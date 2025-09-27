// Hazard Map Interface JavaScript
let hazardMap = null;
let hazardMarkers = [];
let refreshInterval = null;

// Mock hazard data for demonstration
const mockHazardData = [
    {
        id: 1,
        type: 'high_waves',
        severity: 'high',
        lat: 40.7589,
        lng: -73.9851,
        location: 'New York Harbor',
        description: 'Dangerous wave conditions - 4.5m waves detected',
        timestamp: new Date(),
        icon: '🌊'
    },
    {
        id: 2,
        type: 'strong_current',
        severity: 'medium',
        lat: 34.0522,
        lng: -118.2437,
        location: 'Santa Monica Bay',
        description: 'Strong rip currents - Exercise caution',
        timestamp: new Date(),
        icon: '🌀'
    },
    {
        id: 3,
        type: 'pollution',
        severity: 'high',
        lat: 25.7617,
        lng: -80.1918,
        location: 'Miami Beach',
        description: 'Oil spill detected - Beach closure in effect',
        timestamp: new Date(),
        icon: '🛢️'
    },
    {
        id: 4,
        type: 'marine_life',
        severity: 'medium',
        lat: 37.7749,
        lng: -122.4194,
        location: 'San Francisco Bay',
        description: 'Shark sighting reported - Increased vigilance advised',
        timestamp: new Date(),
        icon: '🦈'
    },
    {
        id: 5,
        type: 'weather',
        severity: 'high',
        lat: 29.7604,
        lng: -95.3698,
        location: 'Galveston Bay',
        description: 'Severe storm warning - Seek immediate shelter',
        timestamp: new Date(),
        icon: '⛈️'
    },
    {
        id: 6,
        type: 'debris',
        severity: 'low',
        lat: 32.7767,
        lng: -96.7970,
        location: 'Lake Ray Hubbard',
        description: 'Floating debris reported - Navigate with caution',
        timestamp: new Date(),
        icon: '🗑️'
    },
    {
        id: 7,
        type: 'high_waves',
        severity: 'medium',
        lat: 47.6062,
        lng: -122.3321,
        location: 'Puget Sound',
        description: 'Moderate wave activity - Small craft advisory',
        timestamp: new Date(),
        icon: '🌊'
    },
    {
        id: 8,
        type: 'weather',
        severity: 'low',
        lat: 41.8781,
        lng: -87.6298,
        location: 'Lake Michigan',
        description: 'Light fog conditions - Reduced visibility',
        timestamp: new Date(),
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 AquaSutra Enhanced Hazard Map Loading...');
    const hazardMap = new HazardMap();
    console.log('✅ Enhanced Hazard Map Ready!');
});
}

// Add custom map controls
function addMapControls() {
    // Add fullscreen control
    const fullscreenControl = L.control({position: 'topright'});
    fullscreenControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.style.backgroundColor = 'white';
        div.style.backgroundImage = 'none';
        div.style.width = '30px';
        div.style.height = '30px';
        div.style.cursor = 'pointer';
        div.innerHTML = '⛶';
        div.style.fontSize = '18px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.title = 'Toggle Fullscreen';
        
        div.onclick = function() {
            toggleFullscreen();
        };
        
        return div;
    };
    fullscreenControl.addTo(hazardMap);
    
    // Add location control
    const locationControl = L.control({position: 'topright'});
    locationControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.style.backgroundColor = 'white';
        div.style.backgroundImage = 'none';
        div.style.width = '30px';
        div.style.height = '30px';
        div.style.cursor = 'pointer';
        div.innerHTML = '📍';
        div.style.fontSize = '16px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.title = 'Find My Location';
        
        div.onclick = function() {
            findUserLocation();
        };
        
        return div;
    };
    locationControl.addTo(hazardMap);
}

