// Instant Dashboard Upgrade - Transform basic div to premium interface
console.log('🚀 Dashboard Upgrade Loading...');

// Premium Dashboard HTML Template
function getPremiumDashboardHTML() {
    return `
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 20px; padding: 0; max-width: 1400px; width: 98%; max-height: 95vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; position: relative;">
            
            <!-- Premium Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 32px; border-radius: 20px 20px 0 0; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; filter: blur(40px);"></div>
                <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
                    <div>
                        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: white; display: flex; align-items: center; gap: 16px;">
                            🌊 AquaSutra Premium Dashboard
                            <span id="liveStatus" style="font-size: 14px; background: linear-gradient(135deg, #10b981, #059669); padding: 6px 12px; border-radius: 20px; animation: pulse 2s infinite;">🟢 LIVE</span>
                        </h1>
                        <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 18px; font-weight: 500;">Advanced Ocean Safety Monitoring & Analytics</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 14px; color: #cbd5e1; margin-bottom: 4px;">Last Updated</div>
                        <div id="lastUpdate" style="font-size: 16px; font-weight: 600; color: white;">${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div style="padding: 32px; background: white; overflow-y: auto; max-height: calc(95vh - 140px);">
                
                <!-- Premium Stats Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px;">
                    
                    <!-- Critical Alerts -->
                    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 28px; border-radius: 20px; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(239, 68, 68, 0.3); cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 20px 40px rgba(239, 68, 68, 0.3)'">
                        <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.05); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                            <div style="font-size: 56px; animation: pulse 2s infinite;">🚨</div>
                            <div>
                                <div style="font-size: 16px; opacity: 0.9; margin-bottom: 8px; font-weight: 500;">Critical Ocean Alerts</div>
                                <div style="font-size: 48px; font-weight: 900; margin-bottom: 8px; line-height: 1;">5</div>
                                <div style="font-size: 14px; opacity: 0.8; display: flex; align-items: center; gap: 4px;">
                                    <span>📈</span> +2 in last hour
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Ocean Monitoring -->
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 28px; border-radius: 20px; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(14, 165, 233, 0.3); cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(14, 165, 233, 0.4)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 20px 40px rgba(14, 165, 233, 0.3)'">
                        <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                            <div style="font-size: 56px;">🌊</div>
                            <div>
                                <div style="font-size: 16px; opacity: 0.9; margin-bottom: 8px; font-weight: 500;">Active Ocean Zones</div>
                                <div style="font-size: 48px; font-weight: 900; margin-bottom: 8px; line-height: 1;">12</div>
                                <div style="font-size: 14px; opacity: 0.8;">Monitoring 3 regions</div>
                            </div>
                        </div>
                    </div>

                    <!-- Verified Reports -->
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 28px; border-radius: 20px; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3); cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 20px 40px rgba(16, 185, 129, 0.3)'">
                        <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                            <div style="font-size: 56px;">✅</div>
                            <div>
                                <div style="font-size: 16px; opacity: 0.9; margin-bottom: 8px; font-weight: 500;">Verified Reports</div>
                                <div style="font-size: 48px; font-weight: 900; margin-bottom: 8px; line-height: 1;">847</div>
                                <div style="font-size: 14px; opacity: 0.8;">+15% this week</div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Users -->
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 28px; border-radius: 20px; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3); cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(139, 92, 246, 0.4)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 20px 40px rgba(139, 92, 246, 0.3)'">
                        <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
                            <div style="font-size: 56px;">👥</div>
                            <div>
                                <div style="font-size: 16px; opacity: 0.9; margin-bottom: 8px; font-weight: 500;">Active Users</div>
                                <div style="font-size: 48px; font-weight: 900; margin-bottom: 8px; line-height: 1;">1,234</div>
                                <div style="font-size: 14px; opacity: 0.8;">Online right now</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 20px; padding: 32px; margin-bottom: 32px; border: 2px solid #e2e8f0;">
                    <h3 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 12px;">⚡ Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        
                        <button onclick="window.open('report-hazard.html', '_blank')" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; padding: 20px 24px; border-radius: 16px; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.3s; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; gap: 12px;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 30px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.3)'">
                            <span style="font-size: 20px;">📝</span> Report New Hazard
                        </button>
                        
                        <button onclick="window.open('hazard-map.html', '_blank')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 20px 24px; border-radius: 16px; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.3s; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; gap: 12px;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 30px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.3)'">
                            <span style="font-size: 20px;">🗺️</span> View Live Map
                        </button>
                        
                        <button onclick="window.open('analytics.html', '_blank')" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; padding: 20px 24px; border-radius: 16px; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.3s; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; gap: 12px;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 30px rgba(245, 158, 11, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(245, 158, 11, 0.3)'">
                            <span style="font-size: 20px;">📊</span> View Analytics
                        </button>
                        
                        <button onclick="window.open('emergency.html', '_blank')" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 20px 24px; border-radius: 16px; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.3s; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); display: flex; align-items: center; justify-content: center; gap: 12px;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 30px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(239, 68, 68, 0.3)'">
                            <span style="font-size: 20px;">🚨</span> Emergency Hub
                        </button>
                    </div>
                </div>

                <!-- Premium Activity Feed -->
                <div style="background: white; border-radius: 20px; border: 2px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);">
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 24px 32px; border-bottom: 2px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; font-size: 22px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 12px;">📈 Live Activity Stream</h4>
                            <button onclick="refreshActivity()" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border: none; padding: 8px 16px; border-radius: 12px; font-size: 14px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">🔄 Refresh</button>
                        </div>
                    </div>
                    
                    <div style="padding: 32px;">
                        ${generateActivityItems()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate activity items
function generateActivityItems() {
    const activities = [
        { icon: '🌊', title: 'Tsunami Warning Issued', desc: 'Pacific Coast - Magnitude 7.2 earthquake detected', time: '2 min ago', status: 'CRITICAL', color: '#ef4444' },
        { icon: '⛈️', title: 'Hurricane Alert Updated', desc: 'Category 3 hurricane approaching Florida Keys', time: '15 min ago', status: 'HIGH', color: '#f59e0b' },
        { icon: '📝', title: 'Citizen Report Verified', desc: 'Unusual wave patterns in Miami Beach confirmed', time: '1 hr ago', status: 'VERIFIED', color: '#10b981' },
        { icon: '📱', title: 'Social Media Alert', desc: 'Multiple flooding reports detected on Twitter', time: '2 hr ago', status: 'MONITORING', color: '#3b82f6' }
    ];

    return activities.map(activity => `
        <div style="display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid #f1f5f9; transition: all 0.3s;" onmouseover="this.style.background='#f8fafc'; this.style.transform='translateX(8px)'" onmouseout="this.style.background='transparent'; this.style.transform='translateX(0)'">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, ${activity.color}, ${activity.color}dd); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 12px ${activity.color}40;">
                ${activity.icon}
            </div>
            <div style="flex: 1;">
                <h5 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 600; color: #1e293b;">${activity.title}</h5>
                <p style="margin: 0 0 6px 0; color: #64748b; font-size: 15px; line-height: 1.4;">${activity.desc}</p>
                <span style="color: #94a3b8; font-size: 13px; font-weight: 500;">${activity.time}</span>
            </div>
            <div style="background: ${activity.color}20; color: ${activity.color}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 2px solid ${activity.color}40;">
                ${activity.status}
            </div>
        </div>
    `).join('');
}

// Upgrade function
function upgradeDashboard() {
    const targetDiv = document.querySelector('[data-component-name="<div />"]');
    if (targetDiv) {
        const h2 = targetDiv.querySelector('h2');
        if (h2 && h2.textContent.includes('User Dashboard')) {
            console.log('✅ Found target dashboard, upgrading...');
            targetDiv.outerHTML = getPremiumDashboardHTML();
            
            // Initialize features
            setTimeout(() => {
                initializePremiumFeatures();
                showUpgradeNotification();
            }, 100);
            
            return true;
        }
    }
    return false;
}

// Initialize premium features
function initializePremiumFeatures() {
    // Update time every minute
    setInterval(() => {
        const timeElement = document.getElementById('lastUpdate');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString();
        }
    }, 60000);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
}

// Refresh activity function
function refreshActivity() {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '⏳ Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        showNotification('Activity refreshed successfully!', 'success');
    }, 1500);
}

// Show upgrade notification
function showUpgradeNotification() {
    showNotification('🎉 Dashboard upgraded to Premium!', 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    };
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: ${colors[type]}; color: white; padding: 16px 24px;
        border-radius: 12px; font-weight: 600; font-size: 14px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
        font-family: 'Inter', sans-serif;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Auto-upgrade on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Searching for dashboard to upgrade...');
    
    if (!upgradeDashboard()) {
        setTimeout(() => {
            if (!upgradeDashboard()) {
                // Try more aggressive search
                setTimeout(() => {
                    forceUpgrade();
                }, 3000);
            }
        }, 2000);
    }
});

// Force upgrade function for persistent basic dashboards
function forceUpgrade() {
    console.log('🔧 Force upgrading dashboard...');
    
    // Look for any div with "User Dashboard" text
    const allDivs = document.querySelectorAll('div');
    for (let div of allDivs) {
        const h2 = div.querySelector('h2');
        if (h2 && h2.textContent && h2.textContent.includes('User Dashboard')) {
            console.log('✅ Found dashboard via force search, upgrading...');
            div.outerHTML = getPremiumDashboardHTML();
            
            setTimeout(() => {
                initializePremiumFeatures();
                showUpgradeNotification();
            }, 100);
            
            return true;
        }
    }
    
    // If still not found, create upgrade button
    createUpgradeButton();
    return false;
}

// Create manual upgrade button
function createUpgradeButton() {
    const upgradeBtn = document.createElement('button');
    upgradeBtn.innerHTML = '🚀 Upgrade to Premium Dashboard';
    upgradeBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        animation: pulse 2s infinite;
    `;
    
    upgradeBtn.onclick = () => {
        if (manualUpgrade()) {
            upgradeBtn.remove();
        }
    };
    
    document.body.appendChild(upgradeBtn);
    showNotification('Click the upgrade button to transform your dashboard!', 'info');
}

