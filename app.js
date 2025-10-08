// AquaSutra Frontend Application
const API_BASE_URL = window.location.origin;
const socket = io();

// Global state
const AppState = {
    user: null,
    oceanData: [],
    alerts: [],
    isConnected: false
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('🌊 AquaSutra Ocean Safety Platform Loading...');
    
    // Initialize backend connection
    initializeWebSocket();
    
    // Load initial data
    loadDashboardData();
    
    // Setup interactive features
    setupInteractiveButtons();
    
    // Initialize Google OAuth
    initializeGoogleOAuth();
    
    console.log('✅ AquaSutra Platform Ready!');
}

// WebSocket initialization
function initializeWebSocket() {
    socket.on('connect', () => {
        AppState.isConnected = true;
        updateConnectionStatus(true);
        showNotification('Connected to Ocean Safety Platform', 'success');
    });
    
    socket.on('disconnect', () => {
        AppState.isConnected = false;
        updateConnectionStatus(false);
    });
    
    socket.on('ocean_data_realtime', (data) => {
        updateOceanDataRealtime(data);
    });
    
    socket.on('new_hazard_report', (data) => {
        showNotification(`⚠️ New hazard: ${data.hazard_type} in ${data.location}`, 'warning');
    });
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const [oceanResponse, alertsResponse, statsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/ocean-data`),
            fetch(`${API_BASE_URL}/api/alerts`),
            fetch(`${API_BASE_URL}/api/dashboard-stats`)
        ]);
        
        const [oceanData, alertsData, statsData] = await Promise.all([
            oceanResponse.json(),
            alertsResponse.json(),
            statsResponse.json()
        ]);
        
        if (oceanData.success) {
            AppState.oceanData = oceanData.data;
            updateChartDisplay();
        }
        
        if (alertsData.success) {
            AppState.alerts = alertsData.data;
            updateAlertsDisplay();
        }
        
        if (statsData.success) {
            updateStats(statsData.data);
        }
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Don't show notification for this error as it's not critical
    }
}

// Update statistics display
function updateStats(statsData) {
    console.log('📊 Dashboard Statistics:', statsData);
    
    // Update stats in the global state for other components to use
    AppState.stats = statsData;
    
    // If there are specific stat elements in the DOM, update them here
    // For now, we'll just log the data and store it in AppState
    
    // Example of how to update specific elements when they exist:
    // const monitoringElement = document.getElementById('monitoring-locations');
    // if (monitoringElement) {
    //     monitoringElement.textContent = statsData.monitoring_locations || 0;
    // }
    
    // const alertsElement = document.getElementById('active-alerts');
    // if (alertsElement) {
    //     alertsElement.textContent = statsData.active_alerts || 0;
    // }
    
    // const riskElement = document.getElementById('high-risk-locations');
    // if (riskElement) {
    //     riskElement.textContent = statsData.high_risk_locations || 0;
    // }
    
    // const reportsElement = document.getElementById('recent-reports');
    // if (reportsElement) {
    //     reportsElement.textContent = statsData.recent_reports || 0;
    // }
}

// Update chart display
function updateChartDisplay() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        if (AppState.oceanData[index]) {
            const data = AppState.oceanData[index];
            const height = Math.min(data.wave_height * 20, 90);
            bar.style.height = `${height}%`;
            
            // Color based on risk
            const colors = {
                high: 'linear-gradient(135deg, #EF4444, #DC2626)',
                medium: 'linear-gradient(135deg, #F59E0B, #D97706)',
                low: 'linear-gradient(135deg, #10B981, #059669)'
            };
            bar.style.background = colors[data.risk_level] || colors.low;
            
            // Add tooltip
            bar.title = `${data.location}: ${data.wave_height}m waves, ${data.risk_level} risk`;
        }
    });
}

// Update real-time data
function updateOceanDataRealtime(newData) {
    AppState.oceanData.unshift(newData);
    if (AppState.oceanData.length > 50) {
        AppState.oceanData = AppState.oceanData.slice(0, 50);
    }
    
    updateChartDisplay();
    
    if (newData.risk_level === 'high') {
        showNotification(`⚠️ High risk at ${newData.location}`, 'warning');
    }
}

// Update alerts display
function updateAlertsDisplay() {
    // Create alerts container if it doesn't exist
    let container = document.getElementById('alerts-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alerts-container';
        container.style.cssText = `
            position: fixed;
            top: 140px;
            right: 20px;
            max-width: 300px;
            z-index: 9998;
        `;
        document.body.appendChild(container);
    }
    
    container.innerHTML = '';
    
    AppState.alerts.slice(0, 3).forEach((alert, index) => {
        const alertEl = document.createElement('div');
        alertEl.style.cssText = `
            background: ${alert.severity === 'high' ? '#EF4444' : alert.severity === 'medium' ? '#F59E0B' : '#3B82F6'};
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            margin-bottom: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease ${index * 0.1}s both;
            cursor: pointer;
        `;
        
        alertEl.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">${alert.title}</div>
            <div style="font-size: 12px; opacity: 0.9;">${alert.location}</div>
        `;
        
        alertEl.addEventListener('click', () => showAlertDetails(alert));
        container.appendChild(alertEl);
    });
}

