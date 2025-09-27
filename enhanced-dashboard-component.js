// Enhanced Dashboard Component
function createEnhancedDashboard() {
    return `
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 0; max-width: 1200px; width: 95%; max-height: 90vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
            
            <!-- Dashboard Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 24px 32px; border-radius: 16px 16px 0 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">🌊 Ocean Safety Dashboard</h2>
                        <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 16px;">Real-time monitoring and analytics platform</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 20px; font-size: 14px;">
                            🟢 Live Status
                        </div>
                        <div style="font-size: 14px; color: #cbd5e1;">
                            Last updated: ${new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div style="padding: 32px; background: white; overflow-y: auto; max-height: calc(90vh - 120px);">
                
                <!-- Enhanced Stats Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
                    
                    <!-- Active Alerts Card -->
                    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px;">🚨</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Critical Alerts</div>
                                <div style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">5</div>
                                <div style="font-size: 12px; opacity: 0.8;">+2 in last hour</div>
                            </div>
                        </div>
                    </div>

                    <!-- Ocean Monitoring Card -->
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px;">🌊</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Ocean Alerts</div>
                                <div style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">12</div>
                                <div style="font-size: 12px; opacity: 0.8;">3 regions monitored</div>
                            </div>
                        </div>
                    </div>

                    <!-- Verified Reports Card -->
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px;">✅</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Verified Reports</div>
                                <div style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">847</div>
                                <div style="font-size: 12px; opacity: 0.8;">+15% this week</div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Users Card -->
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                            <div style="font-size: 48px;">👥</div>
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Active Users</div>
                                <div style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">1,234</div>
                                <div style="font-size: 12px; opacity: 0.8;">Online now</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Panel -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1e293b;">⚡ Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        
                        <button onclick="window.open('report-hazard.html', '_blank')" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                            📝 Report New Hazard
                        </button>
                        
                        <button onclick="window.open('hazard-map.html', '_blank')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)'">
                            🗺️ View Live Map
                        </button>
                        
                        <button onclick="window.open('analytics.html', '_blank')" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(245, 158, 11, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(245, 158, 11, 0.3)'">
                            📊 View Analytics
                        </button>
                        
                        <button onclick="window.open('emergency.html', '_blank')" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 16px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.3)'">
                            🚨 Emergency Hub
                        </button>
                    </div>
                </div>

                <!-- Enhanced Recent Activity -->
                <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #1e293b;">📈 Recent Activity</h4>
                            <button style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">View All</button>
                        </div>
                    </div>
                    
                    <div style="padding: 24px;">
                        <!-- Activity Items -->
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🌊</div>
                            <div style="flex: 1;">
                                <h5 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b;">Tsunami Warning Issued</h5>
                                <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">Pacific Coast - Magnitude 7.2 earthquake detected offshore</p>
                                <span style="color: #94a3b8; font-size: 12px;">2 minutes ago</span>
                            </div>
                            <div style="background: rgba(239, 68, 68, 0.1); color: #dc2626; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">CRITICAL</div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">⛈️</div>
                            <div style="flex: 1;">
                                <h5 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b;">Hurricane Alert Updated</h5>
                                <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">Category 3 hurricane approaching Florida Keys - Wind speeds 120mph</p>
                                <span style="color: #94a3b8; font-size: 12px;">15 minutes ago</span>
                            </div>
                            <div style="background: rgba(245, 158, 11, 0.1); color: #d97706; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">HIGH</div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">📝</div>
                            <div style="flex: 1;">
                                <h5 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b;">New Citizen Report Verified</h5>
                                <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">Unusual wave patterns reported in Miami Beach - Confirmed by officials</p>
                                <span style="color: #94a3b8; font-size: 12px;">1 hour ago</span>
                            </div>
                            <div style="background: rgba(16, 185, 129, 0.1); color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">VERIFIED</div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0;">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">📱</div>
                            <div style="flex: 1;">
                                <h5 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b;">Social Media Alert Detected</h5>
                                <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">Multiple reports of coastal flooding on Twitter - Analyzing sentiment</p>
                                <span style="color: #94a3b8; font-size: 12px;">2 hours ago</span>
                            </div>
                            <div style="background: rgba(59, 130, 246, 0.1); color: #1d4ed8; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">MONITORING</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to replace the existing dashboard
function enhanceExistingDashboard() {
    // Find the existing dashboard element
    const existingDashboard = document.querySelector('[data-component-name="<div />"]');
    if (existingDashboard) {
        existingDashboard.outerHTML = createEnhancedDashboard();
    }
}

// Auto-enhance when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the original dashboard to load
    setTimeout(enhanceExistingDashboard, 1000);
});

// Export for manual use
window.enhanceExistingDashboard = enhanceExistingDashboard;
window.createEnhancedDashboard = createEnhancedDashboard;