// Add hazard markers to the map
function addHazardMarkers() {
    // Clear existing markers
    hazardMarkers.forEach(marker => hazardMap.removeLayer(marker));
    hazardMarkers = [];
    
    mockHazardData.forEach(hazard => {
        const color = getSeverityColor(hazard.severity);
        const radius = getSeverityRadius(hazard.severity);
        
        // Create custom marker
        const marker = L.circleMarker([hazard.lat, hazard.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.8,
            radius: radius,
            weight: 3,
            interactive: true,
            bubblingMouseEvents: false
        }).addTo(hazardMap);
        
        // Add popup with hazard details
        const popupContent = createPopupContent(hazard);
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });
        
        // Add hover effects
        marker.on('mouseover', function() {
            this.setStyle({
                fillOpacity: 1,
                weight: 4
            });
        });
        
        marker.on('mouseout', function() {
            this.setStyle({
                fillOpacity: 0.8,
                weight: 3
            });
        });
        
        // Ensure click functionality
        marker.on('click', function(e) {
            e.originalEvent.stopPropagation();
            this.openPopup();
        });
        
        hazardMarkers.push(marker);
        
        // Add pulsing animation for high severity hazards (after a delay to ensure element exists)
        if (hazard.severity === 'high') {
            setTimeout(() => {
                const element = marker.getElement();
                if (element) {
                    element.style.animation = 'pulse 2s infinite';
                    element.style.pointerEvents = 'auto'; // Ensure clickability
                    element.style.cursor = 'pointer';
                }
            }, 100);
        }
    });
}

// Create popup content for hazards
function createPopupContent(hazard) {
    const color = getSeverityColor(hazard.severity);
    const severityText = hazard.severity.toUpperCase();
    const typeText = formatHazardType(hazard.type);
    
    return `
        <div style="min-width: 250px; font-family: 'Inter', sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 24px;">${hazard.icon}</span>
                <h3 style="margin: 0; color: ${color}; font-size: 18px; font-weight: 600;">${hazard.location}</h3>
            </div>
            
            <div style="background: ${color}15; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">Type:</span>
                    <span style="color: #6B7280;">${typeText}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; color: #374151;">Severity:</span>
                    <span style="color: ${color}; font-weight: 700; font-size: 14px;">${severityText}</span>
                </div>
            </div>
            
            <p style="margin: 0 0 12px 0; color: #374151; line-height: 1.4;">${hazard.description}</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #E5E7EB;">
                <span style="font-size: 12px; color: #9CA3AF;">Last updated: ${hazard.timestamp.toLocaleTimeString()}</span>
                <button onclick="focusOnHazard(${hazard.lat}, ${hazard.lng})" style="padding: 4px 8px; background: ${color}; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Focus</button>
            </div>
        </div>
    `;
}

// Populate active alerts in sidebar
function populateActiveAlerts() {
    const alertsContainer = document.getElementById('active-alerts');
    if (!alertsContainer) return;
    
    // Sort hazards by severity (high first)
    const sortedHazards = [...mockHazardData].sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
    });
    
    alertsContainer.innerHTML = sortedHazards.map(hazard => `
        <div class="alert-item ${hazard.severity}" onclick="focusOnHazard(${hazard.lat}, ${hazard.lng})">
            <div class="alert-title">${hazard.icon} ${hazard.location}</div>
            <div class="alert-description">${hazard.description}</div>
            <div class="alert-time">Updated: ${hazard.timestamp.toLocaleTimeString()}</div>
        </div>
    `).join('');
}

// Update statistics
function updateStatistics() {
    const totalHazards = mockHazardData.length;
    const highRiskCount = mockHazardData.filter(h => h.severity === 'high').length;
    
    document.getElementById('total-hazards').textContent = totalHazards;
    document.getElementById('high-risk-count').textContent = highRiskCount;
}

// Focus on specific hazard
function focusOnHazard(lat, lng) {
    if (hazardMap) {
        hazardMap.setView([lat, lng], 10);
        
        // Find and open the popup for this location
        hazardMarkers.forEach(marker => {
            const markerLatLng = marker.getLatLng();
            if (Math.abs(markerLatLng.lat - lat) < 0.001 && Math.abs(markerLatLng.lng - lng) < 0.001) {
                marker.openPopup();
            }
        });
    }
}

