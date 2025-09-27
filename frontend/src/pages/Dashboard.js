import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import HazardMap from '../components/HazardMap';
import SocialFeed from '../components/SocialFeed';
import AnalyticsPanel from '../components/AnalyticsPanel';
import WaterQualityChart from '../components/WaterQualityChart';
import WaterUsageGauge from '../components/WaterUsageGauge';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { currentUser } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [socialData, setSocialData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    hazardType: 'all',
    timeRange: '24h',
    verificationStatus: 'all',
    region: 'all'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch reports
        const reportsResponse = await fetch('http://localhost:5000/api/reports', {
          headers: {
            'Authorization': `Bearer ${await currentUser.getIdToken()}`
          }
        });
        
        if (!reportsResponse.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const reportsData = await reportsResponse.json();
        setReports(reportsData);
        
        // Fetch social media data
        const socialResponse = await fetch('http://localhost:5000/api/social-data', {
          headers: {
            'Authorization': `Bearer ${await currentUser.getIdToken()}`
          }
        });
        
        if (!socialResponse.ok) {
          throw new Error('Failed to fetch social data');
        }
        
        const socialData = await socialResponse.json();
        setSocialData(socialData);
        
        // Fetch analytics data
        const analyticsResponse = await fetch('http://localhost:5000/api/analytics', {
          headers: {
            'Authorization': `Bearer ${await currentUser.getIdToken()}`
          }
        });
        
        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics');
        }
        
        const analyticsData = await analyticsResponse.json();
        setAnalyticsData(analyticsData);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up socket connection for real-time updates
    const socket = new WebSocket('ws://localhost:5000');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_report') {
        setReports(prev => [...prev, data.report]);
      } else if (data.type === 'update_report') {
        setReports(prev => prev.map(report => 
          report.id === data.report.id ? data.report : report
        ));
      } else if (data.type === 'new_social_data') {
        setSocialData(prev => [...prev, ...data.socialData]);
      } else if (data.type === 'analytics_update') {
        setAnalyticsData(data.analytics);
      }
    };
    
    return () => {
      socket.close();
    };
  }, [currentUser]);

  // For demo purposes, generate mock data if no data is available
  useEffect(() => {
    if (!loading && reports.length === 0) {
      // Generate mock reports
      const mockReports = generateMockReports(20);
      setReports(mockReports);
      
      // Generate mock social data
      const mockSocialData = generateMockSocialData(15);
      setSocialData(mockSocialData);
      
      // Generate mock analytics
      const mockAnalytics = generateMockAnalytics();
      setAnalyticsData(mockAnalytics);
    }
  }, [loading, reports.length]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredReports = reports.filter(report => {
    // Filter by hazard type
    if (filters.hazardType !== 'all' && report.hazardType !== filters.hazardType) {
      return false;
    }
    
    // Filter by verification status
    if (filters.verificationStatus !== 'all' && 
        report.verificationStatus !== filters.verificationStatus) {
      return false;
    }
    
    // Filter by time range
    const reportTime = new Date(report.timestamp);
    const now = new Date();
    
    if (filters.timeRange === '24h' && 
        (now - reportTime) > 24 * 60 * 60 * 1000) {
      return false;
    } else if (filters.timeRange === '7d' && 
               (now - reportTime) > 7 * 24 * 60 * 60 * 1000) {
      return false;
    } else if (filters.timeRange === '30d' && 
               (now - reportTime) > 30 * 24 * 60 * 60 * 1000) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>{t('dashboard.title')}</h1>
      
      <div className="dashboard-filters">
        <div className="filter-group">
          <label htmlFor="hazardType">{t('dashboard.hazardType')}</label>
          <select 
            id="hazardType" 
            name="hazardType" 
            value={filters.hazardType}
            onChange={handleFilterChange}
          >
            <option value="all">{t('dashboard.all')}</option>
            <option value="flood">🌊 {t('hazards.flood')}</option>
            <option value="tsunami">⚠️ {t('hazards.tsunami')}</option>
            <option value="highWaves">🌊 {t('hazards.highWaves')}</option>
            <option value="coastalDamage">🏚️ {t('hazards.coastalDamage')}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="timeRange">{t('dashboard.timeRange')}</label>
          <select 
            id="timeRange" 
            name="timeRange" 
            value={filters.timeRange}
            onChange={handleFilterChange}
          >
            <option value="24h">{t('dashboard.last24Hours')}</option>
            <option value="7d">{t('dashboard.last7Days')}</option>
            <option value="30d">{t('dashboard.last30Days')}</option>
            <option value="all">{t('dashboard.allTime')}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="verificationStatus">{t('dashboard.verificationStatus')}</label>
          <select 
            id="verificationStatus" 
            name="verificationStatus" 
            value={filters.verificationStatus}
            onChange={handleFilterChange}
          >
            <option value="all">{t('dashboard.all')}</option>
            <option value="verified">{t('dashboard.verified')}</option>
            <option value="unverified">{t('dashboard.unverified')}</option>
          </select>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="map-container">
          <h2>{t('dashboard.hazardMap')}</h2>
          <HazardMap reports={filteredReports} height="600px" />
        </div>
        
        <div className="side-panel">
          <div className="social-feed-container">
            <h2>{t('dashboard.socialFeed')}</h2>
            <SocialFeed data={socialData} />
          </div>
          
          <div className="analytics-container">
            <h2>{t('dashboard.analytics')}</h2>
            <AnalyticsPanel data={analyticsData} />
          </div>
          
          <div className="water-quality-container">
            <WaterQualityChart />
          </div>
          
          <div className="water-usage-container">
            <WaterUsageGauge percentage={75} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions to generate mock data for demo purposes
function generateMockReports(count) {
  const hazardTypes = ['flood', 'tsunami', 'highWaves', 'coastalDamage'];
  const verificationStatuses = ['verified', 'unverified'];
  const locations = [
    { lat: 13.0827, lng: 80.2707 }, // Chennai
    { lat: 19.0760, lng: 72.8777 }, // Mumbai
    { lat: 22.5726, lng: 88.3639 }, // Kolkata
    { lat: 8.5241, lng: 76.9366 },  // Trivandrum
    { lat: 15.4909, lng: 73.8278 }  // Goa
  ];
  
  return Array(count).fill().map((_, i) => ({
    id: `report-${i}`,
    hazardType: hazardTypes[Math.floor(Math.random() * hazardTypes.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    note: `Mock hazard report #${i}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    verificationStatus: verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)],
    userId: `user-${Math.floor(Math.random() * 10)}`
  }));
}

function generateMockSocialData(count) {
  const keywords = ['flood', 'tsunami', 'waves', 'coastal', 'disaster', 'water'];
  const sentiments = ['positive', 'neutral', 'negative'];
  const sources = ['twitter', 'facebook', 'instagram'];
  
  return Array(count).fill().map((_, i) => ({
    id: `social-${i}`,
    text: `Mock social media post about ${keywords[Math.floor(Math.random() * keywords.length)]} #oceanHazard`,
    keyword: keywords[Math.floor(Math.random() * keywords.length)],
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
  }));
}

function generateMockAnalytics() {
  return {
    hazardCounts: {
      flood: Math.floor(Math.random() * 50),
      tsunami: Math.floor(Math.random() * 20),
      highWaves: Math.floor(Math.random() * 40),
      coastalDamage: Math.floor(Math.random() * 30)
    },
    trendingKeywords: [
      { keyword: 'flood', count: Math.floor(Math.random() * 100) },
      { keyword: 'tsunami', count: Math.floor(Math.random() * 50) },
      { keyword: 'waves', count: Math.floor(Math.random() * 80) },
      { keyword: 'coastal', count: Math.floor(Math.random() * 60) },
      { keyword: 'disaster', count: Math.floor(Math.random() * 40) }
    ],
    sentimentAnalysis: {
      positive: Math.floor(Math.random() * 30),
      neutral: Math.floor(Math.random() * 50),
      negative: Math.floor(Math.random() * 70)
    },
    hotspots: [
      { location: 'Chennai', count: Math.floor(Math.random() * 30) },
      { location: 'Mumbai', count: Math.floor(Math.random() * 25) },
      { location: 'Kolkata', count: Math.floor(Math.random() * 20) },
      { location: 'Trivandrum', count: Math.floor(Math.random() * 15) },
      { location: 'Goa', count: Math.floor(Math.random() * 10) }
    ]
  };
}

export default Dashboard;