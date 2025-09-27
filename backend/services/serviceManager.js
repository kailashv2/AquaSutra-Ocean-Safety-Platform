const socialMediaService = require('./socialMediaService');
const hotspotService = require('./hotspotService');
const offlineService = require('./offlineService');
const multilingualService = require('./multilingualService');
const earlyWarningService = require('./earlyWarningService');
const db = require('../config/db');

class ServiceManager {
  constructor() {
    this.services = {
      socialMedia: socialMediaService,
      hotspot: hotspotService,
      offline: offlineService,
      multilingual: multilingualService,
      earlyWarning: earlyWarningService
    };
    
    this.isInitialized = false;
    this.startupErrors = [];
  }

  // Initialize all services
  async initialize() {
    if (this.isInitialized) {
      console.log('Services already initialized');
      return;
    }

    console.log('🚀 Initializing AquaSutra Enhanced Services...');

    try {
      // Initialize database first
      await this.initializeDatabase();

      // Initialize multilingual service
      await this.initializeMultilingualService();

      // Initialize other services
      await this.initializeOfflineService();
      await this.initializeSocialMediaService();
      await this.initializeHotspotService();
      await this.initializeEarlyWarningService();

      // Set up cleanup tasks
      await this.setupCleanupTasks();

      this.isInitialized = true;
      console.log('✅ All services initialized successfully');

      // Log service status
      await this.logServiceStatus();

    } catch (error) {
      console.error('❌ Service initialization failed:', error);
      this.startupErrors.push(error);
      throw error;
    }
  }