// Refresh hazard data
function refreshHazardData() {
    showLoading(true);
    showNotification('🔄 Refreshing hazard data...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        // Simulate real-time data updates
        mockHazardData.forEach(hazard => {
            hazard.timestamp = new Date();
            // Randomly change some hazard severities for demo
            if (Math.random() < 0.15) {
                const severities = ['low', 'medium', 'high'];
                hazard.severity = severities[Math.floor(Math.random() * severities.length)];
            }
        });
        
        // Update map and sidebar
        addHazardMarkers();
        populateActiveAlerts();
        updateStatistics();
        
        showLoading(false);
        showNotification('✅ Hazard data updated successfully', 'success');
    }, 1500);
}

// Start auto-refresh
function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        refreshHazardData();
    }, 60000); // Refresh every minute
}

// Stop auto-refresh
function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Show/hide loading overlay
function showLoading(show) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Find user location
function findUserLocation() {
    if (navigator.geolocation) {
        showNotification('📍 Finding your location...', 'info');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                hazardMap.setView([lat, lng], 12);
                
                // Add user location marker
                L.marker([lat, lng])
                    .addTo(hazardMap)
                    .bindPopup('📍 Your Location')
                    .openPopup();
                
                showNotification('✅ Location found!', 'success');
            },
            (error) => {
                showNotification('❌ Unable to find your location', 'error');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        showNotification('❌ Geolocation not supported', 'error');
    }
}

// Show hazard report modal - now redirects to dedicated interface
function showHazardReportModal() {
    window.location.href = 'report-hazard.html';
}

