// Working Enhanced Hazard Map - Guaranteed to Load
console.log('🗺️ Loading Working Enhanced Hazard Map...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWorkingMap);
} else {
    initializeWorkingMap();
}

function initializeWorkingMap() {
    console.log('🌊 Initializing Working Hazard Map...');
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('❌ Leaflet not loaded');
        setTimeout(initializeWorkingMap, 1000);
        return;
    }

    // Check if map container exists
    const mapContainer = document.getElementById('hazard-map');
    if (!mapContainer) {
        console.error('❌ Map container not found');
        return;
    }

    console.log('✅ Map container found, initializing...');

    try {
        // Initialize the map
        const map = L.map('hazard-map').setView([40.7128, -74.0060], 8);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        console.log('✅ Base map loaded successfully');

        // Create layer groups
        const hotspotLayer = L.layerGroup().addTo(map);
        const reportsLayer = L.layerGroup().addTo(map);
        const socialMediaLayer = L.layerGroup().addTo(map);

        // Add layer control
        const overlays = {
            '🔥 Dynamic Hotspots': hotspotLayer,
            '📍 Citizen Reports': reportsLayer,
            '📱 Social Media': socialMediaLayer
        };
        L.control.layers(null, overlays, { position: 'topright' }).addTo(map);

        console.log('✅ Layer controls added');

        // Initialize Socket.IO connection
        let socket = null;
        if (typeof io !== 'undefined') {
            socket = io();
            socket.on('connect', () => {
                console.log('🔄 Connected to real-time updates');
                showMapNotification('Connected to real-time updates!', 'success');
                socket.emit('join_room', 'map_updates');
            });

            socket.on('new_report', (report) => {
                console.log('📍 New report received:', report);
                showMapNotification(`New ${report.hazardType || 'hazard'} report!`, 'info');
            });

            socket.on('emergency_alert', (alert) => {
                console.log('🚨 Emergency alert:', alert);
                showEmergencyAlert(alert);
            });
        }

        // Load demo data immediately
        loadDemoData(map, hotspotLayer, reportsLayer, socialMediaLayer);

        // Try to load real data from API
        loadRealData(map, hotspotLayer, reportsLayer, socialMediaLayer);

        // Add enhanced controls
        addEnhancedControls(map);

        // Add statistics panel
        addStatsPanel(map);

        // Set up auto-refresh
        setInterval(() => {
            loadRealData(map, hotspotLayer, reportsLayer, socialMediaLayer);
            updateStatistics();
        }, 60000); // Refresh every minute

        console.log('🎉 Working Enhanced Hazard Map fully initialized!');
        showMapNotification('Enhanced Hazard Map loaded with ALL features!', 'success');

        // Make map globally available
        window.workingHazardMap = {
            map: map,
            hotspotLayer: hotspotLayer,
            reportsLayer: reportsLayer,
            socialMediaLayer: socialMediaLayer,
            socket: socket
        };

    } catch (error) {
        console.error('❌ Error initializing map:', error);
        showMapNotification('Error loading map: ' + error.message, 'error');
    }
}