// Update connection status
function updateConnectionStatus(connected) {
    let indicator = document.getElementById('connection-status');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'connection-status';
        indicator.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            z-index: 9999;
        `;
        document.body.appendChild(indicator);
    }
    
    if (connected) {
        indicator.textContent = '🟢 Live';
        indicator.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        indicator.style.color = 'white';
    } else {
        indicator.textContent = '🔴 Offline';
        indicator.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
        indicator.style.color = 'white';
    }
}

// Setup interactive buttons
function setupInteractiveButtons() {
    // Report Hazard buttons
    document.querySelectorAll('.btn-primary-large').forEach(btn => {
        if (btn.textContent.includes('Report Hazard')) {
            btn.addEventListener('click', showHazardReportModal);
        }
    });
    
    // Dashboard buttons
    document.querySelectorAll('.btn-secondary-large').forEach(btn => {
        if (btn.textContent.includes('Dashboard')) {
            btn.addEventListener('click', showDashboardModal);
        }
    });
    
    // CTA buttons
    document.querySelectorAll('.cta .btn-primary-large').forEach(btn => {
        btn.addEventListener('click', showRegistrationModal);
    });
}

// Show hazard report modal
function showHazardReportModal() {
    const modal = createModal('Report Ocean Hazard', `
        <form id="hazard-form">
            <input type="text" name="reporter_name" placeholder="Your Name" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
            <input type="email" name="reporter_email" placeholder="Email" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
            <select name="hazard_type" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                <option value="">Select Hazard Type</option>
                <option value="high_waves">High Waves</option>
                <option value="strong_current">Strong Current</option>
                <option value="debris">Debris</option>
                <option value="pollution">Pollution</option>
                <option value="marine_life">Dangerous Marine Life</option>
                <option value="weather">Severe Weather</option>
            </select>
            <input type="text" name="location" placeholder="Location" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
            <select name="severity" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                <option value="">Severity Level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <textarea name="description" placeholder="Description" required rows="3" style="width: 100%; margin-bottom: 16px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;"></textarea>
            <div style="display: flex; gap: 12px;">
                <button type="button" onclick="closeModal()" style="flex: 1; padding: 12px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
                <button type="submit" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 8px; cursor: pointer;">Submit</button>
            </div>
        </form>
    `);
    
    document.getElementById('hazard-form').addEventListener('submit', handleHazardReport);
}

// Handle hazard report
async function handleHazardReport(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/report-hazard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Hazard reported successfully!', 'success');
            closeModal();
        } else {
            showNotification('Error submitting report', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

// Show dashboard modal
function showDashboardModal() {
    const modal = createModal('Ocean Safety Dashboard', `
        <div style="max-width: 600px;">
            <div id="dashboard-stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
                <div style="background: #3B82F6; color: white; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">15</div>
                    <div>Monitoring Locations</div>
                </div>
                <div style="background: #F59E0B; color: white; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">3</div>
                    <div>Active Alerts</div>
                </div>
            </div>
            <div style="background: #F9FAFB; padding: 20px; border-radius: 12px;">
                <h3>Recent Ocean Data</h3>
                <div id="dashboard-ocean-data">Loading...</div>
            </div>
        </div>
    `);
    
    loadDashboardModalData();
}

// Load dashboard modal data
async function loadDashboardModalData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ocean-data`);
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('dashboard-ocean-data');
            container.innerHTML = data.data.slice(0, 5).map(item => `
                <div style="background: white; padding: 12px; margin: 8px 0; border-radius: 8px; border-left: 4px solid ${item.risk_level === 'high' ? '#EF4444' : item.risk_level === 'medium' ? '#F59E0B' : '#10B981'};">
                    <strong>${item.location}</strong><br>
                    <small>Wave: ${item.wave_height}m | Risk: ${item.risk_level.toUpperCase()}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Show registration modal
function showRegistrationModal() {
    const modal = createModal('Join AquaSutra', `
        <form id="register-form">
            <input type="text" name="username" placeholder="Username" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
            <input type="email" name="email" placeholder="Email" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
            <input type="password" name="password" placeholder="Password" required style="width: 100%; margin-bottom: 12px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
            <select name="role" style="width: 100%; margin-bottom: 16px; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                <option value="user">Community Member</option>
                <option value="responder">Emergency Responder</option>
                <option value="manager">Safety Manager</option>
            </select>
            <div style="display: flex; gap: 12px;">
                <button type="button" onclick="closeModal()" style="flex: 1; padding: 12px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
                <button type="submit" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 8px; cursor: pointer;">Register</button>
            </div>
        </form>
    `);
    
    document.getElementById('register-form').addEventListener('submit', handleRegistration);
}

// Premium Liquid Glass Login Modal
function showLoginModal() {
    const modal = createLiquidGlassModal('Welcome Back', `
        <p class="glass-modal-subtitle">Sign in to your account to continue</p>
        <form id="login-form" class="glass-form">
            <div class="glass-input-group">
                <label class="glass-label">Email Address</label>
                <input type="email" name="email" placeholder="Enter your email" required class="glass-input">
            </div>
            <div class="glass-input-group">
                <label class="glass-label">Password</label>
                <input type="password" name="password" placeholder="Enter your password" required class="glass-input">
            </div>
            <button type="submit" class="glass-btn-primary">Sign In</button>
            
            <div class="glass-divider">
                <span>OR CONTINUE WITH</span>
            </div>
            
            <div class="glass-social-buttons">
                <button type="button" class="glass-btn-social" onclick="handleGoogleLogin()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>
                <button type="button" class="glass-btn-social" onclick="handleAppleLogin()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                </button>
                <button type="button" class="glass-btn-social" onclick="handleFacebookLogin()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                </button>
            </div>
            
            <div class="glass-footer">
                <a href="#" onclick="showNotification('Password reset coming soon!', 'info')" class="glass-link">Forgot your password?</a>
            </div>
        </form>
    `);
    
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// Premium Liquid Glass Signup Modal
function showSignupModal() {
    const modal = createLiquidGlassModal('Join AquaSutra', `
        <p class="glass-modal-subtitle">Create your account to start protecting coastal communities</p>
        <form id="signup-form" class="glass-form">
            <div class="glass-input-group">
                <label class="glass-label">Full Name</label>
                <input type="text" name="username" placeholder="Enter your full name" required class="glass-input">
            </div>
            <div class="glass-input-group">
                <label class="glass-label">Email Address</label>
                <input type="email" name="email" placeholder="Enter your email" required class="glass-input">
            </div>
            <div class="glass-input-group">
                <label class="glass-label">Password</label>
                <input type="password" name="password" placeholder="Create a password" required class="glass-input">
            </div>
            <div class="glass-input-group">
                <label class="glass-label">Role</label>
                <select name="role" required class="glass-select">
                    <option value="">Select your role</option>
                    <option value="user">Community Member</option>
                    <option value="responder">Emergency Responder</option>
                    <option value="manager">Safety Manager</option>
                </select>
            </div>
            <button type="submit" class="glass-btn-primary">Create Account</button>
            
            <div class="glass-divider">
                <span>OR CONTINUE WITH</span>
            </div>
            
            <div class="glass-social-buttons">
                <button type="button" class="glass-btn-social" onclick="handleGoogleLogin()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>
                <button type="button" class="glass-btn-social" onclick="handleAppleLogin()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                </button>
                <button type="button" class="glass-btn-social" onclick="handleFacebookLogin()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                </button>
            </div>
            
            <div class="glass-footer">
                <p class="glass-terms">By creating an account, you agree to our <a href="#" class="glass-link">Terms of Service</a> and <a href="#" class="glass-link">Privacy Policy</a></p>
            </div>
        </form>
    `);
    
    document.getElementById('signup-form').addEventListener('submit', handleRegistration);
}

function showMonitoringModal() {
    const modal = createModal('Ocean Monitoring System', `
        <div style="max-width: 600px;">
            <div style="background: linear-gradient(135deg, #0EA5E9, #0284C7); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">🌊 Real-time Ocean Monitoring</h3>
                <p style="margin: 0; opacity: 0.9;">Advanced sensors and AI analytics for comprehensive coastal safety</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
                <div style="background: #F0F9FF; padding: 16px; border-radius: 8px; border-left: 4px solid #0EA5E9;">
                    <h4 style="margin: 0 0 8px 0; color: #0C4A6E;">Wave Height Monitoring</h4>
                    <p style="margin: 0; font-size: 14px; color: #075985;">Real-time wave height measurements with AI-powered predictions</p>
                </div>
                <div style="background: #F0F9FF; padding: 16px; border-radius: 8px; border-left: 4px solid #0EA5E9;">
                    <h4 style="margin: 0 0 8px 0; color: #0C4A6E;">Current Analysis</h4>
                    <p style="margin: 0; font-size: 14px; color: #075985;">Underwater current detection and safety assessments</p>
                </div>
                <div style="background: #F0F9FF; padding: 16px; border-radius: 8px; border-left: 4px solid #0EA5E9;">
                    <h4 style="margin: 0 0 8px 0; color: #0C4A6E;">Weather Integration</h4>
                    <p style="margin: 0; font-size: 14px; color: #075985;">Comprehensive weather data and storm tracking</p>
                </div>
                <div style="background: #F0F9FF; padding: 16px; border-radius: 8px; border-left: 4px solid #0EA5E9;">
                    <h4 style="margin: 0 0 8px 0; color: #0C4A6E;">Water Quality</h4>
                    <p style="margin: 0; font-size: 14px; color: #075985;">Pollution detection and water safety monitoring</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="showDashboardModal()" style="padding: 12px 24px; background: linear-gradient(135deg, #0EA5E9, #0284C7); color: white; border: none; border-radius: 8px; cursor: pointer; margin-right: 12px;">View Live Data</button>
                <button onclick="closeModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `);
}

