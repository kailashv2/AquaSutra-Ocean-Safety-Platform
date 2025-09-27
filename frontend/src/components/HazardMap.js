import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import { FaSync, FaSatellite, FaMap, FaFilter, FaExpand } from 'react-icons/fa';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Premium styled components for the map interface
const MapContainer_Styled = styled.div`
  position: relative;
  height: ${props => props.height || '600px'};
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.1);
  box-shadow: 
    0 20px 40px 0 rgba(15, 23, 42, 0.6),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
`;

const MapControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ControlButton = styled(motion.button)`
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.2);
  border-radius: 12px;
  padding: 12px;
  color: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(30, 64, 175, 0.8);
    border-color: rgba(30, 64, 175, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
  }
  
  svg {
    font-size: 16px;
  }
`;

const MapLegend = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.2);
  border-radius: 16px;
  padding: 16px;
  color: #f8fafc;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const LegendTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #f8fafc;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendIcon = styled.span`
  font-size: 16px;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const LiveIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`;

const PopupContainer = styled.div`
  .report-popup {
    min-width: 200px;
    font-family: 'Inter', sans-serif;
    
    h3 {
      margin: 0 0 8px 0;
      color: #1e293b;
      font-size: 16px;
      font-weight: 600;
      text-transform: capitalize;
    }
    
    p {
      margin: 8px 0;
      color: #475569;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .popup-media {
      width: 100%;
      max-height: 120px;
      object-fit: cover;
      border-radius: 8px;
      margin: 8px 0;
    }
    
    .report-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
    }
    
    .report-time {
      color: #64748b;
    }
    
    .verification-status {
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 500;
      text-transform: capitalize;
      
      &.verified {
        background: #dcfce7;
        color: #166534;
      }
      
      &.unverified {
        background: #fef3c7;
        color: #92400e;
      }
      
      &.pending {
        background: #e0e7ff;
        color: #3730a3;
      }
    }
    
    .severity-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
      
      &.low { background: #10b981; }
      &.medium { background: #f59e0b; }
      &.high { background: #ef4444; }
      &.critical { background: #dc2626; }
    }
  }
`;

// Enhanced hazard icons with severity levels and animations
const createHazardIcon = (type, severity = 'medium') => {
  const icons = {
    flood: '🌊',
    tsunami: '⚠️', 
    highWaves: '🌊',
    coastalDamage: '🏚️',
    pollution: '🛢️',
    storm: '🌪️',
    earthquake: '💥'
  };
  
  const severityColors = {
    low: '#10b981',
    medium: '#f59e0b', 
    high: '#ef4444',
    critical: '#dc2626'
  };
  
  return L.divIcon({
    html: `
      <div class="hazard-marker" style="
        background: ${severityColors[severity]};
        border: 3px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      ">
        ${icons[type] || '📍'}
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
          50% { transform: scale(1.1); box-shadow: 0 6px 25px ${severityColors[severity]}50; }
          100% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        }
      </style>
    `,
    className: 'hazard-icon-container',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// Map tile layers
const mapLayers = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri &mdash; Source: Esri, USGS, NOAA'
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; CartoDB'
  }
};

// Component to update map view when center changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Real-time map component with WebSocket support
const RealTimeHazardMap = ({ 
  reports = [], 
  center = [20.5937, 78.9629], 
  zoom = 5, 
  height = '600px', 
  interactive = true,
  showControls = true,
  showLegend = true,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [mapReports, setMapReports] = useState(reports);
  const [mapLayer, setMapLayer] = useState('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const wsRef = useRef(null);
  const intervalRef = useRef(null);
  const mapRef = useRef(null);

  // Mock real-time data generator (replace with actual WebSocket)
  const generateMockHazard = useCallback(() => {
    const hazardTypes = ['flood', 'tsunami', 'highWaves', 'coastalDamage', 'pollution', 'storm'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const locations = [
      { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
      { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
      { lat: 8.5241, lng: 76.9366, name: 'Trivandrum' },
      { lat: 15.4909, lng: 73.8278, name: 'Goa' },
      { lat: 11.0168, lng: 76.9558, name: 'Coimbatore' },
      { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam' }
    ];
    
    const location = locations[Math.floor(Math.random() * locations.length)];
    const hazardType = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: `hazard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      hazardType,
      severity,
      location: {
        lat: location.lat + (Math.random() - 0.5) * 0.5, // Add some randomness
        lng: location.lng + (Math.random() - 0.5) * 0.5
      },
      locationName: location.name,
      note: `Real-time ${hazardType} detected near ${location.name}`,
      timestamp: new Date().toISOString(),
      verificationStatus: Math.random() > 0.7 ? 'verified' : 'unverified',
      isRealTime: true,
      intensity: Math.floor(Math.random() * 10) + 1
    };
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    intervalRef.current = setInterval(() => {
      // Occasionally add new hazards
      if (Math.random() > 0.7) {
        const newHazard = generateMockHazard();
        setMapReports(prev => {
          const updated = [newHazard, ...prev];
          // Keep only last 50 reports for performance
          return updated.slice(0, 50);
        });
        setLastUpdate(new Date());
      }
      
      // Occasionally update existing hazards status
      if (Math.random() > 0.8) {
        setMapReports(prev => prev.map(report => {
          if (Math.random() > 0.9 && report.verificationStatus === 'unverified') {
            return { ...report, verificationStatus: 'verified' };
          }
          return report;
        }));
      }
    }, refreshInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, generateMockHazard]);

  // Initialize with reports
  useEffect(() => {
    setMapReports(reports);
  }, [reports]);

  // Refresh data manually
  const handleRefresh = () => {
    // Add a few new hazards immediately
    const newHazards = Array.from({ length: 2 }, () => generateMockHazard());
    setMapReports(prev => [...newHazards, ...prev].slice(0, 50));
    setLastUpdate(new Date());
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get severity color for circles
  const getSeverityColor = (severity) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b', 
      high: '#ef4444',
      critical: '#dc2626'
    };
    return colors[severity] || colors.medium;
  };

  return (
    <PopupContainer>
      <MapContainer_Styled 
        height={isFullscreen ? '100vh' : height}
        style={isFullscreen ? {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 9999
        } : {}}
      >
        {/* Status Indicator */}
        <StatusIndicator>
          <LiveIndicator />
          <span>Live Feed {isConnected ? 'Connected' : 'Disconnected'}</span>
        </StatusIndicator>

        {/* Map Controls */}
        {showControls && (
          <MapControls>
            <ControlButton
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh Data"
            >
              <FaSync />
            </ControlButton>
            
            <ControlButton
              onClick={() => setMapLayer(mapLayer === 'dark' ? 'satellite' : 'dark')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Toggle Layer"
            >
              {mapLayer === 'dark' ? <FaSatellite /> : <FaMap />}
            </ControlButton>
            
            <ControlButton
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Toggle Fullscreen"
            >
              <FaExpand />
            </ControlButton>
          </MapControls>
        )}

        {/* Map Legend */}
        {showLegend && (
          <MapLegend
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LegendTitle>🌊 Hazard Types</LegendTitle>
            <LegendItem>
              <LegendIcon>🌊</LegendIcon>
              <span>Flood / High Waves</span>
            </LegendItem>
            <LegendItem>
              <LegendIcon>⚠️</LegendIcon>
              <span>Tsunami Warning</span>
            </LegendItem>
            <LegendItem>
              <LegendIcon>🏚️</LegendIcon>
              <span>Coastal Damage</span>
            </LegendItem>
            <LegendItem>
              <LegendIcon>🛢️</LegendIcon>
              <span>Water Pollution</span>
            </LegendItem>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(226, 232, 240, 0.2)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Last Update: {lastUpdate.toLocaleTimeString()}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Active Hazards: {mapReports.length}
              </div>
            </div>
          </MapLegend>
        )}

        {/* Leaflet Map */}
        <MapContainer 
          center={center} 
          zoom={zoom} 
          scrollWheelZoom={interactive}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <ChangeView center={center} zoom={zoom} />
          
          <TileLayer
            attribution={mapLayers[mapLayer].attribution}
            url={mapLayers[mapLayer].url}
          />
          
          {/* Hazard Markers */}
          {mapReports.map((report) => (
            <React.Fragment key={report.id}>
              {/* Severity Circle */}
              <Circle
                center={[report.location.lat, report.location.lng]}
                radius={(report.intensity || 5) * 1000} // radius in meters
                fillColor={getSeverityColor(report.severity)}
                fillOpacity={0.2}
                stroke={true}
                color={getSeverityColor(report.severity)}
                weight={2}
                opacity={0.6}
              />
              
              {/* Hazard Marker */}
              <Marker 
                position={[report.location.lat, report.location.lng]}
                icon={createHazardIcon(report.hazardType, report.severity)}
              >
                <Popup>
                  <div className="report-popup">
                    <h3>
                      <span className={`severity-indicator ${report.severity}`}></span>
                      {report.hazardType.charAt(0).toUpperCase() + report.hazardType.slice(1)}
                      {report.isRealTime && <span style={{ marginLeft: '8px', color: '#10b981' }}>LIVE</span>}
                    </h3>
                    
                    {report.locationName && (
                      <p><strong>Location:</strong> {report.locationName}</p>
                    )}
                    
                    <p>{report.note}</p>
                    
                    {report.intensity && (
                      <p><strong>Intensity:</strong> {report.intensity}/10</p>
                    )}
                    
                    <div className="report-meta">
                      <span className="report-time">
                        {new Date(report.timestamp).toLocaleString()}
                      </span>
                      <span className={`verification-status ${report.verificationStatus}`}>
                        {report.verificationStatus}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </MapContainer_Styled>
    </PopupContainer>
  );
};

export default RealTimeHazardMap;