// Simple Working Ocean Monitoring Dashboard
console.log('🌊 Loading Simple Ocean Monitoring Dashboard...');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing dashboard...');
    
    // Update basic statistics
    updateBasicStats();
    
    // Create enhanced wave chart
    createSimpleEnhancedChart();
    
    // Update sensor data
    updateSensorData();
    
    // Update alerts
    updateAlerts();
    
    // Update advanced metrics
    updateAdvancedMetrics();
    
    // Update weather conditions
    updateWeatherConditions();
    
    // Set up auto-refresh
    setInterval(() => {
        updateBasicStats();
        updateSensorData();
        updateAlerts();
        updateAdvancedMetrics();
        updateWeatherConditions();
    }, 15000); // Faster updates every 15 seconds
    
    console.log('✨ Dashboard initialized successfully!');
});

// Update basic statistics
function updateBasicStats() {
    const tempElement = document.getElementById('ocean-temp');
    const waveElement = document.getElementById('wave-height');
    const qualityElement = document.getElementById('water-quality');
    const weatherElement = document.getElementById('weather');
    
    if (tempElement) tempElement.textContent = (20 + Math.random() * 5).toFixed(1) + '°C';
    if (waveElement) waveElement.textContent = (1 + Math.random() * 2).toFixed(1) + 'm';
    if (qualityElement) qualityElement.textContent = Math.floor(80 + Math.random() * 15);
    if (weatherElement) weatherElement.textContent = ['Clear', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)];
}

// Create simple enhanced chart
function createSimpleEnhancedChart() {
    const chartContainer = document.getElementById('wave-chart');
    if (!chartContainer) {
        console.error('❌ Chart container not found');
        return;
    }
    
    console.log('✅ Creating enhanced chart...');
    
    // Clear container
    chartContainer.innerHTML = '';
    
    // Create enhanced chart
    const chartHTML = `
        <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(59, 130, 246, 0.95)); padding: 24px; color: white; border-radius: 16px 16px 0 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 20px; font-weight: 700;">🌊 Real-Time Wave Analytics</h3>
                <div style="background: rgba(16, 185, 129, 0.9); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;">
                    <span style="display: inline-block; width: 6px; height: 6px; background: #ffffff; border-radius: 50%; margin-right: 4px; animation: pulse 2s infinite;"></span>
                    LIVE DATA
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                <div style="background: rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 16px; margin-bottom: 4px;">🌊</div>
                    <div style="font-size: 16px; font-weight: 700;">${(1.5 + Math.random() * 1.5).toFixed(1)}m</div>
                    <div style="font-size: 10px; opacity: 0.9;">Current Wave</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 16px; margin-bottom: 4px;">🏔️</div>
                    <div style="font-size: 16px; font-weight: 700;">${(2.0 + Math.random() * 1.0).toFixed(1)}m</div>
                    <div style="font-size: 10px; opacity: 0.9;">Peak Today</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 16px; margin-bottom: 4px;">📊</div>
                    <div style="font-size: 16px; font-weight: 700;">${(1.2 + Math.random() * 0.8).toFixed(1)}m</div>
                    <div style="font-size: 10px; opacity: 0.9;">Average</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 16px; margin-bottom: 4px;">⚠️</div>
                    <div style="font-size: 16px; font-weight: 700;">Moderate</div>
                    <div style="font-size: 10px; opacity: 0.9;">Risk Level</div>
                </div>
            </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.98); padding: 24px; border-radius: 0 0 16px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h4 style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">Wave Height Trends</h4>
                <div style="font-size: 12px; color: #64748b;">Last updated: ${new Date().toLocaleTimeString()}</div>
            </div>
            
            <div style="height: 200px; display: flex; align-items: end; gap: 4px; padding: 16px; background: linear-gradient(to top, rgba(14, 165, 233, 0.05) 0%, transparent 50%); border-radius: 12px; margin-bottom: 16px;" id="wave-bars">
                ${generateWaveBars()}
            </div>
            
            <div style="display: flex; justify-content: center; gap: 16px; font-size: 12px; color: #64748b;">
                <div style="display: flex; align-items: center; gap: 4px;">
                    <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 2px;"></div>
                    <span>Calm (< 1.5m)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 2px;"></div>
                    <span>Moderate (1.5-2.5m)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 2px;"></div>
                    <span>High (> 2.5m)</span>
                </div>
            </div>
        </div>
    `;
    
    chartContainer.innerHTML = chartHTML;
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Enhanced chart created successfully!');
}