  // Initialize database and run migrations
  async initializeDatabase() {
    try {
      console.log('📊 Setting up enhanced database schema...');
      await db.setupDatabase();
      console.log('✅ Database schema initialized');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  // Initialize multilingual service
  async initializeMultilingualService() {
    try {
      console.log('🌐 Initializing multilingual support...');
      await this.services.multilingual.loadTranslations();
      console.log('✅ Multilingual service initialized');
    } catch (error) {
      console.error('❌ Multilingual service initialization failed:', error);
      this.startupErrors.push(error);
    }
  }

  // Initialize offline synchronization service
  async initializeOfflineService() {
    try {
      console.log('📱 Starting offline synchronization service...');
      this.services.offline.startSyncProcessor();
      console.log('✅ Offline sync service started');
    } catch (error) {
      console.error('❌ Offline service initialization failed:', error);
      this.startupErrors.push(error);
    }
  }

  // Initialize social media monitoring service
  async initializeSocialMediaService() {
    try {
      console.log('📱 Starting social media monitoring...');
      
      // Check if social media monitoring is enabled
      const settingsResult = await db.query(
        "SELECT value FROM system_settings WHERE key = 'social_media_monitoring'"
      );
      
      if (settingsResult.rows.length > 0 && settingsResult.rows[0].value.enabled) {
        await this.services.socialMedia.startMonitoring();
        console.log('✅ Social media monitoring started');
      } else {
        console.log('ℹ️ Social media monitoring disabled in settings');
      }
    } catch (error) {
      console.error('❌ Social media service initialization failed:', error);
      this.startupErrors.push(error);
    }
  }

  // Initialize hotspot generation service
  async initializeHotspotService() {
    try {
      console.log('🔥 Starting hotspot generation service...');
      this.services.hotspot.startAutoGeneration();
      console.log('✅ Hotspot generation service started');
    } catch (error) {
      console.error('❌ Hotspot service initialization failed:', error);
      this.startupErrors.push(error);
    }
  }

  // Initialize early warning system integration
  async initializeEarlyWarningService() {
    try {
      console.log('⚠️ Starting early warning system monitoring...');
      await this.services.earlyWarning.startMonitoring();
      console.log('✅ Early warning system monitoring started');
    } catch (error) {
      console.error('❌ Early warning service initialization failed:', error);
      this.startupErrors.push(error);
    }
  }

  // Set up cleanup tasks
  async setupCleanupTasks() {
    try {
      console.log('🧹 Setting up cleanup tasks...');

      // Run cleanup every 6 hours
      setInterval(async () => {
        try {
          await this.runCleanupTasks();
        } catch (error) {
          console.error('Cleanup task error:', error);
        }
      }, 6 * 60 * 60 * 1000);

      console.log('✅ Cleanup tasks scheduled');
    } catch (error) {
      console.error('❌ Cleanup task setup failed:', error);
      this.startupErrors.push(error);
    }
  }

  // Run cleanup tasks
  async runCleanupTasks() {
    console.log('🧹 Running scheduled cleanup tasks...');

    try {
      // Clean up old sync records
      await this.services.offline.cleanupSyncRecords();

      // Clean up old notifications
      await db.query(`
        DELETE FROM notifications
        WHERE created_at < NOW() - INTERVAL '30 days'
        AND is_read = true
      `);

      // Clean up old social media posts (keep only hazard-related ones)
      await db.query(`
        DELETE FROM social_media_posts
        WHERE post_created_at < NOW() - INTERVAL '90 days'
        AND is_hazard_related = false
      `);

      // Clean up old NLP analytics
      await db.query(`
        DELETE FROM nlp_analytics
        WHERE created_at < NOW() - INTERVAL '180 days'
      `);

      console.log('✅ Cleanup tasks completed');
    } catch (error) {
      console.error('❌ Cleanup tasks failed:', error);
    }
  }

  // Graceful shutdown of all services
  async shutdown() {
    console.log('🛑 Shutting down services...');

    try {
      // Stop social media monitoring
      if (this.services.socialMedia.isMonitoring) {
        this.services.socialMedia.stopMonitoring();
        console.log('✅ Social media monitoring stopped');
      }

      // Stop hotspot generation
      if (this.services.hotspot.isGenerating) {
        this.services.hotspot.stopAutoGeneration();
        console.log('✅ Hotspot generation stopped');
      }

      // Stop offline sync processor
      if (this.services.offline.isProcessing) {
        this.services.offline.stopSyncProcessor();
        console.log('✅ Offline sync processor stopped');
      }

      // Stop early warning monitoring
      if (this.services.earlyWarning.isMonitoring) {
        this.services.earlyWarning.stopMonitoring();
        console.log('✅ Early warning monitoring stopped');
      }

      console.log('✅ All services shut down gracefully');
    } catch (error) {
      console.error('❌ Service shutdown error:', error);
    }
  }

  // Get service status
  async getServiceStatus() {
    const status = {
      initialized: this.isInitialized,
      startupErrors: this.startupErrors,
      services: {
        socialMedia: {
          running: this.services.socialMedia.isMonitoring,
          name: 'Social Media Monitoring'
        },
        hotspot: {
          running: this.services.hotspot.isGenerating,
          name: 'Hotspot Generation'
        },
        offline: {
          running: this.services.offline.isProcessing,
          name: 'Offline Synchronization'
        },
        earlyWarning: {
          running: this.services.earlyWarning.isMonitoring,
          name: 'Early Warning System'
        },
        multilingual: {
          running: true, // Always running once initialized
          name: 'Multilingual Support'
        }
      }
    };

    // Get additional statistics
    try {
      // Get database connection status
      await db.query('SELECT 1');
      status.database = { connected: true };

      // Get service statistics
      const statsResult = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM reports WHERE created_at >= NOW() - INTERVAL '24 hours') as recent_reports,
          (SELECT COUNT(*) FROM social_media_posts WHERE post_created_at >= NOW() - INTERVAL '24 hours') as recent_social_posts,
          (SELECT COUNT(*) FROM hotspots WHERE is_active = true) as active_hotspots,
          (SELECT COUNT(*) FROM offline_sync_queue WHERE sync_status = 'pending') as pending_syncs
      `);

      if (statsResult.rows.length > 0) {
        status.statistics = {
          recentReports: parseInt(statsResult.rows[0].recent_reports),
          recentSocialPosts: parseInt(statsResult.rows[0].recent_social_posts),
          activeHotspots: parseInt(statsResult.rows[0].active_hotspots),
          pendingSyncs: parseInt(statsResult.rows[0].pending_syncs)
        };
      }
    } catch (error) {
      status.database = { connected: false, error: error.message };
    }

    return status;
  }

  // Log service status
  async logServiceStatus() {
    try {
      const status = await this.getServiceStatus();
      
      console.log('\n📊 Service Status Report:');
      console.log('========================');
      
      Object.entries(status.services).forEach(([key, service]) => {
        const statusIcon = service.running ? '✅' : '❌';
        console.log(`${statusIcon} ${service.name}: ${service.running ? 'Running' : 'Stopped'}`);
      });

      if (status.statistics) {
        console.log('\n📈 Recent Activity:');
        console.log(`   Reports (24h): ${status.statistics.recentReports}`);
        console.log(`   Social Posts (24h): ${status.statistics.recentSocialPosts}`);
        console.log(`   Active Hotspots: ${status.statistics.activeHotspots}`);
        console.log(`   Pending Syncs: ${status.statistics.pendingSyncs}`);
      }

      if (status.startupErrors.length > 0) {
        console.log('\n⚠️ Startup Warnings:');
        status.startupErrors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error.message}`);
        });
      }

      console.log('========================\n');
    } catch (error) {
      console.error('Error logging service status:', error);
    }
  }

  // Health check endpoint data
  async getHealthCheck() {
    const status = await this.getServiceStatus();
    
    const healthCheck = {
      status: this.isInitialized && status.database?.connected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      services: status.services,
      database: status.database,
      statistics: status.statistics || {},
      errors: status.startupErrors
    };

    return healthCheck;
  }

  // Restart a specific service
  async restartService(serviceName) {
    if (!this.services[serviceName]) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    console.log(`🔄 Restarting ${serviceName} service...`);

    try {
      switch (serviceName) {
        case 'socialMedia':
          if (this.services.socialMedia.isMonitoring) {
            this.services.socialMedia.stopMonitoring();
          }
          await this.services.socialMedia.startMonitoring();
          break;

        case 'hotspot':
          if (this.services.hotspot.isGenerating) {
            this.services.hotspot.stopAutoGeneration();
          }
          this.services.hotspot.startAutoGeneration();
          break;

        case 'offline':
          if (this.services.offline.isProcessing) {
            this.services.offline.stopSyncProcessor();
          }
          this.services.offline.startSyncProcessor();
          break;

        case 'earlyWarning':
          if (this.services.earlyWarning.isMonitoring) {
            this.services.earlyWarning.stopMonitoring();
          }
          await this.services.earlyWarning.startMonitoring();
          break;

        default:
          throw new Error(`Service '${serviceName}' cannot be restarted`);
      }

      console.log(`✅ ${serviceName} service restarted successfully`);
    } catch (error) {
      console.error(`❌ Failed to restart ${serviceName} service:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const serviceManager = new ServiceManager();

// Handle process signals for graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await serviceManager.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await serviceManager.shutdown();
  process.exit(0);
});

module.exports = serviceManager;
