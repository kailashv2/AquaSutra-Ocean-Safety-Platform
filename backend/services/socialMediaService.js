const axios = require('axios');
const db = require('../config/db');

class SocialMediaService {
  constructor() {
    this.platforms = {
      twitter: {
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        bearerToken: process.env.TWITTER_BEARER_TOKEN,
        baseUrl: 'https://api.twitter.com/2'
      },
      facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
        baseUrl: 'https://graph.facebook.com/v18.0'
      },
      youtube: {
        apiKey: process.env.YOUTUBE_API_KEY,
        baseUrl: 'https://www.googleapis.com/youtube/v3'
      },
      instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
        baseUrl: 'https://graph.instagram.com'
      }
    };

    this.hazardKeywords = [
      'tsunami', 'hurricane', 'cyclone', 'typhoon', 'storm', 'flood', 'flooding',
      'earthquake', 'seismic', 'landslide', 'avalanche', 'wildfire', 'fire',
      'tornado', 'severe weather', 'emergency', 'disaster', 'evacuation',
      'warning', 'alert', 'danger', 'hazard', 'risk', 'threat', 'crisis',
      'rescue', 'emergency services', 'first responders', 'damage', 'destruction',
      'coastal flooding', 'storm surge', 'high waves', 'rough seas', 'maritime',
      'ocean hazard', 'beach closure', 'rip current', 'dangerous conditions'
    ];

    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  // Start monitoring social media platforms
  async startMonitoring() {
    if (this.isMonitoring) {
      console.log('Social media monitoring already running');
      return;
    }

    this.isMonitoring = true;
    console.log('Starting social media monitoring...');

    // Monitor every 5 minutes
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.collectFromAllPlatforms();
      } catch (error) {
        console.error('Social media monitoring error:', error);
      }
    }, 5 * 60 * 1000);

    // Initial collection
    await this.collectFromAllPlatforms();
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('Social media monitoring stopped');
  }

  // Collect data from all platforms
  async collectFromAllPlatforms() {
    const promises = [];

    if (this.platforms.twitter.bearerToken) {
      promises.push(this.collectTwitterData());
    }

    if (this.platforms.facebook.accessToken) {
      promises.push(this.collectFacebookData());
    }

    if (this.platforms.youtube.apiKey) {
      promises.push(this.collectYouTubeData());
    }

    if (this.platforms.instagram.accessToken) {
      promises.push(this.collectInstagramData());
    }

    const results = await Promise.allSettled(promises);
    
    let totalCollected = 0;
    results.forEach((result, index) => {
      const platforms = ['twitter', 'facebook', 'youtube', 'instagram'];
      if (result.status === 'fulfilled') {
        totalCollected += result.value;
        console.log(`${platforms[index]}: collected ${result.value} posts`);
      } else {
        console.error(`${platforms[index]} error:`, result.reason);
      }
    });

    console.log(`Total posts collected: ${totalCollected}`);
    return totalCollected;
  }

  // Twitter data collection
  async collectTwitterData() {
    try {
      const query = this.hazardKeywords.map(keyword => `"${keyword}"`).join(' OR ');
      
      const response = await axios.get(`${this.platforms.twitter.baseUrl}/tweets/search/recent`, {
        headers: {
          'Authorization': `Bearer ${this.platforms.twitter.bearerToken}`
        },
        params: {
          query: `(${query}) -is:retweet lang:en`,
          max_results: 100,
          'tweet.fields': 'created_at,author_id,public_metrics,geo,lang,context_annotations',
          'user.fields': 'name,username,location',
          'expansions': 'author_id,geo.place_id',
          'place.fields': 'full_name,country,place_type,geo'
        }
      });

      const tweets = response.data.data || [];
      const users = response.data.includes?.users || [];
      const places = response.data.includes?.places || [];

      let savedCount = 0;

      for (const tweet of tweets) {
        const user = users.find(u => u.id === tweet.author_id);
        const place = places.find(p => p.id === tweet.geo?.place_id);

        const postData = {
          platform: 'twitter',
          post_id: tweet.id,
          author_username: user?.username,
          author_name: user?.name,
          content: tweet.text,
          location_name: place?.full_name || user?.location,
          engagement_metrics: {
            retweet_count: tweet.public_metrics?.retweet_count || 0,
            like_count: tweet.public_metrics?.like_count || 0,
            reply_count: tweet.public_metrics?.reply_count || 0,
            quote_count: tweet.public_metrics?.quote_count || 0
          },
          language: tweet.lang,
          post_created_at: new Date(tweet.created_at)
        };

        // Extract hashtags and mentions
        postData.hashtags = this.extractHashtags(tweet.text);
        postData.mentions = this.extractMentions(tweet.text);

        // Process with NLP
        const nlpResult = await this.processWithNLP(tweet.text);
        postData.sentiment_score = nlpResult.sentiment_score;
        postData.sentiment_label = nlpResult.sentiment_label;
        postData.keywords = nlpResult.keywords;
        postData.hazard_relevance_score = nlpResult.hazard_relevance_score;
        postData.is_hazard_related = nlpResult.hazard_relevance_score > 0.6;

        // Geocode location if available
        if (postData.location_name) {
          const coordinates = await this.geocodeLocation(postData.location_name);
          if (coordinates) {
            postData.location = `POINT(${coordinates.lng} ${coordinates.lat})`;
          }
        }

        await this.saveSocialMediaPost(postData);
        savedCount++;
      }

      return savedCount;
    } catch (error) {
      console.error('Twitter collection error:', error.response?.data || error.message);
      return 0;
    }
  }

  // Facebook data collection
  async collectFacebookData() {
    try {
      // Note: Facebook's API has limited public post access
      // This would typically require specific page access or user permissions
      const query = this.hazardKeywords.join(' OR ');
      
      const response = await axios.get(`${this.platforms.facebook.baseUrl}/search`, {
        params: {
          q: query,
          type: 'post',
          access_token: this.platforms.facebook.accessToken,
          fields: 'id,message,created_time,from,place,engagement,reactions.summary(true),comments.summary(true),shares'
        }
      });

      const posts = response.data.data || [];
      let savedCount = 0;

      for (const post of posts) {
        if (!post.message) continue;

        const postData = {
          platform: 'facebook',
          post_id: post.id,
          author_username: post.from?.id,
          author_name: post.from?.name,
          content: post.message,
          location_name: post.place?.name,
          engagement_metrics: {
            reactions: post.reactions?.summary?.total_count || 0,
            comments: post.comments?.summary?.total_count || 0,
            shares: post.shares?.count || 0
          },
          post_created_at: new Date(post.created_time)
        };

        // Process with NLP
        const nlpResult = await this.processWithNLP(post.message);
        postData.sentiment_score = nlpResult.sentiment_score;
        postData.sentiment_label = nlpResult.sentiment_label;
        postData.keywords = nlpResult.keywords;
        postData.hazard_relevance_score = nlpResult.hazard_relevance_score;
        postData.is_hazard_related = nlpResult.hazard_relevance_score > 0.6;

        if (postData.location_name) {
          const coordinates = await this.geocodeLocation(postData.location_name);
          if (coordinates) {
            postData.location = `POINT(${coordinates.lng} ${coordinates.lat})`;
          }
        }

        await this.saveSocialMediaPost(postData);
        savedCount++;
      }

      return savedCount;
    } catch (error) {
      console.error('Facebook collection error:', error.response?.data || error.message);
      return 0;
    }
  }

  // YouTube data collection
  async collectYouTubeData() {
    try {
      const query = this.hazardKeywords.slice(0, 5).join('|'); // YouTube has query length limits
      
      const response = await axios.get(`${this.platforms.youtube.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 50,
          order: 'date',
          publishedAfter: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          key: this.platforms.youtube.apiKey
        }
      });

      const videos = response.data.items || [];
      let savedCount = 0;

      for (const video of videos) {
        const postData = {
          platform: 'youtube',
          post_id: video.id.videoId,
          author_username: video.snippet.channelId,
          author_name: video.snippet.channelTitle,
          content: `${video.snippet.title} - ${video.snippet.description}`,
          media_urls: [video.snippet.thumbnails?.high?.url],
          post_created_at: new Date(video.snippet.publishedAt)
        };

        // Process with NLP
        const nlpResult = await this.processWithNLP(postData.content);
        postData.sentiment_score = nlpResult.sentiment_score;
        postData.sentiment_label = nlpResult.sentiment_label;
        postData.keywords = nlpResult.keywords;
        postData.hazard_relevance_score = nlpResult.hazard_relevance_score;
        postData.is_hazard_related = nlpResult.hazard_relevance_score > 0.6;

        await this.saveSocialMediaPost(postData);
        savedCount++;
      }

      return savedCount;
    } catch (error) {
      console.error('YouTube collection error:', error.response?.data || error.message);
      return 0;
    }
  }

  // Instagram data collection
  async collectInstagramData() {
    try {
      // Note: Instagram's API requires business accounts and specific permissions
      const response = await axios.get(`${this.platforms.instagram.baseUrl}/me/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,location',
          access_token: this.platforms.instagram.accessToken
        }
      });

      const posts = response.data.data || [];
      let savedCount = 0;

      for (const post of posts) {
        if (!post.caption) continue;

        // Check if post contains hazard-related keywords
        const hasHazardKeywords = this.hazardKeywords.some(keyword => 
          post.caption.toLowerCase().includes(keyword.toLowerCase())
        );

        if (!hasHazardKeywords) continue;

        const postData = {
          platform: 'instagram',
          post_id: post.id,
          content: post.caption,
          media_urls: [post.media_url || post.thumbnail_url],
          location_name: post.location?.name,
          post_created_at: new Date(post.timestamp)
        };

        // Process with NLP
        const nlpResult = await this.processWithNLP(post.caption);
        postData.sentiment_score = nlpResult.sentiment_score;
        postData.sentiment_label = nlpResult.sentiment_label;
        postData.keywords = nlpResult.keywords;
        postData.hazard_relevance_score = nlpResult.hazard_relevance_score;
        postData.is_hazard_related = nlpResult.hazard_relevance_score > 0.6;

        if (postData.location_name) {
          const coordinates = await this.geocodeLocation(postData.location_name);
          if (coordinates) {
            postData.location = `POINT(${coordinates.lng} ${coordinates.lat})`;
          }
        }

        await this.saveSocialMediaPost(postData);
        savedCount++;
      }

      return savedCount;
    } catch (error) {
      console.error('Instagram collection error:', error.response?.data || error.message);
      return 0;
    }
  }

  // Process text with NLP
  async processWithNLP(text) {
    try {
      // This would typically call your NLP service
      // For now, we'll implement basic sentiment analysis
      
      const sentiment = this.analyzeSentiment(text);
      const keywords = this.extractKeywords(text);
      const hazardRelevance = this.calculateHazardRelevance(text);

      return {
        sentiment_score: sentiment.score,
        sentiment_label: sentiment.label,
        keywords: keywords,
        hazard_relevance_score: hazardRelevance
      };
    } catch (error) {
      console.error('NLP processing error:', error);
      return {
        sentiment_score: 0,
        sentiment_label: 'neutral',
        keywords: [],
        hazard_relevance_score: 0
      };
    }
  }

  // Basic sentiment analysis
  analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'safe', 'clear', 'calm'];
    const negativeWords = ['bad', 'terrible', 'awful', 'dangerous', 'emergency', 'disaster', 'crisis', 'urgent', 'severe', 'critical'];

    const words = text.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    const totalSentimentWords = positiveCount + negativeCount;
    if (totalSentimentWords === 0) {
      return { score: 0, label: 'neutral' };
    }

    const score = (positiveCount - negativeCount) / totalSentimentWords;
    let label = 'neutral';
    
    if (score > 0.2) label = 'positive';
    else if (score < -0.2) label = 'negative';

    return { score, label };
  }

  // Extract keywords
  extractKeywords(text) {
    const words = text.toLowerCase().split(/\W+/);
    const keywords = words.filter(word => 
      word.length > 3 && 
      this.hazardKeywords.some(hazard => hazard.includes(word) || word.includes(hazard))
    );
    return [...new Set(keywords)];
  }

  // Calculate hazard relevance score
  calculateHazardRelevance(text) {
    const lowerText = text.toLowerCase();
    let score = 0;
    let matchCount = 0;

    this.hazardKeywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchCount++;
        // Give higher scores to more specific hazard terms
        if (keyword.length > 8) score += 0.3;
        else score += 0.2;
      }
    });

    // Boost score for emergency-related terms
    const emergencyTerms = ['emergency', 'urgent', 'immediate', 'evacuation', 'warning', 'alert'];
    emergencyTerms.forEach(term => {
      if (lowerText.includes(term)) {
        score += 0.4;
      }
    });

    return Math.min(score, 1.0); // Cap at 1.0
  }

  // Extract hashtags from text
  extractHashtags(text) {
    const hashtags = text.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.substring(1));
  }

  // Extract mentions from text
  extractMentions(text) {
    const mentions = text.match(/@\w+/g) || [];
    return mentions.map(mention => mention.substring(1));
  }

  // Geocode location name to coordinates
  async geocodeLocation(locationName) {
    try {
      // This would typically use a geocoding service like Google Maps API
      // For now, return null - implement with actual geocoding service
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  // Save social media post to database
  async saveSocialMediaPost(postData) {
    try {
      const query = `
        INSERT INTO social_media_posts (
          platform, post_id, author_username, author_name, content, location,
          location_name, media_urls, hashtags, mentions, engagement_metrics,
          language, sentiment_score, sentiment_label, keywords,
          hazard_relevance_score, is_hazard_related, processed_at, post_created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), $18)
        ON CONFLICT (platform, post_id) DO UPDATE SET
          sentiment_score = EXCLUDED.sentiment_score,
          sentiment_label = EXCLUDED.sentiment_label,
          keywords = EXCLUDED.keywords,
          hazard_relevance_score = EXCLUDED.hazard_relevance_score,
          is_hazard_related = EXCLUDED.is_hazard_related,
          processed_at = NOW()
      `;

      await db.query(query, [
        postData.platform,
        postData.post_id,
        postData.author_username,
        postData.author_name,
        postData.content,
        postData.location,
        postData.location_name,
        JSON.stringify(postData.media_urls || []),
        JSON.stringify(postData.hashtags || []),
        JSON.stringify(postData.mentions || []),
        JSON.stringify(postData.engagement_metrics || {}),
        postData.language,
        postData.sentiment_score,
        postData.sentiment_label,
        JSON.stringify(postData.keywords || []),
        postData.hazard_relevance_score,
        postData.is_hazard_related,
        postData.post_created_at
      ]);

      // Save NLP analytics
      if (postData.keywords && postData.keywords.length > 0) {
        for (const keyword of postData.keywords) {
          await db.query(`
            INSERT INTO nlp_analytics (
              source, source_id, keyword, sentiment, sentiment_score,
              location, language, confidence_score, context
            )
            VALUES ('social_media', $1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            postData.post_id,
            keyword,
            postData.sentiment_label,
            postData.sentiment_score,
            postData.location,
            postData.language,
            postData.hazard_relevance_score,
            postData.content.substring(0, 500)
          ]);
        }
      }

    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        console.error('Error saving social media post:', error);
      }
    }
  }

  // Get social media posts with filtering
  async getPosts(filters = {}) {
    try {
      let query = `
        SELECT * FROM social_media_posts
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      if (filters.platform) {
        query += ` AND platform = $${paramIndex}`;
        params.push(filters.platform);
        paramIndex++;
      }

      if (filters.hazardRelated) {
        query += ` AND is_hazard_related = true`;
      }

      if (filters.sentiment) {
        query += ` AND sentiment_label = $${paramIndex}`;
        params.push(filters.sentiment);
        paramIndex++;
      }

      if (filters.location && filters.radius) {
        query += ` AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex+1}), 4326)::geography,
          $${paramIndex+2}
        )`;
        params.push(filters.location.lng, filters.location.lat, filters.radius);
        paramIndex += 3;
      }

      if (filters.startDate) {
        query += ` AND post_created_at >= $${paramIndex}`;
        params.push(new Date(filters.startDate));
        paramIndex++;
      }

      if (filters.endDate) {
        query += ` AND post_created_at <= $${paramIndex}`;
        params.push(new Date(filters.endDate));
        paramIndex++;
      }

      query += ` ORDER BY post_created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
      }

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting social media posts:', error);
      return [];
    }
  }

  // Get trending keywords
  async getTrendingKeywords(timeframe = '24 hours') {
    try {
      const result = await db.query(`
        SELECT 
          keyword,
          COUNT(*) as frequency,
          AVG(sentiment_score) as avg_sentiment,
          AVG(hazard_relevance_score) as avg_relevance
        FROM social_media_posts,
        jsonb_array_elements_text(keywords) as keyword
        WHERE post_created_at >= NOW() - INTERVAL '${timeframe}'
        AND is_hazard_related = true
        GROUP BY keyword
        HAVING COUNT(*) >= 3
        ORDER BY frequency DESC, avg_relevance DESC
        LIMIT 20
      `);

      return result.rows;
    } catch (error) {
      console.error('Error getting trending keywords:', error);
      return [];
    }
  }

  // Get sentiment analysis summary
  async getSentimentSummary(timeframe = '24 hours') {
    try {
      const result = await db.query(`
        SELECT 
          sentiment_label,
          COUNT(*) as count,
          AVG(sentiment_score) as avg_score,
          platform
        FROM social_media_posts
        WHERE post_created_at >= NOW() - INTERVAL '${timeframe}'
        AND is_hazard_related = true
        GROUP BY sentiment_label, platform
        ORDER BY platform, sentiment_label
      `);

      return result.rows;
    } catch (error) {
      console.error('Error getting sentiment summary:', error);
      return [];
    }
  }
}

module.exports = new SocialMediaService();