function showEmergencyModal() {
    const modal = createModal('Emergency Response System', `
        <div style="max-width: 600px;">
            <div style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">🚨 Emergency Response Center</h3>
                <p style="margin: 0; opacity: 0.9;">Rapid response coordination for ocean safety emergencies</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px;">
                <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #EF4444;">
                    <h4 style="margin: 0 0 8px 0; color: #7F1D1D;">Instant Alert System</h4>
                    <p style="margin: 0; font-size: 14px; color: #991B1B;">Immediate notifications to emergency responders and coastal communities</p>
                </div>
                <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #EF4444;">
                    <h4 style="margin: 0 0 8px 0; color: #7F1D1D;">Rescue Coordination</h4>
                    <p style="margin: 0; font-size: 14px; color: #991B1B;">Real-time coordination between coast guard, lifeguards, and medical teams</p>
                </div>
                <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #EF4444;">
                    <h4 style="margin: 0 0 8px 0; color: #7F1D1D;">Evacuation Planning</h4>
                    <p style="margin: 0; font-size: 14px; color: #991B1B;">AI-powered evacuation route optimization and crowd management</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="showHazardReportModal()" style="padding: 12px 24px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 8px; cursor: pointer; margin-right: 12px;">Report Emergency</button>
                <button onclick="closeModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `);
}

function showAnalyticsModal() {
    const modal = createModal('AI Analytics Dashboard', `
        <div style="max-width: 600px;">
            <div style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">🤖 AI-Powered Analytics</h3>
                <p style="margin: 0; opacity: 0.9;">Advanced machine learning for predictive ocean safety</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
                <div style="background: #F3F0FF; padding: 16px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
                    <h4 style="margin: 0 0 8px 0; color: #4C1D95;">Predictive Modeling</h4>
                    <p style="margin: 0; font-size: 14px; color: #5B21B6;">AI algorithms predict hazardous conditions up to 72 hours in advance</p>
                </div>
                <div style="background: #F3F0FF; padding: 16px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
                    <h4 style="margin: 0 0 8px 0; color: #4C1D95;">Pattern Recognition</h4>
                    <p style="margin: 0; font-size: 14px; color: #5B21B6;">Machine learning identifies dangerous ocean patterns and trends</p>
                </div>
                <div style="background: #F3F0FF; padding: 16px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
                    <h4 style="margin: 0 0 8px 0; color: #4C1D95;">Risk Assessment</h4>
                    <p style="margin: 0; font-size: 14px; color: #5B21B6;">Automated risk scoring for different coastal areas and activities</p>
                </div>
                <div style="background: #F3F0FF; padding: 16px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
                    <h4 style="margin: 0 0 8px 0; color: #4C1D95;">Smart Alerts</h4>
                    <p style="margin: 0; font-size: 14px; color: #5B21B6;">Intelligent notification system with personalized safety recommendations</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="showDashboardModal()" style="padding: 12px 24px; background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; border: none; border-radius: 8px; cursor: pointer; margin-right: 12px;">View Analytics</button>
                <button onclick="closeModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `);
}

function showResourcesModal() {
    const modal = createModal('Safety Resources & Training', `
        <div style="max-width: 600px;">
            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">📚 Ocean Safety Resources</h3>
                <p style="margin: 0; opacity: 0.9;">Comprehensive training materials and safety guidelines</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px;">
                <div style="background: #ECFDF5; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981;">
                    <h4 style="margin: 0 0 8px 0; color: #064E3B;">🏊‍♂️ Swimming Safety Guidelines</h4>
                    <p style="margin: 0; font-size: 14px; color: #065F46;">Essential water safety tips for swimmers and beachgoers</p>
                </div>
                <div style="background: #ECFDF5; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981;">
                    <h4 style="margin: 0 0 8px 0; color: #064E3B;">🚤 Boating Safety Protocols</h4>
                    <p style="margin: 0; font-size: 14px; color: #065F46;">Comprehensive boating safety and emergency procedures</p>
                </div>
                <div style="background: #ECFDF5; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981;">
                    <h4 style="margin: 0 0 8px 0; color: #064E3B;">🏄‍♀️ Surfing & Water Sports</h4>
                    <p style="margin: 0; font-size: 14px; color: #065F46;">Safety guidelines for surfing, diving, and water sports activities</p>
                </div>
                <div style="background: #ECFDF5; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981;">
                    <h4 style="margin: 0 0 8px 0; color: #064E3B;">🆘 Emergency Response Training</h4>
                    <p style="margin: 0; font-size: 14px; color: #065F46;">First aid, CPR, and water rescue training programs</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="showNotification('Training resources downloaded!', 'success')" style="padding: 12px 24px; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 8px; cursor: pointer; margin-right: 12px;">Download Resources</button>
                <button onclick="closeModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `);
}

