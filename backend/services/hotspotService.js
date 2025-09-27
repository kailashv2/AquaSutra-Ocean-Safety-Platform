const db = require('../config/db');

class HotspotService {
  constructor() {
    this.settings = {
      minReports: 3,
      radiusKm: 5,
      decayHours: 24,
      socialMediaWeight: 0.3,
      reportWeight: 0.7,
      severityMultipliers: {
        low: 1.0,
        medium: 1.5,
        high: 2.0,
        critical: 3.0
      }
    };
    
    this.isGenerating = false;
    this.generationInterval = null;
  }

  // Start automatic hotspot generation
  startAutoGeneration() {
    if (this.isGenerating) {
      console.log('Hotspot generation already running');
      return;
    }

    this.isGenerating = true;
    console.log('Starting automatic hotspot generation...');

    // Generate hotspots every 10 minutes
    this.generationInterval = setInterval(async () => {
      try {
        await this.generateHotspots();
      } catch (error) {
        console.error('Hotspot generation error:', error);
      }
    }, 10 * 60 * 1000);

    // Initial generation
    this.generateHotspots();
  }

  // Stop automatic generation
  stopAutoGeneration() {
    if (this.generationInterval) {
      clearInterval(this.generationInterval);
      this.generationInterval = null;
    }
    this.isGenerating = false;
    console.log('Hotspot generation stopped');
  }

  // Generate hotspots based on report density and social media activity
  async generateHotspots() {
    try {
      console.log('Generating hotspots...');
      
      // Load settings from database
      await this.loadSettings();

      // Clear old hotspots
      await this.clearExpiredHotspots();

      // Get report clusters
      const reportClusters = await this.getReportClusters();
      
      // Get social media clusters
      const socialClusters = await this.getSocialMediaClusters();

      // Combine and analyze clusters
      const combinedClusters = await this.combineClusters(reportClusters, socialClusters);

      // Generate hotspots from clusters
      let hotspotsCreated = 0;
      for (const cluster of combinedClusters) {
        if (cluster.intensity_score >= 1.0) { // Minimum intensity threshold
          await this.createOrUpdateHotspot(cluster);
          hotspotsCreated++;
        }
      }

      console.log(`Generated ${hotspotsCreated} hotspots`);
      return hotspotsCreated;

    } catch (error) {
      console.error('Error generating hotspots:', error);
      throw error;
    }
  }

  // Load settings from database
  async loadSettings() {
    try {
      const result = await db.query(
        "SELECT value FROM system_settings WHERE key = 'hotspot_settings'"
      );
      
      if (result.rows.length > 0) {
        const dbSettings = result.rows[0].value;
        this.settings = { ...this.settings, ...dbSettings };
      }
    } catch (error) {
      console.error('Error loading hotspot settings:', error);
    }
  }

  // Clear expired hotspots
  async clearExpiredHotspots() {
    try {
      const result = await db.query(`
        UPDATE hotspots 
        SET is_active = false 
        WHERE last_activity < NOW() - INTERVAL '${this.settings.decayHours} hours'
        AND is_active = true
      `);
      
      if (result.rowCount > 0) {
        console.log(`Deactivated ${result.rowCount} expired hotspots`);
      }
    } catch (error) {
      console.error('Error clearing expired hotspots:', error);
    }
  }

