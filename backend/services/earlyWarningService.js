const db = require('../config/db');
const axios = require('axios');
const WebSocket = require('ws');

class EarlyWarningService {
  constructor() {
    this.integrations = {
      noaa: {
        name: 'NOAA Weather Service',
        baseUrl: 'https://api.weather.gov',
        enabled: process.env.NOAA_INTEGRATION_ENABLED === 'true',
        apiKey: process.env.NOAA_API_KEY
      },
      usgs: {
        name: 'USGS Earthquake Hazards Program',
        baseUrl: 'https://earthquake.usgs.gov/fdsnws/event/1',
        enabled: process.env.USGS_INTEGRATION_ENABLED === 'true'
      },
      tsunami: {
        name: 'Pacific Tsunami Warning Center',
        baseUrl: 'https://www.tsunami.gov/events',
        enabled: process.env.TSUNAMI_WARNING_ENABLED === 'true'
      },
      emergency: {
        name: 'Emergency Alert System',
        baseUrl: process.env.EMERGENCY_ALERT_ENDPOINT,
        enabled: process.env.EMERGENCY_ALERT_ENABLED === 'true',
        apiKey: process.env.EMERGENCY_ALERT_API_KEY
      }
    };

    this.alertLevels = {
      advisory: { priority: 1, color: '#FFA500', urgency: 'Expected' },
      watch: { priority: 2, color: '#FFFF00', urgency: 'Expected' },
      warning: { priority: 3, color: '#FF0000', urgency: 'Immediate' },
      emergency: { priority: 4, color: '#8B0000', urgency: 'Immediate' }
    };

    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.websocketConnections = new Map();
  }