function showGovernmentModal() {
    const modal = createModal('Government Integration Portal', `
        <div style="max-width: 600px;">
            <div style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">🏛️ Government Partnership</h3>
                <p style="margin: 0; opacity: 0.9;">Seamless integration with government agencies and emergency services</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px;">
                <div style="background: #FFFBEB; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B;">
                    <h4 style="margin: 0 0 8px 0; color: #78350F;">🌊 Coast Guard Integration</h4>
                    <p style="margin: 0; font-size: 14px; color: #92400E;">Direct communication channels with coast guard operations</p>
                </div>
                <div style="background: #FFFBEB; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B;">
                    <h4 style="margin: 0 0 8px 0; color: #78350F;">🏥 Emergency Services</h4>
                    <p style="margin: 0; font-size: 14px; color: #92400E;">Automated alerts to hospitals and emergency medical services</p>
                </div>
                <div style="background: #FFFBEB; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B;">
                    <h4 style="margin: 0 0 8px 0; color: #78350F;">📊 Data Sharing</h4>
                    <p style="margin: 0; font-size: 14px; color: #92400E;">Secure data sharing with meteorological and oceanographic departments</p>
                </div>
                <div style="background: #FFFBEB; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B;">
                    <h4 style="margin: 0 0 8px 0; color: #78350F;">📋 Compliance Reporting</h4>
                    <p style="margin: 0; font-size: 14px; color: #92400E;">Automated compliance reports and safety documentation</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="showNotification('Government portal access requested!', 'info')" style="padding: 12px 24px; background: linear-gradient(135deg, #F59E0B, #D97706); color: white; border: none; border-radius: 8px; cursor: pointer; margin-right: 12px;">Request Access</button>
                <button onclick="closeModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `);
}

// Global map variable
let hazardMap = null;
let hazardMarkers = [];

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
    }
];

function showHazardMapModal() {
    const modal = createModal('🌊 Live Ocean Hazard Map', `
        <div style="max-width: 900px; width: 90vw;">
            <div style="background: linear-gradient(135deg, #0EA5E9, #0284C7); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">🗺️ Real-time Ocean Safety Monitor</h3>
                <p style="margin: 0; opacity: 0.9;">Live tracking of ocean hazards, alerts, and safety conditions worldwide</p>
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <div id="hazard-map" style="height: 500px; border-radius: 12px; border: 2px solid #E5E7EB;"></div>
                </div>
                <div style="width: 250px;">
                    <div style="background: #F8FAFC; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                        <h4 style="margin: 0 0 12px 0; color: #1E293B;">🚨 Active Alerts</h4>
                        <div id="active-alerts" style="max-height: 200px; overflow-y: auto;">
                            <!-- Alerts will be populated here -->
                        </div>
                    </div>
                    
                    <div style="background: #F8FAFC; padding: 16px; border-radius: 12px;">
                        <h4 style="margin: 0 0 12px 0; color: #1E293B;">📊 Legend</h4>
                        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 12px; height: 12px; background: #EF4444; border-radius: 50%;"></div>
                                <span>High Risk</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 12px; height: 12px; background: #F59E0B; border-radius: 50%;"></div>
                                <span>Medium Risk</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 12px; height: 12px; background: #10B981; border-radius: 50%;"></div>
                                <span>Low Risk</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 12px;">
                    <button onclick="refreshHazardData()" style="padding: 10px 16px; background: linear-gradient(135deg, #0EA5E9, #0284C7); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">🔄 Refresh Data</button>
                    <button onclick="showHazardReportModal()" style="padding: 10px 16px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">⚠️ Report Hazard</button>
                </div>
                <button onclick="closeModal()" style="padding: 10px 20px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `);
    
    // Initialize the map after the modal is created
    setTimeout(() => {
        initializeHazardMap();
        populateActiveAlerts();
    }, 100);
}

function initializeHazardMap() {
    // Initialize the Leaflet map
    hazardMap = L.map('hazard-map').setView([39.8283, -98.5795], 4); // Center on USA
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(hazardMap);
    
    // Add hazard markers
    addHazardMarkers();
    
    // Auto-refresh every 30 seconds
    setInterval(refreshHazardData, 30000);
}

function addHazardMarkers() {
    // Clear existing markers
    hazardMarkers.forEach(marker => hazardMap.removeLayer(marker));
    hazardMarkers = [];
    
    mockHazardData.forEach(hazard => {
        const color = getSeverityColor(hazard.severity);
        
        // Create custom marker
        const marker = L.circleMarker([hazard.lat, hazard.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: hazard.severity === 'high' ? 12 : hazard.severity === 'medium' ? 8 : 6,
            weight: 2
        }).addTo(hazardMap);
        
        // Add popup with hazard details
        const popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: ${color};">${hazard.icon} ${hazard.location}</h4>
                <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Type:</strong> ${formatHazardType(hazard.type)}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Severity:</strong> <span style="color: ${color}; text-transform: uppercase; font-weight: bold;">${hazard.severity}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 14px;">${hazard.description}</p>
                <p style="margin: 0; font-size: 12px; color: #6B7280;">Last updated: ${hazard.timestamp.toLocaleTimeString()}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        hazardMarkers.push(marker);
        
        // Add pulsing animation for high severity hazards
        if (hazard.severity === 'high') {
            marker.on('add', function() {
                const element = marker.getElement();
                if (element) {
                    element.style.animation = 'pulse 2s infinite';
                }
            });
        }
    });
}

