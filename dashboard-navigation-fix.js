// Dashboard Navigation Fix - Clean working version
console.log('🔧 Loading Navigation Fix...');

// Fix navigation functionality
function fixDashboardNavigation() {
    // Wait for DOM to be ready
    setTimeout(() => {
        const navItems = document.querySelectorAll('.nav-item');
        console.log('Found nav items:', navItems.length);
        
        navItems.forEach(item => {
            // Remove existing listeners
            item.removeEventListener('click', handleNavClick);
            
            // Add new working listener
            item.addEventListener('click', handleNavClick);
        });
        
        console.log('✅ Navigation fixed and ready!');
    }, 1000);
}

// Handle navigation clicks
function handleNavClick(e) {
    e.preventDefault();
    
    const navItems = document.querySelectorAll('.nav-item');
    
    // Remove active class from all items
    navItems.forEach(nav => nav.classList.remove('active'));
    
    // Add active class to clicked item
    this.classList.add('active');
    
    // Get section from href
    const href = this.getAttribute('href');
    const section = href ? href.replace('#', '') : 'overview';
    
    console.log('Navigating to:', section);
    
    // Show notification
    showNavigationNotification(`Switched to ${section.charAt(0).toUpperCase() + section.slice(1)} section`);
    
    // Update content
    updateDashboardContent(section);
}

// Update dashboard content
function updateDashboardContent(section) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.log('Main content not found');
        return;
    }
    
    // Update header
    updateDashboardHeader(section);
    
    // Update content based on section
    switch(section) {
        case 'reports':
            loadReportsContent();
            break;
        case 'analytics':
            loadAnalyticsContent();
            break;
        case 'alerts':
            loadAlertsContent();
            break;
        case 'social':
            loadSocialContent();
            break;
        case 'settings':
            loadSettingsContent();
            break;
        default:
            loadOverviewContent();
    }
}

// Update dashboard header
function updateDashboardHeader(section) {
    const headerTitle = document.querySelector('.dashboard-header h1');
    if (headerTitle) {
        const titles = {
            'overview': 'Ocean Safety Dashboard',
            'reports': 'Reports Management',
            'analytics': 'Analytics & Insights',
            'alerts': 'Alert Management',
            'social': 'Social Media Monitoring',
            'settings': 'System Settings'
        };
        headerTitle.textContent = titles[section] || titles['overview'];
    }
}