  // Get report clusters using spatial clustering
  async getReportClusters() {
    try {
      const query = `
        WITH recent_reports AS (
          SELECT 
            r.id,
            r.location,
            r.hazard_type,
            r.severity,
            r.verification_status,
            r.created_at,
            ST_X(r.location::geometry) as lng,
            ST_Y(r.location::geometry) as lat
          FROM reports r
          WHERE r.created_at >= NOW() - INTERVAL '${this.settings.decayHours} hours'
          AND r.verification_status != 'false_alarm'
        ),
        clustered_reports AS (
          SELECT 
            r1.*,
            COUNT(r2.id) as nearby_count,
            ARRAY_AGG(DISTINCT r2.hazard_type) as hazard_types,
            AVG(CASE 
              WHEN r2.severity = 'low' THEN 1
              WHEN r2.severity = 'medium' THEN 2
              WHEN r2.severity = 'high' THEN 3
              WHEN r2.severity = 'critical' THEN 4
              ELSE 2
            END) as avg_severity
          FROM recent_reports r1
          JOIN recent_reports r2 ON ST_DWithin(
            r1.location,
            r2.location,
            $1
          )
          GROUP BY r1.id, r1.location, r1.hazard_type, r1.severity, 
                   r1.verification_status, r1.created_at, r1.lng, r1.lat
          HAVING COUNT(r2.id) >= $2
        )
        SELECT 
          ST_X(ST_Centroid(ST_Collect(location::geometry))) as center_lng,
          ST_Y(ST_Centroid(ST_Collect(location::geometry))) as center_lat,
          COUNT(*) as report_count,
          hazard_types,
          avg_severity,
          MAX(created_at) as last_activity
        FROM clustered_reports
        GROUP BY hazard_types, 
                 ST_SnapToGrid(ST_X(location::geometry), 0.01),
                 ST_SnapToGrid(ST_Y(location::geometry), 0.01)
        ORDER BY report_count DESC
      `;

      const result = await db.query(query, [
        this.settings.radiusKm * 1000, // Convert km to meters
        this.settings.minReports
      ]);

      return result.rows.map(row => ({
        type: 'report',
        center_lng: row.center_lng,
        center_lat: row.center_lat,
        report_count: row.report_count,
        social_media_count: 0,
        hazard_types: row.hazard_types,
        avg_severity: row.avg_severity,
        last_activity: row.last_activity,
        intensity_score: this.calculateReportIntensity(row)
      }));

    } catch (error) {
      console.error('Error getting report clusters:', error);
      return [];
    }
  }

  // Get social media clusters
  async getSocialMediaClusters() {
    try {
      const query = `
        WITH recent_social AS (
          SELECT 
            s.id,
            s.location,
            s.platform,
            s.hazard_relevance_score,
            s.sentiment_score,
            s.post_created_at,
            ST_X(s.location::geometry) as lng,
            ST_Y(s.location::geometry) as lat
          FROM social_media_posts s
          WHERE s.post_created_at >= NOW() - INTERVAL '${this.settings.decayHours} hours'
          AND s.is_hazard_related = true
          AND s.location IS NOT NULL
        ),
        clustered_social AS (
          SELECT 
            s1.*,
            COUNT(s2.id) as nearby_count,
            AVG(s2.hazard_relevance_score) as avg_relevance,
            AVG(s2.sentiment_score) as avg_sentiment
          FROM recent_social s1
          JOIN recent_social s2 ON ST_DWithin(
            s1.location,
            s2.location,
            $1
          )
          GROUP BY s1.id, s1.location, s1.platform, s1.hazard_relevance_score,
                   s1.sentiment_score, s1.post_created_at, s1.lng, s1.lat
          HAVING COUNT(s2.id) >= 5 -- Minimum social media posts for cluster
        )
        SELECT 
          ST_X(ST_Centroid(ST_Collect(location::geometry))) as center_lng,
          ST_Y(ST_Centroid(ST_Collect(location::geometry))) as center_lat,
          COUNT(*) as social_count,
          avg_relevance,
          avg_sentiment,
          MAX(post_created_at) as last_activity
        FROM clustered_social
        GROUP BY ST_SnapToGrid(ST_X(location::geometry), 0.01),
                 ST_SnapToGrid(ST_Y(location::geometry), 0.01)
        ORDER BY social_count DESC
      `;

      const result = await db.query(query, [
        this.settings.radiusKm * 1000 // Convert km to meters
      ]);

      return result.rows.map(row => ({
        type: 'social',
        center_lng: row.center_lng,
        center_lat: row.center_lat,
        report_count: 0,
        social_media_count: row.social_count,
        avg_relevance: row.avg_relevance,
        avg_sentiment: row.avg_sentiment,
        last_activity: row.last_activity,
        intensity_score: this.calculateSocialIntensity(row)
      }));

    } catch (error) {
      console.error('Error getting social media clusters:', error);
      return [];
    }
  }