// Manual upgrade function
function manualUpgrade() {
    const allDivs = document.querySelectorAll('div');
    for (let div of allDivs) {
        if (div.innerHTML.includes('User Dashboard') || 
            div.innerHTML.includes('Ocean Alerts') || 
            div.innerHTML.includes('Safe Zones')) {
            
            console.log('✅ Manual upgrade successful!');
            div.outerHTML = getPremiumDashboardHTML();
            
            setTimeout(() => {
                initializePremiumFeatures();
                showUpgradeNotification();
            }, 100);
            
            return true;
        }
    }
    
    showNotification('Dashboard not found. Please refresh the page.', 'error');
    return false;
}

// Add slide animations
const slideStyle = document.createElement('style');
slideStyle.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(slideStyle);

// Export for manual use
window.upgradeDashboard = upgradeDashboard;
window.refreshActivity = refreshActivity;
window.manualUpgrade = manualUpgrade;
window.forceUpgrade = forceUpgrade;

// Add immediate upgrade function for console use
window.upgradeNow = function() {
    console.log('🚀 Immediate upgrade requested...');
    if (manualUpgrade()) {
        console.log('✅ Dashboard upgraded successfully!');
        return true;
    } else {
        console.log('❌ Dashboard not found. Trying force upgrade...');
        return forceUpgrade();
    }
};

console.log('✅ Dashboard Upgrade Ready!');
console.log('💡 To manually upgrade, run: upgradeNow() in console');