// Load Reports content
function loadReportsContent() {
    const contentArea = findContentArea();
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <section class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-icon">📝</div>
                <div class="stat-content">
                    <h3>Total Reports</h3>
                    <div class="stat-number">1,247</div>
                    <div class="stat-change positive">+23 this week</div>
                </div>
            </div>
            
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <h3>Verified Reports</h3>
                    <div class="stat-number">847</div>
                    <div class="stat-change positive">68% verified</div>
                </div>
            </div>
            
            <div class="stat-card warning">
                <div class="stat-icon">⏳</div>
                <div class="stat-content">
                    <h3>Pending Review</h3>
                    <div class="stat-number">23</div>
                    <div class="stat-change negative">Needs attention</div>
                </div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <h3>This Month</h3>
                    <div class="stat-number">156</div>
                    <div class="stat-change positive">+15% growth</div>
                </div>
            </div>
        </section>

        <section class="activity-section">
            <div class="activity-header">
                <h3>📝 Recent Reports</h3>
                <div class="activity-controls">
                    <button class="btn-secondary" onclick="refreshReportsData()">🔄 Refresh</button>
                    <button class="btn-secondary" onclick="exportReportsData()">📊 Export</button>
                </div>
            </div>
            
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon tsunami">🌊</div>
                    <div class="activity-content">
                        <h4>Tsunami Warning - Pacific Coast</h4>
                        <p>Magnitude 7.2 earthquake detected offshore. Immediate evacuation required.</p>
                        <span class="activity-time">2 minutes ago</span>
                    </div>
                    <div class="activity-status critical">CRITICAL</div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon storm">⛈️</div>
                    <div class="activity-content">
                        <h4>Hurricane Alert - Florida Keys</h4>
                        <p>Category 3 hurricane approaching with 120mph winds.</p>
                        <span class="activity-time">15 minutes ago</span>
                    </div>
                    <div class="activity-status high">HIGH</div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon report">📝</div>
                    <div class="activity-content">
                        <h4>Coastal Flooding - Miami Beach</h4>
                        <p>Citizen report of unusual wave patterns causing street flooding.</p>
                        <span class="activity-time">1 hour ago</span>
                    </div>
                    <div class="activity-status medium">VERIFIED</div>
                </div>
            </div>
        </section>
    `;
}

// Load Analytics content
function loadAnalyticsContent() {
    const contentArea = findContentArea();
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <section class="analytics-section" style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div class="chart-container" style="background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #e2e8f0;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1e293b;">📈 Hazard Trends</h3>
                    <div class="chart-controls" style="display: flex; gap: 8px;">
                        <button class="btn-small active" onclick="updateChartPeriod('7D')" style="padding: 6px 12px; border: 1px solid #3b82f6; border-radius: 8px; background: #3b82f6; color: white; font-size: 12px; cursor: pointer;">7D</button>
                        <button class="btn-small" onclick="updateChartPeriod('30D')" style="padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; font-size: 12px; cursor: pointer;">30D</button>
                        <button class="btn-small" onclick="updateChartPeriod('90D')" style="padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; font-size: 12px; cursor: pointer;">90D</button>
                    </div>
                </div>
                <div class="chart-area" style="padding: 24px; height: 300px;">
                    <canvas id="hazardTrendsChart" style="width: 100%; height: 100%;"></canvas>
                </div>
            </div>
            
            <div class="map-container" style="background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div class="map-header" style="padding: 24px; border-bottom: 1px solid #e2e8f0;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1e293b;">🗺️ Risk Distribution</h3>
                </div>
                <div class="analytics-grid" style="padding: 24px;">
                    <div class="risk-item high" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                        <span style="font-weight: 500; color: #1e293b;">Tsunami Risk</span>
                        <div class="risk-level" style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">HIGH</div>
                    </div>
                    <div class="risk-item medium" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px; background: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <span style="font-weight: 500; color: #1e293b;">Hurricane Risk</span>
                        <div class="risk-level" style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">MEDIUM</div>
                    </div>
                    <div class="risk-item low" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                        <span style="font-weight: 500; color: #1e293b;">Flood Risk</span>
                        <div class="risk-level" style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">LOW</div>
                    </div>
                    <div class="risk-item info" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
                        <span style="font-weight: 500; color: #1e293b;">Earthquake Risk</span>
                        <div class="risk-level" style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">MODERATE</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <h3>System Uptime</h3>
                    <div class="stat-number">99.2%</div>
                    <div class="stat-change positive">Excellent performance</div>
                </div>
            </div>
            
            <div class="stat-card success">
                <div class="stat-icon">⚡</div>
                <div class="stat-content">
                    <h3>Response Time</h3>
                    <div class="stat-number">1.2s</div>
                    <div class="stat-change positive">Average response</div>
                </div>
            </div>
            
            <div class="stat-card warning">
                <div class="stat-icon">🔄</div>
                <div class="stat-content">
                    <h3>Data Updates</h3>
                    <div class="stat-number">Real-time</div>
                    <div class="stat-change">Every 30 seconds</div>
                </div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-icon">🌐</div>
                <div class="stat-content">
                    <h3>Coverage Areas</h3>
                    <div class="stat-number">15</div>
                    <div class="stat-change positive">Coastal regions</div>
                </div>
            </div>
        </section>
    `;
    
    // Initialize the chart after content is loaded
    setTimeout(() => {
        initializeHazardTrendsChart();
    }, 100);
}

// Load Alerts content
function loadAlertsContent() {
    const contentArea = findContentArea();
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <section class="stats-grid">
            <div class="stat-card primary" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                <div class="stat-icon">🚨</div>
                <div class="stat-content">
                    <h3>Critical Alerts</h3>
                    <div class="stat-number">5</div>
                    <div class="stat-change">Immediate action required</div>
                </div>
            </div>
            
            <div class="stat-card warning">
                <div class="stat-icon">⚠️</div>
                <div class="stat-content">
                    <h3>High Priority</h3>
                    <div class="stat-number">12</div>
                    <div class="stat-change">Review within 1 hour</div>
                </div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-icon">📋</div>
                <div class="stat-content">
                    <h3>Medium Priority</h3>
                    <div class="stat-number">28</div>
                    <div class="stat-change">Review within 24 hours</div>
                </div>
            </div>
            
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <h3>Resolved Today</h3>
                    <div class="stat-number">45</div>
                    <div class="stat-change positive">+12 from yesterday</div>
                </div>
            </div>
        </section>

        <section class="activity-section">
            <div class="activity-header">
                <h3>🚨 Active Alerts</h3>
                <button class="btn-secondary" onclick="acknowledgeAllAlerts()">✅ Acknowledge All</button>
            </div>
            
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon tsunami">🌊</div>
                    <div class="activity-content">
                        <h4>TSUNAMI WARNING ACTIVE</h4>
                        <p>Pacific Coast evacuation in progress. 50,000 people affected.</p>
                        <span class="activity-time">Active for 2 minutes</span>
                    </div>
                    <div class="activity-status critical">CRITICAL</div>
                </div>
            </div>
        </section>
    `;
}

// Load Social content
function loadSocialContent() {
    const contentArea = findContentArea();
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <section class="stats-grid">
            <div class="stat-card" style="background: linear-gradient(135deg, #1da1f2, #0d8bd9);">
                <div class="stat-icon">🐦</div>
                <div class="stat-content">
                    <h3>Twitter Mentions</h3>
                    <div class="stat-number">1,247</div>
                    <div class="stat-change">Last 24 hours</div>
                </div>
            </div>
            
            <div class="stat-card" style="background: linear-gradient(135deg, #4267B2, #365899);">
                <div class="stat-icon">📘</div>
                <div class="stat-content">
                    <h3>Facebook Posts</h3>
                    <div class="stat-number">892</div>
                    <div class="stat-change">Monitoring active</div>
                </div>
            </div>
            
            <div class="stat-card" style="background: linear-gradient(135deg, #E4405F, #C13584);">
                <div class="stat-icon">📷</div>
                <div class="stat-content">
                    <h3>Instagram Posts</h3>
                    <div class="stat-number">634</div>
                    <div class="stat-change">Visual content tracked</div>
                </div>
            </div>
            
            <div class="stat-card" style="background: linear-gradient(135deg, #FF0000, #CC0000);">
                <div class="stat-icon">📺</div>
                <div class="stat-content">
                    <h3>YouTube Videos</h3>
                    <div class="stat-number">156</div>
                    <div class="stat-change">Content analyzed</div>
                </div>
            </div>
        </section>

        <section class="activity-section">
            <div class="activity-header">
                <h3>📱 Recent Social Activity</h3>
                <button class="btn-secondary" onclick="refreshSocialFeed()">🔄 Refresh Feed</button>
            </div>
            
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon" style="background: #1da1f2; color: white;">🐦</div>
                    <div class="activity-content">
                        <h4>@OceanWatch: "Massive waves hitting coast!"</h4>
                        <p>High engagement post about current tsunami situation. Sentiment: Concerned</p>
                        <span class="activity-time">2 minutes ago • 47 retweets</span>
                    </div>
                    <div class="activity-status high">TRENDING</div>
                </div>
            </div>
        </section>
    `;
}

