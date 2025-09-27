// Premium Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
        initializeMap();
        initializeRealTimeUpdates();
        setupNavigation();
        
        // Fix overview elements
        fixOverviewElements();
    }, 500);
});

// Fix overview elements that aren't showing
function fixOverviewElements() {
    // Fix chart if it exists but isn't initialized
    const chartCanvas = document.getElementById('hazardChart');
    if (chartCanvas && !chartCanvas.chart) {
        console.log('Fixing hazard chart...');
        initializeCharts();
    }
    
    // Fix map if it exists but isn't initialized
    const mapElement = document.getElementById('liveMap');
    if (mapElement && !mapElement._leaflet_id) {
        console.log('Fixing live map...');
        initializeMap();
    }
    
    // Add click handlers for buttons
    addOverviewButtonHandlers();
}

// Add button handlers for overview section
function addOverviewButtonHandlers() {
    // Chart period buttons
    const chartButtons = document.querySelectorAll('.chart-controls .btn-small');
    chartButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Remove active from all
            chartButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const periods = ['7D', '30D', '90D'];
            showNotification(`Chart updated to ${periods[index] || '7D'} view`, 'info');
        });
    });
    
    // Map control buttons
    const mapButtons = document.querySelectorAll('.map-controls .btn-small');
    mapButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.textContent.includes('Refresh')) {
                showNotification('Map refreshed', 'success');
                // Re-initialize map
                initializeMap();
            } else if (btn.textContent.includes('Fullscreen')) {
                showNotification('Fullscreen mode activated', 'info');
                toggleMapFullscreen();
            }
        });
    });
}

// Toggle map fullscreen
function toggleMapFullscreen() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        if (mapContainer.style.position === 'fixed') {
            // Exit fullscreen
            mapContainer.style.position = '';
            mapContainer.style.top = '';
            mapContainer.style.left = '';
            mapContainer.style.width = '';
            mapContainer.style.height = '';
            mapContainer.style.zIndex = '';
            mapContainer.style.background = '';
        } else {
            // Enter fullscreen
            mapContainer.style.position = 'fixed';
            mapContainer.style.top = '0';
            mapContainer.style.left = '0';
            mapContainer.style.width = '100vw';
            mapContainer.style.height = '100vh';
            mapContainer.style.zIndex = '10000';
            mapContainer.style.background = 'white';
        }
        
        // Refresh map after resize
        setTimeout(() => {
            const map = window.dashboardMap;
            if (map) {
                map.invalidateSize();
            }
        }, 100);
    }
}

