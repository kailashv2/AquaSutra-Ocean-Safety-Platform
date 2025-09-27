const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Hazard types
const HAZARD_TYPES = ['flood', 'tsunami', 'high_waves', 'coastal_damage'];

// Verification statuses
const VERIFICATION_STATUSES = ['verified', 'unverified', 'false_alarm'];

// Locations for demo (can be expanded)
const LOCATIONS = [
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
  { name: 'Puducherry', lat: 11.9416, lng: 79.8083 }
];

// User roles
const USER_ROLES = ['citizen', 'official', 'analyst'];

// Generate random date within the last 30 days
function randomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
}

// Generate random location near a base location
function randomLocation(baseLocation) {
  // Add some randomness (approximately within 10km)
  const lat = baseLocation.lat + (Math.random() - 0.5) * 0.1;
  const lng = baseLocation.lng + (Math.random() - 0.5) * 0.1;
  return { lat, lng };
}

// Generate mock users
function generateUsers(count = 20) {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const role = USER_ROLES[Math.floor(Math.random() * USER_ROLES.length)];
    const id = uuidv4();
    
    users.push({
      id,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: '$2a$10$XFE/UaYeQQDSBNOGP6VYVOIQKUvw0GQKVcHnN9IiCZMfR.0Q3RJzm', // hashed 'password123'
      role,
      created_at: randomDate()
    });
  }
  
  return users;
}

// Generate mock hazard reports
function generateReports(users, count = 100) {
  const reports = [];
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const hazardType = HAZARD_TYPES[Math.floor(Math.random() * HAZARD_TYPES.length)];
    const baseLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const location = randomLocation(baseLocation);
    const verificationStatus = VERIFICATION_STATUSES[Math.floor(Math.random() * VERIFICATION_STATUSES.length)];
    const id = uuidv4();
    const created_at = randomDate();
    
    reports.push({
      id,
      user_id: user.id,
      hazard_type: hazardType,
      location,
      note: `${hazardType.replace('_', ' ')} reported in ${baseLocation.name} area. Please take necessary precautions.`,
      media_url: null, // In a real scenario, this would be a URL to an image
      verification_status: verificationStatus,
      created_at
    });
  }
  
  return reports;
}

// Generate mock social media posts
function generateSocialPosts(count = 200) {
  const sources = ['twitter', 'facebook', 'instagram', 'news'];
  const sentiments = ['positive', 'neutral', 'negative'];
  const posts = [];
  
  // Templates for generating realistic posts
  const templates = [
    "Seeing {hazard} in {location} area. Stay safe everyone! #{hazard_tag} #emergency",
    "Alert: {hazard} reported near {location}. Authorities responding. #{hazard_tag}",
    "Just witnessed {hazard} at {location} beach. Scary situation! #{hazard_tag} #warning",
    "{hazard} situation worsening in {location}. Need immediate help! #{hazard_tag}",
    "Update: {hazard} conditions improving in {location} after emergency response. #{hazard_tag}",
    "Breaking: {hazard} warning issued for {location} coastal areas. Take precautions! #{hazard_tag}",
    "My neighborhood in {location} is affected by {hazard}. Roads blocked. #{hazard_tag}",
    "Government officials monitoring {hazard} situation in {location}. Stay tuned for updates. #{hazard_tag}",
    "Relief efforts underway for {hazard} victims in {location}. #{hazard_tag} #relief",
    "Volunteers needed to help with {hazard} aftermath in {location}. #{hazard_tag} #volunteer"
  ];
  
  for (let i = 0; i < count; i++) {
    const hazardType = HAZARD_TYPES[Math.floor(Math.random() * HAZARD_TYPES.length)];
    const hazardTerm = hazardType.replace('_', ' ');
    const baseLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const location = randomLocation(baseLocation);
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const id = uuidv4();
    const created_at = randomDate();
    
    // Create post with random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    const text = template
      .replace('{hazard}', hazardTerm)
      .replace('{location}', baseLocation.name)
      .replace('{hazard_tag}', hazardType.replace('_', ''));
    
    posts.push({
      id,
      source_type: source,
      text,
      keywords: JSON.stringify([hazardTerm]),
      sentiment,
      hazard_type: hazardType,
      location,
      created_at
    });
  }
  
  return posts;
}

// Generate mock analytics data
function generateAnalytics() {
  // Hazard distribution
  const hazardDistribution = HAZARD_TYPES.map(type => ({
    hazard_type: type,
    count: Math.floor(Math.random() * 50) + 10
  }));
  
  // Verification status
  const verificationStatus = VERIFICATION_STATUSES.map(status => ({
    verification_status: status,
    count: Math.floor(Math.random() * 50) + 10
  }));
  
  // Sentiment analysis
  const sentiment = [
    { sentiment: 'positive', count: Math.floor(Math.random() * 30) + 10 },
    { sentiment: 'neutral', count: Math.floor(Math.random() * 40) + 20 },
    { sentiment: 'negative', count: Math.floor(Math.random() * 50) + 30 }
  ];
  
  // Trending keywords
  const keywords = [
    'flood', 'water', 'rising', 'tsunami', 'warning', 'evacuation', 
    'waves', 'coastal', 'damage', 'emergency', 'help', 'rescue'
  ];
  
  const trendingKeywords = keywords.map(keyword => ({
    keyword,
    total_count: Math.floor(Math.random() * 100) + 1
  })).sort((a, b) => b.total_count - a.total_count).slice(0, 10);
  
  return {
    hazardDistribution,
    verificationStatus,
    sentiment,
    trendingKeywords
  };
}

// Generate all mock data
function generateAllMockData() {
  const users = generateUsers();
  const reports = generateReports(users);
  const socialPosts = generateSocialPosts();
  const analytics = generateAnalytics();
  
  return {
    users,
    reports,
    socialPosts,
    analytics
  };
}

// Save mock data to JSON files
function saveMockData() {
  const mockData = generateAllMockData();
  const outputDir = path.join(__dirname, '..', 'mock-data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save each data type to separate files
  fs.writeFileSync(
    path.join(outputDir, 'users.json'),
    JSON.stringify(mockData.users, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'reports.json'),
    JSON.stringify(mockData.reports, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'social_posts.json'),
    JSON.stringify(mockData.socialPosts, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'analytics.json'),
    JSON.stringify(mockData.analytics, null, 2)
  );
  
  // Save all data to a single file
  fs.writeFileSync(
    path.join(outputDir, 'all_mock_data.json'),
    JSON.stringify(mockData, null, 2)
  );
  
  console.log(`Mock data generated and saved to ${outputDir}`);
}

// Run the script
saveMockData();