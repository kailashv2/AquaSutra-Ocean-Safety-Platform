// Emergency Response Center JavaScript
let emergencyData = {
    incidents: [
        {
            id: 'INC-001',
            title: 'Boat Distress Signal',
            description: 'Fishing vessel reporting engine failure 2 miles off Miami Beach',
            priority: 'critical',
            status: 'active',
            location: 'Miami Beach, FL',
            timestamp: new Date(Date.now() - 1800000),
            reporter: 'Coast Guard Station Miami'
        },
        {
            id: 'INC-002',
            title: 'Swimming Emergency',
            description: 'Multiple swimmers caught in rip current at Santa Monica Beach',
            priority: 'high',
            status: 'responding',
            location: 'Santa Monica, CA',
            timestamp: new Date(Date.now() - 900000),
            reporter: 'Santa Monica Lifeguard'
        }
    ],
    resources: [
        {
            id: 'RES-001',
            name: 'Coast Guard Cutter',
            icon: '🚢',
            location: 'Miami Station',
            status: 'deployed',
            crew: 8,
            eta: '15 min'
        },
        {
            id: 'RES-002',
            name: 'Rescue Helicopter',
            icon: '🚁',
            location: 'Santa Monica Base',
            status: 'available',
            crew: 4,
            eta: '8 min'
        },
        {
            id: 'RES-003',
            name: 'Marine Ambulance',
            icon: '🚑',
            location: 'Harbor Medical',
            status: 'available',
            crew: 3,
            eta: '12 min'
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚨 Emergency Response Center Loading...');
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    
    initializeEmergencyCenter();
    populateIncidents();
    populateResources();
    populateCommunications();
    startRealTimeUpdates();
    
    // Animate elements on load
    setTimeout(() => {
        animateEmergencyElements();
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✅ Emergency Response Center Ready!');
});

// Initialize emergency center
function initializeEmergencyCenter() {
    emergencyData.incidents = [...emergencyData.incidents];
    emergencyData.resources = [...emergencyData.resources];
    
    // Update status indicators
    updateSystemStatus();
}

// Update system status
function updateSystemStatus() {
    const activeIncidents = emergencyData.incidents.filter(i => i.status === 'active' || i.status === 'responding').length;
    const availableResources = emergencyData.resources.filter(r => r.status === 'available').length;
    
    console.log(`System Status: ${activeIncidents} active incidents, ${availableResources} available resources`);
}

// Animate emergency elements on load
function animateEmergencyElements() {
    const cards = document.querySelectorAll('.action-card, .incidents-panel, .resources-panel, .communication-panel');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 120);
    });
}

