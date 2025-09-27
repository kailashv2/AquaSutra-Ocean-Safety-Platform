// Ocean Monitoring Dashboard JavaScript
let monitoringData = {
    waveHeights: [],
    sensors: [],
    alerts: [],
    currentTimeRange: '24h'
};

// Mock sensor data
const mockSensors = [
    {
        id: 'NYC-001',
        name: 'New York Harbor Buoy',
        location: 'New York Harbor',
        status: 'online',
        temperature: 22.5,
        waveHeight: 1.8,
        windSpeed: 12,
        waterQuality: 88,
        lastUpdate: new Date()
    },
    {
        id: 'MIA-002',
        name: 'Miami Beach Station',
        location: 'Miami Beach, FL',
        status: 'online',
        temperature: 26.3,
        waveHeight: 2.4,
        windSpeed: 8,
        waterQuality: 82,
        lastUpdate: new Date()
    },
    {
        id: 'SF-003',
        name: 'San Francisco Bay Monitor',
        location: 'San Francisco Bay',
        status: 'online',
        temperature: 18.7,
        waveHeight: 1.2,
        windSpeed: 15,
        waterQuality: 91,
        lastUpdate: new Date()
    },
    {
        id: 'SEA-004',
        name: 'Seattle Waterfront Sensor',
        location: 'Elliott Bay, WA',
        status: 'offline',
        temperature: 16.2,
        waveHeight: 0.9,
        windSpeed: 6,
        waterQuality: 85,
        lastUpdate: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
        id: 'LA-005',
        name: 'Santa Monica Pier Station',
        location: 'Santa Monica, CA',
        status: 'online',
        temperature: 21.8,
        waveHeight: 1.6,
        windSpeed: 10,
        waterQuality: 79,
        lastUpdate: new Date()
    },
    {
        id: 'BOS-006',
        name: 'Boston Harbor Buoy',
        location: 'Boston Harbor, MA',
        status: 'online',
        temperature: 19.4,
        waveHeight: 2.1,
        windSpeed: 14,
        waterQuality: 86,
        lastUpdate: new Date()
    }
];

// Mock alerts data
const mockAlerts = [
    {
        id: 1,
        type: 'high',
        icon: '🌊',
        title: 'High Wave Activity',
        description: 'Wave heights exceeding 2.5m detected at Miami Beach',
        timestamp: new Date(),
        location: 'Miami Beach, FL'
    },
    {
        id: 2,
        type: 'medium',
        icon: '🌡️',
        title: 'Temperature Anomaly',
        description: 'Unusual temperature spike in San Francisco Bay',
        timestamp: new Date(Date.now() - 1800000), // 30 min ago
        location: 'San Francisco Bay'
    },
    {
        id: 3,
        type: 'low',
        icon: '🛰️',
        title: 'Sensor Maintenance',
        description: 'Seattle sensor scheduled for routine maintenance',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        location: 'Elliott Bay, WA'
    }
];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Ocean Monitoring Dashboard Loading...');
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    
    initializeDashboard();
    generateWaveChart();
    populateAlerts();
    populateSensors();
    startRealTimeUpdates();
    
    // Animate elements on load
    setTimeout(() => {
        animateElementsOnLoad();
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✅ Monitoring Dashboard Ready!');
});