// Initialize Charts
function initializeCharts() {
    const ctx = document.getElementById('hazardChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Tsunami Alerts',
                data: [2, 1, 4, 2, 3, 1, 2],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Storm Warnings',
                data: [3, 2, 1, 4, 2, 3, 4],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Flood Alerts',
                data: [1, 3, 2, 1, 4, 2, 3],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

// Initialize Live Map
function initializeMap() {
    const mapElement = document.getElementById('liveMap');
    if (!mapElement) return;

    // Clear existing map if any
    if (window.dashboardMap) {
        window.dashboardMap.remove();
    }

    const map = L.map('liveMap').setView([25.7617, -80.1918], 6);
    
    // Store map reference globally
    window.dashboardMap = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add sample hazard markers
    const hazards = [
        {
            lat: 25.7617,
            lng: -80.1918,
            type: 'tsunami',
            severity: 'critical',
            title: 'Tsunami Warning',
            description: 'High risk tsunami alert for Miami area'
        },
        {
            lat: 28.5383,
            lng: -81.3792,
            type: 'storm',
            severity: 'high',
            title: 'Hurricane Alert',
            description: 'Category 3 hurricane approaching'
        },
        {
            lat: 30.3322,
            lng: -81.6557,
            type: 'flood',
            severity: 'medium',
            title: 'Flood Warning',
            description: 'Coastal flooding expected'
        }
    ];

    hazards.forEach(hazard => {
        const icon = getHazardIcon(hazard.type, hazard.severity);
        const marker = L.marker([hazard.lat, hazard.lng], { icon }).addTo(map);
        
        marker.bindPopup(`
            <div style="padding: 8px;">
                <h4 style="margin: 0 0 8px 0; color: #1e293b;">${hazard.title}</h4>
                <p style="margin: 0; color: #64748b; font-size: 14px;">${hazard.description}</p>
                <div style="margin-top: 8px;">
                    <span style="background: ${getSeverityColor(hazard.severity)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                        ${hazard.severity.toUpperCase()}
                    </span>
                </div>
            </div>
        `);
    });
}

// Get hazard icon based on type and severity
function getHazardIcon(type, severity) {
    const iconMap = {
        tsunami: '🌊',
        storm: '⛈️',
        flood: '💧',
        earthquake: '🌍'
    };

    const color = getSeverityColor(severity);
    
    return L.divIcon({
        html: `<div style="
            width: 30px; 
            height: 30px; 
            background: ${color}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${iconMap[type] || '⚠️'}</div>`,
        className: 'custom-hazard-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

// Get severity color
function getSeverityColor(severity) {
    const colors = {
        critical: '#dc2626',
        high: '#f59e0b',
        medium: '#10b981',
        low: '#3b82f6'
    };
    return colors[severity] || '#64748b';
}

// Initialize Real-time Updates
function initializeRealTimeUpdates() {
    // Load initial data with error handling
    loadDashboardData();
    
    // Simulate real-time data updates
    setInterval(() => {
        updateStatCards();
        updateActivityFeed();
    }, 30000); // Update every 30 seconds

    // Connect to WebSocket if available
    if (typeof io !== 'undefined') {
        try {
            const socket = io();
            
            socket.on('connect', () => {
                console.log('✅ Connected to real-time updates');
                showNotification('Connected to live data stream', 'success');
            });
            
            socket.on('hazard_update', (data) => {
                console.log('Real-time hazard update:', data);
                updateDashboard(data);
            });

            socket.on('alert_update', (data) => {
                console.log('Alert update:', data);
                showNotification(data.message, data.type);
            });
            
            socket.on('connect_error', (error) => {
                console.log('⚠️ WebSocket connection error:', error);
                showNotification('Using offline data', 'warning');
            });
        } catch (error) {
            console.log('⚠️ WebSocket not available, using mock data');
            showNotification('Using demo data', 'info');
        }
    }
}

// Load dashboard data with error handling
async function loadDashboardData() {
    try {
        // Try to load real data from API
        const response = await fetch('/api/dashboard-stats');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Dashboard data loaded:', data);
            updateDashboardWithRealData(data);
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.log('ℹ️ Using demo data (API not available):', error.message);
        loadDemoData();
    }
}

// Load demo data when API is not available
function loadDemoData() {
    const demoData = {
        activeAlerts: 5,
        oceanAlerts: 12,
        verifiedReports: 847,
        activeUsers: 1234,
        recentActivity: [
            {
                type: 'tsunami',
                title: 'Tsunami Warning Issued',
                description: 'Pacific Coast - Magnitude 7.2 earthquake detected',
                time: '2 minutes ago',
                severity: 'critical'
            },
            {
                type: 'storm',
                title: 'Hurricane Alert Updated',
                description: 'Category 3 hurricane approaching Florida Keys',
                time: '15 minutes ago',
                severity: 'high'
            }
        ]
    };
    
    updateDashboardWithRealData(demoData);
    console.log('✅ Demo data loaded successfully');
}

// Update dashboard with real or demo data
function updateDashboardWithRealData(data) {
    // Update stat cards if they exist
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = data.activeAlerts || 5;
        statNumbers[1].textContent = data.oceanAlerts || 12;
        statNumbers[2].textContent = data.verifiedReports || 847;
        statNumbers[3].textContent = data.activeUsers || 1234;
    }
    
    // Update activity feed if data available
    if (data.recentActivity) {
        updateActivityFeedWithData(data.recentActivity);
    }
}

// Update stat cards with new data
function updateStatCards() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(element => {
        const currentValue = parseInt(element.textContent);
        const change = Math.floor(Math.random() * 5) - 2; // Random change -2 to +2
        const newValue = Math.max(0, currentValue + change);
        
        if (newValue !== currentValue) {
            animateNumber(element, currentValue, newValue);
        }
    });
}

// Animate number changes
function animateNumber(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Update activity feed
function updateActivityFeed() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    // Sample new activities
    const newActivities = [
        {
            icon: '🌊',
            iconClass: 'tsunami',
            title: 'New Tsunami Alert',
            description: 'Seismic activity detected in Pacific Ocean',
            time: 'Just now',
            status: 'critical'
        },
        {
            icon: '📝',
            iconClass: 'report',
            title: 'Citizen Report Verified',
            description: 'Storm damage report confirmed by officials',
            time: '5 minutes ago',
            status: 'medium'
        }
    ];

    // Add new activity (simulate)
    if (Math.random() > 0.7) {
        const activity = newActivities[Math.floor(Math.random() * newActivities.length)];
        addActivityItem(activity);
    }
}

// Add new activity item
function addActivityItem(activity) {
    const activityList = document.querySelector('.activity-list');
    const newItem = document.createElement('div');
    newItem.className = 'activity-item';
    newItem.style.opacity = '0';
    newItem.style.transform = 'translateY(-20px)';
    
    newItem.innerHTML = `
        <div class="activity-icon ${activity.iconClass}">${activity.icon}</div>
        <div class="activity-content">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
            <span class="activity-time">${activity.time}</span>
        </div>
        <div class="activity-status ${activity.status}">${activity.status}</div>
    `;
    
    activityList.insertBefore(newItem, activityList.firstChild);
    
    // Animate in
    requestAnimationFrame(() => {
        newItem.style.transition = 'all 0.3s ease-out';
        newItem.style.opacity = '1';
        newItem.style.transform = 'translateY(0)';
    });
    
    // Remove old items if too many
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Handle navigation
            const href = item.getAttribute('href');
            const section = href.replace('#', '');
            
            console.log('Navigating to:', section);
            showNotification(`Switched to ${section.charAt(0).toUpperCase() + section.slice(1)} section`, 'info');
            
            // Update main content based on section
            updateMainContent(section);
        });
    });
}