function populateIncidents() {
    const incidentsList = document.getElementById('incidents-list');
    if (!incidentsList) return;
    
    incidentsList.innerHTML = emergencyData.incidents.map(incident => `
        <div class="incident-item ${incident.priority}" onclick="showIncidentDetails('${incident.id}')">
            <div class="incident-header">
                <div class="incident-title">${incident.title}</div>
                <div class="incident-status ${incident.priority}">${incident.status.toUpperCase()}</div>
            </div>
            <div class="incident-desc">${incident.description}</div>
            <div class="incident-meta">
                <span>📍 ${incident.location}</span>
                <span>⏰ ${getTimeAgo(incident.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function populateResources() {
    const resourcesList = document.getElementById('resources-list');
    if (!resourcesList) return;
    
    resourcesList.innerHTML = emergencyData.resources.map(resource => `
        <div class="resource-item" onclick="showResourceDetails('${resource.id}')">
            <div class="resource-info">
                <span class="resource-icon">${resource.icon}</span>
                <div>
                    <div class="resource-name">${resource.name}</div>
                    <div class="resource-location">📍 ${resource.location} • Crew: ${resource.crew}</div>
                </div>
            </div>
            <div class="resource-status ${resource.status}">${resource.status.toUpperCase()}</div>
        </div>
    `).join('');
}

function populateCommunications() {
    const commChannels = document.getElementById('comm-channels');
    if (!commChannels) return;
    
    const channels = [
        { id: 'COMM-001', name: 'Coast Guard', icon: '🛡️', frequency: 'VHF 16', status: 'active', connected: true },
        { id: 'COMM-002', name: 'Marine Police', icon: '👮', frequency: '800 MHz', status: 'active', connected: true },
        { id: 'COMM-003', name: 'Fire Department', icon: '🚒', frequency: 'UHF 453', status: 'standby', connected: false },
        { id: 'COMM-004', name: 'Medical Services', icon: '🏥', frequency: 'Digital', status: 'active', connected: true }
    ];
    
    commChannels.innerHTML = channels.map(channel => `
        <div class="comm-channel ${channel.connected ? 'active' : ''}" onclick="toggleCommChannel('${channel.id}')">
            <div class="channel-icon">${channel.icon}</div>
            <div class="channel-name">${channel.name}</div>
            <div class="channel-status">${channel.frequency} • ${channel.status}</div>
        </div>
    `).join('');
}

// Essential Emergency Functions
function call911() {
    // Create emergency call modal
    const modal = createEmergencyModal('🚨 EMERGENCY CALL 911', `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 72px; margin-bottom: 20px; color: #EF4444;">🚨</div>
            <h2 style="color: #EF4444; margin-bottom: 16px; font-size: 24px;">CALLING 911</h2>
            <p style="font-size: 18px; margin-bottom: 24px; color: #1E293B;">
                <strong>For immediate life-threatening emergencies</strong>
            </p>
            
            <div style="background: #FEF2F2; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #EF4444;">
                <p style="margin: 0; color: #991B1B; font-weight: 600;">
                    ☎️ Dialing 911 Emergency Services<br>
                    📍 Location: Automatically shared<br>
                    🆔 Caller ID: AquaSutra Emergency System
                </p>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button onclick="confirmCall911()" style="padding: 16px 32px; background: #EF4444; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer;">
                    📞 CONFIRM CALL
                </button>
                <button onclick="closeModal()" style="padding: 16px 32px; background: #6B7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Cancel
                </button>
            </div>
        </div>
    `);
}

function reportEmergency() {
    const modal = createEmergencyModal('🚨 Emergency Report', `
        <div style="max-width: 500px; font-family: 'Inter', sans-serif;">
            <!-- Emergency Priority Banner -->
            <div style="background: linear-gradient(135deg, #EF4444, #DC2626); padding: 20px; border-radius: 16px; margin-bottom: 24px; text-align: center; color: #FFFFFF; box-shadow: 0 8px 25px -8px rgba(239, 68, 68, 0.3);">
                <div style="font-size: 48px; margin-bottom: 8px;">🚨</div>
                <p style="margin: 0; font-weight: 700; font-size: 16px; color: #FFFFFF; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">For life-threatening emergencies, call 911 first!</p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #FFFFFF; opacity: 1; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">This form is for non-critical marine emergencies</p>
            </div>

            <form id="emergency-form">
                <!-- Emergency Type Selection -->
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 8px; font-size: 14px;">
                        🚨 Emergency Type *
                    </label>
                    <select name="emergency_type" required style="width: 100%; padding: 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 16px; background: white; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <option value="">Select Emergency Type</option>
                        <option value="drowning">🌊 Person in Water/Drowning</option>
                        <option value="boat_distress">🚢 Boat in Distress</option>
                        <option value="medical">🏥 Medical Emergency</option>
                        <option value="missing_person">🔍 Missing Person</option>
                        <option value="fire">🔥 Fire/Explosion</option>
                        <option value="collision">💥 Collision/Accident</option>
                        <option value="environmental">🌿 Environmental Hazard</option>
                        <option value="other">⚠️ Other Emergency</option>
                    </select>
                </div>

                <!-- Location Section with Auto-detect -->
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 8px; font-size: 14px;">
                        📍 Location *
                    </label>
                    <div style="position: relative;">
                        <input type="text" id="location-input" name="location" placeholder="Enter location or use GPS..." required style="width: 100%; padding: 16px 50px 16px 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 16px; background: white; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <button type="button" id="get-location-btn" onclick="getCurrentLocation()" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: #3B82F6; color: white; border: none; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
                            <span id="location-icon">📍</span>
                        </button>
                    </div>
                    <div id="location-status" style="margin-top: 8px; font-size: 12px; color: #6B7280;"></div>
                    <div id="coordinates-display" style="margin-top: 4px; font-size: 11px; color: #9CA3AF; font-family: monospace;"></div>
                </div>

                <!-- People Involved -->
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 8px; font-size: 14px;">
                        👥 Number of People Involved *
                    </label>
                    <select name="people_count" required style="width: 100%; padding: 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 16px; background: white; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <option value="">Select number of people</option>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3-5">3-5 people</option>
                        <option value="6-10">6-10 people</option>
                        <option value="10+">More than 10 people</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>

                <!-- Description -->
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 8px; font-size: 14px;">
                        📝 Description *
                    </label>
                    <textarea name="description" placeholder="Describe what happened, current situation, and any immediate dangers..." required rows="4" style="width: 100%; padding: 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 16px; resize: vertical; background: white; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-family: 'Inter', sans-serif;"></textarea>
                </div>

                <!-- Contact Information -->
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 8px; font-size: 14px;">
                        📞 Your Phone Number *
                    </label>
                    <input type="tel" name="callback" placeholder="(555) 123-4567" required style="width: 100%; padding: 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 16px; background: white; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="margin-top: 6px; font-size: 12px; color: #6B7280;">Emergency responders will call this number for updates</div>
                </div>

                <!-- Additional Information -->
                <div style="margin-bottom: 32px;">
                    <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 8px; font-size: 14px;">
                        ℹ️ Additional Information (Optional)
                    </label>
                    <textarea name="additional_info" placeholder="Weather conditions, vessel details, medical conditions, etc..." rows="2" style="width: 100%; padding: 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 16px; resize: vertical; background: white; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-family: 'Inter', sans-serif;"></textarea>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 16px; margin-top: 32px;">
                    <button type="button" onclick="closeModal()" style="flex: 1; padding: 16px; background: #F3F4F6; color: #374151; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.2s ease;">
                        Cancel
                    </button>
                    <button type="submit" id="submit-emergency" style="flex: 2; padding: 16px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 16px; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                        🚨 SEND EMERGENCY ALERT
                    </button>
                </div>
            </form>
        </div>
    `);
    
    // Add form handling
    setupEmergencyForm();
}

function requestRescue() {
    const modal = createEmergencyModal('🚁 Request Rescue', `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🚁</div>
            <h3 style="color: #EF4444; margin-bottom: 16px;">Coast Guard & Rescue Dispatch</h3>
            
            <div style="display: grid; gap: 12px; margin-bottom: 24px;">
                <button onclick="dispatchCoastGuard()" style="padding: 16px; background: #3B82F6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    🛡️ Coast Guard Dispatch
                </button>
                <button onclick="dispatchHelicopter()" style="padding: 16px; background: #0EA5E9; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    🚁 Helicopter Rescue
                </button>
                <button onclick="dispatchMarineUnit()" style="padding: 16px; background: #10B981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    🚤 Marine Rescue Unit
                </button>
            </div>
            
            <button onclick="closeModal()" style="padding: 12px 24px; background: #6B7280; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
        </div>
    `);
}

function medicalEmergency() {
    const modal = createEmergencyModal('🏥 Medical Emergency', `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px; color: #EF4444;">🏥</div>
            <h3 style="color: #EF4444; margin-bottom: 16px;">Medical Emergency Response</h3>
            
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #EF4444;">
                <p style="margin: 0; color: #991B1B; font-weight: 600;">
                    🚨 For cardiac arrest, severe bleeding, or unconscious person - CALL 911 IMMEDIATELY
                </p>
            </div>
            
            <div style="display: grid; gap: 12px; margin-bottom: 24px;">
                <button onclick="call911()" style="padding: 16px; background: #EF4444; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 16px;">
                    🚨 CALL 911 NOW
                </button>
                <button onclick="requestAmbulance()" style="padding: 16px; background: #F59E0B; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    🚑 Request Marine Ambulance
                </button>
                <button onclick="requestMedic()" style="padding: 16px; background: #10B981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    👨‍⚕️ Request Paramedic Team
                </button>
            </div>
            
            <button onclick="closeModal()" style="padding: 12px 24px; background: #6B7280; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
        </div>
    `);
}

function showIncidentDetails(incidentId) {
    const incident = emergencyData.incidents.find(i => i.id === incidentId);
    if (incident) {
        showNotification(`📋 ${incident.title} - Status: ${incident.status.toUpperCase()}`, 'info');
    }
}

function showResourceDetails(resourceId) {
    const resource = emergencyData.resources.find(r => r.id === resourceId);
    if (resource) {
        showNotification(`${resource.icon} ${resource.name} - ${resource.status.toUpperCase()}`, 'info');
    }
}

function toggleCommChannel(channelId) {
    showNotification(`📡 Communication channel toggled`, 'success');
}

function refreshIncidents() {
    populateIncidents();
    showNotification('🔄 Incidents refreshed', 'success');
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else {
        return `${hours}h ago`;
    }
}

// Essential Emergency Action Functions
function confirmCall911() {
    closeModal();
    showNotification('📞 Connecting to 911 Emergency Services...', 'error');
    
    // Simulate call connection
    setTimeout(() => {
        showNotification('✅ Connected to 911 - Emergency services dispatched', 'success');
    }, 3000);
}

// Basic form setup
function setupEmergencyForm() {
    const form = document.getElementById('emergency-form');
    if (!form) return;
    
    // Add form submission handler
    form.addEventListener('submit', handleEmergencyReport);
    
    // Auto-detect location on form load
    setTimeout(() => {
        getCurrentLocation();
    }, 500);
}

// Get current location using GPS
function getCurrentLocation() {
    const locationBtn = document.getElementById('get-location-btn');
    const locationInput = document.getElementById('location-input');
    const locationStatus = document.getElementById('location-status');
    const coordinatesDisplay = document.getElementById('coordinates-display');
    const locationIcon = document.getElementById('location-icon');
    
    if (!navigator.geolocation) {
        locationStatus.textContent = '❌ Geolocation not supported by this browser';
        locationStatus.style.color = '#EF4444';
        return;
    }
    
    // Show loading state
    locationIcon.textContent = '⏳';
    locationBtn.style.background = '#F59E0B';
    locationStatus.textContent = '🔍 Getting your location...';
    locationStatus.style.color = '#F59E0B';
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
    };
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = Math.round(position.coords.accuracy);
            
            // Update UI with success
            locationIcon.textContent = '✅';
            locationBtn.style.background = '#10B981';
            locationStatus.textContent = `✅ Location detected (±${accuracy}m accuracy)`;
            locationStatus.style.color = '#10B981';
            coordinatesDisplay.textContent = `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            // Reverse geocode to get address
            reverseGeocode(lat, lng, locationInput);
            
            // Reset button after 3 seconds
            setTimeout(() => {
                locationIcon.textContent = '📍';
                locationBtn.style.background = '#3B82F6';
            }, 3000);
        },
        (error) => {
            let errorMessage = '';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '❌ Location access denied. Please enable location services.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '❌ Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = '❌ Location request timed out.';
                    break;
                default:
                    errorMessage = '❌ Unknown error occurred while getting location.';
                    break;
            }
            
            locationIcon.textContent = '❌';
            locationBtn.style.background = '#EF4444';
            locationStatus.textContent = errorMessage;
            locationStatus.style.color = '#EF4444';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                locationIcon.textContent = '📍';
                locationBtn.style.background = '#3B82F6';
            }, 3000);
        },
        options
    );
}