// Animate elements on load
function animateElementsOnLoad() {
    const cards = document.querySelectorAll('.stat-card, .chart-section, .alerts-panel, .sensor-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize dashboard with real-time data
function initializeDashboard() {
    updateKeyStatistics();
    
    // Initialize enhanced wave chart
    generateWaveChart();
    
    // Set up auto-refresh
    setInterval(() => {
        updateKeyStatistics();
        updateSensorData();
    }, 30000); // Update every 30 seconds
}

// Update key statistics
function updateKeyStatistics() {
    const onlineSensors = mockSensors.filter(s => s.status === 'online');
    
    // Calculate averages from online sensors
    const avgTemp = onlineSensors.reduce((sum, s) => sum + s.temperature, 0) / onlineSensors.length;
    const avgWaveHeight = onlineSensors.reduce((sum, s) => sum + s.waveHeight, 0) / onlineSensors.length;
    const avgWaterQuality = onlineSensors.reduce((sum, s) => sum + s.waterQuality, 0) / onlineSensors.length;
    
    // Update DOM elements with animation
    animateValue('ocean-temp', avgTemp.toFixed(1) + '°C');
    animateValue('wave-height', avgWaveHeight.toFixed(1) + 'm');
    animateValue('water-quality', Math.round(avgWaterQuality));
    
    // Update weather based on conditions
    const weatherConditions = ['Clear', 'Partly Cloudy', 'Overcast', 'Light Breeze'];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    document.getElementById('weather').textContent = randomWeather;
}

// Animate value changes
function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element && element.textContent !== newValue) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// Premium Ocean Wave Monitoring Dashboard
function generateWaveChart() {
    console.log('🔄 Starting generateWaveChart...');
    const chartContainer = document.getElementById('wave-chart');
    if (!chartContainer) {
        console.error('❌ Chart container not found!');
        return;
    }
    
    console.log('✅ Chart container found, generating enhanced chart...');
    
    // Clear existing content
    chartContainer.innerHTML = '';
    
    // Simple container styling
    chartContainer.style.cssText = `
        background: white;
        border-radius: 12px;
        margin: 20px 0;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        overflow: hidden;
    `;
    
    // Generate wave data
    const dataPoints = 20; // Fixed for consistency
    const waveData = [];
    
    for (let i = 0; i < dataPoints; i++) {
        const height = 0.8 + Math.random() * 2.5 + Math.sin(i * 0.5) * 0.8;
        let condition, riskLevel;
        
        if (height < 1.5) {
            condition = 'Calm';
            riskLevel = 'calm';
        } else if (height < 2.5) {
            condition = 'Moderate';
            riskLevel = 'moderate';
        } else if (height < 3.5) {
            condition = 'High';
            riskLevel = 'high';
        } else {
            condition = 'Extreme';
            riskLevel = 'extreme';
        }
        
        waveData.push({
            value: height,
            time: new Date(Date.now() - (dataPoints - i) * 1800000),
            condition: condition,
            riskLevel: riskLevel,
            windSpeed: 5 + Math.random() * 15,
            direction: Math.floor(Math.random() * 360),
            period: 6 + Math.random() * 6,
            energy: (height * height * 2.5).toFixed(1)
        });
    }
    
    monitoringData.waveHeights = waveData;
    
    // Create enhanced premium dashboard with real-time updates
    createEnhancedPremiumDashboard(chartContainer, waveData);
}

// Enhanced Premium Dashboard with Real-time Updates
function createEnhancedPremiumDashboard(container, waveData) {
    // Clear existing content first
    container.innerHTML = '';
    
    // Override container styling for premium look
    container.style.cssText = `
        background: transparent !important;
        border-radius: 20px !important;
        margin: 24px 0 !important;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        overflow: hidden !important;
        height: auto !important;
        display: block !important;
        padding: 0 !important;
    `;
    
    // Premium Glass Morphism Header
    const headerSection = document.createElement('div');
    headerSection.style.cssText = `
        background: linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(59, 130, 246, 0.95));
        backdrop-filter: blur(25px);
        padding: 32px;
        color: white;
        position: relative;
        overflow: hidden;
        border-radius: 20px 20px 0 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Add floating particles effect
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
    `;
    
    // Create floating particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: rgba(255, 255, 255, ${0.3 + Math.random() * 0.4});
            border-radius: 50%;
            animation: floatParticle${i} ${8 + Math.random() * 12}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particlesContainer.appendChild(particle);
    }
    
    headerSection.appendChild(particlesContainer);
    
    headerSection.innerHTML += `
        <div style="position: relative; z-index: 2;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                    <h2 style="margin: 0; font-size: 26px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🌊 Advanced Wave Analytics</h2>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Real-time ocean monitoring with AI-powered insights</p>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="background: rgba(16, 185, 129, 0.9); padding: 8px 16px; border-radius: 25px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                        <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
                        LIVE DATA
                    </div>
                    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 25px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.2);">
                        Updated: <span id="last-update-time">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Enhanced Stats Grid with Real-time Updates
    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 16px;
        margin-top: 20px;
        position: relative;
        z-index: 2;
    `;
    
    const maxWave = Math.max(...waveData.map(d => d.value));
    const avgWave = waveData.reduce((sum, d) => sum + d.value, 0) / waveData.length;
    const highRiskCount = waveData.filter(d => d.riskLevel === 'high' || d.riskLevel === 'extreme').length;
    const trend = waveData[waveData.length - 1].value > waveData[0].value ? '↗️ Rising' : '↘️ Falling';
    const currentCondition = waveData[waveData.length - 1].condition;
    
    const stats = [
        { label: 'Current Wave', value: `${waveData[waveData.length - 1].value.toFixed(1)}m`, icon: '🌊', color: '#60a5fa', id: 'current-wave' },
        { label: 'Peak Today', value: `${maxWave.toFixed(1)}m`, icon: '🏔️', color: '#34d399', id: 'peak-wave' },
        { label: 'Average', value: `${avgWave.toFixed(1)}m`, icon: '📊', color: '#fbbf24', id: 'avg-wave' },
        { label: 'Risk Level', value: currentCondition, icon: '⚠️', color: '#f87171', id: 'risk-level' },
        { label: 'Trend', value: trend, icon: '📈', color: '#a78bfa', id: 'trend' },
        { label: 'Active Alerts', value: highRiskCount, icon: '🚨', color: '#fb7185', id: 'alerts' }
    ];
    
    stats.forEach((stat, index) => {
        const statCard = document.createElement('div');
        statCard.id = stat.id;
        statCard.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(15px);
            border-radius: 16px;
            padding: 16px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
        `;
        
        statCard.innerHTML = `
            <div style="position: absolute; top: -50%; right: -50%; width: 100px; height: 100px; background: ${stat.color}; opacity: 0.1; border-radius: 50%; filter: blur(20px);"></div>
            <div style="position: relative; z-index: 2;">
                <div style="font-size: 24px; margin-bottom: 8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${stat.icon}</div>
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 4px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);" data-value="${stat.value}">${stat.value}</div>
                <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">${stat.label}</div>
            </div>
        `;
        
        statCard.addEventListener('mouseenter', () => {
            statCard.style.transform = 'translateY(-4px) scale(1.05)';
            statCard.style.background = 'rgba(255, 255, 255, 0.3)';
            statCard.style.boxShadow = '0 12px 25px rgba(0,0,0,0.2)';
        });
        
        statCard.addEventListener('mouseleave', () => {
            statCard.style.transform = 'translateY(0) scale(1)';
            statCard.style.background = 'rgba(255, 255, 255, 0.2)';
            statCard.style.boxShadow = 'none';
        });
        
        statsGrid.appendChild(statCard);
        
        // Staggered animation
        setTimeout(() => {
            statCard.style.opacity = '1';
            statCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    headerSection.appendChild(statsGrid);
    container.appendChild(headerSection);
    
    // Enhanced Chart Section with Glass Morphism
    const chartSection = document.createElement('div');
    chartSection.style.cssText = `
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(25px);
        padding: 32px;
        position: relative;
        border-radius: 0 0 20px 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-top: none;
    `;
    
    // Chart Title with Real-time Indicator
    const chartTitle = document.createElement('div');
    chartTitle.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid rgba(14, 165, 233, 0.1);
    `;
    
    chartTitle.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 700;">Real-Time Wave Height Trends</h3>
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                <div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%; animation: pulse 1s infinite;"></div>
                UPDATING
            </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #64748b;">Next update in: <span id="countdown-timer" style="font-weight: 600; color: #0ea5e9;">15s</span></div>
            <button onclick="forceRefreshChart()" style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                🔄 Refresh
            </button>
        </div>
    `;
    
    chartSection.appendChild(chartTitle);
    
    // Enhanced Interactive Chart Area
    const chartArea = document.createElement('div');
    chartArea.id = 'enhanced-chart-area';
    chartArea.style.cssText = `
        height: 350px;
        display: flex;
        align-items: end;
        gap: 3px;
        padding: 20px;
        background: linear-gradient(to top, rgba(14, 165, 233, 0.08) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 100%);
        border-radius: 16px;
        position: relative;
        margin-bottom: 24px;
        border: 1px solid rgba(14, 165, 233, 0.1);
        overflow: hidden;
    `;
    
    // Add grid lines
    const gridLines = document.createElement('div');
    gridLines.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    `;
    
    for (let i = 1; i <= 4; i++) {
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            left: 20px;
            right: 20px;
            top: ${(i * 20)}%;
            height: 1px;
            background: rgba(14, 165, 233, 0.1);
        `;
        gridLines.appendChild(line);
    }
    chartArea.appendChild(gridLines);
    
    // Create enhanced wave bars with animations
    waveData.forEach((data, index) => {
        const barContainer = document.createElement('div');
        barContainer.style.cssText = `
            flex: 1;
            height: 100%;
            display: flex;
            align-items: end;
            position: relative;
        `;
        
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        bar.dataset.index = index;
        bar.style.cssText = `
            width: 100%;
            background: ${getEnhancedWaveColor(data.riskLevel)};
            border-radius: 4px 4px 0 0;
            cursor: pointer;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: scaleY(0);
            transform-origin: bottom;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            height: ${Math.min((data.value / 4) * 100, 100)}%;
            min-height: 12px;
            position: relative;
            overflow: hidden;
        `;
        
        // Add shimmer effect
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s infinite;
        `;
        bar.appendChild(shimmer);
        
        bar.addEventListener('click', () => showEnhancedWaveModal(data));
        bar.addEventListener('mouseenter', (e) => showEnhancedTooltip(data, e.target));
        bar.addEventListener('mouseleave', hideEnhancedTooltip);
        
        barContainer.appendChild(bar);
        chartArea.appendChild(barContainer);
        
        // Staggered animation with bounce effect
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1.1)';
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
            }, 200);
        }, index * 50);
    });
    
    chartSection.appendChild(chartArea);
    
    // Enhanced Legend with Interactive Elements
    const legend = document.createElement('div');
    legend.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 24px;
        padding: 20px;
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border-radius: 16px;
        flex-wrap: wrap;
        border: 1px solid rgba(14, 165, 233, 0.1);
    `;
    
    const legendItems = [
        { color: '#10b981', label: 'Calm (< 1.5m)', icon: '🟢', count: waveData.filter(d => d.riskLevel === 'calm').length },
        { color: '#f59e0b', label: 'Moderate (1.5-2.5m)', icon: '🟡', count: waveData.filter(d => d.riskLevel === 'moderate').length },
        { color: '#ef4444', label: 'High (2.5-3.5m)', icon: '🔴', count: waveData.filter(d => d.riskLevel === 'high').length },
        { color: '#7c2d12', label: 'Extreme (> 3.5m)', icon: '🟤', count: waveData.filter(d => d.riskLevel === 'extreme').length }
    ];
    
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #475569;
            font-weight: 600;
            padding: 8px 12px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        legendItem.innerHTML = `
            <span style="font-size: 16px;">${item.icon}</span>
            <span>${item.label}</span>
            <span style="background: ${item.color}; color: white; padding: 2px 6px; border-radius: 8px; font-size: 11px; font-weight: 700;">${item.count}</span>
        `;
        
        legendItem.addEventListener('mouseenter', () => {
            legendItem.style.transform = 'translateY(-2px)';
            legendItem.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
        
        legendItem.addEventListener('mouseleave', () => {
            legendItem.style.transform = 'translateY(0)';
            legendItem.style.boxShadow = 'none';
        });
        
        legend.appendChild(legendItem);
    });
    
    chartSection.appendChild(legend);
    container.appendChild(chartSection);
    
    // Start real-time updates
    startRealTimeUpdates();
}

// Enhanced Wave Color Function
function getEnhancedWaveColor(riskLevel) {
    const colors = {
        calm: 'linear-gradient(135deg, #10b981, #059669, #047857)',
        moderate: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)', 
        high: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
        extreme: 'linear-gradient(135deg, #7c2d12, #451a03, #292524)'
    };
    return colors[riskLevel] || colors.moderate;
}

// Simple Wave Data Modal
function showDataPoint(data) {
    showSimpleModal(data);
}

// Premium Time Range Selector
function setTimeRange(range) {
    monitoringData.currentTimeRange = range;
    
    // Professional button animation
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.transform = 'scale(1)';
    });
    
    event.target.classList.add('active');
    event.target.style.transform = 'scale(1.05)';
    
    // Smooth transition effect
    const chartContainer = document.getElementById('wave-chart');
    chartContainer.style.opacity = '0.6';
    chartContainer.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        generateWaveChart();
        chartContainer.style.opacity = '1';
        
        const rangeLabels = {
            '6h': '6 Hours',
            '24h': '24 Hours',
            '7d': '7 Days', 
            '30d': '30 Days'
        };
        
        showNotification(`🌊 Premium ${rangeLabels[range]} Wave Analysis Loaded`, 'success');
    }, 200);
    
    setTimeout(() => {
        event.target.style.transform = 'scale(1)';
    }, 300);
}

// Populate alerts panel
function populateAlerts() {
    const alertsContainer = document.getElementById('monitoring-alerts');
    if (!alertsContainer) return;
    
    if (mockAlerts.length === 0) {
        alertsContainer.innerHTML = '<p style="color: #10B981; text-align: center; padding: 20px;">✅ No active alerts</p>';
        return;
    }
    
    alertsContainer.innerHTML = mockAlerts.map(alert => `
        <div class="alert-item ${alert.type}" onclick="showAlertDetails('${alert.id}')">
            <div class="alert-content">
                <span class="alert-icon">${alert.icon}</span>
                <div class="alert-text">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-desc">${alert.description}</div>
                    <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">
                        ${alert.timestamp.toLocaleTimeString()} • ${alert.location}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show alert details