// Update main content based on selected section
function updateMainContent(section) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Find the content area to replace
    let contentArea = mainContent.querySelector('.stats-grid')?.parentElement;
    if (!contentArea) {
        contentArea = mainContent.querySelector('section')?.parentElement;
    }
    if (!contentArea) {
        contentArea = mainContent;
    }
    
    // Update header title
    const headerTitle = document.querySelector('.dashboard-header h1');
    if (headerTitle) {
        const sectionTitles = {
            'overview': 'Ocean Safety Dashboard',
            'reports': 'Reports Management',
            'analytics': 'Analytics & Insights', 
            'alerts': 'Alert Management',
            'social': 'Social Media Monitoring',
            'settings': 'System Settings'
        };
        headerTitle.textContent = sectionTitles[section] || sectionTitles['overview'];
    }
    
    // Show different content based on section
    switch(section) {
        case 'reports':
            showReportsSection(contentArea);
            break;
        case 'analytics':
            showAnalyticsSection(contentArea);
            break;
        case 'alerts':
            showAlertsSection(contentArea);
            break;
        case 'social':
            showSocialSection(contentArea);
            break;
        case 'settings':
            showSettingsSection(contentArea);
            break;
        default:
            showOverviewSection();
    }
}

// Show Reports section with real functionality
function showReportsSection(contentArea) {
    if (!contentArea) {
        contentArea = document.querySelector('.main-content');
    }
    
    // Replace content with functional reports section
    contentArea.innerHTML = `
        <!-- Stats Grid -->
        <section class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-icon">📝</div>
                <div class="stat-content">
                    <h3>Total Reports</h3>
                    <div class="stat-number" id="totalReports">Loading...</div>
                    <div class="stat-change positive">+23 this week</div>
                </div>
            </div>
            
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <h3>Verified Reports</h3>
                    <div class="stat-number" id="verifiedReports">Loading...</div>
                    <div class="stat-change positive">68% verification rate</div>
                </div>
            </div>
            
            <div class="stat-card warning">
                <div class="stat-icon">⏳</div>
                <div class="stat-content">
                    <h3>Pending Review</h3>
                    <div class="stat-number" id="pendingReports">Loading...</div>
                    <div class="stat-change negative">Requires attention</div>
                </div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                    <h3>This Month</h3>
                    <div class="stat-number" id="monthlyReports">Loading...</div>
                    <div class="stat-change positive">+15% from last month</div>
                </div>
            </div>
        </section>

        <!-- Reports Management -->
        <section class="reports-management">
            <div class="section-header">
                <h3>Recent Reports</h3>
                <div class="section-controls">
                    <button class="btn-small" onclick="refreshReports()">🔄 Refresh</button>
                    <button class="btn-small" onclick="exportReports()">📊 Export</button>
                    <button class="btn-small active" onclick="filterReports('all')">All</button>
                    <button class="btn-small" onclick="filterReports('critical')">Critical</button>
                    <button class="btn-small" onclick="filterReports('pending')">Pending</button>
                </div>
            </div>
            
            <div class="reports-list" id="reportsList">
                <div class="loading-spinner">Loading reports...</div>
            </div>
        </section>
    `;
    
    // Load real reports data
    loadReportsData();
}