function populateActiveAlerts() {
    const alertsContainer = document.getElementById('active-alerts');
    if (!alertsContainer) return;
    
    const highSeverityHazards = mockHazardData.filter(h => h.severity === 'high');
    
    if (highSeverityHazards.length === 0) {
        alertsContainer.innerHTML = '<p style="color: #10B981; font-size: 14px; margin: 0;">✅ No active high-risk alerts</p>';
        return;
    }
    
    alertsContainer.innerHTML = highSeverityHazards.map(hazard => `
        <div style="background: white; border-left: 4px solid #EF4444; padding: 12px; margin-bottom: 8px; border-radius: 6px; cursor: pointer;" onclick="focusOnHazard(${hazard.lat}, ${hazard.lng})">
            <div style="font-weight: 600; color: #EF4444; font-size: 14px; margin-bottom: 4px;">${hazard.icon} ${hazard.location}</div>
            <div style="font-size: 12px; color: #6B7280;">${hazard.description}</div>
            <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">${hazard.timestamp.toLocaleTimeString()}</div>
        </div>
    `).join('');
}

function focusOnHazard(lat, lng) {
    if (hazardMap) {
        hazardMap.setView([lat, lng], 10);
    }
}

function refreshHazardData() {
    // Simulate real-time data updates
    mockHazardData.forEach(hazard => {
        hazard.timestamp = new Date();
        // Randomly change some hazard severities for demo
        if (Math.random() < 0.2) {
            const severities = ['low', 'medium', 'high'];
            hazard.severity = severities[Math.floor(Math.random() * severities.length)];
        }
    });
    
    if (hazardMap) {
        addHazardMarkers();
        populateActiveAlerts();
    }
    
    showNotification('🔄 Hazard data refreshed', 'info');
}

function getSeverityColor(severity) {
    switch (severity) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
        default: return '#6B7280';
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

// Handle registration
async function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            AppState.user = result.user;
            showNotification(`Welcome ${result.user.username}!`, 'success');
            updateNavigationForLoggedInUser();
            closeModal();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('Registration failed', 'error');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            AppState.user = result.user;
            showNotification(`Welcome back ${result.user.username}!`, 'success');
            updateNavigationForLoggedInUser();
            closeModal();
        } else {
            showNotification(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Login failed', 'error');
    }
}

// Utility functions
function createModal(title, content) {
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
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
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `;
    
    modal.innerHTML = `
        <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #374151;">${title}</h2>
        ${content}
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    return overlay;
}

// Premium Liquid Glass Modal
function createLiquidGlassModal(title, content) {
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'glass-modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'glass-modal';
    
    modal.innerHTML = `
        <div class="glass-modal-header">
            <h2 class="glass-modal-title">${title}</h2>
            <button class="glass-close-btn" onclick="closeModal()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="glass-modal-content">
            ${content}
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Add entrance animation
    setTimeout(() => {
        overlay.classList.add('glass-modal-show');
    }, 10);
    
    return overlay;
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showNotification(message, type = 'info') {
    // Skip showing specific notifications per user request
    if (message === 'Connected to Ocean Safety Platform' || message === 'Error loading data') {
        return;
    }
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6'};
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Update navigation to show user profile after login
function updateNavigationForLoggedInUser() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions || !AppState.user) return;
    
    // Create user profile dropdown
    const userProfile = document.createElement('div');
    userProfile.className = 'user-profile-dropdown';
    userProfile.innerHTML = `
        <div class="user-profile-trigger" onclick="toggleUserDropdown()">
            <div class="user-avatar">
                ${AppState.user.avatar ? 
                    `<img src="${AppState.user.avatar}" alt="${AppState.user.username}" />` : 
                    `<div class="avatar-placeholder ${getAvatarClass(AppState.user.role)}">${getAvatarIcon(AppState.user.role)}</div>`
                }
            </div>
            <span class="user-name">${AppState.user.username}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="dropdown-arrow">
                <path d="M4 6l4 4 4-4H4z"/>
            </svg>
        </div>
        <div class="user-dropdown-menu" id="userDropdownMenu">
            <div class="dropdown-header">
                <div class="user-info">
                    <div class="user-name">${AppState.user.username}</div>
                    <div class="user-email">${AppState.user.email}</div>
                    <div class="user-role">${AppState.user.role || 'User'}</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" onclick="showProfileModal()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 9a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5z"/>
                </svg>
                Profile Settings
            </a>
            <a href="#" class="dropdown-item" onclick="openPremiumDashboard()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/>
                </svg>
                Dashboard
            </a>
            <a href="#" class="dropdown-item" onclick="showNotificationsModal()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 2a6 6 0 0 0-6 6c0 1.5-.5 2.5-1 3h14c-.5-.5-1-1.5-1-3a6 6 0 0 0-6-6zM6 13a2 2 0 1 0 4 0H6z"/>
                </svg>
                Notifications
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout-item" onclick="handleLogout()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6zM5 3h6v10H5V3z"/>
                    <path d="M8 6v4M6 8h4"/>
                </svg>
                Sign Out
            </a>
        </div>
    `;
    
    // Replace nav actions with user profile
    navActions.innerHTML = '';
    navActions.appendChild(userProfile);
}

// Get avatar class based on user role
function getAvatarClass(role) {
    switch (role?.toLowerCase()) {
        case 'manager':
        case 'safety manager':
        case 'admin':
            return 'avatar-manager';
        case 'responder':
        case 'emergency responder':
        case 'authority':
            return 'avatar-authority';
        case 'user':
        case 'community member':
        default:
            return 'avatar-user';
    }
}

// Get avatar icon based on user role
function getAvatarIcon(role) {
    const avatarData = getAvatarImageSet();
    const avatarImages = avatarData.primary;
    const fallbackImages = avatarData.fallback;
    
    let primarySrc, fallbackSrc, altText;
    
    switch (role?.toLowerCase()) {
        case 'manager':
        case 'safety manager':
        case 'admin':
            primarySrc = avatarImages.manager;
            fallbackSrc = fallbackImages.manager;
            altText = 'Manager Avatar';
            break;
        case 'responder':
        case 'emergency responder':
        case 'authority':
            primarySrc = avatarImages.authority;
            fallbackSrc = fallbackImages.authority;
            altText = 'Authority Avatar';
            break;
        case 'user':
        case 'community member':
        default:
            primarySrc = avatarImages.user;
            fallbackSrc = fallbackImages.user;
            altText = 'User Avatar';
            break;
    }
    
    return `<img src="${primarySrc}" 
                 alt="${altText}" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" 
                 onerror="this.src='${fallbackSrc}'; this.onerror=null;" />`;
}

// Get random avatar image set for variety
function getAvatarImageSet() {
    // Use DiceBear API for reliable, consistent avatars
    const seed = Math.floor(Date.now() / (1000 * 60 * 15)); // Changes every 15 minutes
    
    const avatarSets = [
        {
            user: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${seed}&backgroundColor=0ea5e9`,
            manager: `https://api.dicebear.com/7.x/avataaars/svg?seed=manager${seed}&backgroundColor=f59e0b&accessories=eyepatch,wayfarers,round&clothing=blazerShirt,blazerSweater`,
            authority: `https://api.dicebear.com/7.x/avataaars/svg?seed=authority${seed}&backgroundColor=ef4444&clothing=overall,shirtCrewNeck&accessories=prescription02,round`
        },
        {
            user: `https://api.dicebear.com/7.x/personas/svg?seed=user${seed + 1}&backgroundColor=0ea5e9`,
            manager: `https://api.dicebear.com/7.x/personas/svg?seed=manager${seed + 1}&backgroundColor=f59e0b`,
            authority: `https://api.dicebear.com/7.x/personas/svg?seed=authority${seed + 1}&backgroundColor=ef4444`
        },
        {
            user: `https://api.dicebear.com/7.x/big-smile/svg?seed=user${seed + 2}&backgroundColor=0ea5e9`,
            manager: `https://api.dicebear.com/7.x/big-smile/svg?seed=manager${seed + 2}&backgroundColor=f59e0b`,
            authority: `https://api.dicebear.com/7.x/big-smile/svg?seed=authority${seed + 2}&backgroundColor=ef4444`
        },
        {
            user: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=user${seed + 3}&backgroundColor=0ea5e9`,
            manager: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=manager${seed + 3}&backgroundColor=f59e0b`,
            authority: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=authority${seed + 3}&backgroundColor=ef4444`
        }
    ];
    
    // Fallback to CSS-based avatars if external images fail
    const fallbackAvatars = {
        user: createCSSAvatar('👤', '#0ea5e9'),
        manager: createCSSAvatar('👔', '#f59e0b'),
        authority: createCSSAvatar('🛡️', '#ef4444')
    };
    
    const timeIndex = Math.floor(Date.now() / (1000 * 60 * 15)) % avatarSets.length;
    
    // Return both primary and fallback options
    return {
        primary: avatarSets[timeIndex],
        fallback: fallbackAvatars
    };
}

// Create CSS-based avatar as fallback
function createCSSAvatar(emoji, bgColor) {
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
            <circle cx="48" cy="48" r="48" fill="${bgColor}"/>
            <text x="48" y="58" font-size="32" text-anchor="middle" fill="white">${emoji}</text>
        </svg>
    `)}`;
}

// Toggle user dropdown menu
function toggleUserDropdown() {
    const dropdownMenu = document.getElementById('userDropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
        
        // Add click outside handler
        if (dropdownMenu.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', closeDropdownOnClickOutside);
            }, 100);
        } else {
            document.removeEventListener('click', closeDropdownOnClickOutside);
        }
    }
}

// Close dropdown when clicking outside
function closeDropdownOnClickOutside(event) {
    const dropdown = document.querySelector('.user-profile-dropdown');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    
    if (dropdown && !dropdown.contains(event.target)) {
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

// Handle logout
function handleLogout() {
    AppState.user = null;
    showNotification('Logged out successfully', 'success');
    
    // Restore original navigation buttons
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <button class="btn-secondary" onclick="showLoginModal()">Log in</button>
            <button class="btn-primary" onclick="showSignupModal()">Sign up free</button>
        `;
    }
}