function showAlertDetails(alertId) {
    const alert = mockAlerts.find(a => a.id == alertId);
    if (alert) {
        showNotification(`🚨 ${alert.title}: ${alert.description}`, alert.type === 'high' ? 'error' : alert.type === 'medium' ? 'warning' : 'info');
    }
}

// Populate sensors grid
function populateSensors() {
    const sensorsGrid = document.getElementById('sensors-grid');
    if (!sensorsGrid) return;
    
    sensorsGrid.innerHTML = mockSensors.map(sensor => `
        <div class="sensor-card" onclick="showSensorDetails('${sensor.id}')">
            <div class="sensor-header">
                <div class="sensor-name">${sensor.name}</div>
                <div class="sensor-status ${sensor.status}">
                    ${sensor.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                </div>
            </div>
            <div class="sensor-readings">
                <div class="reading">
                    <div class="reading-value">${sensor.temperature}°C</div>
                    <div class="reading-label">Temperature</div>
                </div>
                <div class="reading">
                    <div class="reading-value">${sensor.waveHeight}m</div>
                    <div class="reading-label">Wave Height</div>
                </div>
                <div class="reading">
                    <div class="reading-value">${sensor.windSpeed}kt</div>
                    <div class="reading-label">Wind Speed</div>
                </div>
                <div class="reading">
                    <div class="reading-value">${sensor.waterQuality}</div>
                    <div class="reading-label">Water Quality</div>
                </div>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280;">
                📍 ${sensor.location} • Last update: ${sensor.lastUpdate.toLocaleTimeString()}
            </div>
        </div>
    `).join('');
}

// Show sensor details
function showSensorDetails(sensorId) {
    const sensor = mockSensors.find(s => s.id === sensorId);
    if (sensor) {
        showNotification(`🛰️ ${sensor.name} (${sensor.location}): ${sensor.status.toUpperCase()}`, sensor.status === 'online' ? 'success' : 'error');
    }
}

// Update sensor data (simulate real-time updates)
function updateSensorData() {
    mockSensors.forEach(sensor => {
        if (sensor.status === 'online') {
            // Simulate small changes in readings
            sensor.temperature += (Math.random() - 0.5) * 0.2;
            sensor.waveHeight += (Math.random() - 0.5) * 0.1;
            sensor.windSpeed += (Math.random() - 0.5) * 2;
            sensor.waterQuality += Math.floor((Math.random() - 0.5) * 2);
            
            // Keep values within realistic ranges
            sensor.temperature = Math.max(10, Math.min(35, sensor.temperature));
            sensor.waveHeight = Math.max(0.1, Math.min(5, sensor.waveHeight));
            sensor.windSpeed = Math.max(0, Math.min(30, sensor.windSpeed));
            sensor.waterQuality = Math.max(50, Math.min(100, sensor.waterQuality));
            
            sensor.lastUpdate = new Date();
        }
    });
    
    populateSensors();
}

// Start real-time updates
function startRealTimeUpdates() {
    setInterval(() => {
        updateSensorData();
        updateKeyStatistics();
        
        // Occasionally add new alerts
        if (Math.random() < 0.1) { // 10% chance every interval
            addRandomAlert();
        }
    }, 10000); // Update every 10 seconds
}

// Add random alert for demonstration
function addRandomAlert() {
    const alertTypes = [
        { type: 'medium', icon: '🌊', title: 'Wave Activity', desc: 'Increased wave activity detected' },
        { type: 'low', icon: '🌡️', title: 'Temperature Change', desc: 'Minor temperature fluctuation observed' },
        { type: 'medium', icon: '💧', title: 'Water Quality', desc: 'Water quality index variation detected' }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomSensor = mockSensors[Math.floor(Math.random() * mockSensors.length)];
    
    const newAlert = {
        id: Date.now(),
        type: randomAlert.type,
        icon: randomAlert.icon,
        title: randomAlert.title,
        description: randomAlert.desc,
        timestamp: new Date(),
        location: randomSensor.location
    };
    
    mockAlerts.unshift(newAlert);
    if (mockAlerts.length > 5) {
        mockAlerts.pop(); // Keep only 5 most recent alerts
    }
    
    populateAlerts();
    showNotification(`🚨 New ${randomAlert.title} alert from ${randomSensor.location}`, 'warning');
}

// Notification system
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
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #0EA5E9, #0284C7)';
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
    
    .chart-bar {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: bottom;
        transition: all 0.3s ease;
    }
    
    /* Simple Wave Chart - No Overlapping */
    .simple-wave-header {
        background: #F8FAFC;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid #E5E7EB;
    }
    
    .simple-stats-row {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    .simple-stat-box {
        background: white;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        border: 1px solid #D1D5DB;
        flex: 1;
        min-width: 120px;
    }
    
    .simple-stat-number {
        font-size: 20px;
        font-weight: 700;
        color: #3B82F6;
        margin-bottom: 5px;
    }
    
    .simple-stat-text {
        font-size: 11px;
        color: #6B7280;
        text-transform: uppercase;
    }
    
    .simple-chart-box {
        background: white;
        border-radius: 8px;
        padding: 25px;
        border: 1px solid #E5E7EB;
        margin-top: 15px;
    }
    
    .simple-chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F3F4F6;
    }
    
    .simple-chart-title {
        font-size: 16px;
        font-weight: 600;
        color: #1F2937;
    }
    
    .simple-live-badge {
        background: #10B981;
        color: white;
        padding: 4px 8px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 600;
    }
    
    .simple-chart-area {
        height: 250px;
        display: flex;
        align-items: end;
        gap: 3px;
        padding: 10px 0;
        border-bottom: 1px solid #E5E7EB;
        border-left: 1px solid #E5E7EB;
    }
    
    .simple-wave-bar {
        flex: 1;
        border-radius: 3px 3px 0 0;
        cursor: pointer;
        transition: opacity 0.3s ease;
        opacity: 0;
        min-height: 5px;
        margin: 0;
    }
    
    .simple-wave-bar.calm {
        background: #10B981;
    }
    
    .simple-wave-bar.moderate {
        background: #F59E0B;
    }
    
    .simple-wave-bar.high {
        background: #EF4444;
    }
    
    .simple-wave-bar.extreme {
        background: #7C2D12;
    }
    
    .simple-legend {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #F3F4F6;
        flex-wrap: wrap;
    }
    
    .simple-legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: #6B7280;
    }
    
    .simple-legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
    }
    
    .simple-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease;
    }
    
    .simple-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .simple-modal-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .simple-modal-box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .simple-modal-header {
        background: #3B82F6;
        color: white;
        padding: 20px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .simple-modal-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
    }
    
    .simple-close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
    }
    
    .simple-tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
    }
    
    @keyframes waveMove {
        0% { 
            transform: translateX(-100px); 
        }
        100% { 
            transform: translateX(100px); 
        }
    }
    
    @keyframes pulse {
        0%, 100% { 
            opacity: 1; 
        }
        50% { 
            opacity: 0.5; 
        }
    }
    
    @media (max-width: 768px) {
        .simple-stats-row {
            flex-direction: column;
        }
        
        .simple-stat-box {
            min-width: auto;
        }
        
        .simple-modal-box {
            width: 95%;
        }
        
        .simple-chart-area {
            height: 200px;
        }
    }