  // Combine report and social media clusters
  async combineClusters(reportClusters, socialClusters) {
    const combined = [];
    const processed = new Set();

    // Process report clusters
    for (const reportCluster of reportClusters) {
      const key = `${Math.round(reportCluster.center_lat * 100)}_${Math.round(reportCluster.center_lng * 100)}`;
      
      if (processed.has(key)) continue;
      processed.add(key);

      // Find nearby social clusters
      const nearbySocial = socialClusters.filter(social => {
        const distance = this.calculateDistance(
          reportCluster.center_lat, reportCluster.center_lng,
          social.center_lat, social.center_lng
        );
        return distance <= this.settings.radiusKm;
      });

      const combinedCluster = {
        center_lat: reportCluster.center_lat,
        center_lng: reportCluster.center_lng,
        report_count: reportCluster.report_count,
        social_media_count: nearbySocial.reduce((sum, s) => sum + s.social_media_count, 0),
        hazard_types: reportCluster.hazard_types || [],
        severity_distribution: this.calculateSeverityDistribution(reportCluster),
        last_activity: reportCluster.last_activity,
        intensity_score: this.calculateCombinedIntensity(reportCluster, nearbySocial)
      };

      combined.push(combinedCluster);
    }

    // Process standalone social clusters
    for (const socialCluster of socialClusters) {
      const key = `${Math.round(socialCluster.center_lat * 100)}_${Math.round(socialCluster.center_lng * 100)}`;
      
      if (processed.has(key)) continue;
      processed.add(key);

      // Only include if high relevance and sufficient activity
      if (socialCluster.avg_relevance >= 0.7 && socialCluster.social_media_count >= 10) {
        const combinedCluster = {
          center_lat: socialCluster.center_lat,
          center_lng: socialCluster.center_lng,
          report_count: 0,
          social_media_count: socialCluster.social_media_count,
          hazard_types: [],
          severity_distribution: {},
          last_activity: socialCluster.last_activity,
          intensity_score: socialCluster.intensity_score
        };

        combined.push(combinedCluster);
      }
    }

    return combined.sort((a, b) => b.intensity_score - a.intensity_score);
  }

  // Calculate report cluster intensity
  calculateReportIntensity(cluster) {
    const baseScore = cluster.report_count * this.settings.reportWeight;
    const severityMultiplier = cluster.avg_severity || 2;
    const timeDecay = this.calculateTimeDecay(cluster.last_activity);
    
    return baseScore * (severityMultiplier / 2) * timeDecay;
  }

  // Calculate social media cluster intensity
  calculateSocialIntensity(cluster) {
    const baseScore = cluster.social_count * this.settings.socialMediaWeight;
    const relevanceMultiplier = cluster.avg_relevance || 0.5;
    const sentimentMultiplier = cluster.avg_sentiment < -0.3 ? 1.5 : 1.0; // Negative sentiment increases urgency
    const timeDecay = this.calculateTimeDecay(cluster.last_activity);
    
    return baseScore * relevanceMultiplier * sentimentMultiplier * timeDecay;
  }

  // Calculate combined intensity score
  calculateCombinedIntensity(reportCluster, socialClusters) {
    const reportIntensity = this.calculateReportIntensity(reportCluster);
    const socialIntensity = socialClusters.reduce((sum, cluster) => 
      sum + this.calculateSocialIntensity(cluster), 0
    );
    
    return reportIntensity + socialIntensity;
  }

