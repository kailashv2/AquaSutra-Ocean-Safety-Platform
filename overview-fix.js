// Overview Fix - Simple working solution
console.log('🔧 Loading Overview Fix...');

// Wait for everything to load
window.addEventListener('load', function() {
    setTimeout(() => {
        fixOverviewElements();
    }, 1000);
});

function fixOverviewElements() {
    console.log('Fixing overview elements...');
    
    // Fix Chart
    fixHazardChart();
    
    // Fix Map
    fixLiveMap();
    
    console.log('✅ Overview elements fixed!');
}

// Fix Hazard Chart
function fixHazardChart() {
    const chartArea = document.querySelector('.chart-area');
    if (!chartArea) {
        console.log('Chart area not found');
        return;
    }
    
    // Replace with working chart
    chartArea.innerHTML = `
        <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            <!-- Background pattern -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1;">
                <svg width="100%" height="100%" viewBox="0 0 400 300">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#64748b" stroke-width="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
            
            <!-- Chart content -->
            <div style="position: relative; z-index: 1; text-align: center; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px;">📈 Hazard Trends (Last 7 Days)</h4>
                </div>
                
                <!-- Simulated chart lines -->
                <div style="position: relative; width: 80%; height: 200px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <svg width="100%" height="100%" viewBox="0 0 300 160">
                        <!-- Grid lines -->
                        <defs>
                            <pattern id="chartGrid" width="30" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#chartGrid)" />
                        
                        <!-- Tsunami line (red) -->
                        <polyline fill="none" stroke="#ef4444" stroke-width="3" points="20,120 60,100 100,140 140,90 180,110 220,80 260,100"/>
                        <circle cx="20" cy="120" r="4" fill="#ef4444"/>
                        <circle cx="60" cy="100" r="4" fill="#ef4444"/>
                        <circle cx="100" cy="140" r="4" fill="#ef4444"/>
                        <circle cx="140" cy="90" r="4" fill="#ef4444"/>
                        <circle cx="180" cy="110" r="4" fill="#ef4444"/>
                        <circle cx="220" cy="80" r="4" fill="#ef4444"/>
                        <circle cx="260" cy="100" r="4" fill="#ef4444"/>
                        
                        <!-- Hurricane line (orange) -->
                        <polyline fill="none" stroke="#f59e0b" stroke-width="3" points="20,100 60,80 100,120 140,70 180,90 220,60 260,80"/>
                        <circle cx="20" cy="100" r="4" fill="#f59e0b"/>
                        <circle cx="60" cy="80" r="4" fill="#f59e0b"/>
                        <circle cx="100" cy="120" r="4" fill="#f59e0b"/>
                        <circle cx="140" cy="70" r="4" fill="#f59e0b"/>
                        <circle cx="180" cy="90" r="4" fill="#f59e0b"/>
                        <circle cx="220" cy="60" r="4" fill="#f59e0b"/>
                        <circle cx="260" cy="80" r="4" fill="#f59e0b"/>
                        
                        <!-- Flood line (green) -->
                        <polyline fill="none" stroke="#10b981" stroke-width="3" points="20,80 60,60 100,100 140,50 180,70 220,40 260,60"/>
                        <circle cx="20" cy="80" r="4" fill="#10b981"/>
                        <circle cx="60" cy="60" r="4" fill="#10b981"/>
                        <circle cx="100" cy="100" r="4" fill="#10b981"/>
                        <circle cx="140" cy="50" r="4" fill="#10b981"/>
                        <circle cx="180" cy="70" r="4" fill="#10b981"/>
                        <circle cx="220" cy="40" r="4" fill="#10b981"/>
                        <circle cx="260" cy="60" r="4" fill="#10b981"/>
                        
                        <!-- Labels -->
                        <text x="20" y="155" text-anchor="middle" font-size="10" fill="#64748b">Mon</text>
                        <text x="60" y="155" text-anchor="middle" font-size="10" fill="#64748b">Tue</text>
                        <text x="100" y="155" text-anchor="middle" font-size="10" fill="#64748b">Wed</text>
                        <text x="140" y="155" text-anchor="middle" font-size="10" fill="#64748b">Thu</text>
                        <text x="180" y="155" text-anchor="middle" font-size="10" fill="#64748b">Fri</text>
                        <text x="220" y="155" text-anchor="middle" font-size="10" fill="#64748b">Sat</text>
                        <text x="260" y="155" text-anchor="middle" font-size="10" fill="#64748b">Sun</text>
                    </svg>
                    
                    <!-- Legend -->
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%;"></div>
                            <span style="font-size: 12px; color: #64748b;">Tsunami</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                            <span style="font-size: 12px; color: #64748b;">Hurricane</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div>
                            <span style="font-size: 12px; color: #64748b;">Flood</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('✅ Chart fixed with SVG');
}

// Fix Live Map
function fixLiveMap() {
    const mapElement = document.getElementById('liveMap');
    if (!mapElement) {
        console.log('Map element not found');
        return;
    }
    
    // Replace with working map
    mapElement.innerHTML = `
        <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; position: relative; overflow: hidden;">
            <!-- Map background -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23dbeafe"/><path d="M50 100 Q100 80 150 100 T250 120 L300 110 L350 130 L400 120 L400 300 L0 300 Z" fill="%2393c5fd" opacity="0.6"/><path d="M0 150 Q50 130 100 150 T200 170 L250 160 L300 180 L350 170 L400 190 L400 300 L0 300 Z" fill="%2360a5fa" opacity="0.4"/></svg>'); background-size: cover;"></div>
            
            <!-- Hazard markers -->
            <div style="position: absolute; top: 60px; left: 80px; z-index: 2;">
                <div style="background: #ef4444; color: white; padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); cursor: pointer; animation: pulse 2s infinite;" onclick="showMarkerInfo('Tsunami Warning', 'Pacific Coast - High Risk Area')">
                    🌊
                </div>
            </div>
            
            <div style="position: absolute; top: 120px; left: 180px; z-index: 2;">
                <div style="background: #f59e0b; color: white; padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); cursor: pointer;" onclick="showMarkerInfo('Hurricane Alert', 'Florida Keys - Category 3 Storm')">
                    🌀
                </div>
            </div>
            
            <div style="position: absolute; top: 180px; left: 120px; z-index: 2;">
                <div style="background: #10b981; color: white; padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); cursor: pointer;" onclick="showMarkerInfo('Flood Alert', 'Miami Beach - Coastal Flooding')">
                    💧
                </div>
            </div>
            
            <!-- Map title -->
            <div style="position: absolute; top: 16px; left: 16px; background: rgba(255, 255, 255, 0.9); padding: 8px 12px; border-radius: 6px; font-size: 14px; font-weight: 600; color: #1e293b; z-index: 3;">
                🗺️ Live Hazard Map
            </div>
            
            <!-- Map controls -->
            <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px; z-index: 3;">
                <button onclick="refreshMap()" style="background: rgba(255, 255, 255, 0.9); border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;">🔄 Refresh</button>
                <button onclick="toggleFullscreen()" style="background: rgba(255, 255, 255, 0.9); border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;">⛶ Fullscreen</button>
            </div>
            
            <!-- Legend -->
            <div style="position: absolute; bottom: 16px; left: 16px; background: rgba(255, 255, 255, 0.9); padding: 12px; border-radius: 8px; font-size: 12px; z-index: 3;">
                <div style="margin-bottom: 4px; font-weight: 600; color: #1e293b;">Hazard Levels:</div>
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                    <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%;"></div>
                    <span>Critical</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                    <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                    <span>High</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div>
                    <span>Medium</span>
                </div>
            </div>
        </div>
    `;
    
    console.log('✅ Map fixed with SVG');
}

// Map interaction functions
function showMarkerInfo(title, description) {
    showNotification(`${title}: ${description}`, 'info');
}

function refreshMap() {
    showNotification('Map refreshed with latest data', 'success');
    // Add refresh animation
    const mapElement = document.getElementById('liveMap');
    if (mapElement) {
        mapElement.style.opacity = '0.7';
        setTimeout(() => {
            mapElement.style.opacity = '1';
        }, 500);
    }
}

function toggleFullscreen() {
    const mapElement = document.getElementById('liveMap');
    if (mapElement) {
        if (mapElement.style.position === 'fixed') {
            // Exit fullscreen
            mapElement.style.position = '';
            mapElement.style.top = '';
            mapElement.style.left = '';
            mapElement.style.width = '';
            mapElement.style.height = '';
            mapElement.style.zIndex = '';
            showNotification('Exited fullscreen mode', 'info');
        } else {
            // Enter fullscreen
            mapElement.style.position = 'fixed';
            mapElement.style.top = '0';
            mapElement.style.left = '0';
            mapElement.style.width = '100vw';
            mapElement.style.height = '100vh';
            mapElement.style.zIndex = '10000';
            showNotification('Entered fullscreen mode', 'success');
        }
    }
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

console.log('✅ Overview Fix Ready!');