`;
document.head.appendChild(style);

// Premium Wave Data Generator
function generatePremiumWaveData(dataPoints) {
    const waveData = [];
    const baseHeight = 1.8;
    
    for (let i = 0; i < dataPoints; i++) {
        const timeMultiplier = monitoringData.currentTimeRange === '6h' ? 900000 : 
                              monitoringData.currentTimeRange === '24h' ? 1800000 : 
                              monitoringData.currentTimeRange === '7d' ? 3600000 : 
                              86400000;
        
        const time = new Date(Date.now() - (dataPoints - i) * timeMultiplier);
        
        // Advanced wave modeling with realistic patterns
        const tidalCycle = Math.sin((i / dataPoints) * 4 * Math.PI) * 0.7;
        const weatherPattern = Math.sin((i / dataPoints) * 2 * Math.PI) * 0.5;
        const randomVariation = (Math.random() - 0.5) * 1.0;
        const stormInfluence = Math.sin((i / dataPoints) * 6 * Math.PI) * 0.3;
        
        const waveHeight = Math.max(0.3, baseHeight + tidalCycle + weatherPattern + randomVariation + stormInfluence);
        
        // Premium risk classification
        let condition, riskLevel;
        if (waveHeight < 1.5) {
            condition = 'Calm';
            riskLevel = 'calm';
        } else if (waveHeight < 2.5) {
            condition = 'Moderate';
            riskLevel = 'moderate';
        } else if (waveHeight < 4.0) {
            condition = 'High';
            riskLevel = 'high';
        } else {
            condition = 'Extreme';
            riskLevel = 'extreme';
        }
        
        waveData.push({
            value: waveHeight,
            time: time,
            condition: condition,
            riskLevel: riskLevel,
            windSpeed: 8 + Math.random() * 20,
            direction: Math.floor(Math.random() * 360),
            period: 6 + Math.random() * 8,
            energy: calculateWaveEnergy(waveHeight, 6 + Math.random() * 8),
            confidence: 88 + Math.random() * 10
        });
    }
    
    return waveData;
}

// Simple Premium Dashboard Creation
function createSimplePremiumDashboard(container, waveData) {
    // Premium Header
    const header = document.createElement('div');
    header.style.cssText = `
        background: linear-gradient(135deg, #0ea5e9, #3b82f6);
        padding: 24px;
        color: white;
        position: relative;
    `;
    
    header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700;">🌊 Ocean Wave Analytics</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 15px; font-size: 11px; font-weight: 600;">
                <span style="display: inline-block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 5px;"></span>
                LIVE
            </div>
        </div>
    `;
    
    // Stats Grid
    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
    `;
    
    const maxWave = Math.max(...waveData.map(d => d.value));
    const avgWave = waveData.reduce((sum, d) => sum + d.value, 0) / waveData.length;
    const highRiskCount = waveData.filter(d => d.riskLevel === 'high' || d.riskLevel === 'extreme').length;
    
    const stats = [
        { label: 'Peak', value: `${maxWave.toFixed(1)}m`, icon: '🏔️' },
        { label: 'Average', value: `${avgWave.toFixed(1)}m`, icon: '📊' },
        { label: 'High Risk', value: highRiskCount, icon: '⚠️' },
        { label: 'Status', value: 'Active', icon: '✅' }
    ];
    
    stats.forEach(stat => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        card.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 4px;">${stat.icon}</div>
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 2px;">${stat.value}</div>
            <div style="font-size: 10px; opacity: 0.9; text-transform: uppercase;">${stat.label}</div>
        `;
        
        statsGrid.appendChild(card);
    });
    
    header.appendChild(statsGrid);
    container.appendChild(header);
    
    // Chart Section
    const chartSection = document.createElement('div');
    chartSection.style.cssText = `
        background: white;
        padding: 24px;
    `;
    
    // Chart Title
    const title = document.createElement('div');
    title.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid #f1f5f9;
    `;
    
    title.innerHTML = `
        <h3 style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">Real-Time Wave Height Trends</h3>
        <div style="font-size: 11px; color: #64748b;">Updated: ${new Date().toLocaleTimeString()}</div>
    `;
    
    chartSection.appendChild(title);
    
    // Chart Area
    const chartArea = document.createElement('div');
    chartArea.style.cssText = `
        height: 250px;
        display: flex;
        align-items: end;
        gap: 2px;
        padding: 15px 0;
        background: linear-gradient(to top, rgba(14, 165, 233, 0.05) 0%, transparent 40%);
        border-radius: 8px;
        margin-bottom: 20px;
        border-bottom: 1px solid #e5e7eb;
    `;
    
    // Create bars
    waveData.forEach((data, index) => {
        const bar = document.createElement('div');
        bar.style.cssText = `
            flex: 1;
            background: ${getSimpleWaveColor(data.riskLevel)};
            border-radius: 2px 2px 0 0;
            cursor: pointer;
            transition: all 0.3s ease;
            height: ${Math.min((data.value / 4) * 100, 100)}%;
            min-height: 6px;
            opacity: 0;
        `;
        
        bar.addEventListener('click', () => showSimpleWaveModal(data));
        bar.addEventListener('mouseenter', (e) => showSimpleTooltip(data, e.target));
        bar.addEventListener('mouseleave', hideSimpleTooltip);
        
        chartArea.appendChild(bar);
        
        // Animate
        setTimeout(() => {
            bar.style.opacity = '1';
        }, index * 30);
    });
    
    chartSection.appendChild(chartArea);
    
    // Legend
    const legend = document.createElement('div');
    legend.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 8px;
        font-size: 12px;
    `;
    
    legend.innerHTML = `
        <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 12px; height: 12px; background: #10b981; border-radius: 2px;"></div>
            <span>Calm</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 2px;"></div>
            <span>Moderate</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 2px;"></div>
            <span>High</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 12px; height: 12px; background: #7c2d12; border-radius: 2px;"></div>
            <span>Extreme</span>
        </div>
    `;
    
    chartSection.appendChild(legend);
    container.appendChild(chartSection);
}

// Get Simple Wave Color
function getSimpleWaveColor(riskLevel) {
    const colors = {
        calm: '#10b981',
        moderate: '#f59e0b', 
        high: '#ef4444',
        extreme: '#7c2d12'
    };
    return colors[riskLevel] || colors.moderate;
}

// Simple Wave Modal
function showSimpleWaveModal(data) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        padding: 0;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    `;
    
    content.innerHTML = `
        <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 20px; border-radius: 12px 12px 0 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 18px;">🌊 Wave Analysis</h3>
                <button onclick="closeSimpleWaveModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;">✕</button>
            </div>
        </div>
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 28px; font-weight: 700; color: ${getSimpleWaveColor(data.riskLevel)}; margin-bottom: 5px;">${data.value.toFixed(1)}m</div>
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${data.condition} Conditions</div>
                <div style="font-size: 12px; color: #9ca3af;">${data.time.toLocaleString()}</div>
            </div>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <div style="display: grid; gap: 8px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between;"><span>💨 Wind Speed:</span><strong>${data.windSpeed.toFixed(1)} kt</strong></div>
                    <div style="display: flex; justify-content: space-between;"><span>🧭 Direction:</span><strong>${data.direction}°</strong></div>
                    <div style="display: flex; justify-content: space-between;"><span>⚡ Energy:</span><strong>${data.energy} kW/m</strong></div>
                </div>
            </div>
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px;">
                <div style="font-weight: 600; margin-bottom: 8px; color: #1e40af;">🛡️ Safety Info</div>
                <div style="font-size: 13px; color: #1f2937;">${getSimpleSafetyText(data.riskLevel)}</div>
            </div>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSimpleWaveModal();
    });
    
    window.currentWaveModal = modal;
}