// Generate wave bars
function generateWaveBars() {
    let bars = '';
    for (let i = 0; i < 20; i++) {
        const height = 0.8 + Math.random() * 2.5;
        const color = height < 1.5 ? 'linear-gradient(135deg, #10b981, #059669)' :
                     height < 2.5 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                     'linear-gradient(135deg, #ef4444, #dc2626)';
        
        bars += `
            <div style="
                flex: 1;
                height: ${Math.min((height / 3) * 100, 100)}%;
                background: ${color};
                border-radius: 2px 2px 0 0;
                min-height: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                opacity: 0;
                animation: slideUp 0.6s ease forwards;
                animation-delay: ${i * 0.05}s;
            " 
            onmouseover="this.style.transform='scaleY(1.1)'; this.style.opacity='0.8';"
            onmouseout="this.style.transform='scaleY(1)'; this.style.opacity='1';"
            title="Wave Height: ${height.toFixed(1)}m"></div>
        `;
    }
    
    // Add slide up animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: scaleY(0); }
            to { opacity: 1; transform: scaleY(1); }
        }
    `;
    document.head.appendChild(style);
    
    return bars;
}

// Enhanced sensor data with more metrics
function updateSensorData() {
    const sensorsGrid = document.getElementById('sensors-grid');
    if (!sensorsGrid) return;
    
    const sensors = [
        { 
            name: 'New York Harbor Buoy', 
            location: 'New York Harbor',
            status: Math.random() > 0.95 ? 'offline' : 'online', 
            temp: (20 + Math.random() * 5).toFixed(1), 
            wave: (1 + Math.random() * 2).toFixed(1),
            windSpeed: (8 + Math.random() * 12).toFixed(0),
            waterQuality: Math.floor(85 + Math.random() * 10),
            salinity: (34.5 + Math.random() * 1.5).toFixed(1),
            ph: (7.8 + Math.random() * 0.4).toFixed(1),
            lastUpdate: new Date().toLocaleTimeString()
        },
        { 
            name: 'Miami Beach Station', 
            location: 'Miami Beach, FL',
            status: Math.random() > 0.9 ? 'maintenance' : 'online', 
            temp: (25 + Math.random() * 3).toFixed(1), 
            wave: (1.5 + Math.random() * 1.5).toFixed(1),
            windSpeed: (6 + Math.random() * 8).toFixed(0),
            waterQuality: Math.floor(78 + Math.random() * 12),
            salinity: (35.2 + Math.random() * 1.2).toFixed(1),
            ph: (8.0 + Math.random() * 0.3).toFixed(1),
            lastUpdate: new Date().toLocaleTimeString()
        },
        { 
            name: 'San Francisco Bay Monitor', 
            location: 'San Francisco Bay',
            status: 'online', 
            temp: (16 + Math.random() * 4).toFixed(1), 
            wave: (0.8 + Math.random() * 1.2).toFixed(1),
            windSpeed: (12 + Math.random() * 8).toFixed(0),
            waterQuality: Math.floor(88 + Math.random() * 8),
            salinity: (33.8 + Math.random() * 1.0).toFixed(1),
            ph: (7.9 + Math.random() * 0.2).toFixed(1),
            lastUpdate: new Date().toLocaleTimeString()
        },
        { 
            name: 'Seattle Waterfront Sensor', 
            location: 'Elliott Bay, WA',
            status: Math.random() > 0.85 ? 'offline' : 'online', 
            temp: (14 + Math.random() * 4).toFixed(1), 
            wave: (0.6 + Math.random() * 1.4).toFixed(1),
            windSpeed: (5 + Math.random() * 10).toFixed(0),
            waterQuality: Math.floor(82 + Math.random() * 10),
            salinity: (32.5 + Math.random() * 1.8).toFixed(1),
            ph: (7.7 + Math.random() * 0.3).toFixed(1),
            lastUpdate: new Date().toLocaleTimeString()
        },
        {
            name: 'Boston Harbor Buoy',
            location: 'Boston Harbor, MA',
            status: 'online',
            temp: (18 + Math.random() * 4).toFixed(1),
            wave: (1.2 + Math.random() * 1.8).toFixed(1),
            windSpeed: (10 + Math.random() * 6).toFixed(0),
            waterQuality: Math.floor(84 + Math.random() * 8),
            salinity: (34.2 + Math.random() * 1.3).toFixed(1),
            ph: (7.8 + Math.random() * 0.2).toFixed(1),
            lastUpdate: new Date().toLocaleTimeString()
        },
        {
            name: 'Santa Monica Pier Station',
            location: 'Santa Monica, CA',
            status: Math.random() > 0.92 ? 'maintenance' : 'online',
            temp: (21 + Math.random() * 3).toFixed(1),
            wave: (1.4 + Math.random() * 1.6).toFixed(1),
            windSpeed: (7 + Math.random() * 9).toFixed(0),
            waterQuality: Math.floor(76 + Math.random() * 14),
            salinity: (35.0 + Math.random() * 1.4).toFixed(1),
            ph: (8.1 + Math.random() * 0.3).toFixed(1),
            lastUpdate: new Date().toLocaleTimeString()
        }
    ];
    
    sensorsGrid.innerHTML = sensors.map(sensor => {
        const statusColor = sensor.status === 'online' ? '#10B981' : 
                           sensor.status === 'maintenance' ? '#F59E0B' : '#EF4444';
        const statusIcon = sensor.status === 'online' ? '🟢' : 
                          sensor.status === 'maintenance' ? '🟡' : '🔴';
        
        return `
            <div class="sensor-card" style="cursor: pointer; transition: all 0.3s ease;" onclick="showSensorDetails('${sensor.name}')">
                <div class="sensor-header">
                    <div class="sensor-name" style="font-weight: 600; color: #1E293B;">${sensor.name}</div>
                    <div class="sensor-status ${sensor.status}" style="color: ${statusColor}; font-weight: 500;">
                        ${statusIcon} ${sensor.status.toUpperCase()}
                    </div>
                </div>
                <div class="sensor-readings" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 16px;">
                    <div class="reading">
                        <div class="reading-value" style="color: #3B82F6;">${sensor.temp}°C</div>
                        <div class="reading-label">Temperature</div>
                    </div>
                    <div class="reading">
                        <div class="reading-value" style="color: #0EA5E9;">${sensor.wave}m</div>
                        <div class="reading-label">Wave Height</div>
                    </div>
                    <div class="reading">
                        <div class="reading-value" style="color: #8B5CF6;">${sensor.windSpeed}kt</div>
                        <div class="reading-label">Wind Speed</div>
                    </div>
                    <div class="reading">
                        <div class="reading-value" style="color: #10B981;">${sensor.waterQuality}</div>
                        <div class="reading-label">Water Quality</div>
                    </div>
                    <div class="reading">
                        <div class="reading-value" style="color: #F59E0B;">${sensor.salinity}‰</div>
                        <div class="reading-label">Salinity</div>
                    </div>
                    <div class="reading">
                        <div class="reading-value" style="color: #EF4444;">${sensor.ph}</div>
                        <div class="reading-label">pH Level</div>
                    </div>
                </div>
                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280; display: flex; justify-content: space-between;">
                    <span>📍 ${sensor.location}</span>
                    <span>🕒 ${sensor.lastUpdate}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Update alerts data