// Profile modal functions
function showProfileModal() {
    toggleUserDropdown();
    createModal('Profile Settings', `
        <div style="max-width: 400px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div class="profile-avatar-large ${getAvatarClass(AppState.user.role)}" style="width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; margin: 0 auto 16px;">
                    ${getAvatarIcon(AppState.user.role)}
                </div>
                <h3 style="margin: 0 0 8px 0;">${AppState.user.username}</h3>
                <p style="margin: 0; color: #6b7280;">${AppState.user.email}</p>
                <span style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-top: 8px;">
                    ${AppState.user.role || 'User'}
                </span>
            </div>
            
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #374151;">Account Information</h4>
                <div style="margin-bottom: 8px;"><strong>Provider:</strong> ${AppState.user.provider || 'Email'}</div>
                <div style="margin-bottom: 8px;"><strong>Member since:</strong> ${new Date().toLocaleDateString()}</div>
                <div><strong>Status:</strong> <span style="color: #10b981;">Active</span></div>
            </div>
            
            <div style="display: flex; gap: 12px;">
                <button onclick="closeModal()" style="flex: 1; padding: 12px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
                <button onclick="showNotification('Profile editing coming soon!', 'info')" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 8px; cursor: pointer;">Edit Profile</button>
            </div>
        </div>
    `);
}

// Open Premium Dashboard
function openPremiumDashboard() {
    toggleUserDropdown();
    
    // Show loading notification
    showNotification('Opening Dashboard...', 'info');
    
    // Navigate to premium dashboard in same tab
    const dashboardUrl = '/premium-dashboard.html';
    setTimeout(() => {
        window.location.href = dashboardUrl;
    }, 500);
}

// Keep old function name for compatibility but redirect to premium
function showDashboardModal() {
    openPremiumDashboard();
}

function showNotificationsModal() {
    toggleUserDropdown();
    createModal('Notifications', `
        <div style="max-width: 400px;">
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h4 style="margin: 0;">Recent Notifications</h4>
                    <button onclick="showNotification('All notifications marked as read', 'success')" style="background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 14px;">Mark all read</button>
                </div>
                
                <div style="space-y: 12px;">
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                        <div style="font-weight: 600; color: #92400e;">⚠️ High Wave Warning</div>
                        <div style="font-size: 14px; color: #78350f;">Marina Beach - Wave height 3.2m</div>
                        <div style="font-size: 12px; color: #a16207; margin-top: 4px;">2 hours ago</div>
                    </div>
                    
                    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                        <div style="font-weight: 600; color: #1e40af;">📊 Weekly Report Ready</div>
                        <div style="font-size: 14px; color: #1e3a8a;">Your ocean safety summary is available</div>
                        <div style="font-size: 12px; color: #3730a3; margin-top: 4px;">1 day ago</div>
                    </div>
                    
                    <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                        <div style="font-weight: 600; color: #065f46;">✅ System Update</div>
                        <div style="font-size: 14px; color: #064e3b;">AquaSutra platform updated successfully</div>
                        <div style="font-size: 12px; color: #047857; margin-top: 4px;">2 days ago</div>
                    </div>
                </div>
            </div>
            
            <button onclick="closeModal()" style="width: 100%; padding: 12px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer;">Close</button>
        </div>
    `);
}