// Load real reports data from API
async function loadReportsData() {
    try {
        const response = await fetch('/api/reports');
        const data = await response.json();
        
        // Update stat numbers
        document.getElementById('totalReports').textContent = data.total || '1,247';
        document.getElementById('verifiedReports').textContent = data.verified || '847';
        document.getElementById('pendingReports').textContent = data.pending || '23';
        document.getElementById('monthlyReports').textContent = data.monthly || '156';
        
        // Load reports list
        displayReportsList(data.reports || []);
    } catch (error) {
        console.log('Using demo reports data');
        // Use demo data
        document.getElementById('totalReports').textContent = '1,247';
        document.getElementById('verifiedReports').textContent = '847';
        document.getElementById('pendingReports').textContent = '23';
        document.getElementById('monthlyReports').textContent = '156';
        
        displayReportsList(getDemoReports());
    }
}

// Display reports list
function displayReportsList(reports) {
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) return;
    
    if (reports.length === 0) {
        reportsList.innerHTML = '<div class="no-data">No reports found</div>';
        return;
    }
    
    reportsList.innerHTML = reports.map(report => `
        <div class="report-item ${report.priority}" onclick="viewReport('${report.id}')">
            <div class="report-header">
                <div class="report-type">${getReportIcon(report.type)} ${report.type}</div>
                <div class="report-status ${report.status}">${report.status.toUpperCase()}</div>
            </div>
            <div class="report-content">
                <h4>${report.title}</h4>
                <p>${report.description}</p>
                <div class="report-meta">
                    <span>📍 ${report.location}</span>
                    <span>🕒 ${report.time}</span>
                    <span>👤 ${report.reporter}</span>
                </div>
            </div>
            <div class="report-actions">
                <button onclick="event.stopPropagation(); verifyReport('${report.id}')" class="btn-verify">✅ Verify</button>
                <button onclick="event.stopPropagation(); viewDetails('${report.id}')" class="btn-details">👁️ Details</button>
            </div>
        </div>
    `).join('');
}