function updateAlerts() {
    const alertsContainer = document.getElementById('monitoring-alerts');
    if (!alertsContainer) {
        console.log('❌ Alerts container not found');
        return;
    }
    
    // Mock alerts data
    const alerts = [
        {
            id: 1,
            type: 'high',
            icon: '🌊',
            title: 'High Wave Activity',
            description: 'Wave heights exceeding 2.5m detected at Miami Beach',
            location: 'Miami Beach, FL',
            time: new Date().toLocaleTimeString()
        },
        {
            id: 2,
            type: 'medium',
            icon: '🌡️',
            title: 'Temperature Anomaly',
            description: 'Unusual temperature spike in San Francisco Bay',
            location: 'San Francisco Bay',
            time: new Date(Date.now() - 1800000).toLocaleTimeString() // 30 min ago
        },
        {
            id: 3,
            type: 'low',
            icon: '🛰️',
            title: 'Sensor Maintenance',
            description: 'Seattle sensor scheduled for routine maintenance',
            location: 'Elliott Bay, WA',
            time: new Date(Date.now() - 3600000).toLocaleTimeString() // 1 hour ago
        }
    ];
    
    // Add more alert types for comprehensive monitoring
    const additionalAlerts = [
        {
            id: 4,
            type: 'high',
            icon: '🌪️',
            title: 'Storm Warning',
            description: 'Severe weather system approaching coastal areas',
            location: 'Atlantic Coast',
            time: new Date(Date.now() - 600000).toLocaleTimeString() // 10 min ago
        },
        {
            id: 5,
            type: 'medium',
            icon: '🐠',
            title: 'Marine Life Activity',
            description: 'Unusual fish migration patterns detected',
            location: 'Pacific Coast',
            time: new Date(Date.now() - 1200000).toLocaleTimeString() // 20 min ago
        },
        {
            id: 6,
            type: 'low',
            icon: '🔋',
            title: 'Sensor Battery Low',
            description: 'Boston Harbor sensor battery at 15%',
            location: 'Boston Harbor, MA',
            time: new Date(Date.now() - 2400000).toLocaleTimeString() // 40 min ago
        },
        {
            id: 7,
            type: 'medium',
            icon: '🌊',
            title: 'Tidal Surge',
            description: 'Higher than normal tidal activity observed',
            location: 'Gulf Coast',
            time: new Date(Date.now() - 1800000).toLocaleTimeString() // 30 min ago
        }
    ];
    
    const allAlerts = [...alerts, ...additionalAlerts];
    
    // Show more alerts for comprehensive monitoring
    const activeAlerts = allAlerts.filter(() => Math.random() > 0.4);
    
    if (activeAlerts.length === 0) {
        alertsContainer.innerHTML = '<p style="color: #10B981; text-align: center; padding: 20px; font-weight: 500;">✅ No active alerts</p>';
        return;
    }
    
    alertsContainer.innerHTML = activeAlerts.map(alert => `
        <div class="alert-item ${alert.type}" onclick="showAlertDetails('${alert.id}')" style="cursor: pointer;">
            <div class="alert-content">
                <span class="alert-icon" style="font-size: 20px; margin-right: 12px;">${alert.icon}</span>
                <div class="alert-text">
                    <div class="alert-title" style="font-weight: 600; color: #1E293B; margin-bottom: 4px;">${alert.title}</div>
                    <div class="alert-desc" style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">${alert.description}</div>
                    <div style="font-size: 12px; color: #9CA3AF;">
                        ${alert.time} • ${alert.location}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log(`✅ Updated ${activeAlerts.length} alerts`);
}

// Show alert details with expanded information
function showAlertDetails(alertId) {
    const alertTypes = {
        '1': { title: 'High Wave Activity', desc: 'Wave heights exceeding 2.5m detected at Miami Beach - Small craft advisory in effect', type: 'error' },
        '2': { title: 'Temperature Anomaly', desc: 'Unusual temperature spike in San Francisco Bay - Monitoring marine ecosystem impact', type: 'warning' },
        '3': { title: 'Sensor Maintenance', desc: 'Seattle sensor scheduled for routine maintenance - Expected downtime: 2 hours', type: 'info' },
        '4': { title: 'Storm Warning', desc: 'Severe weather system approaching coastal areas - Wind speeds up to 45kt expected', type: 'error' },
        '5': { title: 'Marine Life Activity', desc: 'Unusual fish migration patterns detected - Possible environmental factor influence', type: 'warning' },
        '6': { title: 'Sensor Battery Low', desc: 'Boston Harbor sensor battery at 15% - Maintenance team dispatched', type: 'info' },
        '7': { title: 'Tidal Surge', desc: 'Higher than normal tidal activity observed - Coastal flooding possible', type: 'warning' }
    };
    
    const alert = alertTypes[alertId];
    if (alert) {
        showNotification(`🚨 ${alert.title}: ${alert.desc}`, alert.type);
    }
}

// Simple notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        font-family: 'Inter', sans-serif;
    `;
    
    switch (type) {
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #0EA5E9, #0284C7)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Show detailed sensor information
function showSensorDetails(sensorName) {
    showNotification(`🛰️ ${sensorName} - Click to view detailed analytics and historical data`, 'info');
}

// Update advanced metrics dashboard
function updateAdvancedMetrics() {
    // Add advanced metrics section after sensors if it doesn't exist
    let metricsSection = document.getElementById('advanced-metrics');
    if (!metricsSection) {
        const sensorsSection = document.querySelector('.sensors-grid').parentElement;
        metricsSection = document.createElement('section');
        metricsSection.id = 'advanced-metrics';
        metricsSection.style.marginTop = '48px';
        sensorsSection.parentNode.insertBefore(metricsSection, sensorsSection.nextSibling);
    }
    
    const currentTime = new Date();
    const riskLevel = Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low';
    const riskColor = riskLevel === 'High' ? '#EF4444' : riskLevel === 'Medium' ? '#F59E0B' : '#10B981';
    
    metricsSection.innerHTML = `
        <h2 style="font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 24px;">📊 Advanced Ocean Analytics</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
            <!-- Risk Assessment Card -->
            <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, ${riskColor}, ${riskColor}dd); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">⚠️</div>
                    <div>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1E293B;">Risk Assessment</h3>
                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6B7280;">AI-Powered Analysis</p>
                    </div>
                </div>
                <div style="font-size: 32px; font-weight: 800; color: ${riskColor}; margin-bottom: 8px;">${riskLevel}</div>
                <div style="font-size: 14px; color: #6B7280;">Current ocean conditions assessment based on multiple sensor readings and weather patterns.</div>
            </div>
            
            <!-- Predictive Analytics -->
            <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #8B5CF6, #7C3AED); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🔮</div>
                    <div>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1E293B;">24h Forecast</h3>
                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6B7280;">Predictive Model</p>
                    </div>
                </div>
                <div style="font-size: 32px; font-weight: 800; color: #8B5CF6; margin-bottom: 8px;">${(1.2 + Math.random() * 1.8).toFixed(1)}m</div>
                <div style="font-size: 14px; color: #6B7280;">Predicted peak wave height in next 24 hours based on weather patterns and tidal data.</div>
            </div>
            
            <!-- Environmental Impact -->
            <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10B981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🌍</div>
                    <div>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1E293B;">Eco Impact</h3>
                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6B7280;">Environmental Health</p>
                    </div>
                </div>
                <div style="font-size: 32px; font-weight: 800; color: #10B981; margin-bottom: 8px;">${Math.floor(75 + Math.random() * 20)}%</div>
                <div style="font-size: 14px; color: #6B7280;">Overall ocean ecosystem health score based on water quality, temperature, and marine life indicators.</div>
            </div>
        </div>
        
        <!-- Real-time Activity Feed -->
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1E293B; display: flex; align-items: center; gap: 8px;">📈 Live Activity Feed</h3>
            <div id="activity-feed" style="max-height: 200px; overflow-y: auto;">
                ${generateActivityFeed()}
            </div>
        </div>
    `;
}

// Generate activity feed
function generateActivityFeed() {
    const activities = [
        { time: new Date(), icon: '🌊', text: 'Wave height increased to 2.3m at Miami Beach Station', type: 'warning' },
        { time: new Date(Date.now() - 300000), icon: '🌡️', text: 'Temperature reading updated: 22.4°C at New York Harbor', type: 'info' },
        { time: new Date(Date.now() - 600000), icon: '✅', text: 'All sensors reporting normal water quality levels', type: 'success' },
        { time: new Date(Date.now() - 900000), icon: '🔧', text: 'Maintenance completed on Seattle Waterfront Sensor', type: 'info' },
        { time: new Date(Date.now() - 1200000), icon: '⚠️', text: 'High wind speeds detected: 18kt at San Francisco Bay', type: 'warning' },
        { time: new Date(Date.now() - 1500000), icon: '📊', text: 'Daily water quality report generated', type: 'success' }
    ];
    
    return activities.map(activity => {
        const timeAgo = Math.floor((Date.now() - activity.time.getTime()) / 60000);
        const color = activity.type === 'warning' ? '#F59E0B' : activity.type === 'success' ? '#10B981' : '#6B7280';
        
        return `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F3F4F6;">
                <div style="font-size: 20px;">${activity.icon}</div>
                <div style="flex: 1;">
                    <div style="font-size: 14px; color: #374151; margin-bottom: 2px;">${activity.text}</div>
                    <div style="font-size: 12px; color: ${color};">${timeAgo === 0 ? 'Just now' : `${timeAgo} min ago`}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Update weather conditions
function updateWeatherConditions() {
    // Add weather section if it doesn't exist
    let weatherSection = document.getElementById('weather-conditions');
    if (!weatherSection) {
        const metricsSection = document.getElementById('advanced-metrics');
        if (metricsSection) {
            weatherSection = document.createElement('section');
            weatherSection.id = 'weather-conditions';
            weatherSection.style.marginTop = '48px';
            metricsSection.parentNode.insertBefore(weatherSection, metricsSection.nextSibling);
        }
    }
    
    if (!weatherSection) return;
    
    const weatherConditions = [
        { location: 'New York Harbor', temp: (18 + Math.random() * 8).toFixed(0), condition: 'Partly Cloudy', wind: (8 + Math.random() * 12).toFixed(0), humidity: (65 + Math.random() * 20).toFixed(0) },
        { location: 'Miami Beach', temp: (24 + Math.random() * 6).toFixed(0), condition: 'Sunny', wind: (6 + Math.random() * 8).toFixed(0), humidity: (70 + Math.random() * 15).toFixed(0) },
        { location: 'San Francisco Bay', temp: (15 + Math.random() * 6).toFixed(0), condition: 'Foggy', wind: (12 + Math.random() * 8).toFixed(0), humidity: (80 + Math.random() * 10).toFixed(0) },
        { location: 'Seattle Waterfront', temp: (12 + Math.random() * 6).toFixed(0), condition: 'Overcast', wind: (5 + Math.random() * 10).toFixed(0), humidity: (75 + Math.random() * 15).toFixed(0) }
    ];
    
    weatherSection.innerHTML = `
        <h2 style="font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 24px;">🌤️ Regional Weather Conditions</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            ${weatherConditions.map(weather => {
                const conditionIcon = weather.condition === 'Sunny' ? '☀️' : 
                                    weather.condition === 'Partly Cloudy' ? '⛅' :
                                    weather.condition === 'Overcast' ? '☁️' : '🌫️';
                
                return `
                    <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1E293B;">${weather.location}</h3>
                            <div style="font-size: 32px;">${conditionIcon}</div>
                        </div>
                        <div style="font-size: 28px; font-weight: 700; color: #3B82F6; margin-bottom: 12px;">${weather.temp}°C</div>
                        <div style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">${weather.condition}</div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #9CA3AF;">
                            <span>💨 ${weather.wind} kt</span>
                            <span>💧 ${weather.humidity}%</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

console.log('📄 Enhanced monitoring script loaded with advanced analytics');
