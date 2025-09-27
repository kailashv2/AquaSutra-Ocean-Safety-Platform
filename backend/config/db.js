const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'aquasutra',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Initialize database tables
async function setupDatabase() {
  try {
    // Create extension for PostGIS if it doesn't exist
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS postgis;
    `);

    // Create enhanced users table with additional fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'citizen',
        phone VARCHAR(20),
        organization VARCHAR(100),
        location GEOGRAPHY(POINT),
        language_preference VARCHAR(10) DEFAULT 'en',
        notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
        profile_image_url TEXT,
        is_verified BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create enhanced reports table with comprehensive fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        hazard_type VARCHAR(50) NOT NULL,
        location GEOGRAPHY(POINT) NOT NULL,
        media_urls JSONB DEFAULT '[]',
        thumbnail_urls JSONB DEFAULT '[]',
        media_url TEXT, -- Keep for backward compatibility
        note TEXT,
        severity VARCHAR(20) DEFAULT 'medium',
        tags JSONB DEFAULT '[]',
        verification_status VARCHAR(20) DEFAULT 'unverified',
        verified_by INTEGER REFERENCES users(id),
        verified_at TIMESTAMP,
        is_anonymous BOOLEAN DEFAULT false,
        metadata JSONB DEFAULT '{}',
        location_accuracy FLOAT,
        priority_score INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        is_emergency BOOLEAN DEFAULT false,
        response_status VARCHAR(30) DEFAULT 'pending',
        assigned_to INTEGER REFERENCES users(id),
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create report comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_comments (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        comment TEXT NOT NULL,
        is_official BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create report history table for audit trail
    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_history (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        old_values JSONB,
        new_values JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create social media posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_media_posts (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(20) NOT NULL,
        post_id VARCHAR(100) NOT NULL,
        author_username VARCHAR(100),
        author_name VARCHAR(100),
        content TEXT NOT NULL,
        location GEOGRAPHY(POINT),
        location_name VARCHAR(100),
        media_urls JSONB DEFAULT '[]',
        hashtags JSONB DEFAULT '[]',
        mentions JSONB DEFAULT '[]',
        engagement_metrics JSONB DEFAULT '{}',
        language VARCHAR(10),
        sentiment_score FLOAT,
        sentiment_label VARCHAR(20),
        keywords JSONB DEFAULT '[]',
        hazard_relevance_score FLOAT DEFAULT 0,
        is_hazard_related BOOLEAN DEFAULT false,
        processed_at TIMESTAMP,
        post_created_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(platform, post_id)
      );
    `);

    // Create hotspots table for dynamic hotspot generation
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotspots (
        id SERIAL PRIMARY KEY,
        location GEOGRAPHY(POINT) NOT NULL,
        radius FLOAT NOT NULL,
        intensity_score FLOAT NOT NULL,
        report_count INTEGER NOT NULL,
        social_media_count INTEGER DEFAULT 0,
        hazard_types JSONB DEFAULT '[]',
        severity_distribution JSONB DEFAULT '{}',
        last_activity TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(30) NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        is_read BOOLEAN DEFAULT false,
        priority VARCHAR(20) DEFAULT 'normal',
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create alert subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alert_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        location GEOGRAPHY(POINT) NOT NULL,
        radius FLOAT NOT NULL,
        hazard_types JSONB DEFAULT '[]',
        severity_threshold VARCHAR(20) DEFAULT 'low',
        notification_methods JSONB DEFAULT '["push"]',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create offline sync queue table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS offline_sync_queue (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(20) NOT NULL,
        table_name VARCHAR(50) NOT NULL,
        record_data JSONB NOT NULL,
        sync_status VARCHAR(20) DEFAULT 'pending',
        error_message TEXT,
        attempts INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        synced_at TIMESTAMP
      );
    `);

    // Create enhanced nlp_analytics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nlp_analytics (
        id SERIAL PRIMARY KEY,
        source VARCHAR(30) NOT NULL, -- 'report', 'social_media', 'news'
        source_id INTEGER,
        keyword VARCHAR(100) NOT NULL,
        sentiment VARCHAR(20) NOT NULL,
        sentiment_score FLOAT,
        location GEOGRAPHY(POINT),
        language VARCHAR(10),
        confidence_score FLOAT,
        context TEXT,
        count INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create system settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        description TEXT,
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_location ON reports USING GIST(location);
      CREATE INDEX IF NOT EXISTS idx_reports_hazard_type ON reports(hazard_type);
      CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
      CREATE INDEX IF NOT EXISTS idx_reports_verification_status ON reports(verification_status);
      CREATE INDEX IF NOT EXISTS idx_social_media_location ON social_media_posts USING GIST(location);
      CREATE INDEX IF NOT EXISTS idx_social_media_platform ON social_media_posts(platform);
      CREATE INDEX IF NOT EXISTS idx_social_media_hazard_related ON social_media_posts(is_hazard_related);
      CREATE INDEX IF NOT EXISTS idx_hotspots_location ON hotspots USING GIST(location);
      CREATE INDEX IF NOT EXISTS idx_hotspots_active ON hotspots(is_active);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    `);

    // Insert default system settings
    await pool.query(`
      INSERT INTO system_settings (key, value, description) VALUES
      ('social_media_monitoring', '{"enabled": true, "platforms": ["twitter", "facebook", "youtube", "instagram"]}', 'Social media monitoring configuration'),
      ('nlp_settings', '{"sentiment_threshold": 0.6, "hazard_keywords": ["tsunami", "storm", "flood", "hurricane", "earthquake"]}', 'NLP processing settings'),
      ('hotspot_settings', '{"min_reports": 3, "radius_km": 5, "decay_hours": 24}', 'Hotspot generation settings'),
      ('notification_settings', '{"max_per_hour": 10, "emergency_override": true}', 'Notification system settings')
      ON CONFLICT (key) DO NOTHING;
    `);

    console.log('Enhanced database setup completed');
  } catch (error) {
    console.error('Database setup error:', error);
    throw error;
  }
}

module.exports = {
  pool,
  setupDatabase,
  query: (text, params) => pool.query(text, params),
};