// Simple Tooltip
function showSimpleTooltip(data, element) {
    hideSimpleTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 11px;
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
    `;
    
    tooltip.innerHTML = `${data.value.toFixed(1)}m - ${data.condition}`;
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    tooltip.id = 'simple-wave-tooltip';
}

function hideSimpleTooltip() {
    const existing = document.getElementById('simple-wave-tooltip');
    if (existing) existing.remove();
}

function closeSimpleWaveModal() {
    if (window.currentWaveModal) {
        window.currentWaveModal.remove();
        window.currentWaveModal = null;
    }
}

// Original Premium Ocean Dashboard Creation
function createPremiumOceanDashboard(container, waveData) {
    // Premium Header Section
    const headerSection = document.createElement('div');
    headerSection.style.cssText = `
        background: linear-gradient(135deg, #0ea5e9, #3b82f6);
        padding: 24px;
        color: white;
        position: relative;
        overflow: hidden;
    `;
    
    // Simple wave background pattern
    const wavePattern = document.createElement('div');
    wavePattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 2px,
            transparent 2px,
            transparent 20px
        );
        animation: waveMove 6s linear infinite;
        opacity: 0.3;
    `;
    
    headerSection.appendChild(wavePattern);
    
    // Header content
    const headerContent = document.createElement('div');
    headerContent.style.cssText = 'position: relative; z-index: 2;';
    headerContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 700;">🌊 Ocean Wave Analytics</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 6px; animation: pulse 2s infinite;"></span>
                LIVE MONITORING
            </div>
        </div>
    `;
    
    // Premium stats grid
    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-top: 20px;
    `;
    
    const maxWave = Math.max(...waveData.map(d => d.value));
    const avgWave = waveData.reduce((sum, d) => sum + d.value, 0) / waveData.length;
    const highRiskCount = waveData.filter(d => d.riskLevel === 'high' || d.riskLevel === 'extreme').length;
    const trend = waveData[waveData.length - 1].value > waveData[0].value ? '↗️ Rising' : '↘️ Falling';
    
    const stats = [
        { label: 'Peak Wave', value: `${maxWave.toFixed(1)}m`, icon: '🏔️' },
        { label: 'Average', value: `${avgWave.toFixed(1)}m`, icon: '📊' },
        { label: 'High Risk', value: highRiskCount, icon: '⚠️' },
        { label: 'Trend', value: trend, icon: '📈' }
    ];
    
    stats.forEach(stat => {
        const statCard = document.createElement('div');
        statCard.style.cssText = `
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        `;
        
        statCard.innerHTML = `
            <div style="font-size: 20px; margin-bottom: 8px;">${stat.icon}</div>
            <div style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">${stat.value}</div>
            <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">${stat.label}</div>
        `;
        
        statCard.addEventListener('mouseenter', () => {
            statCard.style.transform = 'translateY(-2px)';
            statCard.style.background = 'rgba(255, 255, 255, 0.25)';
        });
        
        statCard.addEventListener('mouseleave', () => {
            statCard.style.transform = 'translateY(0)';
            statCard.style.background = 'rgba(255, 255, 255, 0.15)';
        });
        
        statsGrid.appendChild(statCard);
    });
    
    headerContent.appendChild(statsGrid);
    headerSection.appendChild(headerContent);
    container.appendChild(headerSection);
    
    // Premium Chart Section
    const chartSection = document.createElement('div');
    chartSection.style.cssText = `
        background: white;
        padding: 32px;
        position: relative;
    `;
    
    // Chart title
    const chartTitle = document.createElement('div');
    chartTitle.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f1f5f9;
    `;
    
    chartTitle.innerHTML = `
        <h3 style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600;">Real-Time Wave Height Trends</h3>
        <div style="font-size: 12px; color: #64748b;">Last updated: ${new Date().toLocaleTimeString()}</div>
    `;
    
    chartSection.appendChild(chartTitle);
    
    // Premium chart area
    const chartArea = document.createElement('div');
    chartArea.style.cssText = `
        height: 300px;
        display: flex;
        align-items: end;
        gap: 3px;
        padding: 20px 0;
        background: linear-gradient(to top, rgba(14, 165, 233, 0.05) 0%, transparent 50%);
        border-radius: 12px;
        position: relative;
        margin-bottom: 24px;
    `;
    
    // Create premium wave bars
    waveData.forEach((data, index) => {
        const barContainer = document.createElement('div');
        barContainer.style.cssText = `
            flex: 1;
            height: 100%;
            display: flex;
            align-items: end;
            position: relative;
        `;
        
        const bar = document.createElement('div');
        bar.style.cssText = `
            width: 100%;
            background: ${getPremiumWaveColor(data.value)};
            border-radius: 4px 4px 0 0;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: scaleY(0);
            transform-origin: bottom;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            height: ${Math.min((data.value / 5) * 100, 100)}%;
            min-height: 8px;
        `;
        
        // Add premium interactions
        bar.addEventListener('click', () => showPremiumWaveModal(data));
        bar.addEventListener('mouseenter', (e) => showPremiumTooltip(data, e.target));
        bar.addEventListener('mouseleave', hidePremiumTooltip);
        
        barContainer.appendChild(bar);
        chartArea.appendChild(barContainer);
        
        // Staggered animation
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
        }, index * 50);
    });
    
    chartSection.appendChild(chartArea);
    
    // Premium legend
    const legend = document.createElement('div');
    legend.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 24px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        flex-wrap: wrap;
    `;
    
    const legendItems = [
        { color: '#10b981', label: 'Calm (< 1.5m)', icon: '🟢' },
        { color: '#f59e0b', label: 'Moderate (1.5-2.5m)', icon: '🟡' },
        { color: '#ef4444', label: 'High (2.5-4m)', icon: '🔴' },
        { color: '#7c2d12', label: 'Extreme (> 4m)', icon: '🟤' }
    ];
    
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #475569;
            font-weight: 500;
        `;
        
        legendItem.innerHTML = `
            <span style="font-size: 16px;">${item.icon}</span>
            <span>${item.label}</span>
        `;
        
        legend.appendChild(legendItem);
    });
    
    chartSection.appendChild(legend);
    container.appendChild(chartSection);
}

// Create Clean Professional Chart
function createCleanChart(container, waveData) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'clean-chart-container';
    
    // Chart title with live indicator
    const titleDiv = document.createElement('div');
    titleDiv.className = 'clean-chart-title';
    titleDiv.innerHTML = `
        <span>🌊 Wave Height Trends</span>
        <div class="clean-live-badge">
            <div class="clean-live-dot"></div>
            LIVE
        </div>
    `;
    
    // Chart bars container
    const barsContainer = document.createElement('div');
    barsContainer.className = 'clean-chart-bars';
    
    waveData.forEach((data, index) => {
        const bar = document.createElement('div');
        bar.className = `clean-wave-bar ${data.riskLevel}`;
        bar.style.height = `${Math.min((data.value / 5) * 100, 100)}%`;
        
        // Add risk indicators only for extreme conditions
        if (data.riskLevel === 'extreme') {
            const indicator = document.createElement('div');
            indicator.className = 'clean-risk-indicator';
            indicator.innerHTML = '⚠️';
            bar.appendChild(indicator);
        }
        
        // Clean interactions
        bar.addEventListener('click', () => showDataPoint(data));
        bar.addEventListener('mouseenter', (e) => showCleanTooltip(data, e.target));
        bar.addEventListener('mouseleave', hideCleanTooltip);
        
        barsContainer.appendChild(bar);
        
        // Simple animation
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
        }, index * 20);
    });
    
    // Add legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    legend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color" style="background: #10B981;"></div>
            <span>Calm (< 1.2m)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: #F59E0B;"></div>
            <span>Moderate (1.2-2.8m)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: #EF4444;"></div>
            <span>High (2.8-4.2m)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: #7C2D12;"></div>
            <span>Extreme (> 4.2m)</span>
        </div>
    `;
    
    chartContainer.appendChild(titleDiv);
    chartContainer.appendChild(barsContainer);
    chartContainer.appendChild(legend);
    container.appendChild(chartContainer);
}

// Premium Interactive Features
function addPremiumInteractivity(waveData) {
    // Store data globally for modal access
    window.currentWaveData = waveData;
}

// Simple Modal
function showSimpleModal(data) {
    const modal = document.createElement('div');
    modal.className = 'simple-modal';
    modal.innerHTML = `
        <div class="simple-modal-bg" onclick="closeSimpleModal()"></div>
        <div class="simple-modal-box">
            <div class="simple-modal-header">
                <h3 class="simple-modal-title">🌊 Wave Data</h3>
                <button onclick="closeSimpleModal()" class="simple-close-btn">✕</button>
            </div>
            <div style="padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 32px; font-weight: 700; color: #3B82F6; margin-bottom: 5px;">${data.value.toFixed(1)}m</div>
                    <div style="font-size: 16px; color: #6B7280; margin-bottom: 10px;">${data.condition} Conditions</div>
                    <div style="font-size: 14px; color: #9CA3AF;">${data.time.toLocaleString()}</div>
                </div>
                <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>💨 Wind Speed:</span>
                        <strong>${data.windSpeed.toFixed(1)} kt</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>🧭 Direction:</span>
                        <strong>${data.direction}°</strong>
                    </div>
                </div>
                <div style="background: #EFF6FF; padding: 15px; border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 8px; color: #1E40AF;">🛡️ Safety Info</div>
                    <div style="font-size: 14px; color: #1F2937;">${getSimpleSafetyText(data.riskLevel)}</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

// Premium Tooltip System
function showPremiumTooltip(data, element) {
    hidePremiumTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'premium-tooltip';
    tooltip.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 8px; color: #60A5FA;">🌊 ${data.value.toFixed(1)}m - ${data.condition}</div>
        <div style="margin-bottom: 4px;">⏰ ${data.time.toLocaleTimeString()}</div>
        <div style="margin-bottom: 4px;">💨 Wind: ${data.windSpeed.toFixed(1)} kt</div>
        <div>🎯 Confidence: ${data.confidence.toFixed(0)}%</div>
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 12 + 'px';
    tooltip.id = 'premium-tooltip';
}

function hidePremiumTooltip() {
    const existing = document.getElementById('premium-tooltip');
    if (existing) existing.remove();
}

function closePremiumModal() {
    const modal = document.querySelector('.premium-analysis-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 400);
    }
}

function calculateWaveEnergy(height, period) {
    const energy = (1025 * Math.pow(9.81, 2) * Math.pow(height, 2) * period) / (32 * Math.PI);
    return (energy / 1000).toFixed(1);
}

function adjustColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Simple Tooltip System
function showSimpleTooltip(data, element) {
    hideSimpleTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'simple-tooltip';
    tooltip.innerHTML = `${data.value.toFixed(1)}m - ${data.condition}`;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    tooltip.id = 'simple-tooltip';
}

function hideSimpleTooltip() {
    const existing = document.getElementById('simple-tooltip');
    if (existing) existing.remove();
}

function closeSimpleModal() {
    const modal = document.querySelector('.simple-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function getSimpleSafetyText(riskLevel) {
    const advice = {
        calm: 'Safe for all water activities.',
        moderate: 'Use caution. Life jackets recommended.',
        high: 'Dangerous conditions. Avoid small boats.',
        extreme: 'EXTREME - All activities prohibited.'
    };
    return advice[riskLevel] || advice.moderate;
}

// Premium Wave Color System
function getPremiumWaveColor(waveHeight) {
    if (waveHeight < 1.5) {
        return 'linear-gradient(135deg, #10b981, #059669)';
    } else if (waveHeight < 2.5) {
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
    } else if (waveHeight < 4.0) {
        return 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        return 'linear-gradient(135deg, #7c2d12, #451a03)';
    }
}

// Premium Wave Modal
function showPremiumWaveModal(data) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 24px; border-radius: 20px 20px 0 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 20px; font-weight: 700;">🌊 Wave Analysis</h3>
                <button onclick="closePremiumModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 16px;">✕</button>
            </div>
        </div>
        <div style="padding: 24px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                <div style="background: ${data.riskLevel === 'calm' ? '#10b981' : data.riskLevel === 'moderate' ? '#f59e0b' : data.riskLevel === 'high' ? '#ef4444' : '#7c2d12'}; color: white; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 28px; font-weight: 800; margin-bottom: 8px;">${data.value.toFixed(2)}m</div>
                    <div style="opacity: 0.9;">Wave Height</div>
                    <div style="margin-top: 8px; font-size: 12px; font-weight: 600;">${data.condition.toUpperCase()}</div>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 12px;">📊 Wave Metrics</div>
                    <div style="display: grid; gap: 8px; font-size: 13px;">
                        <div style="display: flex; justify-content: space-between;"><span>💨 Wind Speed:</span><strong>${data.windSpeed.toFixed(1)} kt</strong></div>
                        <div style="display: flex; justify-content: space-between;"><span>🧭 Direction:</span><strong>${data.direction}°</strong></div>
                        <div style="display: flex; justify-content: space-between;"><span>⏱️ Period:</span><strong>${data.period.toFixed(1)}s</strong></div>
                        <div style="display: flex; justify-content: space-between;"><span>⚡ Energy:</span><strong>${data.energy} kW/m</strong></div>
                    </div>
                </div>
            </div>
            <div style="background: #f0f9ff; border-radius: 12px; padding: 20px;">
                <h4 style="color: #0369a1; margin-bottom: 12px;">🛡️ Safety Recommendations</h4>
                <div style="color: #1f2937; line-height: 1.6;">
                    ${getPremiumSafetyAdvice(data.riskLevel)}
                </div>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePremiumModal();
    });
    
    window.currentPremiumModal = modal;
}

// Premium Tooltip
function showPremiumTooltip(data, element) {
    hidePremiumTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: absolute;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 41, 59, 0.9));
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    `;
    
    tooltip.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px; color: #60a5fa;">🌊 ${data.value.toFixed(1)}m - ${data.condition}</div>
        <div style="font-size: 11px; opacity: 0.8;">⏰ ${data.time.toLocaleTimeString()}</div>
        <div style="font-size: 11px; opacity: 0.8;">💨 ${data.windSpeed.toFixed(1)} kt • 🧭 ${data.direction}°</div>
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.id = 'premium-tooltip';
}

function hidePremiumTooltip() {
    const existing = document.getElementById('premium-tooltip');
    if (existing) existing.remove();
}

function closePremiumModal() {
    if (window.currentPremiumModal) {
        window.currentPremiumModal.style.opacity = '0';
        setTimeout(() => {
            if (window.currentPremiumModal) {
                window.currentPremiumModal.remove();
                window.currentPremiumModal = null;
            }
        }, 300);
    }
}

function getPremiumSafetyAdvice(riskLevel) {
    const advice = {
        calm: '✅ Perfect conditions for all water activities. Ideal for swimming, surfing, and recreational boating. Enjoy the calm seas!',
        moderate: '⚠️ Exercise caution with small watercraft. Recommended for experienced swimmers only. Life jackets strongly advised for all activities.',
        high: '🚫 Dangerous conditions present. Avoid small boat operations. Swimming not recommended. Only experienced mariners should venture out.',
        extreme: '🆘 EXTREME DANGER - All water activities strictly prohibited. Seek immediate shelter. Contact emergency services if assistance needed.'
    };
    return advice[riskLevel] || advice.moderate;
}

// Real-time Update System
let updateInterval;
let countdownInterval;
let updateCounter = 15;

function startRealTimeUpdates() {
    // Clear existing intervals
    if (updateInterval) clearInterval(updateInterval);
    if (countdownInterval) clearInterval(countdownInterval);
    
    // Start countdown timer
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    
    // Start data updates every 15 seconds
    updateInterval = setInterval(() => {
        updateRealTimeData();
        updateCounter = 15; // Reset countdown
    }, 15000);
}

function updateCountdown() {
    const timer = document.getElementById('countdown-timer');
    if (timer) {
        timer.textContent = `${updateCounter}s`;
        timer.style.color = updateCounter <= 5 ? '#ef4444' : '#0ea5e9';
    }
    updateCounter--;
    if (updateCounter < 0) updateCounter = 15;
}

function updateRealTimeData() {
    console.log('🔄 Updating real-time wave data...');
    
    // Update timestamp
    const timeElement = document.getElementById('last-update-time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }
    
    // Generate new wave data
    const newWaveData = [];
    for (let i = 0; i < 20; i++) {
        const height = 0.8 + Math.random() * 2.5 + Math.sin(i * 0.5) * 0.8;
        let condition, riskLevel;
        
        if (height < 1.5) {
            condition = 'Calm';
            riskLevel = 'calm';
        } else if (height < 2.5) {
            condition = 'Moderate';
            riskLevel = 'moderate';
        } else if (height < 3.5) {
            condition = 'High';
            riskLevel = 'high';
        } else {
            condition = 'Extreme';
            riskLevel = 'extreme';
        }
        
        newWaveData.push({
            value: height,
            time: new Date(Date.now() - (20 - i) * 1800000),
            condition: condition,
            riskLevel: riskLevel,
            windSpeed: 5 + Math.random() * 15,
            direction: Math.floor(Math.random() * 360),
            period: 6 + Math.random() * 6,
            energy: (height * height * 2.5).toFixed(1)
        });
    }
    
    // Update chart bars with smooth animation
    updateChartBars(newWaveData);
    
    // Update statistics
    updateStatistics(newWaveData);
    
    // Update legend counts
    updateLegendCounts(newWaveData);
}

function updateChartBars(newWaveData) {
    const bars = document.querySelectorAll('.wave-bar');
    
    bars.forEach((bar, index) => {
        if (newWaveData[index]) {
            const data = newWaveData[index];
            
            // Smooth height transition
            bar.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.height = `${Math.min((data.value / 4) * 100, 100)}%`;
            bar.style.background = getEnhancedWaveColor(data.riskLevel);
            
            // Update event listeners with new data
            bar.onclick = () => showEnhancedWaveModal(data);
            bar.onmouseenter = (e) => showEnhancedTooltip(data, e.target);
            
            // Add pulse effect for significant changes
            if (Math.abs(data.value - (parseFloat(bar.dataset.lastValue) || 0)) > 0.5) {
                bar.style.transform = 'scaleY(1.1) scaleX(1.05)';
                setTimeout(() => {
                    bar.style.transform = 'scaleY(1) scaleX(1)';
                }, 300);
            }
            
            bar.dataset.lastValue = data.value;
        }
    });
}

function updateStatistics(waveData) {
    const maxWave = Math.max(...waveData.map(d => d.value));
    const avgWave = waveData.reduce((sum, d) => sum + d.value, 0) / waveData.length;
    const highRiskCount = waveData.filter(d => d.riskLevel === 'high' || d.riskLevel === 'extreme').length;
    const trend = waveData[waveData.length - 1].value > waveData[0].value ? '↗️ Rising' : '↘️ Falling';
    const currentCondition = waveData[waveData.length - 1].condition;
    
    const updates = [
        { id: 'current-wave', value: `${waveData[waveData.length - 1].value.toFixed(1)}m` },
        { id: 'peak-wave', value: `${maxWave.toFixed(1)}m` },
        { id: 'avg-wave', value: `${avgWave.toFixed(1)}m` },
        { id: 'risk-level', value: currentCondition },
        { id: 'trend', value: trend },
        { id: 'alerts', value: highRiskCount }
    ];
    
    updates.forEach(update => {
        const element = document.getElementById(update.id);
        if (element) {
            const valueElement = element.querySelector('[data-value]');
            if (valueElement && valueElement.textContent !== update.value) {
                // Animate value change
                element.style.transform = 'scale(1.1)';
                element.style.background = 'rgba(255, 255, 255, 0.4)';
                
                setTimeout(() => {
                    valueElement.textContent = update.value;
                    valueElement.dataset.value = update.value;
                    element.style.transform = 'scale(1)';
                    element.style.background = 'rgba(255, 255, 255, 0.2)';
                }, 200);
            }
        }
    });
}

function updateLegendCounts(waveData) {
    const counts = {
        calm: waveData.filter(d => d.riskLevel === 'calm').length,
        moderate: waveData.filter(d => d.riskLevel === 'moderate').length,
        high: waveData.filter(d => d.riskLevel === 'high').length,
        extreme: waveData.filter(d => d.riskLevel === 'extreme').length
    };
    
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach((item, index) => {
        const countElement = item.querySelector('.count');
        if (countElement) {
            const riskLevels = ['calm', 'moderate', 'high', 'extreme'];
            const newCount = counts[riskLevels[index]];
            if (countElement.textContent !== newCount.toString()) {
                countElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    countElement.textContent = newCount;
                    countElement.style.transform = 'scale(1)';
                }, 150);
            }
        }
    });
}