// Social Login Handlers
async function handleGoogleLogin() {
    try {
        showNotification('Opening Google login...', 'info');
        
        // Create a more realistic Google OAuth simulation
        const googleAuthWindow = createGoogleAuthSimulation();
        
        // Wait for user interaction in the simulated Google auth
        const googleUser = await googleAuthWindow;
        
        if (!googleUser) {
            showNotification('Google login was cancelled', 'warning');
            return;
        }
        
        showNotification('Processing Google login...', 'info');
        console.log('Attempting Google login with:', googleUser);
        
        // Register/login with backend
        const response = await fetch(`${API_BASE_URL}/api/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: 'google',
                user: googleUser,
                role: 'user'
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Login result:', result);
        
        if (result.success) {
            AppState.user = result.user;
            showNotification(`Welcome ${result.user.username}! Logged in with Google`, 'success');
            updateNavigationForLoggedInUser();
            closeModal();
        } else {
            showNotification('Google login failed: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Google login error:', error);
        showNotification(`Google login error: ${error.message}`, 'error');
    }
}

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '166886283256-h9srv9qqn32qls3jfmm2au91vcjq5kt8.apps.googleusercontent.com';

// Initialize Google OAuth when page loads
function initializeGoogleOAuth() {
    console.log('🔧 Initializing Google OAuth...');
    
    if (typeof google !== 'undefined' && google.accounts) {
        try {
            // Initialize Google Identity Services
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
                use_fedcm_for_prompt: false,
                ux_mode: 'popup',
                context: 'signin'
            });
            
            console.log('✅ Google OAuth initialized successfully');
            
        } catch (error) {
            console.error('❌ Google OAuth initialization failed:', error);
            showNotification('Google OAuth setup issue. Please try again.', 'warning');
        }
    } else {
        console.log('⚠️ Google OAuth library not loaded yet, retrying...');
        setTimeout(initializeGoogleOAuth, 1000);
    }
}

// Handle Google credential response
async function handleGoogleCredentialResponse(response) {
    try {
        showNotification('Processing Google login...', 'info');
        console.log('🔐 Google credential received');
        
        // Send the credential to our backend for verification
        const backendResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credential: response.credential
            })
        });
        
        const result = await backendResponse.json();
        console.log('Google login result:', result);
        
        if (result.success) {
            AppState.user = result.user;
            
            // Store token if provided
            if (result.token) {
                localStorage.setItem('authToken', result.token);
            }
            
            showNotification(`Welcome ${result.user.username}! Logged in with Google`, 'success');
            updateNavigationForLoggedInUser();
            closeModal();
        } else {
            showNotification('Google login failed: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Google login error:', error);
        showNotification(`Google login error: ${error.message}`, 'error');
    }
}

// Social Login Handlers
async function handleGoogleLogin() {
    try {
        console.log('🔐 Attempting Google login...');
        
        if (typeof google === 'undefined' || !google.accounts) {
            console.error('❌ Google OAuth library not available');
            showNotification('Google OAuth not available. Please check your internet connection and try again.', 'error');
            return;
        }
        
        showNotification('Opening Google account chooser...', 'info');
        
        // Use Google Identity Services with OAuth2 for real account selection
        try {
            // Create OAuth2 token client for account selection
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'openid email profile',
                ux_mode: 'popup',
                callback: async (response) => {
                    if (response.error) {
                        console.error('Google OAuth error:', response.error);
                        showNotification('Google login failed: ' + response.error, 'error');
                        return;
                    }
                    
                    try {
                        showNotification('Processing Google login...', 'info');
                        console.log('Google OAuth response:', response);
                        
                        // Get user info using the access token
                        const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`);
                        
                        if (!userInfoResponse.ok) {
                            throw new Error('Failed to fetch user info from Google');
                        }
                        
                        const userInfo = await userInfoResponse.json();
                        console.log('Google user info:', userInfo);
                        
                        // Create user object with real Google data
                        const googleUser = {
                            id: userInfo.id,
                            email: userInfo.email,
                            name: userInfo.name,
                            picture: userInfo.picture,
                            verified_email: userInfo.verified_email
                        };
                        
                        // Send to our backend for user creation/login
                        const backendResponse = await fetch(`${API_BASE_URL}/api/social-login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                provider: 'google',
                                user: googleUser
                            })
                        });
                        
                        const result = await backendResponse.json();
                        console.log('Backend login result:', result);
                        
                        if (result.success) {
                            AppState.user = result.user;
                            
                            // Store token if provided
                            if (result.token) {
                                localStorage.setItem('authToken', result.token);
                            }
                            
                            showNotification(`Welcome ${result.user.username}! Logged in with Google`, 'success');
                            updateNavigationForLoggedInUser();
                            closeModal();
                        } else {
                            showNotification('Google login failed: ' + result.message, 'error');
                        }
                        
                    } catch (error) {
                        console.error('Error processing Google user info:', error);
                        showNotification('Failed to process Google login: ' + error.message, 'error');
                    }
                }
            });
            
            // Request access token - this will show the Google account chooser
            tokenClient.requestAccessToken();
            
        } catch (error) {
            console.error('Google OAuth initialization error:', error);
            showNotification('Google OAuth setup error: ' + error.message, 'error');
        }
        
    } catch (error) {
        console.error('❌ Google login error:', error);
        showNotification(`Google login error: ${error.message}`, 'error');
    }
}

// Demo Google login for localhost development
async function handleDemoGoogleLogin() {
    try {
        showNotification('Using demo Google login for development...', 'info');
        
        // Simulate a Google user for development
        const demoGoogleUser = {
            id: 'demo_google_' + Date.now(),
            email: 'demo@gmail.com',
            name: 'Demo Google User',
            picture: 'https://via.placeholder.com/150/4285F4/white?text=G'
        };
        
        // Send to our backend
        const response = await fetch(`${API_BASE_URL}/api/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: 'google',
                user: demoGoogleUser
            })
        });
        
        const result = await response.json();
        console.log('Demo Google login result:', result);
        
        if (result.success) {
            AppState.user = result.user;
            showNotification(`Welcome ${result.user.username}! (Demo Google Login)`, 'success');
            updateNavigationForLoggedInUser();
            closeModal();
        } else {
            showNotification('Demo Google login failed: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Demo Google login error:', error);
        showNotification('Demo Google login failed', 'error');
    }
}