// Create hazard report modal
function createHazardReportModal() {
    const overlay = document.createElement('div');
    overlay.id = 'hazard-report-modal';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 0;
        max-width: 500px;
        width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: modalSlideIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 24px; border-radius: 16px 16px 0 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 700;">🚨 Report Ocean Hazard</h2>
                <button onclick="closeHazardReportModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
            </div>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">Help keep our coastal communities safe by reporting ocean hazards</p>
        </div>
        
        <form id="hazard-report-form" style="padding: 24px;">
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Reporter Information</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <input type="text" name="reporter_name" placeholder="Your Name" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif;">
                    <input type="email" name="reporter_email" placeholder="Email Address" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif;">
                </div>
                <input type="tel" name="reporter_phone" placeholder="Phone Number (Optional)" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Hazard Details</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <select name="hazard_type" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif;">
                        <option value="">Select Hazard Type</option>
                        <option value="high_waves">🌊 High Waves</option>
                        <option value="strong_current">🌀 Strong Current/Rip Tide</option>
                        <option value="debris">🗑️ Debris/Obstacles</option>
                        <option value="pollution">🛢️ Pollution/Oil Spill</option>
                        <option value="marine_life">🦈 Dangerous Marine Life</option>
                        <option value="weather">⛈️ Severe Weather</option>
                        <option value="infrastructure">🏗️ Infrastructure Damage</option>
                        <option value="other">❓ Other</option>
                    </select>
                    <select name="severity" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif;">
                        <option value="">Severity Level</option>
                        <option value="low">🟢 Low - Monitor Conditions</option>
                        <option value="medium">🟡 Medium - Exercise Caution</option>
                        <option value="high">🔴 High - Immediate Danger</option>
                    </select>
                </div>
                <input type="text" name="location" placeholder="Specific Location (e.g., Miami Beach, Pier 39)" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; margin-bottom: 12px; font-family: 'Inter', sans-serif;">
                <textarea name="description" placeholder="Detailed description of the hazard..." required rows="4" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif; resize: vertical;"></textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Additional Information</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <input type="datetime-local" name="incident_time" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif;">
                    <select name="weather_conditions" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif;">
                        <option value="">Weather Conditions</option>
                        <option value="clear">☀️ Clear</option>
                        <option value="cloudy">☁️ Cloudy</option>
                        <option value="rainy">🌧️ Rainy</option>
                        <option value="stormy">⛈️ Stormy</option>
                        <option value="foggy">🌫️ Foggy</option>
                    </select>
                </div>
            </div>
            
            <div style="background: #F8FAFC; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3B82F6;">
                <p style="margin: 0; font-size: 14px; color: #374151;">
                    <strong>📍 Emergency?</strong> For immediate life-threatening situations, call emergency services (911) first, then submit this report.
                </p>
            </div>
            
            <div style="display: flex; gap: 12px;">
                <button type="button" onclick="closeHazardReportModal()" style="flex: 1; padding: 14px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Inter', sans-serif;">Cancel</button>
                <button type="submit" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Inter', sans-serif;">Submit Report</button>
            </div>
        </form>
    `;
    
    overlay.appendChild(modal);
    
    // Add form submission handler
    const form = modal.querySelector('#hazard-report-form');
    form.addEventListener('submit', handleHazardReportSubmission);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeHazardReportModal();
        }
    });
    
    return overlay;
}

// Close hazard report modal
function closeHazardReportModal() {
    const modal = document.getElementById('hazard-report-modal');
    if (modal) {
        modal.style.animation = 'modalSlideOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Handle hazard report form submission
async function handleHazardReportSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Add timestamp and ID
    data.id = Date.now();
    data.timestamp = new Date().toISOString();
    data.status = 'pending';
    
    showNotification('📤 Submitting hazard report...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // Add to mock data for demonstration
        const newHazard = {
            id: data.id,
            type: data.hazard_type,
            severity: data.severity,
            lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Random location near NYC for demo
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
            location: data.location,
            description: data.description,
            timestamp: new Date(),
            icon: getHazardIcon(data.hazard_type),
            reporter: data.reporter_name
        };
        
        mockHazardData.push(newHazard);
        
        // Update map and sidebar
        addHazardMarkers();
        populateActiveAlerts();
        updateStatistics();
        
        showNotification('✅ Hazard report submitted successfully! Thank you for helping keep our waters safe.', 'success');
        closeHazardReportModal();
        
        // Focus on the new hazard
        setTimeout(() => {
            focusOnHazard(newHazard.lat, newHazard.lng);
        }, 500);
        
    }, 2000);
}

// Get hazard icon based on type
function getHazardIcon(type) {
    const icons = {
        'high_waves': '🌊',
        'strong_current': '🌀',
        'debris': '🗑️',
        'pollution': '🛢️',
        'marine_life': '🦈',
        'weather': '⛈️',
        'infrastructure': '🏗️',
        'other': '⚠️'
    };
    return icons[type] || '⚠️';
}

// Utility functions
function getSeverityColor(severity) {
    switch (severity) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
        default: return '#6B7280';
    }
}

function getSeverityRadius(severity) {
    switch (severity) {
        case 'high': return 15;
        case 'medium': return 10;
        case 'low': return 7;
        default: return 8;
    }
}

function formatHazardType(type) {
    const types = {
        'high_waves': 'High Waves',
        'strong_current': 'Strong Current',
        'pollution': 'Pollution',
        'marine_life': 'Marine Life',
        'weather': 'Severe Weather',
        'debris': 'Debris'
    };
    return types[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Simple notification system
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
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
            notification.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes modalSlideIn {
        from {
            transform: scale(0.9) translateY(-20px);
            opacity: 0;
        }
        to {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes modalSlideOut {
        from {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        to {
            transform: scale(0.9) translateY(-20px);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.1);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.8;
        }
    }
    
    .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    /* Ensure markers remain clickable during animation */
    .leaflet-marker-icon {
        pointer-events: auto !important;
        cursor: pointer !important;
    }
    
    .leaflet-clickable {
        pointer-events: auto !important;
        cursor: pointer !important;
    }
`;
document.head.appendChild(style);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});