function forceRefreshChart() {
    const button = event.target;
    button.style.transform = 'rotate(360deg) scale(0.9)';
    button.textContent = '🔄 Updating...';
    
    setTimeout(() => {
        updateRealTimeData();
        button.style.transform = 'rotate(0deg) scale(1)';
        button.textContent = '🔄 Refresh';
        updateCounter = 15; // Reset countdown
    }, 500);
}

// Enhanced Tooltip System
function showEnhancedTooltip(data, element) {
    hideEnhancedTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'enhanced-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(30, 41, 59, 0.95));
        backdrop-filter: blur(15px);
        color: white;
        padding: 16px;
        border-radius: 12px;
        font-size: 13px;
        pointer-events: none;
        z-index: 10000;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 220px;
    `;
    
    const riskColor = {
        calm: '#10b981',
        moderate: '#f59e0b',
        high: '#ef4444',
        extreme: '#7c2d12'
    }[data.riskLevel] || '#64748b';
    
    tooltip.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2);">
            <div style="width: 12px; height: 12px; background: ${riskColor}; border-radius: 50%; box-shadow: 0 0 8px ${riskColor};"></div>
            <div style="font-weight: 700; font-size: 16px; color: #60a5fa;">🌊 ${data.value.toFixed(2)}m</div>
            <div style="background: ${riskColor}; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase;">${data.condition}</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between;">
                <span style="opacity: 0.8;">⏰ Time:</span>
                <strong>${data.time.toLocaleTimeString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="opacity: 0.8;">💨 Wind:</span>
                <strong>${data.windSpeed.toFixed(1)} kt</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="opacity: 0.8;">🧭 Direction:</span>
                <strong>${data.direction}°</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="opacity: 0.8;">⚡ Energy:</span>
                <strong>${data.energy} kW/m</strong>
            </div>
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 11px; opacity: 0.8; text-align: center;">
            Click for detailed analysis
        </div>
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 12;
    
    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom + 12;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
}

function hideEnhancedTooltip() {
    const existing = document.getElementById('enhanced-tooltip');
    if (existing) {
        existing.style.opacity = '0';
        existing.style.transform = 'translateY(10px)';
        setTimeout(() => existing.remove(), 300);
    }
}

// Enhanced Wave Modal
function showEnhancedWaveModal(data) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 20000;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.4s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
        backdrop-filter: blur(25px);
        border-radius: 24px;
        max-width: 700px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transform: scale(0.9) translateY(20px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const riskColor = {
        calm: '#10b981',
        moderate: '#f59e0b',
        high: '#ef4444',
        extreme: '#7c2d12'
    }[data.riskLevel] || '#64748b';
    
    modalContent.innerHTML = `
        <div style="background: linear-gradient(135deg, ${riskColor}, ${riskColor}dd); color: white; padding: 32px; border-radius: 24px 24px 0 0; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50%; right: -50%; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(40px);"></div>
            <div style="position: relative; z-index: 2;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 24px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🌊 Advanced Wave Analysis</h3>
                    <button onclick="closeEnhancedModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px; font-weight: bold; transition: all 0.3s ease;">✕</button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center;">
                    <div>
                        <div style="font-size: 48px; font-weight: 900; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${data.value.toFixed(2)}m</div>
                        <div style="font-size: 18px; font-weight: 600; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">${data.condition} CONDITIONS</div>
                        <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">Recorded at ${data.time.toLocaleString()}</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.15); border-radius: 16px; backdrop-filter: blur(10px);">
                        <div style="font-size: 32px; margin-bottom: 8px;">⚠️</div>
                        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase;">Risk Level</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="padding: 32px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;">
                <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 16px; border: 1px solid rgba(14, 165, 233, 0.2);">
                    <div style="color: #0369a1; font-size: 14px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <span>💨</span> Wind Conditions
                    </div>
                    <div style="color: #1e293b;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Speed:</span><strong>${data.windSpeed.toFixed(1)} knots</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Direction:</span><strong>${data.direction}° ${getWindDirection(data.direction)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Period:</span><strong>${data.period.toFixed(1)}s</strong>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 20px; border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.2);">
                    <div style="color: #166534; font-size: 14px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <span>⚡</span> Energy Analysis
                    </div>
                    <div style="color: #1e293b;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Wave Energy:</span><strong>${data.energy} kW/m</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Power Density:</span><strong>${(data.energy * 1.2).toFixed(1)} kW/m²</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Classification:</span><strong>${getEnergyClass(data.energy)}</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fefce8, #fef3c7); border-radius: 16px; padding: 24px; border: 1px solid rgba(245, 158, 11, 0.2);">
                <h4 style="color: #92400e; margin-bottom: 16px; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                    <span>🛡️</span> Safety Recommendations
                </h4>
                <div style="color: #1f2937; line-height: 1.7; font-size: 14px;">
                    ${getPremiumSafetyAdvice(data.riskLevel)}
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
                <button onclick="exportWaveData('${JSON.stringify(data).replace(/"/g, '&quot;')}')" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    📊 Export Data
                </button>
                <button onclick="closeEnhancedModal()" style="background: linear-gradient(135deg, #64748b, #475569); color: white; border: none; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1) translateY(0)';
    }, 10);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEnhancedModal();
    });
    
    window.currentEnhancedModal = modal;
}

