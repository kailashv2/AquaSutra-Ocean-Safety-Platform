const db = require('../config/db');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const multilingualService = require('../services/multilingualService');
const offlineService = require('../services/offlineService');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'audio/mpeg', 'audio/wav'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
    }
  }
});

// Media processing utilities
const processImage = async (buffer, filename) => {
  const processedBuffer = await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  
  const thumbnailBuffer = await sharp(buffer)
    .resize(300, 200, { fit: 'cover' })
    .jpeg({ quality: 70 })
    .toBuffer();
    
  return { processedBuffer, thumbnailBuffer };
};

const uploadToS3 = async (buffer, key, contentType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || 'aquasutra-media',
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  return result.Location;
};

// Get all reports with optional filtering
exports.getReports = async (req, res, next) => {
  try {
    const { hazardType, verificationStatus, startDate, endDate, lat, lng, radius } = req.query;
    
    let query = `
      SELECT r.id, r.hazard_type, ST_X(r.location::geometry) as longitude, 
      ST_Y(r.location::geometry) as latitude, r.media_url, r.note, 
      r.verification_status, r.created_at, u.name as reporter_name, u.role as reporter_role
      FROM reports r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    // Apply filters if provided
    if (hazardType) {
      query += ` AND r.hazard_type = $${paramIndex}`;
      queryParams.push(hazardType);
      paramIndex++;
    }
    
    if (verificationStatus) {
      query += ` AND r.verification_status = $${paramIndex}`;
      queryParams.push(verificationStatus);
      paramIndex++;
    }
    
    if (startDate) {
      query += ` AND r.created_at >= $${paramIndex}`;
      queryParams.push(new Date(startDate));
      paramIndex++;
    }
    
    if (endDate) {
      query += ` AND r.created_at <= $${paramIndex}`;
      queryParams.push(new Date(endDate));
      paramIndex++;
    }
    
    // Spatial query if coordinates and radius provided
    if (lat && lng && radius) {
      query += ` AND ST_DWithin(
        r.location,
        ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex+1}), 4326)::geography,
        $${paramIndex+2}
      )`;
      queryParams.push(parseFloat(lng), parseFloat(lat), parseFloat(radius));
      paramIndex += 3;
    }
    
    query += ` ORDER BY r.created_at DESC`;
    
    const result = await db.query(query, queryParams);
    
    // Format the response
    const reports = result.rows.map(row => ({
      id: row.id,
      hazardType: row.hazard_type,
      location: {
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude)
      },
      mediaUrl: row.media_url,
      note: row.note,
      verificationStatus: row.verification_status,
      timestamp: row.created_at,
      reporter: {
        name: row.reporter_name,
        role: row.reporter_role
      }
    }));
    
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// Get a single report by ID
exports.getReportById = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT r.id, r.hazard_type, ST_X(r.location::geometry) as longitude, 
      ST_Y(r.location::geometry) as latitude, r.media_url, r.note, 
      r.verification_status, r.created_at, u.name as reporter_name, u.role as reporter_role
      FROM reports r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    const row = result.rows[0];
    
    const report = {
      id: row.id,
      hazardType: row.hazard_type,
      location: {
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude)
      },
      mediaUrl: row.media_url,
      note: row.note,
      verificationStatus: row.verification_status,
      timestamp: row.created_at,
      reporter: {
        name: row.reporter_name,
        role: row.reporter_role
      }
    };
    
    res.json(report);
  } catch (error) {
    next(error);
  }
};

// Create a new report with enhanced media support
exports.createReport = async (req, res, next) => {
  try {
    const { 
      hazardType, 
      location, 
      note, 
      severity = 'medium',
      tags = [],
      isAnonymous = false,
      metadata = {}
    } = req.body;
    
    let mediaUrls = [];
    let thumbnailUrls = [];
    
    // Process uploaded files if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileId = uuidv4();
        const fileExtension = path.extname(file.originalname);
        const baseKey = `reports/${fileId}`;
        
        if (file.mimetype.startsWith('image/')) {
          // Process image
          const { processedBuffer, thumbnailBuffer } = await processImage(file.buffer, file.originalname);
          
          const imageUrl = await uploadToS3(processedBuffer, `${baseKey}_processed${fileExtension}`, file.mimetype);
          const thumbnailUrl = await uploadToS3(thumbnailBuffer, `${baseKey}_thumbnail.jpg`, 'image/jpeg');
          
          mediaUrls.push({
            type: 'image',
            url: imageUrl,
            originalName: file.originalname,
            size: file.size
          });
          thumbnailUrls.push(thumbnailUrl);
          
        } else if (file.mimetype.startsWith('video/')) {
          // Upload video directly (processing can be done asynchronously)
          const videoUrl = await uploadToS3(file.buffer, `${baseKey}${fileExtension}`, file.mimetype);
          
          mediaUrls.push({
            type: 'video',
            url: videoUrl,
            originalName: file.originalname,
            size: file.size
          });
          
        } else if (file.mimetype.startsWith('audio/')) {
          // Upload audio directly
          const audioUrl = await uploadToS3(file.buffer, `${baseKey}${fileExtension}`, file.mimetype);
          
          mediaUrls.push({
            type: 'audio',
            url: audioUrl,
            originalName: file.originalname,
            size: file.size
          });
        }
      }
    }
    
    // Enhanced location data with accuracy and additional metadata
    const locationData = {
      ...location,
      accuracy: location.accuracy || null,
      altitude: location.altitude || null,
      heading: location.heading || null,
      speed: location.speed || null,
      timestamp: location.timestamp || new Date().toISOString()
    };
    
    // Insert report into database with enhanced fields
    const result = await db.query(
      `INSERT INTO reports (
        user_id, hazard_type, location, media_urls, thumbnail_urls, note, 
        severity, tags, is_anonymous, metadata, location_accuracy, created_at
      )
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING id, created_at`,
      [
        req.user.id,
        hazardType,
        locationData.lng,
        locationData.lat,
        JSON.stringify(mediaUrls),
        JSON.stringify(thumbnailUrls),
        note,
        severity,
        JSON.stringify(tags),
        isAnonymous,
        JSON.stringify({ ...metadata, locationData }),
        locationData.accuracy
      ]
    );
    
    const reportId = result.rows[0].id;
    
    // Emit socket event for real-time updates
    if (req.io) {
      const reportResult = await db.query(
        `SELECT r.id, r.hazard_type, ST_X(r.location::geometry) as longitude, 
        ST_Y(r.location::geometry) as latitude, r.media_url, r.note, 
        r.verification_status, r.created_at, u.name as reporter_name, u.role as reporter_role
        FROM reports r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = $1`,
        [reportId]
      );
      
      if (reportResult.rows.length > 0) {
        const row = reportResult.rows[0];
        
        const newReport = {
          id: row.id,
          hazardType: row.hazard_type,
          location: {
            lat: parseFloat(row.latitude),
            lng: parseFloat(row.longitude)
          },
          mediaUrl: row.media_url,
          note: row.note,
          verificationStatus: row.verification_status,
          timestamp: row.created_at,
          reporter: {
            name: row.reporter_name,
            role: row.reporter_role
          }
        };
        
        req.io.emit('new_report', { type: 'new_report', report: newReport });
      }
    }
    
    res.status(201).json({ id: reportId, message: 'Report created successfully' });
  } catch (error) {
    next(error);
  }
};

// Verify a report (change verification status)
exports.verifyReport = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['verified', 'unverified', 'false_alarm'].includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }
    
    const result = await db.query(
      `UPDATE reports
      SET verification_status = $1
      WHERE id = $2
      RETURNING id`,
      [status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Emit socket event for real-time updates
    if (req.io) {
      const reportResult = await db.query(
        `SELECT r.id, r.hazard_type, ST_X(r.location::geometry) as longitude, 
        ST_Y(r.location::geometry) as latitude, r.media_url, r.note, 
        r.verification_status, r.created_at, u.name as reporter_name, u.role as reporter_role
        FROM reports r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = $1`,
        [req.params.id]
      );
      
      if (reportResult.rows.length > 0) {
        const row = reportResult.rows[0];
        
        const updatedReport = {
          id: row.id,
          hazardType: row.hazard_type,
          location: {
            lat: parseFloat(row.latitude),
            lng: parseFloat(row.longitude)
          },
          mediaUrl: row.media_url,
          note: row.note,
          verificationStatus: row.verification_status,
          timestamp: row.created_at,
          reporter: {
            name: row.reporter_name,
            role: row.reporter_role
          }
        };
        
        req.io.emit('update_report', { type: 'update_report', report: updatedReport });
      }
    }
    
    res.json({ message: 'Report verification status updated' });
  } catch (error) {
    next(error);
  }
};

// Delete a report
exports.deleteReport = async (req, res, next) => {
  try {
    // Check if user is authorized to delete (creator or official)
    const reportCheck = await db.query(
      'SELECT user_id FROM reports WHERE id = $1',
      [req.params.id]
    );
    
    if (reportCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    const report = reportCheck.rows[0];
    
    if (report.user_id !== req.user.id && !['official', 'analyst'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }
    
    // Delete the report
    await db.query(
      'DELETE FROM reports WHERE id = $1',
      [req.params.id]
    );
    
    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('delete_report', { type: 'delete_report', reportId: req.params.id });
    }
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    next(error);
  }
};