async function handleAppleLogin() {
    try {
        showNotification('Initializing Apple login...', 'info');
        
        // Simulate Apple Sign-In flow
        const mockAppleUser = {
            id: 'apple_' + Date.now(),
            email: 'user@privaterelay.appleid.com',
            name: 'Apple User',
            provider: 'apple',
            avatar: 'https://via.placeholder.com/150/000000/white?text=A'
        };
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Register/login with backend
        const response = await fetch(`${API_BASE_URL}/api/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: 'apple',
                user: mockAppleUser,
                role: 'user'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            AppState.user = result.user;
            showNotification(`Welcome ${result.user.username}! Logged in with Apple`, 'success');
            closeModal();
        } else {
            showNotification('Apple login failed: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Apple login error:', error);
        showNotification('Apple login successful! (Demo mode)', 'success');
        
        // Demo mode - simulate successful login
        AppState.user = {
            id: 'demo_apple_user',
            username: 'Apple User',
            email: 'demo@apple.com',
            role: 'user',
            provider: 'apple'
        };
        closeModal();
    }
}

async function handleFacebookLogin() {
    try {
        showNotification('Opening Facebook login...', 'info');
        
        // Create a more realistic Facebook OAuth simulation
        const facebookAuthWindow = createFacebookAuthSimulation();
        
        // Wait for user interaction in the simulated Facebook auth
        const facebookUser = await facebookAuthWindow;
        
        if (!facebookUser) {
            showNotification('Facebook login was cancelled', 'warning');
            return;
        }
        
        showNotification('Processing Facebook login...', 'info');
        console.log('Attempting Facebook login with:', facebookUser);
        
        // Register/login with backend
        const response = await fetch(`${API_BASE_URL}/api/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: 'facebook',
                user: facebookUser,
                role: 'user'
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Login result:', result);
        
        if (result.success) {
            AppState.user = result.user;
            showNotification(`Welcome ${result.user.username}! Logged in with Facebook`, 'success');
            updateNavigationForLoggedInUser();
            closeModal();
        } else {
            showNotification('Facebook login failed: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Facebook login error:', error);
        showNotification(`Facebook login error: ${error.message}`, 'error');
    }
}

// Create realistic Facebook OAuth simulation
function createFacebookAuthSimulation() {
    return new Promise((resolve) => {
        // Create Facebook auth simulation modal
        const authModal = createModal('Continue with Facebook', `
            <div style="text-align: center; padding: 20px; background: #f0f2f5;">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" style="margin-right: 12px;" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <h3 style="margin: 0; color: #1c1e21; font-family: Helvetica, Arial, sans-serif;">Log in to Facebook</h3>
                </div>
                
                <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <input type="email" placeholder="Email address or phone number" 
                           style="width: 100%; padding: 14px; border: 1px solid #dddfe2; border-radius: 6px; margin-bottom: 12px; font-size: 16px;"
                           value="demo@facebook.com" readonly>
                    <input type="password" placeholder="Password" 
                           style="width: 100%; padding: 14px; border: 1px solid #dddfe2; border-radius: 6px; margin-bottom: 16px; font-size: 16px;"
                           value="••••••••" readonly>
                    
                    <button onclick="selectFacebookAccount('demo@facebook.com', 'Demo User')" 
                            style="width: 100%; padding: 12px; background: #1877f2; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; margin-bottom: 12px;">
                        Log In
                    </button>
                    
                    <div style="text-align: center; margin: 16px 0;">
                        <span style="color: #8a8d91; font-size: 14px;">or</span>
                    </div>
                    
                    <button onclick="selectFacebookAccount('oceanuser@facebook.com', 'Ocean Safety User')" 
                            style="width: 100%; padding: 12px; background: #42b883; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; margin-bottom: 8px;">
                        🌊 Continue as Ocean Safety User
                    </button>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button onclick="cancelFacebookAuth()" style="padding: 10px 20px; background: #e4e6ea; border: none; border-radius: 6px; cursor: pointer; color: #1c1e21;">Cancel</button>
                </div>
            </div>
        `);
        
        // Add global functions for account selection
        window.selectFacebookAccount = (email, name) => {
            // Determine role based on email/name
            let role = 'user';
            if (name.includes('Ocean Safety') || name.includes('Responder') || email.includes('oceanuser')) {
                role = 'responder';
            } else if (name.includes('Manager') || name.includes('Safety Manager') || email.includes('manager')) {
                role = 'manager';
            }
            
            const facebookUser = {
                id: 'facebook_' + Date.now(),
                email: email,
                name: name,
                provider: 'facebook',
                role: role,
                avatar: null // Will use role-based avatar
            };
            closeModal();
            resolve(facebookUser);
        };
        
        window.cancelFacebookAuth = () => {
            closeModal();
            resolve(null);
        };
    });
}

function showAlertDetails(alert) {
    createModal('Alert Details', `
        <div style="max-width: 400px;">
            <div style="background: ${alert.severity === 'high' ? '#FEE2E2' : alert.severity === 'medium' ? '#FEF3C7' : '#DBEAFE'}; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; color: ${alert.severity === 'high' ? '#DC2626' : alert.severity === 'medium' ? '#D97706' : '#2563EB'};">${alert.title}</h3>
                <p style="margin: 0; color: #374151;">${alert.description}</p>
            </div>
            <div style="margin-bottom: 12px;"><strong>Location:</strong> ${alert.location}</div>
            <div style="margin-bottom: 12px;"><strong>Severity:</strong> ${alert.severity.toUpperCase()}</div>
            <div style="margin-bottom: 16px;"><strong>Time:</strong> ${new Date(alert.created_at).toLocaleString()}</div>
            <button onclick="closeModal()" style="width: 100%; padding: 12px; background: #3B82F6; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
        </div>
    `);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
`;
document.head.appendChild(style);