  // Start monitoring external warning systems
  async startMonitoring() {
    if (this.isMonitoring) {
      console.log('Early warning monitoring already running');
      return;
    }

    this.isMonitoring = true;
    console.log('Starting early warning system monitoring...');

    // Monitor every 2 minutes for critical alerts
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkAllSources();
      } catch (error) {
        console.error('Early warning monitoring error:', error);
      }
    }, 2 * 60 * 1000);

    // Initial check
    await this.checkAllSources();
    
    // Initialize WebSocket connections for real-time feeds
    await this.initializeWebSocketConnections();
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    // Close WebSocket connections
    for (const [source, ws] of this.websocketConnections) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
    this.websocketConnections.clear();

    this.isMonitoring = false;
    console.log('Early warning monitoring stopped');
  }

  // Check all warning sources
  async checkAllSources() {
    const promises = [];

    if (this.integrations.noaa.enabled) {
      promises.push(this.checkNOAAAlerts());
    }

    if (this.integrations.usgs.enabled) {
      promises.push(this.checkUSGSEarthquakes());
    }

    if (this.integrations.tsunami.enabled) {
      promises.push(this.checkTsunamiWarnings());
    }

    const results = await Promise.allSettled(promises);
    
    let totalAlerts = 0;
    results.forEach((result, index) => {
      const sources = ['NOAA', 'USGS', 'Tsunami'];
      if (result.status === 'fulfilled') {
        totalAlerts += result.value;
        console.log(`${sources[index]}: processed ${result.value} alerts`);
      } else {
        console.error(`${sources[index]} error:`, result.reason);
      }
    });

    if (totalAlerts > 0) {
      console.log(`Total new alerts processed: ${totalAlerts}`);
    }

    return totalAlerts;
  }

  // Check NOAA weather alerts
  async checkNOAAAlerts() {
    try {
      const response = await axios.get(`${this.integrations.noaa.baseUrl}/alerts/active`, {
        params: {
          status: 'actual',
          message_type: 'alert',
          urgency: 'immediate,expected'
        },
        timeout: 10000
      });

      const alerts = response.data.features || [];
      let processedCount = 0;

      for (const alert of alerts) {
        const properties = alert.properties;
        
        // Filter for ocean/coastal hazards
        if (this.isOceanRelatedAlert(properties.event)) {
          const alertData = {
            source: 'NOAA',
            external_id: properties.id,
            title: properties.headline,
            description: properties.description,
            event_type: properties.event,
            severity: this.mapNOAASeverity(properties.severity),
            urgency: properties.urgency,
            certainty: properties.certainty,
            areas: properties.areaDesc,
            effective_time: new Date(properties.effective),
            expires_time: new Date(properties.expires),
            geometry: alert.geometry
          };

          const saved = await this.saveExternalAlert(alertData);
          if (saved) processedCount++;
        }
      }

      return processedCount;
    } catch (error) {
      console.error('NOAA alerts check error:', error.message);
      return 0;
    }
  }

  // Check USGS earthquake data
  async checkUSGSEarthquakes() {
    try {
      const response = await axios.get(`${this.integrations.usgs.baseUrl}/query`, {
        params: {
          format: 'geojson',
          starttime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last hour
          minmagnitude: 4.0, // Only significant earthquakes
          orderby: 'time'
        },
        timeout: 10000
      });

      const earthquakes = response.data.features || [];
      let processedCount = 0;

      for (const earthquake of earthquakes) {
        const properties = earthquake.properties;
        const geometry = earthquake.geometry;

        // Check if it's near coastal areas (simplified check)
        if (this.isNearCoast(geometry.coordinates)) {
          const alertData = {
            source: 'USGS',
            external_id: earthquake.id,
            title: properties.title,
            description: `Magnitude ${properties.mag} earthquake ${properties.place}`,
            event_type: 'earthquake',
            severity: this.mapEarthquakeSeverity(properties.mag),
            urgency: properties.mag >= 6.0 ? 'immediate' : 'expected',
            certainty: 'observed',
            magnitude: properties.mag,
            depth: geometry.coordinates[2],
            effective_time: new Date(properties.time),
            geometry: earthquake.geometry
          };

          const saved = await this.saveExternalAlert(alertData);
          if (saved) processedCount++;
        }
      }

      return processedCount;
    } catch (error) {
      console.error('USGS earthquakes check error:', error.message);
      return 0;
    }
  }

  // Check tsunami warnings
  async checkTsunamiWarnings() {
    try {
      // This would integrate with actual tsunami warning systems
      // For now, we'll simulate checking for tsunami bulletins
      
      const response = await axios.get(`${this.integrations.tsunami.baseUrl}/latest.json`, {
        timeout: 10000
      });

      const warnings = response.data.warnings || [];
      let processedCount = 0;

      for (const warning of warnings) {
        const alertData = {
          source: 'Tsunami Warning Center',
          external_id: warning.id,
          title: warning.title,
          description: warning.message,
          event_type: 'tsunami',
          severity: 'warning',
          urgency: 'immediate',
          certainty: warning.certainty || 'possible',
          areas: warning.areas,
          effective_time: new Date(warning.issued),
          expires_time: warning.expires ? new Date(warning.expires) : null,
          geometry: warning.geometry
        };

        const saved = await this.saveExternalAlert(alertData);
        if (saved) processedCount++;
      }

      return processedCount;
    } catch (error) {
      // Tsunami warning endpoint might not exist, so we'll handle gracefully
      console.log('Tsunami warnings check: No active warnings or service unavailable');
      return 0;
    }
  }

  // Initialize WebSocket connections for real-time feeds
  async initializeWebSocketConnections() {
    // Example: Connect to real-time earthquake feed
    if (this.integrations.usgs.enabled) {
      try {
        const ws = new WebSocket('wss://earthquake.usgs.gov/ws/earthquake');
        
        ws.on('open', () => {
          console.log('Connected to USGS real-time earthquake feed');
        });

        ws.on('message', async (data) => {
          try {
            const earthquake = JSON.parse(data);
            if (earthquake.properties.mag >= 4.0 && this.isNearCoast(earthquake.geometry.coordinates)) {
              await this.processRealtimeEarthquake(earthquake);
            }
          } catch (error) {
            console.error('Error processing real-time earthquake:', error);
          }
        });

        ws.on('error', (error) => {
          console.error('USGS WebSocket error:', error);
        });

        ws.on('close', () => {
          console.log('USGS WebSocket connection closed');
          // Attempt to reconnect after 30 seconds
          setTimeout(() => {
            if (this.isMonitoring) {
              this.initializeWebSocketConnections();
            }
          }, 30000);
        });

        this.websocketConnections.set('usgs', ws);
      } catch (error) {
        console.error('Error initializing USGS WebSocket:', error);
      }
    }
  }

  // Process real-time earthquake data
  async processRealtimeEarthquake(earthquake) {
    const properties = earthquake.properties;
    const geometry = earthquake.geometry;

    const alertData = {
      source: 'USGS Real-time',
      external_id: earthquake.id,
      title: properties.title,
      description: `REAL-TIME: Magnitude ${properties.mag} earthquake ${properties.place}`,
      event_type: 'earthquake',
      severity: this.mapEarthquakeSeverity(properties.mag),
      urgency: properties.mag >= 6.0 ? 'immediate' : 'expected',
      certainty: 'observed',
      magnitude: properties.mag,
      depth: geometry.coordinates[2],
      effective_time: new Date(properties.time),
      geometry: earthquake.geometry,
      is_realtime: true
    };

    await this.saveExternalAlert(alertData);
    
    // Immediately trigger alert processing for high-magnitude earthquakes
    if (properties.mag >= 6.0) {
      await this.triggerEmergencyAlert(alertData);
    }
  }

  // Save external alert to database
  async saveExternalAlert(alertData) {
    try {
      // Check if alert already exists
      const existingResult = await db.query(
        'SELECT id FROM external_alerts WHERE source = $1 AND external_id = $2',
        [alertData.source, alertData.external_id]
      );

      if (existingResult.rows.length > 0) {
        return false; // Alert already processed
      }

      // Create external_alerts table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS external_alerts (
          id SERIAL PRIMARY KEY,
          source VARCHAR(100) NOT NULL,
          external_id VARCHAR(200) NOT NULL,
          title VARCHAR(500) NOT NULL,
          description TEXT,
          event_type VARCHAR(50) NOT NULL,
          severity VARCHAR(20) NOT NULL,
          urgency VARCHAR(20),
          certainty VARCHAR(20),
          areas TEXT,
          magnitude FLOAT,
          depth FLOAT,
          geometry JSONB,
          effective_time TIMESTAMP NOT NULL,
          expires_time TIMESTAMP,
          is_realtime BOOLEAN DEFAULT false,
          processed BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(source, external_id)
        )
      `);

      // Insert the alert
      const result = await db.query(`
        INSERT INTO external_alerts (
          source, external_id, title, description, event_type, severity,
          urgency, certainty, areas, magnitude, depth, geometry,
          effective_time, expires_time, is_realtime
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id
      `, [
        alertData.source,
        alertData.external_id,
        alertData.title,
        alertData.description,
        alertData.event_type,
        alertData.severity,
        alertData.urgency,
        alertData.certainty,
        alertData.areas,
        alertData.magnitude,
        alertData.depth,
        JSON.stringify(alertData.geometry),
        alertData.effective_time,
        alertData.expires_time,
        alertData.is_realtime || false
      ]);

      const alertId = result.rows[0].id;

      // Process the alert (create notifications, trigger responses)
      await this.processAlert(alertId, alertData);

      console.log(`Saved external alert: ${alertData.title}`);
      return true;

    } catch (error) {
      console.error('Error saving external alert:', error);
      return false;
    }
  }

  // Process alert and trigger appropriate responses
  async processAlert(alertId, alertData) {
    try {
      // Determine affected areas and users
      const affectedUsers = await this.getAffectedUsers(alertData);

      // Create notifications for affected users
      for (const user of affectedUsers) {
        await this.createAlertNotification(user, alertData);
      }

      // If it's a high-severity alert, trigger emergency protocols
      if (this.alertLevels[alertData.severity]?.priority >= 3) {
        await this.triggerEmergencyAlert(alertData);
      }

      // Update hotspots based on the alert
      await this.updateHotspotsFromAlert(alertData);

      // Mark alert as processed
      await db.query(
        'UPDATE external_alerts SET processed = true WHERE id = $1',
        [alertId]
      );

    } catch (error) {
      console.error('Error processing alert:', error);
    }
  }

  // Get users affected by the alert
  async getAffectedUsers(alertData) {
    try {
      let query = `
        SELECT DISTINCT u.id, u.name, u.email, u.notification_preferences
        FROM users u
        JOIN alert_subscriptions s ON u.id = s.user_id
        WHERE s.is_active = true
      `;

      const params = [];
      let paramIndex = 1;

      // If alert has geometry, find users within affected area
      if (alertData.geometry && alertData.geometry.coordinates) {
        const coords = alertData.geometry.coordinates;
        let radius = 50000; // Default 50km radius

        // Adjust radius based on event type and severity
        if (alertData.event_type === 'tsunami') radius = 100000; // 100km
        if (alertData.event_type === 'earthquake' && alertData.magnitude >= 6.0) radius = 200000; // 200km

        query += ` AND ST_DWithin(
          s.location,
          ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)::geography,
          $${paramIndex + 2}
        )`;
        params.push(coords[0], coords[1], radius);
        paramIndex += 3;
      }

      // Filter by hazard type if user has preferences
      if (alertData.event_type) {
        query += ` AND (s.hazard_types = '[]'::jsonb OR s.hazard_types @> $${paramIndex})`;
        params.push(JSON.stringify([alertData.event_type]));
        paramIndex++;
      }

      const result = await db.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Error getting affected users:', error);
      return [];
    }
  }

  // Create alert notification for user
  async createAlertNotification(user, alertData) {
    try {
      const severity = this.alertLevels[alertData.severity] || this.alertLevels.advisory;
      
      await db.query(`
        INSERT INTO notifications (
          user_id, type, title, message, data, priority, expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        user.id,
        'external_alert',
        alertData.title,
        alertData.description,
        JSON.stringify({
          source: alertData.source,
          eventType: alertData.event_type,
          severity: alertData.severity,
          urgency: alertData.urgency,
          areas: alertData.areas,
          externalId: alertData.external_id
        }),
        severity.priority >= 3 ? 'high' : 'normal',
        alertData.expires_time
      ]);

      console.log(`Created alert notification for user ${user.id}: ${alertData.title}`);

    } catch (error) {
      console.error('Error creating alert notification:', error);
    }
  }

  // Trigger emergency alert protocols
  async triggerEmergencyAlert(alertData) {
    try {
      console.log(`EMERGENCY ALERT TRIGGERED: ${alertData.title}`);

      // Send to emergency alert system if configured
      if (this.integrations.emergency.enabled && this.integrations.emergency.baseUrl) {
        await this.sendToEmergencySystem(alertData);
      }

      // Create high-priority system notification
      await db.query(`
        INSERT INTO notifications (
          user_id, type, title, message, data, priority
        )
        SELECT 
          u.id, 'emergency_alert', $1, $2, $3, 'high'
        FROM users u
        WHERE u.role IN ('emergency_responder', 'official', 'administrator')
      `, [
        `EMERGENCY: ${alertData.title}`,
        alertData.description,
        JSON.stringify({
          source: alertData.source,
          eventType: alertData.event_type,
          severity: alertData.severity,
          urgency: alertData.urgency,
          isEmergency: true
        })
      ]);

      // Log emergency alert
      console.log(`Emergency alert sent to all emergency responders and officials`);

    } catch (error) {
      console.error('Error triggering emergency alert:', error);
    }
  }

  // Send alert to external emergency system
  async sendToEmergencySystem(alertData) {
    try {
      const payload = {
        source: 'AquaSutra',
        alert: {
          id: alertData.external_id,
          title: alertData.title,
          description: alertData.description,
          eventType: alertData.event_type,
          severity: alertData.severity,
          urgency: alertData.urgency,
          areas: alertData.areas,
          effectiveTime: alertData.effective_time,
          expiresTime: alertData.expires_time
        }
      };

      await axios.post(this.integrations.emergency.baseUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.integrations.emergency.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      console.log('Alert sent to emergency system successfully');

    } catch (error) {
      console.error('Error sending to emergency system:', error);
    }
  }

  // Update hotspots based on alert
  async updateHotspotsFromAlert(alertData) {
    try {
      if (!alertData.geometry || !alertData.geometry.coordinates) {
        return;
      }

      const coords = alertData.geometry.coordinates;
      const severity = this.alertLevels[alertData.severity] || this.alertLevels.advisory;

      // Create or update hotspot at alert location
      await db.query(`
        INSERT INTO hotspots (
          location, radius, intensity_score, report_count, social_media_count,
          hazard_types, severity_distribution, last_activity, is_active
        )
        VALUES (
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3, $4, 0, 0, $5, $6, NOW(), true
        )
        ON CONFLICT ON CONSTRAINT hotspots_location_key DO UPDATE SET
          intensity_score = GREATEST(hotspots.intensity_score, EXCLUDED.intensity_score),
          hazard_types = hotspots.hazard_types || EXCLUDED.hazard_types,
          last_activity = NOW(),
          is_active = true
      `, [
        coords[0], coords[1],
        25000, // 25km radius
        severity.priority * 2, // Intensity based on severity
        JSON.stringify([alertData.event_type]),
        JSON.stringify({ [alertData.severity]: 1.0 })
      ]);

    } catch (error) {
      console.error('Error updating hotspots from alert:', error);
    }
  }

  // Helper functions
  isOceanRelatedAlert(eventType) {
    const oceanEvents = [
      'tsunami', 'storm surge', 'coastal flood', 'hurricane', 'typhoon',
      'marine weather', 'high surf', 'rip current', 'gale', 'storm'
    ];
    return oceanEvents.some(event => 
      eventType.toLowerCase().includes(event.toLowerCase())
    );
  }

  isNearCoast(coordinates) {
    // Simplified check - in reality, you'd use a proper coastal database
    // This checks if the earthquake is within a reasonable distance of major coastlines
    const [lng, lat] = coordinates;
    
    // Pacific Ring of Fire and major coastal areas
    const coastalRegions = [
      { minLat: 30, maxLat: 60, minLng: -180, maxLng: -100 }, // US West Coast
      { minLat: -50, maxLat: 10, minLng: -90, maxLng: -30 },  // South America West Coast
      { minLat: 20, maxLat: 60, minLng: 120, maxLng: 180 },   // Asia Pacific
      { minLat: -50, maxLat: -10, minLng: 100, maxLng: 180 }  // Australia/New Zealand
    ];

    return coastalRegions.some(region =>
      lat >= region.minLat && lat <= region.maxLat &&
      lng >= region.minLng && lng <= region.maxLng
    );
  }

  mapNOAASeverity(noaaSeverity) {
    const mapping = {
      'Extreme': 'emergency',
      'Severe': 'warning',
      'Moderate': 'watch',
      'Minor': 'advisory',
      'Unknown': 'advisory'
    };
    return mapping[noaaSeverity] || 'advisory';
  }

  mapEarthquakeSeverity(magnitude) {
    if (magnitude >= 7.0) return 'emergency';
    if (magnitude >= 6.0) return 'warning';
    if (magnitude >= 5.0) return 'watch';
    return 'advisory';
  }

  // Get active external alerts
  async getActiveAlerts(filters = {}) {
    try {
      let query = `
        SELECT * FROM external_alerts
        WHERE effective_time <= NOW()
        AND (expires_time IS NULL OR expires_time > NOW())
      `;

      const params = [];
      let paramIndex = 1;

      if (filters.eventType) {
        query += ` AND event_type = $${paramIndex}`;
        params.push(filters.eventType);
        paramIndex++;
      }

      if (filters.severity) {
        query += ` AND severity = $${paramIndex}`;
        params.push(filters.severity);
        paramIndex++;
      }

      if (filters.source) {
        query += ` AND source = $${paramIndex}`;
        params.push(filters.source);
        paramIndex++;
      }

      query += ` ORDER BY effective_time DESC`;

      if (filters.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
      }

      const result = await db.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Error getting active alerts:', error);
      return [];
    }
  }

  // Get alert statistics
  async getAlertStatistics() {
    try {
      const result = await db.query(`
        SELECT 
          source,
          event_type,
          severity,
          COUNT(*) as count
        FROM external_alerts
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY source, event_type, severity
        ORDER BY count DESC
      `);

      return result.rows;

    } catch (error) {
      console.error('Error getting alert statistics:', error);
      return [];
    }
  }
}

module.exports = new EarlyWarningService();