  // Calculate time decay factor
  calculateTimeDecay(lastActivity) {
    const hoursAgo = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60);
    return Math.max(0.1, 1 - (hoursAgo / this.settings.decayHours));
  }

  // Calculate severity distribution
  calculateSeverityDistribution(cluster) {
    // This would be more complex in a real implementation
    // For now, return a simple distribution based on average severity
    const avgSev = cluster.avg_severity || 2;
    
    if (avgSev >= 3.5) return { critical: 0.4, high: 0.4, medium: 0.2 };
    if (avgSev >= 2.5) return { high: 0.5, medium: 0.4, low: 0.1 };
    if (avgSev >= 1.5) return { medium: 0.6, low: 0.3, high: 0.1 };
    return { low: 0.7, medium: 0.3 };
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Create or update hotspot
  async createOrUpdateHotspot(cluster) {
    try {
      // Check if hotspot already exists nearby
      const existingResult = await db.query(`
        SELECT id FROM hotspots
        WHERE ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
        AND is_active = true
      `, [cluster.center_lng, cluster.center_lat, this.settings.radiusKm * 1000]);

      if (existingResult.rows.length > 0) {
        // Update existing hotspot
        await db.query(`
          UPDATE hotspots SET
            intensity_score = $1,
            report_count = $2,
            social_media_count = $3,
            hazard_types = $4,
            severity_distribution = $5,
            last_activity = $6,
            updated_at = NOW()
          WHERE id = $7
        `, [
          cluster.intensity_score,
          cluster.report_count,
          cluster.social_media_count,
          JSON.stringify(cluster.hazard_types),
          JSON.stringify(cluster.severity_distribution),
          cluster.last_activity,
          existingResult.rows[0].id
        ]);

        console.log(`Updated hotspot ${existingResult.rows[0].id}`);
      } else {
        // Create new hotspot
        const result = await db.query(`
          INSERT INTO hotspots (
            location, radius, intensity_score, report_count, social_media_count,
            hazard_types, severity_distribution, last_activity, is_active
          )
          VALUES (
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
            $3, $4, $5, $6, $7, $8, $9, true
          )
          RETURNING id
        `, [
          cluster.center_lng,
          cluster.center_lat,
          this.settings.radiusKm * 1000,
          cluster.intensity_score,
          cluster.report_count,
          cluster.social_media_count,
          JSON.stringify(cluster.hazard_types),
          JSON.stringify(cluster.severity_distribution),
          cluster.last_activity
        ]);

        console.log(`Created new hotspot ${result.rows[0].id}`);
      }
    } catch (error) {
      console.error('Error creating/updating hotspot:', error);
    }
  }

  // Get active hotspots with filtering
  async getActiveHotspots(filters = {}) {
    try {
      let query = `
        SELECT 
          id,
          ST_X(location::geometry) as lng,
          ST_Y(location::geometry) as lat,
          radius,
          intensity_score,
          report_count,
          social_media_count,
          hazard_types,
          severity_distribution,
          last_activity,
          created_at,
          updated_at
        FROM hotspots
        WHERE is_active = true
      `;
      
      const params = [];
      let paramIndex = 1;

      if (filters.minIntensity) {
        query += ` AND intensity_score >= $${paramIndex}`;
        params.push(filters.minIntensity);
        paramIndex++;
      }

      if (filters.hazardType) {
        query += ` AND hazard_types @> $${paramIndex}`;
        params.push(JSON.stringify([filters.hazardType]));
        paramIndex++;
      }

      if (filters.location && filters.searchRadius) {
        query += ` AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex+1}), 4326)::geography,
          $${paramIndex+2}
        )`;
        params.push(filters.location.lng, filters.location.lat, filters.searchRadius);
        paramIndex += 3;
      }

      query += ` ORDER BY intensity_score DESC`;

      if (filters.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
      }

      const result = await db.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        location: {
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng)
        },
        radius: row.radius,
        intensityScore: row.intensity_score,
        reportCount: row.report_count,
        socialMediaCount: row.social_media_count,
        hazardTypes: row.hazard_types,
        severityDistribution: row.severity_distribution,
        lastActivity: row.last_activity,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

    } catch (error) {
      console.error('Error getting active hotspots:', error);
      return [];
    }
  }

  // Get hotspot statistics
  async getHotspotStatistics() {
    try {
      const result = await db.query(`
        SELECT 
          COUNT(*) as total_hotspots,
          AVG(intensity_score) as avg_intensity,
          MAX(intensity_score) as max_intensity,
          SUM(report_count) as total_reports,
          SUM(social_media_count) as total_social_posts
        FROM hotspots
        WHERE is_active = true
      `);

      const severityResult = await db.query(`
        SELECT 
          jsonb_object_keys(severity_distribution) as severity,
          AVG((severity_distribution->jsonb_object_keys(severity_distribution))::float) as avg_percentage
        FROM hotspots
        WHERE is_active = true
        AND severity_distribution != '{}'::jsonb
        GROUP BY jsonb_object_keys(severity_distribution)
      `);

      return {
        totalHotspots: parseInt(result.rows[0].total_hotspots),
        avgIntensity: parseFloat(result.rows[0].avg_intensity || 0),
        maxIntensity: parseFloat(result.rows[0].max_intensity || 0),
        totalReports: parseInt(result.rows[0].total_reports || 0),
        totalSocialPosts: parseInt(result.rows[0].total_social_posts || 0),
        severityDistribution: severityResult.rows.reduce((acc, row) => {
          acc[row.severity] = parseFloat(row.avg_percentage);
          return acc;
        }, {})
      };

    } catch (error) {
      console.error('Error getting hotspot statistics:', error);
      return {
        totalHotspots: 0,
        avgIntensity: 0,
        maxIntensity: 0,
        totalReports: 0,
        totalSocialPosts: 0,
        severityDistribution: {}
      };
    }
  }

  // Update hotspot settings
  async updateSettings(newSettings) {
    try {
      this.settings = { ...this.settings, ...newSettings };
      
      await db.query(`
        UPDATE system_settings 
        SET value = $1, updated_at = NOW()
        WHERE key = 'hotspot_settings'
      `, [JSON.stringify(this.settings)]);

      console.log('Hotspot settings updated');
      return this.settings;
    } catch (error) {
      console.error('Error updating hotspot settings:', error);
      throw error;
    }
  }
}

module.exports = new HotspotService();