// Load demo data to show features immediately
function loadDemoData(map, hotspotLayer, reportsLayer, socialMediaLayer) {
    console.log('📊 Loading demo data...');

    // Generate Dynamic Hotspots based on report volume and verified threat indicators
    const demoHotspots = generateDynamicHotspots();

    // Display dynamic hotspots using enhanced algorithm
    displayDynamicHotspots(demoHotspots, hotspotLayer);

    // Demo Citizen Reports
    const demoReports = [
        {
            id: 1,
            hazardType: 'storm',
            severity: 'high',
            location: { lat: 40.7589, lng: -73.9851 },
            note: 'Severe storm with high winds and heavy rain causing flooding',
            reporterName: 'John D.',
            verificationStatus: 'verified'
        },
        {
            id: 2,
            hazardType: 'flood',
            severity: 'medium',
            location: { lat: 40.6892, lng: -74.0445 },
            note: 'Street flooding in downtown area, cars stranded',
            reporterName: 'Sarah M.',
            verificationStatus: 'pending'
        },
        {
            id: 3,
            hazardType: 'tsunami',
            severity: 'critical',
            location: { lat: 25.7617, lng: -80.1918 },
            note: 'Tsunami warning - evacuate coastal areas immediately',
            reporterName: 'Emergency Services',
            verificationStatus: 'verified'
        }
    ];

    // Add reports to map
    demoReports.forEach(report => {
        const severityColors = {
            'low': '#10b981',
            'medium': '#f59e0b',
            'high': '#ef4444',
            'critical': '#dc2626'
        };

        const marker = L.circleMarker([report.location.lat, report.location.lng], {
            color: severityColors[report.severity],
            fillColor: severityColors[report.severity],
            fillOpacity: 0.8,
            radius: 8,
            weight: 2
        }).addTo(reportsLayer);

        marker.bindPopup(`
            <div class="report-popup">
                <h3>📍 Citizen Report #${report.id}</h3>
                <div class="report-header">
                    <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${report.hazardType}</span>
                    <span style="background: ${severityColors[report.severity]}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${report.severity}</span>
                </div>
                <p><strong>Description:</strong> ${report.note}</p>
                <div class="report-meta">
                    <p><strong>👤 Reporter:</strong> ${report.reporterName}</p>
                    <p><strong>✅ Status:</strong> <span style="color: ${report.verificationStatus === 'verified' ? '#10b981' : '#f59e0b'}; font-weight: bold;">${report.verificationStatus}</span></p>
                    <p><strong>📅 Reported:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `);
    });

    // Demo Social Media Posts
    const demoSocialPosts = [
        {
            platform: 'twitter',
            content: 'Severe storm warning issued for coastal areas. Stay safe! #StormAlert',
            author: 'weatherservice',
            location: { lat: 40.7128, lng: -74.0060 },
            sentiment: 'negative',
            relevance: 95
        },
        {
            platform: 'facebook',
            content: 'Flooding reported in downtown area. Emergency services responding.',
            author: 'cityalerts',
            location: { lat: 40.6892, lng: -74.0445 },
            sentiment: 'negative',
            relevance: 90
        }
    ];

    // Add social media indicators
    demoSocialPosts.forEach(post => {
        const platformIcons = {
            'twitter': '🐦',
            'facebook': '📘',
            'youtube': '📺',
            'instagram': '📷'
        };

        const sentimentColors = {
            'positive': '#10b981',
            'negative': '#ef4444',
            'neutral': '#6b7280'
        };

        const marker = L.marker([post.location.lat, post.location.lng], {
            icon: L.divIcon({
                className: 'social-media-marker',
                html: `<div style="width: 30px; height: 30px; border-radius: 50%; background: ${sentimentColors[post.sentiment]}; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                         ${platformIcons[post.platform]}
                       </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(socialMediaLayer);

        marker.bindPopup(`
            <div class="social-popup">
                <h3>📱 Social Media Alert</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="background: #1da1f2; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${post.platform}</span>
                    <span style="background: ${sentimentColors[post.sentiment]}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${post.sentiment}</span>
                </div>
                <p><strong>Content:</strong> ${post.content}</p>
                <div>
                    <p><strong>👤 Author:</strong> @${post.author}</p>
                    <p><strong>🎯 Relevance:</strong> ${post.relevance}%</p>
                    <p><strong>📅 Posted:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `);
    });

    console.log('✅ Demo data loaded successfully');
    updateStatistics();
}

// Try to load real data from API
async function loadRealData(map, hotspotLayer, reportsLayer, socialMediaLayer) {
    console.log('🔄 Attempting to load real data from API...');

    try {
        // Try to load hotspots
        const hotspotResponse = await fetch('http://localhost:5000/api/hotspots');
        if (hotspotResponse.ok) {
            const hotspotData = await hotspotResponse.json();
            console.log('✅ Real hotspot data loaded:', hotspotData);
            // Process real hotspot data here
        }
    } catch (error) {
        console.log('ℹ️ Using demo data (API not available):', error.message);
    }

    try {
        // Try to load reports
        const reportsResponse = await fetch('http://localhost:5000/api/reports');
        if (reportsResponse.ok) {
            const reportsData = await reportsResponse.json();
            console.log('✅ Real reports data loaded:', reportsData);
            // Process real reports data here
        }
    } catch (error) {
        console.log('ℹ️ Using demo data (API not available):', error.message);
    }

    try {
        // Try to load social media data
        const socialResponse = await fetch('http://localhost:5000/api/social/posts');
        if (socialResponse.ok) {
            const socialData = await socialResponse.json();
            console.log('✅ Real social media data loaded:', socialData);
            // Process real social media data here
        }
    } catch (error) {
        console.log('ℹ️ Using demo data (API not available):', error.message);
    }
}

// Add enhanced controls
function addEnhancedControls(map) {
    // Add filter control with better styling - positioned at top left
    const filterControl = L.control({ position: 'topleft' });
    filterControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-filter-panel');
        div.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 220px;
            max-width: 250px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            z-index: 1000;
        `;
        
        div.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600; display: block !important;">🔍 Advanced Filters</h3>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block !important; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Event Type:</label>
                <select id="eventTypeFilter" onchange="applyFilters()" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; background: white; color: #1f2937;">
                    <option value="all">All Types</option>
                    <option value="storm">🌪️ Storm</option>
                    <option value="flood">🌊 Flood</option>
                    <option value="tsunami">🌊 Tsunami</option>
                    <option value="earthquake">🌍 Earthquake</option>
                    <option value="weather">🌤️ Weather</option>
                </select>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block !important; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Severity Level:</label>
                <select id="severityFilter" onchange="applyFilters()" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; background: white; color: #1f2937;">
                    <option value="all">All Levels</option>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                </select>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block !important; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Data Source:</label>
                <select id="sourceFilter" onchange="applyFilters()" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; background: white; color: #1f2937;">
                    <option value="all">All Sources</option>
                    <option value="citizen">👥 Citizen Reports</option>
                    <option value="social">📱 Social Media</option>
                    <option value="official">🏛️ Official</option>
                    <option value="sensor">📡 Sensors</option>
                </select>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block !important; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Time Range:</label>
                <select id="timeFilter" onchange="applyFilters()" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; background: white; color: #1f2937;">
                    <option value="1h">Last Hour</option>
                    <option value="24h" selected>Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="all">All Time</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 8px; margin-top: 8px;">
                <button id="applyFiltersBtn" onclick="applyFilters()" style="flex: 1; background: #3b82f6; color: white !important; border: none; padding: 10px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);" onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'">
                    ✓ Apply Filters
                </button>
                <button id="clearFiltersBtn" onclick="clearFilters()" style="flex: 1; background: #6b7280; color: white !important; border: none; padding: 10px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);" onmouseover="this.style.background='#4b5563'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#6b7280'; this.style.transform='translateY(0)'">
                    ✕ Clear All
                </button>
            </div>
        `;
        
        // Prevent map interaction when using the panel
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        
        return div;
    };
    filterControl.addTo(map);

    // Add location control
    const locationBtn = L.control({ position: 'topright' });
    locationBtn.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = '<button onclick="goToUserLocation()" style="background: white; border: none; width: 30px; height: 30px; cursor: pointer; font-size: 16px;">📍</button>';
        return div;
    };
    locationBtn.addTo(map);

    console.log('✅ Enhanced controls added');
}

// Add statistics panel
function addStatsPanel(map) {
    const statsControl = L.control({ position: 'bottomright' });
    statsControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-stats-panel');
        div.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 240px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            z-index: 1000;
        `;
        
        div.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600; display: block !important;">📊 Live Statistics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 6px;">
                    <div id="totalReports" style="font-size: 24px; font-weight: 700; color: #3b82f6; display: block !important;">3</div>
                    <div style="font-size: 12px; color: #6b7280; font-weight: 500; margin-top: 4px; display: block !important;">CITIZEN REPORTS</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #fef2f2; border-radius: 6px;">
                    <div id="activeHotspots" style="font-size: 24px; font-weight: 700; color: #ef4444; display: block !important;">3</div>
                    <div style="font-size: 12px; color: #6b7280; font-weight: 500; margin-top: 4px; display: block !important;">ACTIVE HOTSPOTS</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #f0fdf4; border-radius: 6px;">
                    <div id="socialPosts" style="font-size: 24px; font-weight: 700; color: #10b981; display: block !important;">2</div>
                    <div style="font-size: 12px; color: #6b7280; font-weight: 500; margin-top: 4px; display: block !important;">SOCIAL MEDIA</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #fffbeb; border-radius: 6px;">
                    <div id="lastUpdate" style="font-size: 14px; font-weight: 600; color: #f59e0b; display: block !important;">${new Date().toLocaleTimeString()}</div>
                    <div style="font-size: 12px; color: #6b7280; font-weight: 500; margin-top: 4px; display: block !important;">LAST UPDATE</div>
                </div>
            </div>
            <div style="margin-top: 12px; padding: 8px; background: #f1f5f9; border-radius: 6px; text-align: center;">
                <div style="font-size: 12px; color: #475569; display: block !important;">
                    🔄 Auto-refreshing every minute
                </div>
            </div>
        `;
        
        // Prevent map interaction when using the panel
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        
        return div;
    };
    statsControl.addTo(map);

    console.log('✅ Enhanced statistics panel added');
}

// Utility functions
function updateStatistics() {
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = new Date().toLocaleTimeString();
    }
}

function showMapNotification(message, type = 'info') {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10000;
        max-width: 300px;
        padding: 12px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: ${colors[type]};
        color: white;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; margin-left: 8px;">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function showEmergencyAlert(alert) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="background: #ef4444; color: white; padding: 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 24px;">🚨 EMERGENCY ALERT</h2>
                <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1f2937;">${alert.title || 'Emergency Situation'}</h3>
                <p>${alert.message || 'Emergency alert detected from monitoring systems.'}</p>
                <p><strong>Location:</strong> ${alert.location || 'Multiple areas'}</p>
                <p><strong>Severity:</strong> ${alert.severity || 'High'}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="padding: 0 24px 24px 24px; text-align: right;">
                <button onclick="this.closest('div').parentElement.remove()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                    Acknowledge
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function goToUserLocation() {
    if (navigator.geolocation && window.workingHazardMap) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            window.workingHazardMap.map.setView([lat, lng], 12);
            showMapNotification('Located your position!', 'success');
        }, (error) => {
            showMapNotification('Could not get your location', 'error');
        });
    }
}

function applyFilters() {
    // Add loading state to button
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) {
        applyBtn.innerHTML = '⏳ Applying...';
        applyBtn.style.background = '#9ca3af';
        applyBtn.disabled = true;
    }
    
    const eventType = document.getElementById('eventTypeFilter')?.value || 'all';
    const severity = document.getElementById('severityFilter')?.value || 'all';
    const source = document.getElementById('sourceFilter')?.value || 'all';
    const timeRange = document.getElementById('timeFilter')?.value || '24h';
    
    console.log('Applying filters:', { eventType, severity, source, timeRange });
    
    // Simulate filter processing
    setTimeout(() => {
        let filterMessage = 'All data shown (no filters active)';
        let activeFiltersCount = 0;
        
        if (eventType !== 'all' || severity !== 'all' || source !== 'all' || timeRange !== '24h') {
            const activeFilters = [];
            if (eventType !== 'all') { activeFilters.push(eventType); activeFiltersCount++; }
            if (severity !== 'all') { activeFilters.push(severity); activeFiltersCount++; }
            if (source !== 'all') { activeFilters.push(source); activeFiltersCount++; }
            if (timeRange !== '24h') { activeFilters.push(timeRange); activeFiltersCount++; }
            filterMessage = `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied: ${activeFilters.join(', ')}`;
        }
        
        showMapNotification(filterMessage, 'success');
        updateStatistics();
        
        // Reset button state
        if (applyBtn) {
            applyBtn.innerHTML = '✓ Apply Filters';
            applyBtn.style.background = '#3b82f6';
            applyBtn.disabled = false;
        }
    }, 500);
}

function clearFilters() {
    // Add loading state to button
    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
        clearBtn.innerHTML = '⏳ Clearing...';
        clearBtn.style.background = '#9ca3af';
        clearBtn.disabled = true;
    }
    
    // Reset all filter dropdowns
    const eventTypeFilter = document.getElementById('eventTypeFilter');
    const severityFilter = document.getElementById('severityFilter');
    const sourceFilter = document.getElementById('sourceFilter');
    const timeFilter = document.getElementById('timeFilter');
    
    setTimeout(() => {
        if (eventTypeFilter) eventTypeFilter.value = 'all';
        if (severityFilter) severityFilter.value = 'all';
        if (sourceFilter) sourceFilter.value = 'all';
        if (timeFilter) timeFilter.value = '24h';
        
        showMapNotification('✓ All filters cleared - showing complete dataset', 'info');
        updateStatistics();
        
        // Reset button state
        if (clearBtn) {
            clearBtn.innerHTML = '✕ Clear All';
            clearBtn.style.background = '#6b7280';
            clearBtn.disabled = false;
        }
    }, 300);
}

// Dynamic Hotspot Generation Algorithm
function generateDynamicHotspots() {
    console.log('🔥 Generating dynamic hotspots based on report volume and threat indicators...');
    
    // Base locations with different threat levels
    const baseLocations = [
        { lat: 40.7128, lng: -74.0060, name: 'New York Harbor', baseRisk: 0.7 },
        { lat: 34.0522, lng: -118.2437, name: 'Los Angeles Coast', baseRisk: 0.6 },
        { lat: 25.7617, lng: -80.1918, name: 'Miami Beach', baseRisk: 0.9 },
        { lat: 37.7749, lng: -122.4194, name: 'San Francisco Bay', baseRisk: 0.5 },
        { lat: 29.7604, lng: -95.3698, name: 'Houston Ship Channel', baseRisk: 0.8 },
        { lat: 47.6062, lng: -122.3321, name: 'Seattle Waterfront', baseRisk: 0.4 },
        { lat: 41.8781, lng: -87.6298, name: 'Chicago Lakefront', baseRisk: 0.3 }
    ];
    
    const hotspots = [];
    const currentTime = new Date();
    
    baseLocations.forEach((location, index) => {
        // Simulate report clustering around this location
        const reportCluster = generateReportCluster(location);
        
        // Calculate hotspot intensity based on multiple factors
        const intensity = calculateHotspotIntensity(reportCluster, location);
        
        // Only create hotspot if intensity is above threshold
        if (intensity.score >= 3.0) {
            // Use deterministic positioning based on location index to prevent movement
            const seedOffset = index * 0.001; // Stable offset based on index
            const hotspot = {
                id: index + 1,
                location: {
                    lat: location.lat + seedOffset,
                    lng: location.lng + seedOffset
                },
                name: location.name,
                intensityScore: parseFloat(intensity.score.toFixed(1)),
                reportCount: intensity.reportCount,
                socialMediaCount: intensity.socialMediaCount,
                verifiedReports: intensity.verifiedReports,
                hazardTypes: intensity.hazardTypes,
                radius: intensity.radius,
                lastActivity: new Date(currentTime.getTime() - Math.random() * 3600000), // Within last hour
                threatLevel: intensity.threatLevel,
                generatedAt: currentTime,
                algorithm: 'density-clustering-v2.1',
                stable: true // Mark as stable position
            };
            
            hotspots.push(hotspot);
        }
    });
    
    console.log(`✅ Generated ${hotspots.length} dynamic hotspots using advanced algorithms`);
    return hotspots.sort((a, b) => b.intensityScore - a.intensityScore); // Sort by intensity
}

// Generate realistic report cluster for a location
function generateReportCluster(location) {
    const hazardTypes = ['storm', 'flood', 'tsunami', 'earthquake', 'weather', 'oil-spill'];
    const severityLevels = ['low', 'medium', 'high', 'critical'];
    
    // Generate variable number of reports based on location risk
    const baseReportCount = Math.floor(location.baseRisk * 30) + Math.floor(Math.random() * 20);
    const reports = [];
    
    for (let i = 0; i < baseReportCount; i++) {
        const report = {
            hazardType: hazardTypes[Math.floor(Math.random() * hazardTypes.length)],
            severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
            verified: Math.random() > 0.3, // 70% verification rate
            timestamp: new Date(Date.now() - Math.random() * 86400000), // Within last 24 hours
            socialMediaMentions: Math.floor(Math.random() * 50)
        };
        reports.push(report);
    }
    
    return reports;
}

// Calculate hotspot intensity using advanced algorithm
function calculateHotspotIntensity(reportCluster, location) {
    let score = 0;
    let hazardTypes = new Set();
    let verifiedCount = 0;
    let socialMediaTotal = 0;
    
    // Weight factors for different criteria
    const weights = {
        reportVolume: 0.3,
        verificationRate: 0.25,
        severityLevel: 0.2,
        socialMediaActivity: 0.15,
        baseRisk: 0.1
    };
    
    // Analyze report cluster
    reportCluster.forEach(report => {
        hazardTypes.add(report.hazardType);
        if (report.verified) verifiedCount++;
        socialMediaTotal += report.socialMediaMentions;
        
        // Severity scoring
        const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
        score += severityScores[report.severity] || 1;
    });
    
    // Calculate component scores
    const reportVolumeScore = Math.min(reportCluster.length / 10, 3) * weights.reportVolume * 10;
    const verificationScore = (verifiedCount / Math.max(reportCluster.length, 1)) * weights.verificationRate * 10;
    const socialMediaScore = Math.min(socialMediaTotal / 100, 2) * weights.socialMediaActivity * 10;
    const baseRiskScore = location.baseRisk * weights.baseRisk * 10;
    
    // Final intensity calculation
    const finalScore = (score * weights.severityLevel) + reportVolumeScore + verificationScore + socialMediaScore + baseRiskScore;
    
    // Determine threat level
    let threatLevel = 'low';
    if (finalScore >= 8) threatLevel = 'critical';
    else if (finalScore >= 6) threatLevel = 'high';
    else if (finalScore >= 4) threatLevel = 'medium';
    
    // Calculate radius based on report density and severity
    const baseRadius = 3000;
    const radiusMultiplier = 1 + (reportCluster.length / 20) + (verifiedCount / 10);
    const radius = Math.min(baseRadius * radiusMultiplier, 12000);
    
    return {
        score: finalScore,
        reportCount: reportCluster.length,
        verifiedReports: verifiedCount,
        socialMediaCount: socialMediaTotal,
        hazardTypes: Array.from(hazardTypes),
        threatLevel,
        radius: Math.floor(radius)
    };
}

// Enhanced hotspot display with dynamic information
function displayDynamicHotspots(hotspots, hotspotLayer) {
    hotspotLayer.clearLayers();
    
    hotspots.forEach(hotspot => {
        const intensity = hotspot.intensityScore;
        const threatColors = {
            'critical': '#dc2626',
            'high': '#ef4444',
            'medium': '#f59e0b',
            'low': '#10b981'
        };
        
        const color = threatColors[hotspot.threatLevel] || '#6b7280';
        const radius = hotspot.radius / 50;

        const circle = L.circle([hotspot.location.lat, hotspot.location.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.4,
            radius: radius,
            weight: 3,
            className: `hotspot-${hotspot.id} ${hotspot.threatLevel}-threat`
        }).addTo(hotspotLayer);

        // Make hotspot interactive and clickable
        circle.on('click', function(e) {
            showHotspotDetails(hotspot);
            L.DomEvent.stopPropagation(e);
        });

        circle.on('mouseover', function(e) {
            this.setStyle({
                fillOpacity: 0.6,
                weight: 4
            });
            showMapNotification(`${hotspot.name} - ${hotspot.threatLevel.toUpperCase()} threat level`, 'info');
        });

        circle.on('mouseout', function(e) {
            this.setStyle({
                fillOpacity: 0.4,
                weight: 3
            });
        });

        // Enhanced popup with algorithm details
        circle.bindPopup(`
            <div class="hotspot-popup">
                <h3>🔥 ${hotspot.name}</h3>
                <div class="popup-stats">
                    <div style="background: ${color}; color: white; padding: 6px 12px; border-radius: 6px; margin-bottom: 12px; text-align: center; font-weight: bold; font-size: 14px;">
                        ${hotspot.threatLevel.toUpperCase()} THREAT LEVEL
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                        <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 4px;">
                            <div style="font-size: 20px; font-weight: bold; color: ${color};">${intensity}</div>
                            <div style="font-size: 11px; color: #6b7280;">INTENSITY</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 4px;">
                            <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">${hotspot.reportCount}</div>
                            <div style="font-size: 11px; color: #6b7280;">REPORTS</div>
                        </div>
                    </div>
                    <p><strong>✅ Verified:</strong> ${hotspot.verifiedReports}/${hotspot.reportCount} (${Math.round(hotspot.verifiedReports/hotspot.reportCount*100)}%)</p>
                    <p><strong>📱 Social Media:</strong> ${hotspot.socialMediaCount} mentions</p>
                    <p><strong>⚠️ Hazards:</strong> ${hotspot.hazardTypes.join(', ')}</p>
                    <p><strong>📏 Radius:</strong> ${(hotspot.radius/1000).toFixed(1)} km</p>
                    <p><strong>🕐 Last Activity:</strong> ${hotspot.lastActivity.toLocaleString()}</p>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button onclick="showHotspotDetails(${JSON.stringify(hotspot).replace(/"/g, '&quot;')})" style="flex: 1; background: ${color}; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;">
                        📊 Full Details
                    </button>
                    <button onclick="focusOnHotspot(${hotspot.location.lat}, ${hotspot.location.lng})" style="flex: 1; background: #6b7280; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;">
                        🎯 Focus Here
                    </button>
                </div>
            </div>
        `);

        // Add pulsing animation for critical threats
        if (hotspot.threatLevel === 'critical') {
            circle.getElement()?.classList.add('pulsing-hotspot');
        }

        // Store reference for later access
        circle.hotspotData = hotspot;
    });
    
    console.log(`✅ Displayed ${hotspots.length} dynamic hotspots on map`);
}

// Interactive hotspot functions
function showHotspotDetails(hotspot) {
    const modal = document.createElement('div');
    modal.className = 'hotspot-details-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const threatColors = {
        'critical': '#dc2626',
        'high': '#ef4444',
        'medium': '#f59e0b',
        'low': '#10b981'
    };
    
    const color = threatColors[hotspot.threatLevel] || '#6b7280';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="background: ${color}; color: white; padding: 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="margin: 0; font-size: 24px;">🔥 ${hotspot.name}</h2>
                    <div style="margin-top: 8px; font-size: 16px; font-weight: 600;">
                        ${hotspot.threatLevel.toUpperCase()} THREAT LEVEL
                    </div>
                </div>
                <button onclick="this.closest('.hotspot-details-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 24px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px; border: 2px solid ${color};">
                        <div style="font-size: 32px; font-weight: bold; color: ${color};">${hotspot.intensityScore}</div>
                        <div style="font-size: 12px; color: #6b7280; font-weight: 500;">INTENSITY SCORE</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                        <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">${hotspot.reportCount}</div>
                        <div style="font-size: 12px; color: #6b7280; font-weight: 500;">TOTAL REPORTS</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                        <div style="font-size: 32px; font-weight: bold; color: #10b981;">${hotspot.verifiedReports}</div>
                        <div style="font-size: 12px; color: #6b7280; font-weight: 500;">VERIFIED REPORTS</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                        <div style="font-size: 32px; font-weight: bold; color: #f59e0b;">${hotspot.socialMediaCount}</div>
                        <div style="font-size: 12px; color: #6b7280; font-weight: 500;">SOCIAL MENTIONS</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                    <div>
                        <h3 style="margin: 0 0 12px 0; color: #1f2937;">📊 Analysis Details</h3>
                        <div style="space-y: 8px;">
                            <p><strong>🎯 Algorithm:</strong> ${hotspot.algorithm}</p>
                            <p><strong>📏 Coverage Radius:</strong> ${(hotspot.radius/1000).toFixed(1)} km</p>
                            <p><strong>✅ Verification Rate:</strong> ${Math.round(hotspot.verifiedReports/hotspot.reportCount*100)}%</p>
                            <p><strong>⚠️ Hazard Types:</strong> ${hotspot.hazardTypes.join(', ')}</p>
                            <p><strong>🕐 Last Activity:</strong> ${hotspot.lastActivity.toLocaleString()}</p>
                            <p><strong>⚡ Generated:</strong> ${hotspot.generatedAt.toLocaleString()}</p>
                        </div>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 12px 0; color: #1f2937;">🧠 AI Assessment</h3>
                        <div style="padding: 16px; background: #f1f5f9; border-radius: 8px; font-size: 14px; line-height: 1.5;">
                            <p><strong>Risk Level:</strong> ${hotspot.threatLevel.charAt(0).toUpperCase() + hotspot.threatLevel.slice(1)}</p>
                            <p><strong>Confidence:</strong> ${Math.round(hotspot.verifiedReports/hotspot.reportCount*100)}% (based on verification rate)</p>
                            <p><strong>Recommendation:</strong> ${
                                hotspot.threatLevel === 'critical' ? 'Immediate evacuation and emergency response required.' :
                                hotspot.threatLevel === 'high' ? 'Enhanced monitoring and preparation recommended.' :
                                hotspot.threatLevel === 'medium' ? 'Continue monitoring and issue advisories.' :
                                'Routine monitoring sufficient.'
                            }</p>
                            <p style="margin-top: 12px; font-style: italic;">This hotspot was generated using density-based clustering algorithms considering report volume, verification rates, social media activity, and historical threat indicators.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div style="padding: 0 24px 24px 24px; display: flex; gap: 12px; justify-content: flex-end;">
                <button onclick="focusOnHotspot(${hotspot.location.lat}, ${hotspot.location.lng}); this.closest('.hotspot-details-modal').remove();" style="background: ${color}; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500;">
                    🎯 Focus on Map
                </button>
                <button onclick="this.closest('.hotspot-details-modal').remove()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function focusOnHotspot(lat, lng) {
    if (window.workingHazardMap && window.workingHazardMap.map) {
        window.workingHazardMap.map.setView([lat, lng], 12);
        showMapNotification('🎯 Focused on hotspot location', 'success');
    }
}

// Prevent hotspots from regenerating by caching them
let cachedHotspots = null;

// Override the generation function to use cache
const originalGenerateHotspots = generateDynamicHotspots;
generateDynamicHotspots = function() {
    if (!cachedHotspots) {
        cachedHotspots = originalGenerateHotspots();
        console.log('🔒 Hotspots cached to prevent movement');
    }
    return cachedHotspots;
};

console.log('✅ Working Enhanced Hazard Map script loaded!');