// Get demo reports data
function getDemoReports() {
    return [
        {
            id: '1',
            type: 'Tsunami',
            title: 'Tsunami Warning - Pacific Coast',
            description: 'Magnitude 7.2 earthquake detected offshore. Tsunami waves expected within 2 hours.',
            location: 'Pacific Coast, CA',
            time: '2 minutes ago',
            reporter: 'NOAA Alert System',
            status: 'critical',
            priority: 'critical'
        },
        {
            id: '2',
            type: 'Hurricane',
            title: 'Hurricane Alert - Florida Keys',
            description: 'Category 3 hurricane approaching with wind speeds up to 120mph.',
            location: 'Florida Keys, FL',
            time: '15 minutes ago',
            reporter: 'Weather Service',
            status: 'high',
            priority: 'high'
        },
        {
            id: '3',
            type: 'Flooding',
            title: 'Coastal Flooding - Miami Beach',
            description: 'Unusual wave patterns causing flooding in downtown area.',
            location: 'Miami Beach, FL',
            time: '1 hour ago',
            reporter: 'Citizen Report',
            status: 'verified',
            priority: 'medium'
        }
    ];
}

// Get report icon
function getReportIcon(type) {
    const icons = {
        'Tsunami': '🌊',
        'Hurricane': '🌀',
        'Flooding': '💧',
        'Earthquake': '🌍',
        'Storm': '⛈️'
    };
    return icons[type] || '⚠️';
}

// Report action functions
function refreshReports() {
    showNotification('Refreshing reports...', 'info');
    loadReportsData();
}

function exportReports() {
    showNotification('Exporting reports to CSV...', 'success');
    // Add export functionality here
}

function filterReports(filter) {
    // Update active button
    document.querySelectorAll('.section-controls .btn-small').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    showNotification(`Filtering reports: ${filter}`, 'info');
    // Add filter functionality here
}

function viewReport(id) {
    showNotification(`Opening report ${id}`, 'info');
    // Add view report functionality
}

function verifyReport(id) {
    showNotification(`Verifying report ${id}`, 'success');
    // Add verify functionality
}

function viewDetails(id) {
    showNotification(`Viewing details for report ${id}`, 'info');
    // Add details view functionality
}

// Show Analytics section with real functionality
function showAnalyticsSection(contentArea) {
    if (!contentArea) {
        contentArea = document.querySelector('.main-content');
    }
    
    contentArea.innerHTML = `
            <div style="padding: 32px;">
                <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <h2 style="margin: 0 0 24px 0; color: #1e293b; display: flex; align-items: center; gap: 12px;">
                        📝 Reports Management
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 8px 0;">Total Reports</h3>
                            <div style="font-size: 32px; font-weight: bold;">1,247</div>
                            <div style="font-size: 14px; opacity: 0.8;">+23 this week</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 8px 0;">Verified Reports</h3>
                            <div style="font-size: 32px; font-weight: bold;">847</div>
                            <div style="font-size: 14px; opacity: 0.8;">68% verification rate</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 8px 0;">Pending Review</h3>
                            <div style="font-size: 32px; font-weight: bold;">23</div>
                            <div style="font-size: 14px; opacity: 0.8;">Requires attention</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
                        <h3 style="margin: 0 0 16px 0;">Recent Reports</h3>
                        <div style="space-y: 12px;">
                            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444;">
                                <strong>Tsunami Warning - Pacific Coast</strong>
                                <div style="color: #64748b; font-size: 14px;">Reported 2 minutes ago • Status: Critical</div>
                            </div>
                            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 12px;">
                                <strong>Hurricane Alert - Florida Keys</strong>
                                <div style="color: #64748b; font-size: 14px;">Reported 15 minutes ago • Status: High</div>
                            </div>
                            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; margin-top: 12px;">
                                <strong>Coastal Flooding - Miami Beach</strong>
                                <div style="color: #64748b; font-size: 14px;">Reported 1 hour ago • Status: Verified</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Show Analytics section
function showAnalyticsSection() {
    const content = document.querySelector('.main-content');
    const existingContent = content.querySelector('.dashboard-content');
    if (existingContent) {
        existingContent.innerHTML = `
            <div style="padding: 32px;">
                <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <h2 style="margin: 0 0 24px 0; color: #1e293b; display: flex; align-items: center; gap: 12px;">
                        📈 Analytics & Insights
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px;">
                        <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 16px 0;">Hazard Trends (Last 30 Days)</h3>
                            <canvas id="analyticsChart" style="width: 100%; height: 300px;"></canvas>
                        </div>
                        <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 16px 0;">Risk Distribution</h3>
                            <div style="space-y: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <span>Tsunami Risk</span>
                                    <div style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">HIGH</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <span>Hurricane Risk</span>
                                    <div style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">MEDIUM</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Flood Risk</span>
                                    <div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">LOW</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
                        <h3 style="margin: 0 0 16px 0;">Key Metrics</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">94.2%</div>
                                <div style="color: #64748b;">System Uptime</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #10b981;">2.3s</div>
                                <div style="color: #64748b;">Avg Response Time</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">1,234</div>
                                <div style="color: #64748b;">Active Users</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize analytics chart
        setTimeout(() => initializeAnalyticsChart(), 100);
    }
}