// Reverse geocode coordinates to address
async function reverseGeocode(lat, lng, locationInput) {
    try {
        // Using a free geocoding service (OpenStreetMap Nominatim)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();
        
        if (data && data.display_name) {
            // Format the address nicely
            const address = data.display_name;
            locationInput.value = `${address} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`;
        } else {
            locationInput.value = `GPS Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        locationInput.value = `GPS Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

// Format phone number as user types
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
        if (value.length <= 3) {
            formattedValue = `(${value}`;
        } else if (value.length <= 6) {
            formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    e.target.value = formattedValue;
}

// Emergency report handler
function handleEmergencyReport(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submit-emergency');
    
    // Show loading state
    submitBtn.innerHTML = '⏳ SENDING ALERT...';
    submitBtn.style.background = '#F59E0B';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate sending to emergency services
    setTimeout(() => {
        closeModal();
        showNotification('🚨 Emergency alert sent successfully! Response teams have been notified.', 'success');
        
        // Add to incidents
        const newIncident = {
            id: `EMER-${Date.now()}`,
            title: `${getEmergencyTypeLabel(data.emergency_type)} Emergency`,
            description: `${data.description} (${data.people_count} people involved)`,
            priority: getPriorityLevel(data.emergency_type),
            status: 'active',
            location: data.location,
            timestamp: new Date(),
            reporter: 'Emergency Report System'
        };
        
        emergencyData.incidents.unshift(newIncident);
        if (emergencyData.incidents.length > 5) emergencyData.incidents.pop();
        populateIncidents();
        
        // Show follow-up notification
        setTimeout(() => {
            showNotification(`📞 Emergency responders will contact you at ${data.callback}`, 'info');
        }, 3000);
        
    }, 2000); // Simulate network delay
}

// Helper functions
function getEmergencyTypeLabel(type) {
    const labels = {
        'drowning': '🌊 DROWNING',
        'boat_distress': '🚢 BOAT DISTRESS',
        'medical': '🏥 MEDICAL',
        'missing_person': '🔍 MISSING PERSON',
        'fire': '🔥 FIRE',
        'collision': '💥 COLLISION',
        'environmental': '🌿 ENVIRONMENTAL',
        'other': '⚠️ OTHER'
    };
    return labels[type] || '⚠️ EMERGENCY';
}

function getPriorityLevel(type) {
    const highPriority = ['drowning', 'medical', 'fire', 'collision'];
    return highPriority.includes(type) ? 'critical' : 'high';
}


function dispatchCoastGuard() {
    closeModal();
    showNotification('🛡️ Coast Guard units dispatched - ETA 12 minutes', 'success');
}

function dispatchHelicopter() {
    closeModal();
    showNotification('🚁 Rescue helicopter dispatched - ETA 8 minutes', 'success');
}

function dispatchMarineUnit() {
    closeModal();
    showNotification('🚤 Marine rescue unit dispatched - ETA 6 minutes', 'success');
}

function requestAmbulance() {
    closeModal();
    showNotification('🚑 Marine ambulance requested - ETA 10 minutes', 'success');
}

function requestMedic() {
    closeModal();
    showNotification('👨‍⚕️ Paramedic team dispatched - ETA 7 minutes', 'success');
}

function createEmergencyModal(title, content) {
    const overlay = document.createElement('div');
    overlay.id = 'emergency-modal';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
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
        padding: 24px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: emergencySlideIn 0.3s ease;
        border: 3px solid #EF4444;
    `;
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #EF4444; font-weight: 800;">${title}</h2>
            <button onclick="closeModal()" style="background: #EF4444; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold;">✕</button>
        </div>
        ${content}
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    return overlay;
}

function closeModal() {
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.remove();
    }
}

function startRealTimeUpdates() {
    setInterval(() => {
        if (Math.random() < 0.1) {
            const emergencyTypes = [
                { title: 'Boat Distress Signal', desc: 'Vessel requesting immediate assistance', priority: 'critical' },
                { title: 'Person Overboard', desc: 'Individual reported in water', priority: 'critical' },
                { title: 'Medical Emergency', desc: 'Medical assistance required on vessel', priority: 'high' }
            ];
            
            const randomType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
            
            const newIncident = {
                id: `EMER-${Date.now()}`,
                title: randomType.title,
                description: randomType.desc,
                priority: randomType.priority,
                status: 'active',
                location: 'Coastal Waters',
                timestamp: new Date(),
                reporter: 'Emergency Alert System'
            };
            
            emergencyData.incidents.unshift(newIncident);
            if (emergencyData.incidents.length > 5) emergencyData.incidents.pop();
            populateIncidents();
            showNotification(`🚨 EMERGENCY: ${randomType.title}`, 'error');
        }
    }, 45000); // Every 45 seconds
}

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
        max-width: 350px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        font-family: 'Inter', sans-serif;
        animation: slideIn 0.3s ease;
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes emergencySlideIn {
        from { 
            transform: scale(0.8) translateY(-50px); 
            opacity: 0; 
        }
        to { 
            transform: scale(1) translateY(0); 
            opacity: 1; 
        }
    }
    @keyframes emergencyPulse {
        0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); 
        }
        50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); 
        }
    }
    @keyframes locationPulse {
        0%, 100% { 
            transform: scale(1); 
        }
        50% { 
            transform: scale(1.1); 
        }
    }
    .action-card.emergency-call {
        animation: emergencyPulse 2s infinite;
    }
    .action-card.emergency-call:hover {
        animation: none;
        transform: scale(1.05);
    }
    
    /* Enhanced form styles */
    #emergency-form input:focus,
    #emergency-form select:focus,
    #emergency-form textarea:focus {
        outline: none !important;
        border-color: #3B82F6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    #emergency-form input.valid,
    #emergency-form select.valid,
    #emergency-form textarea.valid {
        border-color: #10B981 !important;
    }
    
    #emergency-form input.invalid,
    #emergency-form select.invalid,
    #emergency-form textarea.invalid {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    #get-location-btn:hover {
        transform: translateY(-50%) scale(1.05) !important;
    }
    
    #get-location-btn:active {
        transform: translateY(-50%) scale(0.95) !important;
    }
    
    .location-loading {
        animation: locationPulse 1s infinite !important;
    }
    
    /* Submit button hover effects */
    #submit-emergency:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
    }
    
    #submit-emergency:active {
        transform: translateY(0) !important;
    }
    
    #submit-emergency:disabled {
        opacity: 0.7 !important;
        cursor: not-allowed !important;
        transform: none !important;
    }
    
    /* Mobile responsive improvements */
    @media (max-width: 768px) {
        #emergency-modal .modal-container {
            margin: 10px !important;
            max-width: calc(100vw - 20px) !important;
            max-height: calc(100vh - 20px) !important;
        }
        
        #emergency-form {
            max-width: none !important;
        }
        
        #emergency-form input,
        #emergency-form select,
        #emergency-form textarea {
            font-size: 16px !important; /* Prevent zoom on iOS */
        }
        
        .emergency-buttons {
            flex-direction: column !important;
        }
        
        .emergency-buttons button {
            width: 100% !important;
        }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        #emergency-form input,
        #emergency-form select,
        #emergency-form textarea {
            border-width: 3px !important;
        }
    }
`;
document.head.appendChild(style);