// Load Settings content
function loadSettingsContent() {
    const contentArea = findContentArea();
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <section class="settings-section">
            <div class="settings-grid">
                <div class="settings-card">
                    <h3>⚙️ System Configuration</h3>
                    <div class="settings-options">
                        <label>
                            <input type="checkbox" checked> Email Notifications
                        </label>
                        <label>
                            <input type="checkbox" checked> SMS Alerts
                        </label>
                        <label>
                            <input type="checkbox"> Push Notifications
                        </label>
                    </div>
                </div>
                
                <div class="settings-card">
                    <h3>📊 Data Preferences</h3>
                    <div class="settings-options">
                        <label>Update Frequency:
                            <select>
                                <option>Every 30 seconds</option>
                                <option>Every minute</option>
                                <option>Every 5 minutes</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="system-status">
                <h3>🔧 System Status</h3>
                <div class="status-grid">
                    <div class="status-item online">
                        <span>Database</span>
                        <div class="status-indicator">🟢 Online</div>
                    </div>
                    <div class="status-item online">
                        <span>API Services</span>
                        <div class="status-indicator">🟢 Operational</div>
                    </div>
                    <div class="status-item warning">
                        <span>Social Media</span>
                        <div class="status-indicator">🟡 Limited</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Load Overview content (default)
function loadOverviewContent() {
    // Reload the page to show default content
    location.reload();
}

// Helper functions
function findContentArea() {
    let contentArea = document.querySelector('.stats-grid')?.parentElement;
    if (!contentArea) {
        contentArea = document.querySelector('.main-content');
    }
    return contentArea;
}

function showNavigationNotification(message) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Action functions
function refreshReportsData() {
    showNavigationNotification('Refreshing reports data...');
}

function exportReportsData() {
    showNavigationNotification('Exporting reports to CSV...');
}

function acknowledgeAllAlerts() {
    showNavigationNotification('All alerts acknowledged');
}

function refreshSocialFeed() {
    showNavigationNotification('Refreshing social media feed...');
}

// Initialize Hazard Trends Chart
function initializeHazardTrendsChart() {
    const ctx = document.getElementById('hazardTrendsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Tsunami Alerts',
                data: [2, 1, 4, 2, 3, 1, 2],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Hurricane Warnings',
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
            }
        }
    });
}

// Update chart period
function updateChartPeriod(period) {
    // Update active button
    document.querySelectorAll('.chart-controls .btn-small').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'white';
        btn.style.color = '#64748b';
        btn.style.borderColor = '#e2e8f0';
    });
    
    event.target.classList.add('active');
    event.target.style.background = '#3b82f6';
    event.target.style.color = 'white';
    event.target.style.borderColor = '#3b82f6';
    
    showNavigationNotification(`Updated chart to ${period} view`);
}

// Auto-fix navigation when page loads
document.addEventListener('DOMContentLoaded', fixDashboardNavigation);

// Also try to fix after a delay in case content loads later
setTimeout(fixDashboardNavigation, 2000);

console.log('✅ Navigation Fix Ready!');