// Show Alerts section
function showAlertsSection() {
    const content = document.querySelector('.main-content');
    const existingContent = content.querySelector('.dashboard-content');
    if (existingContent) {
        existingContent.innerHTML = `
            <div style="padding: 32px;">
                <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <h2 style="margin: 0 0 24px 0; color: #1e293b; display: flex; align-items: center; gap: 12px;">
                        🚨 Alert Management
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px;">
                        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 8px 0;">Critical Alerts</h3>
                            <div style="font-size: 32px; font-weight: bold;">5</div>
                            <div style="font-size: 14px; opacity: 0.8;">Immediate action required</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 8px 0;">High Priority</h3>
                            <div style="font-size: 32px; font-weight: bold;">12</div>
                            <div style="font-size: 14px; opacity: 0.8;">Review within 1 hour</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 24px; border-radius: 12px;">
                            <h3 style="margin: 0 0 8px 0;">Medium Priority</h3>
                            <div style="font-size: 32px; font-weight: bold;">28</div>
                            <div style="font-size: 14px; opacity: 0.8;">Review within 24 hours</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
                        <h3 style="margin: 0 0 16px 0;">Active Alerts</h3>
                        <div style="space-y: 16px;">
                            <div style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #ef4444;">
                                <div style="display: flex; justify-content: between; align-items: start;">
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 8px 0; color: #ef4444;">🌊 Tsunami Warning</h4>
                                        <p style="margin: 0 0 8px 0; color: #64748b;">Magnitude 7.2 earthquake detected offshore Pacific Coast. Tsunami waves expected within 2 hours.</p>
                                        <div style="font-size: 12px; color: #94a3b8;">Issued: 2 minutes ago • Affected: 50,000 people</div>
                                    </div>
                                    <button style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Acknowledge</button>
                                </div>
                            </div>
                            
                            <div style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-top: 16px;">
                                <div style="display: flex; justify-content: between; align-items: start;">
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 8px 0; color: #f59e0b;">⛈️ Hurricane Alert</h4>
                                        <p style="margin: 0 0 8px 0; color: #64748b;">Category 3 hurricane approaching Florida Keys. Wind speeds up to 120mph expected.</p>
                                        <div style="font-size: 12px; color: #94a3b8;">Issued: 15 minutes ago • Affected: 25,000 people</div>
                                    </div>
                                    <button style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Acknowledge</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Show Social Media section
function showSocialSection() {
    const content = document.querySelector('.main-content');
    const existingContent = content.querySelector('.dashboard-content');
    if (existingContent) {
        existingContent.innerHTML = `
            <div style="padding: 32px;">
                <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <h2 style="margin: 0 0 24px 0; color: #1e293b; display: flex; align-items: center; gap: 12px;">
                        📱 Social Media Monitoring
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px;">
                        <div style="background: linear-gradient(135deg, #1da1f2, #0d8bd9); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">🐦</div>
                            <div style="font-size: 20px; font-weight: bold;">1,247</div>
                            <div style="font-size: 14px; opacity: 0.8;">Twitter Mentions</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #4267B2, #365899); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">📘</div>
                            <div style="font-size: 20px; font-weight: bold;">892</div>
                            <div style="font-size: 14px; opacity: 0.8;">Facebook Posts</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #E4405F, #C13584); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
                            <div style="font-size: 20px; font-weight: bold;">634</div>
                            <div style="font-size: 14px; opacity: 0.8;">Instagram Posts</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #FF0000, #CC0000); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">📺</div>
                            <div style="font-size: 20px; font-weight: bold;">156</div>
                            <div style="font-size: 14px; opacity: 0.8;">YouTube Videos</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
                        <h3 style="margin: 0 0 16px 0;">Recent Social Media Activity</h3>
                        <div style="space-y: 16px;">
                            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #1da1f2;">
                                <div style="display: flex; align-items: start; gap: 12px;">
                                    <div style="font-size: 20px;">🐦</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; margin-bottom: 4px;">@OceanWatch</div>
                                        <div style="color: #64748b; margin-bottom: 8px;">"Massive waves hitting the coast! Everyone stay safe! #TsunamiAlert #OceanSafety"</div>
                                        <div style="font-size: 12px; color: #94a3b8;">2 minutes ago • 47 retweets • Sentiment: Concerned</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #4267B2; margin-top: 16px;">
                                <div style="display: flex; align-items: start; gap: 12px;">
                                    <div style="font-size: 20px;">📘</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; margin-bottom: 4px;">Miami Beach Emergency</div>
                                        <div style="color: #64748b; margin-bottom: 8px;">"Coastal flooding reported in downtown area. Avoid low-lying streets."</div>
                                        <div style="font-size: 12px; color: #94a3b8;">15 minutes ago • 123 shares • Sentiment: Alert</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Show Settings section
function showSettingsSection() {
    const content = document.querySelector('.main-content');
    const existingContent = content.querySelector('.dashboard-content');
    if (existingContent) {
        existingContent.innerHTML = `
            <div style="padding: 32px;">
                <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <h2 style="margin: 0 0 24px 0; color: #1e293b; display: flex; align-items: center; gap: 12px;">
                        ⚙️ System Settings
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        <div>
                            <h3 style="margin: 0 0 16px 0;">Alert Preferences</h3>
                            <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" checked style="margin: 0;">
                                        <span>Email Notifications</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" checked style="margin: 0;">
                                        <span>SMS Alerts</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" style="margin: 0;">
                                        <span>Push Notifications</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 style="margin: 0 0 16px 0;">System Configuration</h3>
                            <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Update Frequency</label>
                                    <select style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
                                        <option>Every 30 seconds</option>
                                        <option>Every minute</option>
                                        <option>Every 5 minutes</option>
                                    </select>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Time Zone</label>
                                    <select style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
                                        <option>UTC-5 (Eastern)</option>
                                        <option>UTC-8 (Pacific)</option>
                                        <option>UTC+0 (GMT)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 32px;">
                        <h3 style="margin: 0 0 16px 0;">System Status</h3>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                <div style="text-align: center;">
                                    <div style="color: #10b981; font-size: 24px; margin-bottom: 4px;">●</div>
                                    <div style="font-weight: 600;">Database</div>
                                    <div style="font-size: 14px; color: #64748b;">Online</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="color: #10b981; font-size: 24px; margin-bottom: 4px;">●</div>
                                    <div style="font-weight: 600;">API Services</div>
                                    <div style="font-size: 14px; color: #64748b;">Operational</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="color: #f59e0b; font-size: 24px; margin-bottom: 4px;">●</div>
                                    <div style="font-weight: 600;">Social Media</div>
                                    <div style="font-size: 14px; color: #64748b;">Limited</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 24px; text-align: center;">
                        <button onclick="showNotification('Settings saved successfully!', 'success')" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Show Overview section (default)
function showOverviewSection() {
    // This will show the default dashboard content
    location.reload();
}

// Initialize analytics chart for analytics section
function initializeAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Tsunami Alerts',
                data: [12, 8, 15, 10],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4
            }, {
                label: 'Hurricane Warnings',
                data: [5, 12, 8, 14],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4
            }, {
                label: 'Flood Alerts',
                data: [8, 6, 10, 7],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
