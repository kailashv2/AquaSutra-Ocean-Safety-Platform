const db = require('../config/db');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

class OfflineService {
  constructor() {
    this.syncQueue = new Map();
    this.isProcessing = false;
    this.processingInterval = null;
    
    // Configure AWS S3 for media sync
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });
  }

  // Start automatic sync processing
  startSyncProcessor() {
    if (this.isProcessing) {
      console.log('Sync processor already running');
      return;
    }

    this.isProcessing = true;
    console.log('Starting offline sync processor...');

    // Process sync queue every 30 seconds
    this.processingInterval = setInterval(async () => {
      try {
        await this.processSyncQueue();
      } catch (error) {
        console.error('Sync processing error:', error);
      }
    }, 30 * 1000);

    // Initial processing
    this.processSyncQueue();
  }

  // Stop sync processor
  stopSyncProcessor() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log('Offline sync processor stopped');
  }

  // Add item to sync queue
  async addToSyncQueue(userId, action, tableName, recordData, priority = 'normal') {
    try {
      const syncItem = {
        id: uuidv4(),
        userId,
        action,
        tableName,
        recordData,
        priority,
        attempts: 0,
        createdAt: new Date(),
        status: 'pending'
      };

      // Add to database queue
      await db.query(`
        INSERT INTO offline_sync_queue (
          user_id, action, table_name, record_data, sync_status, attempts, created_at
        )
        VALUES ($1, $2, $3, $4, 'pending', 0, NOW())
      `, [userId, action, tableName, JSON.stringify(recordData)]);

      // Add to memory queue for immediate processing
      this.syncQueue.set(syncItem.id, syncItem);

      console.log(`Added sync item: ${action} on ${tableName} for user ${userId}`);
      return syncItem.id;

    } catch (error) {
      console.error('Error adding to sync queue:', error);
      throw error;
    }
  }

  // Process sync queue
  async processSyncQueue() {
    try {
      // Get pending sync items from database
      const result = await db.query(`
        SELECT id, user_id, action, table_name, record_data, attempts, created_at
        FROM offline_sync_queue
        WHERE sync_status = 'pending'
        AND attempts < 5
        ORDER BY created_at ASC
        LIMIT 50
      `);

      if (result.rows.length === 0) {
        return;
      }

      console.log(`Processing ${result.rows.length} sync items...`);

      for (const item of result.rows) {
        try {
          await this.processSyncItem(item);
        } catch (error) {
          console.error(`Error processing sync item ${item.id}:`, error);
          await this.handleSyncError(item.id, error.message);
        }
      }

    } catch (error) {
      console.error('Error processing sync queue:', error);
    }
  }

  // Process individual sync item
  async processSyncItem(item) {
    const { id, user_id, action, table_name, record_data } = item;
    const data = JSON.parse(record_data);

    console.log(`Processing sync item ${id}: ${action} on ${table_name}`);

    switch (table_name) {
      case 'reports':
        await this.syncReport(user_id, action, data);
        break;
      case 'report_comments':
        await this.syncReportComment(user_id, action, data);
        break;
      case 'notifications':
        await this.syncNotification(user_id, action, data);
        break;
      case 'media':
        await this.syncMedia(user_id, action, data);
        break;
      default:
        throw new Error(`Unsupported table for sync: ${table_name}`);
    }

    // Mark as synced
    await db.query(`
      UPDATE offline_sync_queue
      SET sync_status = 'completed', synced_at = NOW()
      WHERE id = $1
    `, [id]);

    console.log(`Successfully synced item ${id}`);
  }

  // Sync report data
  async syncReport(userId, action, data) {
    switch (action) {
      case 'create':
        await this.createReportFromSync(userId, data);
        break;
      case 'update':
        await this.updateReportFromSync(userId, data);
        break;
      case 'delete':
        await this.deleteReportFromSync(userId, data);
        break;
      default:
        throw new Error(`Unsupported report action: ${action}`);
    }
  }

  // Create report from sync data
  async createReportFromSync(userId, data) {
    const {
      tempId,
      hazardType,
      location,
      note,
      severity = 'medium',
      tags = [],
      isAnonymous = false,
      metadata = {},
      mediaFiles = []
    } = data;

    // Process media files first if any
    let mediaUrls = [];
    let thumbnailUrls = [];

    if (mediaFiles.length > 0) {
      const mediaResult = await this.processSyncMediaFiles(mediaFiles);
      mediaUrls = mediaResult.mediaUrls;
      thumbnailUrls = mediaResult.thumbnailUrls;
    }

    // Create the report
    const result = await db.query(`
      INSERT INTO reports (
        user_id, hazard_type, location, media_urls, thumbnail_urls, note,
        severity, tags, is_anonymous, metadata, created_at
      )
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      userId,
      hazardType,
      location.lng,
      location.lat,
      JSON.stringify(mediaUrls),
      JSON.stringify(thumbnailUrls),
      note,
      severity,
      JSON.stringify(tags),
      isAnonymous,
      JSON.stringify({ ...metadata, tempId, syncedAt: new Date() }),
      data.createdAt || new Date()
    ]);

    const reportId = result.rows[0].id;

    // Store mapping for client reference
    await this.storeTempIdMapping('reports', tempId, reportId);

    return reportId;
  }

  // Update report from sync data
  async updateReportFromSync(userId, data) {
    const { reportId, updates } = data;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const [field, value] of Object.entries(updates)) {
      switch (field) {
        case 'note':
        case 'severity':
        case 'verification_status':
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
          break;
        case 'tags':
        case 'metadata':
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(JSON.stringify(value));
          paramIndex++;
          break;
        case 'location':
          updateFields.push(`location = ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)::geography`);
          values.push(value.lng, value.lat);
          paramIndex += 2;
          break;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(reportId, userId);

    const query = `
      UPDATE reports 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
    `;

    await db.query(query, values);
  }

  // Delete report from sync data
  async deleteReportFromSync(userId, data) {
    const { reportId } = data;

    await db.query(`
      DELETE FROM reports
      WHERE id = $1 AND user_id = $2
    `, [reportId, userId]);
  }

  // Sync report comment
  async syncReportComment(userId, action, data) {
    if (action === 'create') {
      const { reportId, comment, isOfficial = false } = data;

      await db.query(`
        INSERT INTO report_comments (report_id, user_id, comment, is_official, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [reportId, userId, comment, isOfficial, data.createdAt || new Date()]);
    }
  }

  // Sync notification
  async syncNotification(userId, action, data) {
    if (action === 'mark_read') {
      const { notificationId } = data;

      await db.query(`
        UPDATE notifications
        SET is_read = true
        WHERE id = $1 AND user_id = $2
      `, [notificationId, userId]);
    }
  }

  // Sync media files
  async syncMedia(userId, action, data) {
    if (action === 'upload') {
      const { tempId, fileData, fileName, mimeType } = data;

      // Upload to S3
      const fileKey = `sync/${userId}/${uuidv4()}_${fileName}`;
      const buffer = Buffer.from(fileData, 'base64');

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET || 'aquasutra-media',
        Key: fileKey,
        Body: buffer,
        ContentType: mimeType,
        ACL: 'public-read'
      };

      const result = await this.s3.upload(uploadParams).promise();
      
      // Store mapping
      await this.storeTempIdMapping('media', tempId, result.Location);

      return result.Location;
    }
  }

  // Process sync media files
  async processSyncMediaFiles(mediaFiles) {
    const mediaUrls = [];
    const thumbnailUrls = [];

    for (const mediaFile of mediaFiles) {
      const { tempId, fileData, fileName, mimeType } = mediaFile;

      try {
        const url = await this.syncMedia(null, 'upload', {
          tempId,
          fileData,
          fileName,
          mimeType
        });

        mediaUrls.push({
          type: mimeType.startsWith('image/') ? 'image' : 
                mimeType.startsWith('video/') ? 'video' : 'audio',
          url,
          originalName: fileName
        });

        // Generate thumbnail for images
        if (mimeType.startsWith('image/')) {
          // This would typically generate a thumbnail
          thumbnailUrls.push(url); // Simplified for now
        }

      } catch (error) {
        console.error(`Error processing media file ${fileName}:`, error);
      }
    }

    return { mediaUrls, thumbnailUrls };
  }

  // Store temporary ID mapping
  async storeTempIdMapping(type, tempId, realId) {
    try {
      await db.query(`
        INSERT INTO temp_id_mappings (type, temp_id, real_id, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (type, temp_id) DO UPDATE SET
          real_id = EXCLUDED.real_id,
          created_at = NOW()
      `, [type, tempId, realId]);
    } catch (error) {
      // Create table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS temp_id_mappings (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          temp_id VARCHAR(100) NOT NULL,
          real_id VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(type, temp_id)
        )
      `);
      
      // Retry insert
      await db.query(`
        INSERT INTO temp_id_mappings (type, temp_id, real_id, created_at)
        VALUES ($1, $2, $3, NOW())
      `, [type, tempId, realId]);
    }
  }

  // Handle sync errors
  async handleSyncError(syncItemId, errorMessage) {
    try {
      await db.query(`
        UPDATE offline_sync_queue
        SET attempts = attempts + 1,
            error_message = $1,
            sync_status = CASE 
              WHEN attempts + 1 >= 5 THEN 'failed'
              ELSE 'pending'
            END
        WHERE id = $2
      `, [errorMessage, syncItemId]);

    } catch (error) {
      console.error('Error handling sync error:', error);
    }
  }

  // Get sync status for user
  async getSyncStatus(userId) {
    try {
      const result = await db.query(`
        SELECT 
          sync_status,
          COUNT(*) as count
        FROM offline_sync_queue
        WHERE user_id = $1
        GROUP BY sync_status
      `, [userId]);

      const status = {
        pending: 0,
        completed: 0,
        failed: 0,
        total: 0
      };

      result.rows.forEach(row => {
        status[row.sync_status] = parseInt(row.count);
        status.total += parseInt(row.count);
      });

      return status;

    } catch (error) {
      console.error('Error getting sync status:', error);
      return { pending: 0, completed: 0, failed: 0, total: 0 };
    }
  }

  // Get offline data for user (for initial app load)
  async getOfflineData(userId, lastSyncTime = null) {
    try {
      const data = {
        reports: [],
        notifications: [],
        settings: {},
        lastSync: new Date()
      };

      // Get user's reports
      let reportsQuery = `
        SELECT 
          r.id, r.hazard_type, ST_X(r.location::geometry) as lng, ST_Y(r.location::geometry) as lat,
          r.media_urls, r.note, r.severity, r.tags, r.verification_status, r.created_at, r.updated_at
        FROM reports r
        WHERE r.user_id = $1
      `;
      
      const reportsParams = [userId];
      
      if (lastSyncTime) {
        reportsQuery += ` AND r.updated_at > $2`;
        reportsParams.push(new Date(lastSyncTime));
      }
      
      reportsQuery += ` ORDER BY r.created_at DESC LIMIT 100`;

      const reportsResult = await db.query(reportsQuery, reportsParams);
      
      data.reports = reportsResult.rows.map(row => ({
        id: row.id,
        hazardType: row.hazard_type,
        location: { lat: row.lat, lng: row.lng },
        mediaUrls: row.media_urls,
        note: row.note,
        severity: row.severity,
        tags: row.tags,
        verificationStatus: row.verification_status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      // Get user's notifications
      let notificationsQuery = `
        SELECT id, type, title, message, data, is_read, priority, created_at
        FROM notifications
        WHERE user_id = $1
      `;
      
      const notificationsParams = [userId];
      
      if (lastSyncTime) {
        notificationsQuery += ` AND created_at > $2`;
        notificationsParams.push(new Date(lastSyncTime));
      }
      
      notificationsQuery += ` ORDER BY created_at DESC LIMIT 50`;

      const notificationsResult = await db.query(notificationsQuery, notificationsParams);
      data.notifications = notificationsResult.rows;

      // Get user settings
      const userResult = await db.query(`
        SELECT language_preference, notification_preferences
        FROM users
        WHERE id = $1
      `, [userId]);

      if (userResult.rows.length > 0) {
        data.settings = {
          language: userResult.rows[0].language_preference,
          notifications: userResult.rows[0].notification_preferences
        };
      }

      return data;

    } catch (error) {
      console.error('Error getting offline data:', error);
      return { reports: [], notifications: [], settings: {}, lastSync: new Date() };
    }
  }

  // Clear old sync records
  async cleanupSyncRecords() {
    try {
      // Remove completed sync records older than 7 days
      const result = await db.query(`
        DELETE FROM offline_sync_queue
        WHERE sync_status = 'completed'
        AND synced_at < NOW() - INTERVAL '7 days'
      `);

      // Remove failed sync records older than 30 days
      const failedResult = await db.query(`
        DELETE FROM offline_sync_queue
        WHERE sync_status = 'failed'
        AND created_at < NOW() - INTERVAL '30 days'
      `);

      // Remove old temp ID mappings
      const mappingResult = await db.query(`
        DELETE FROM temp_id_mappings
        WHERE created_at < NOW() - INTERVAL '30 days'
      `);

      console.log(`Cleaned up ${result.rowCount} completed, ${failedResult.rowCount} failed sync records, and ${mappingResult.rowCount} temp mappings`);

    } catch (error) {
      console.error('Error cleaning up sync records:', error);
    }
  }

  // Retry failed sync items
  async retryFailedSyncs(userId = null) {
    try {
      let query = `
        UPDATE offline_sync_queue
        SET sync_status = 'pending', attempts = 0, error_message = NULL
        WHERE sync_status = 'failed'
      `;
      
      const params = [];
      
      if (userId) {
        query += ` AND user_id = $1`;
        params.push(userId);
      }

      const result = await db.query(query, params);
      
      console.log(`Retrying ${result.rowCount} failed sync items`);
      return result.rowCount;

    } catch (error) {
      console.error('Error retrying failed syncs:', error);
      return 0;
    }
  }
}

module.exports = new OfflineService();