function closeEnhancedModal() {
    if (window.currentEnhancedModal) {
        window.currentEnhancedModal.style.opacity = '0';
        const content = window.currentEnhancedModal.querySelector('div');
        if (content) {
            content.style.transform = 'scale(0.9) translateY(20px)';
        }
        setTimeout(() => {
            if (window.currentEnhancedModal) {
                window.currentEnhancedModal.remove();
                window.currentEnhancedModal = null;
            }
        }, 400);
    }
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
}

function getEnergyClass(energy) {
    if (energy < 5) return 'Low';
    if (energy < 15) return 'Moderate';
    if (energy < 30) return 'High';
    return 'Extreme';
}

function exportWaveData(dataStr) {
    const data = JSON.parse(dataStr.replace(/&quot;/g, '"'));
    const csvContent = `Wave Height,${data.value}m\nCondition,${data.condition}\nWind Speed,${data.windSpeed} kt\nDirection,${data.direction}°\nEnergy,${data.energy} kW/m\nTime,${data.time}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wave-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Add CSS animations for enhanced effects
function addEnhancedAnimations() {
    if (document.getElementById('enhanced-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-animations';
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes floatParticle0 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            25% { transform: translate(20px, -30px) rotate(90deg); opacity: 0.7; }
            50% { transform: translate(-10px, -60px) rotate(180deg); opacity: 0.5; }
            75% { transform: translate(-30px, -20px) rotate(270deg); opacity: 0.8; }
        }
        
        @keyframes floatParticle1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
            33% { transform: translate(-25px, 40px) rotate(120deg); opacity: 0.6; }
            66% { transform: translate(15px, -45px) rotate(240deg); opacity: 0.8; }
        }
        
        @keyframes floatParticle2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
            20% { transform: translate(30px, 20px) rotate(72deg); opacity: 0.3; }
            40% { transform: translate(-20px, 50px) rotate(144deg); opacity: 0.7; }
            60% { transform: translate(25px, -30px) rotate(216deg); opacity: 0.4; }
            80% { transform: translate(-35px, -10px) rotate(288deg); opacity: 0.6; }
        }
        
        @keyframes floatParticle3 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            50% { transform: translate(-40px, 35px) rotate(180deg); opacity: 0.8; }
        }
        
        @keyframes floatParticle4 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
            25% { transform: translate(35px, -25px) rotate(90deg); opacity: 0.4; }
            50% { transform: translate(-15px, -50px) rotate(180deg); opacity: 0.7; }
            75% { transform: translate(-40px, 15px) rotate(270deg); opacity: 0.5; }
        }
        
        @keyframes floatParticle5 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
            33% { transform: translate(20px, 45px) rotate(120deg); opacity: 0.6; }
            66% { transform: translate(-30px, -35px) rotate(240deg); opacity: 0.3; }
        }
        
        @keyframes floatParticle6 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
            16% { transform: translate(25px, 30px) rotate(60deg); opacity: 0.7; }
            33% { transform: translate(-20px, 40px) rotate(120deg); opacity: 0.4; }
            50% { transform: translate(30px, -25px) rotate(180deg); opacity: 0.8; }
            66% { transform: translate(-35px, -15px) rotate(240deg); opacity: 0.3; }
            83% { transform: translate(15px, -40px) rotate(300deg); opacity: 0.6; }
        }
        
        @keyframes floatParticle7 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            50% { transform: translate(45px, -30px) rotate(180deg); opacity: 0.7; }
        }
        
        @keyframes floatParticle8 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
            25% { transform: translate(-30px, 35px) rotate(90deg); opacity: 0.4; }
            50% { transform: translate(20px, -40px) rotate(180deg); opacity: 0.8; }
            75% { transform: translate(40px, 20px) rotate(270deg); opacity: 0.5; }
        }
        
        @keyframes floatParticle9 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
            33% { transform: translate(-25px, -35px) rotate(120deg); opacity: 0.7; }
            66% { transform: translate(35px, 25px) rotate(240deg); opacity: 0.3; }
        }
        
        @keyframes floatParticle10 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
            20% { transform: translate(40px, -20px) rotate(72deg); opacity: 0.6; }
            40% { transform: translate(-15px, -45px) rotate(144deg); opacity: 0.4; }
            60% { transform: translate(-35px, 25px) rotate(216deg); opacity: 0.8; }
            80% { transform: translate(25px, 40px) rotate(288deg); opacity: 0.3; }
        }
        
        @keyframes floatParticle11 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            50% { transform: translate(-40px, -30px) rotate(180deg); opacity: 0.7; }
        }
        
        @keyframes floatParticle12 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
            25% { transform: translate(30px, 40px) rotate(90deg); opacity: 0.4; }
            50% { transform: translate(-25px, -35px) rotate(180deg); opacity: 0.8; }
            75% { transform: translate(-40px, 30px) rotate(270deg); opacity: 0.5; }
        }
        
        @keyframes floatParticle13 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
            33% { transform: translate(35px, -40px) rotate(120deg); opacity: 0.6; }
            66% { transform: translate(-30px, 20px) rotate(240deg); opacity: 0.3; }
        }
        
        @keyframes floatParticle14 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
            16% { transform: translate(-35px, 25px) rotate(60deg); opacity: 0.7; }
            33% { transform: translate(25px, -30px) rotate(120deg); opacity: 0.4; }
            50% { transform: translate(-20px, -40px) rotate(180deg); opacity: 0.8; }
            66% { transform: translate(40px, -15px) rotate(240deg); opacity: 0.3; }
            83% { transform: translate(-25px, 35px) rotate(300deg); opacity: 0.6; }
        }
        
        .wave-bar:hover {
            transform: scaleY(1.05) scaleX(1.1) !important;
            filter: brightness(1.1) saturate(1.2);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
        }
        
        .enhanced-stat-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .enhanced-stat-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
        }
        
        .legend-item:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize enhanced dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌊 Loading Enhanced Ocean Monitoring Dashboard...');
    
    try {
        // Add enhanced animations first
        addEnhancedAnimations();
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            try {
                // Initialize the dashboard
                initializeDashboard();
                console.log('✨ Enhanced Ocean Monitoring Dashboard loaded successfully!');
            } catch (initError) {
                console.error('❌ Dashboard initialization error:', initError);
                // Try basic fallback
                basicFallbackInit();
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error loading enhanced dashboard:', error);
        basicFallbackInit();
    }
});

// Basic fallback initialization
function basicFallbackInit() {
    try {
        console.log('🔄 Starting basic fallback initialization...');
        updateKeyStatistics();
        updateSensorData();
        
        // Try to at least show a basic chart
        const chartContainer = document.getElementById('wave-chart');
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; border-radius: 16px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 24px;">🌊 Ocean Wave Monitoring</h3>
                    <p style="margin: 0; opacity: 0.9;">Enhanced chart loading... Please refresh the page if this persists.</p>
                    <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 8px; cursor: pointer;">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
        }
        
        console.log('📊 Basic dashboard loaded as fallback');
    } catch (fallbackError) {
        console.error('❌ Fallback initialization failed:', fallbackError);
    }
}

// Also try to initialize when window loads (backup)
window.addEventListener('load', function() {
    setTimeout(() => {
        const chartContainer = document.getElementById('wave-chart');
        if (chartContainer && !chartContainer.querySelector('.enhanced-chart-area')) {
            console.log('🔄 Backup initialization triggered...');
            try {
                generateWaveChart();
            } catch (error) {
                console.error('❌ Backup chart generation failed:', error);
            }
        }
    }, 1000);
});
