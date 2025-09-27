// Dashboard Fix - Resolves data loading errors and enhances UI
console.log('🔧 Loading Dashboard Fix...');

// Enhanced Dashboard Component with Error Handling
function createEnhancedDashboardWithErrorHandling() {
    return `
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 0; max-width: 1200px; width: 95%; max-height: 90vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
            
            <!-- Dashboard Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 24px 32px; border-radius: 16px 16px 0 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <h2 style="margin: 0; font-size: 28px; font-weight: 700; color: white; display: flex; align-items: center; gap: 12px;">
                            🌊 AquaSutra Dashboard
                            <span id="connectionStatus" style="font-size: 12px; background: #10b981; padding: 4px 8px; border-radius: 12px;">🟢 LIVE</span>
                        </h2>
                        <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 16px;">Ocean Safety Monitoring Platform</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 20px; font-size: 14px;">
                            📊 Real-time Analytics
                        </div>
                        <div style="font-size: 14px; color: #cbd5e1;">
                            <span id="lastUpdate">Last updated: ${new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div style="padding: 32px; background: white; overflow-y: auto; max-height: calc(90vh - 120px);">
                
                <!-- Enhanced Stats Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
                    
                    <!-- Critical Alerts Card -->
                    <div class="stat-card" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3); cursor: pointer; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 40px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 25px rgba(239, 68, 68, 0.3)'">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px; animation: pulse 2s infinite;">🚨</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Critical Alerts</div>
                                <div class="stat-number" style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">5</div>
                                <div style="font-size: 12px; opacity: 0.8;">Requires immediate attention</div>
                            </div>
                        </div>
                    </div>

                    <!-- Ocean Monitoring Card -->
                    <div class="stat-card" style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3); cursor: pointer; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 40px rgba(14, 165, 233, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 25px rgba(14, 165, 233, 0.3)'">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px;">🌊</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Ocean Alerts</div>
                                <div class="stat-number" style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">12</div>
                                <div style="font-size: 12px; opacity: 0.8;">Active monitoring zones</div>
                            </div>
                        </div>
                    </div>

                    <!-- Verified Reports Card -->
                    <div class="stat-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); cursor: pointer; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 40px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 25px rgba(16, 185, 129, 0.3)'">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px;">✅</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Verified Reports</div>
                                <div class="stat-number" style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">847</div>
                                <div style="font-size: 12px; opacity: 0.8;">+15% this week</div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Users Card -->
                    <div class="stat-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3); cursor: pointer; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 40px rgba(139, 92, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 25px rgba(139, 92, 246, 0.3)'">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px;">👥</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Active Users</div>
                                <div class="stat-number" style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">1,234</div>
                                <div style="font-size: 12px; opacity: 0.8;">Online now</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Panel -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 8px;">⚡ Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        
                        <button onclick="navigateToPage('report-hazard.html')" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                            📝 Report New Hazard
                        </button>
                        
                        <button onclick="navigateToPage('hazard-map.html')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)'">
                            🗺️ View Live Map
                        </button>
                        
                        <button onclick="navigateToPage('analytics.html')" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(245, 158, 11, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(245, 158, 11, 0.3)'">
                            📊 View Analytics
                        </button>
                        
                        <button onclick="navigateToPage('emergency.html')" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.3)'">
                            🚨 Emergency Hub
                        </button>
                    </div>
                </div>

                <!-- Enhanced Recent Activity -->
                <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 8px;">📈 Recent Activity</h4>
                            <button onclick="refreshActivity()" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">🔄 Refresh</button>
                        </div>
                    </div>
                    
                    <div id="activityFeed" style="padding: 24px;">
                        <!-- Activity items will be loaded here -->
                        <div style="text-align: center; padding: 40px; color: #64748b;">
                            <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                            <p>Loading recent activity...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Navigation function with error handling
function navigateToPage(page) {
    try {
        if (page.startsWith('http')) {
            window.open(page, '_blank');
        } else {
            window.location.href = page;
        }
    } catch (error) {
        console.log('Navigation error:', error);
        showNotification('Page not available', 'warning');
    }
}

// Load activity data with error handling
async function loadActivityData() {
    try {
        const response = await fetch('/api/dashboard-stats');
        if (response.ok) {
            const data = await response.json();
            updateActivityFeed(data.recentActivity || []);
            updateConnectionStatus('connected');
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.log('ℹ️ Loading demo activity data');
        loadDemoActivity();
        updateConnectionStatus('demo');
    }
}

// Load demo activity data
function loadDemoActivity() {
    const demoActivities = [
        {
            icon: '🌊',
            iconClass: 'tsunami',
            title: 'Tsunami Warning Issued',
            description: 'Pacific Coast - Magnitude 7.2 earthquake detected offshore',
            time: '2 minutes ago',
            status: 'critical'
        },
        {
            icon: '⛈️',
            iconClass: 'storm',
            title: 'Hurricane Alert Updated',
            description: 'Category 3 hurricane approaching Florida Keys - Wind speeds 120mph',
            time: '15 minutes ago',
            status: 'high'
        },
        {
            icon: '📝',
            iconClass: 'report',
            title: 'New Citizen Report Verified',
            description: 'Unusual wave patterns reported in Miami Beach - Confirmed by officials',
            time: '1 hour ago',
            status: 'verified'
        },
        {
            icon: '📱',
            iconClass: 'social',
            title: 'Social Media Alert Detected',
            description: 'Multiple reports of coastal flooding on Twitter - Analyzing sentiment',
            time: '2 hours ago',
            status: 'monitoring'
        }
    ];
    
    updateActivityFeed(demoActivities);
}

// Update activity feed
function updateActivityFeed(activities) {
    const feedElement = document.getElementById('activityFeed');
    if (!feedElement) return;
    
    if (activities.length === 0) {
        feedElement.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    feedElement.innerHTML = activities.map(activity => `
        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
            <div style="width: 48px; height: 48px; background: ${getStatusGradient(activity.status)}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                ${activity.icon}
            </div>
            <div style="flex: 1;">
                <h5 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b;">${activity.title}</h5>
                <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">${activity.description}</p>
                <span style="color: #94a3b8; font-size: 12px;">${activity.time}</span>
            </div>
            <div style="background: ${getStatusBackground(activity.status)}; color: ${getStatusColor(activity.status)}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                ${activity.status.toUpperCase()}
            </div>
        </div>
    `).join('');
}

// Helper functions for status styling
function getStatusGradient(status) {
    const gradients = {
        critical: 'linear-gradient(135deg, #ef4444, #dc2626)',
        high: 'linear-gradient(135deg, #f59e0b, #d97706)',
        verified: 'linear-gradient(135deg, #10b981, #059669)',
        monitoring: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    };
    return gradients[status] || 'linear-gradient(135deg, #64748b, #475569)';
}

function getStatusBackground(status) {
    const backgrounds = {
        critical: 'rgba(239, 68, 68, 0.1)',
        high: 'rgba(245, 158, 11, 0.1)',
        verified: 'rgba(16, 185, 129, 0.1)',
        monitoring: 'rgba(59, 130, 246, 0.1)'
    };
    return backgrounds[status] || 'rgba(100, 116, 139, 0.1)';
}

function getStatusColor(status) {
    const colors = {
        critical: '#dc2626',
        high: '#d97706',
        verified: '#059669',
        monitoring: '#1d4ed8'
    };
    return colors[status] || '#475569';
}

// Update connection status
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        const statusConfig = {
            connected: { text: '🟢 LIVE', bg: '#10b981' },
            demo: { text: '🟡 DEMO', bg: '#f59e0b' },
            error: { text: '🔴 ERROR', bg: '#ef4444' }
        };
        
        const config = statusConfig[status] || statusConfig.demo;
        statusElement.textContent = config.text;
        statusElement.style.background = config.bg;
    }
}

// Refresh activity function
function refreshActivity() {
    const button = event.target;
    button.textContent = '⏳ Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        loadActivityData();
        button.textContent = '🔄 Refresh';
        button.disabled = false;
        showNotification('Activity refreshed', 'success');
    }, 1000);
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
        font-family: 'Inter', sans-serif;
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
    }, 3000);
}

// Replace existing dashboard function
function replaceExistingDashboard() {
    // Find the existing dashboard element
    const existingDashboard = document.querySelector('[data-component-name="<div />"]');
    if (existingDashboard && existingDashboard.querySelector('h2')) {
        const h2 = existingDashboard.querySelector('h2');
        if (h2 && h2.textContent.includes('User Dashboard')) {
            console.log('✅ Found existing dashboard, replacing...');
            existingDashboard.outerHTML = createEnhancedDashboardWithErrorHandling();
            
            // Initialize the enhanced dashboard
            setTimeout(() => {
                loadActivityData();
                updateLastUpdateTime();
                
                // Update time every minute
                setInterval(updateLastUpdateTime, 60000);
            }, 500);
            
            showNotification('Dashboard enhanced successfully!', 'success');
            return true;
        }
    }
    return false;
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);

// Auto-replace when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Dashboard Fix loaded, checking for existing dashboard...');
    
    // Try to replace immediately
    if (!replaceExistingDashboard()) {
        // If not found, try again after a delay
        setTimeout(() => {
            if (!replaceExistingDashboard()) {
                console.log('ℹ️ No existing dashboard found to replace');
            }
        }, 2000);
    }
});

// Export functions for manual use
window.replaceExistingDashboard = replaceExistingDashboard;
window.createEnhancedDashboardWithErrorHandling = createEnhancedDashboardWithErrorHandling;
window.loadActivityData = loadActivityData;

console.log('✅ Dashboard Fix ready!');
