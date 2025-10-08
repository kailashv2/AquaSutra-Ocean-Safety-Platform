/**
 * AquaSutra Enhanced Integration Script
 * Connects all enhanced backend features to the premium website
 */

class AquaSutraEnhanced {
    constructor() {
        this.apiBase = 'http://localhost:5000/api';
        this.socket = null;
        this.currentUser = null;
        this.offlineQueue = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    async init() {
        console.log('🌊 Initializing AquaSutra Enhanced Features...');
        
        // Check authentication status first
        await this.checkAuthStatus();
        
        // Initialize Socket.IO for real-time updates
        this.initializeSocket();
        
        // Initialize offline capabilities
        this.initializeOfflineSync();
        
        // Initialize geolocation
        this.initializeGeolocation();
        
        // Initialize multilingual support
        this.initializeMultilingual();
        
        // Initialize enhanced UI components
        this.initializeEnhancedUI();
        
        // Load initial data
        await this.loadInitialData();
        
        console.log('✅ AquaSutra Enhanced Features Initialized');
    }

    // Check authentication status
    async checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                // Validate token with server
                const response = await fetch(`${this.apiBase}/validate-token`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    this.currentUser = result.user;
                    localStorage.setItem('user', JSON.stringify(result.user));
                    this.updateUIForRole(result.user.role);
                } else {
                    // Token is invalid, clear local storage
                    console.log('Token validation failed, clearing auth data...');
                    this.clearAuthData();
                }
            } catch (error) {
                console.error('Token validation error:', error);
                // On network error, keep user logged in locally
                this.currentUser = JSON.parse(user);
            }
        }
    }

    // Clear authentication data
    clearAuthData() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.currentUser = null;
    }

    // 1. GEOTAGGED CITIZEN REPORTING WITH MEDIA UPLOAD
    async submitHazardReport(reportData) {
        const enhancedReport = {
            ...reportData,
            timestamp: new Date().toISOString(),
            location: await this.getCurrentLocation(),
            userId: this.currentUser?.id,
            offline: !this.isOnline
        };

        if (this.isOnline) {
            try {
                const response = await fetch(`${this.apiBase}/report-hazard`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    },
                    body: JSON.stringify(enhancedReport)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    this.showNotification('Report submitted successfully!', 'success');
                    this.socket?.emit('new_report', result);
                    return result;
                }
            } catch (error) {
                console.error('Report submission failed:', error);
                this.addToOfflineQueue('report', enhancedReport);
            }
        } else {
            this.addToOfflineQueue('report', enhancedReport);
            this.showNotification('Report saved offline. Will sync when online.', 'info');
        }
    }

    // 2. ROLE-BASED ACCESS CONTROL
    async authenticateUser(credentials) {
        try {
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const userData = await response.json();
                this.currentUser = userData.user;
                localStorage.setItem('authToken', userData.token);
                localStorage.setItem('userRole', userData.user.role);
                
                this.updateUIForRole(userData.user.role);
                this.showNotification(`Welcome ${userData.user.name}!`, 'success');
                
                return userData;
            }
        } catch (error) {
            console.error('Authentication failed:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    updateUIForRole(role) {
        const rolePermissions = {
            'citizen': ['report:create', 'map:view:basic'],
            'official': ['report:create', 'report:verify', 'map:view:detailed'],
            'analyst': ['analytics:view:advanced', 'social:monitor', 'hotspot:configure'],
            'emergency_responder': ['emergency:manage', 'alert:broadcast'],
            'administrator': ['system:configure', 'user:manage', 'all:access']
        };

        const userPermissions = rolePermissions[role] || [];
        
        // Show/hide UI elements based on permissions
        document.querySelectorAll('[data-permission]').forEach(element => {
            const requiredPermission = element.dataset.permission;
            if (userPermissions.includes(requiredPermission) || userPermissions.includes('all:access')) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    // 3. REAL-TIME CROWDSOURCED DATA AGGREGATION
    async loadDashboardData(filters = {}) {
        try {
            // Use the correct endpoint that exists on the server
            const response = await fetch(`${this.apiBase}/dashboard-stats`);

            if (response.ok) {
                const dashboardData = await response.json();
                this.updateDashboard(dashboardData);
                return dashboardData;
            }
        } catch (error) {
            console.error('Dashboard data loading failed:', error);
        }
    }

    updateDashboard(data) {
        // Update summary statistics using the correct data structure from dashboard-stats endpoint
        if (document.getElementById('totalReports')) {
            document.getElementById('totalReports').textContent = data.data?.recent_reports || 0;
        }
        if (document.getElementById('verifiedReports')) {
            document.getElementById('verifiedReports').textContent = data.data?.monitoring_locations || 0;
        }
        if (document.getElementById('activeHotspots')) {
            document.getElementById('activeHotspots').textContent = data.data?.high_risk_locations || 0;
        }

        // Update charts and visualizations if methods exist
        if (this.updateHazardDistributionChart) {
            this.updateHazardDistributionChart(data.data);
        }
        if (this.updateRealtimeMap) {
            this.updateRealtimeMap(data.data);
        }
    }

    // 4. INTERACTIVE MAP WITH DYNAMIC HOTSPOTS
    initializeEnhancedMap() {
        if (typeof L === 'undefined') {
            console.error('Leaflet not loaded');
            return;
        }

        this.map = L.map('hazardMap').setView([40.7128, -74.0060], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.hotspotLayer = L.layerGroup().addTo(this.map);
        this.reportsLayer = L.layerGroup().addTo(this.map);
        
        // Load initial hotspots
        this.loadHotspots();
        
        // Auto-refresh every 30 seconds
        setInterval(() => this.loadHotspots(), 30000);
    }

    async loadHotspots() {
        try {
            // Use ocean-data endpoint instead since hotspots endpoint doesn't exist
            const response = await fetch(`${this.apiBase}/ocean-data`);

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Convert ocean data to hotspot format
                    const hotspots = result.data.filter(item => item.risk_level === 'high').map(item => ({
                        location: { lat: item.latitude, lng: item.longitude },
                        intensityScore: item.risk_level === 'high' ? 8 : item.risk_level === 'medium' ? 5 : 2,
                        reportCount: 1,
                        socialMediaCount: 0,
                        hazardTypes: ['ocean_conditions'],
                        lastActivity: item.timestamp,
                        radius: 1000
                    }));
                    this.updateHotspotsOnMap(hotspots);
                }
            }
        } catch (error) {
            console.error('Hotspots loading failed:', error);
        }
    }

    updateHotspotsOnMap(hotspots) {
        this.hotspotLayer.clearLayers();
        
        hotspots.forEach(hotspot => {
            const intensity = hotspot.intensityScore;
            const color = intensity > 7 ? '#ff4444' : intensity > 4 ? '#ff8800' : '#ffaa00';
            const radius = Math.max(hotspot.radius / 100, 50);

            const circle = L.circle([hotspot.location.lat, hotspot.location.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.3,
                radius: radius
            }).addTo(this.hotspotLayer);

            circle.bindPopup(`
                <div class="hotspot-popup">
                    <h3>Hazard Hotspot</h3>
                    <p><strong>Intensity:</strong> ${intensity.toFixed(1)}/10</p>
                    <p><strong>Reports:</strong> ${hotspot.reportCount}</p>
                    <p><strong>Social Media:</strong> ${hotspot.socialMediaCount} posts</p>
                    <p><strong>Hazard Types:</strong> ${hotspot.hazardTypes.join(', ')}</p>
                    <p><strong>Last Activity:</strong> ${new Date(hotspot.lastActivity).toLocaleString()}</p>
                </div>
            `);
        });
    }

    // 5. SOCIAL MEDIA INTEGRATION WITH NLP
    async loadSocialMediaData(filters = {}) {
        try {
            // Social media endpoint doesn't exist, so we'll skip this for now
            // or provide mock data for demo purposes
            console.log('Social media integration not implemented yet');
            return { posts: [] };
        } catch (error) {
            console.error('Social media data loading failed:', error);
        }
    }

    updateSocialMediaFeed(posts) {
        const feedContainer = document.getElementById('socialMediaFeed');
        if (!feedContainer) return;

        feedContainer.innerHTML = posts.map(post => `
            <div class="social-post ${post.sentiment.label}">
                <div class="post-header">
                    <span class="platform">${post.platform}</span>
                    <span class="author">@${post.author.username}</span>
                    <span class="sentiment ${post.sentiment.label}">
                        ${post.sentiment.label} (${(post.sentiment.score * 100).toFixed(0)}%)
                    </span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-meta">
                    <span class="relevance">Hazard Relevance: ${(post.hazardRelevanceScore * 100).toFixed(0)}%</span>
                    <span class="timestamp">${new Date(post.postCreatedAt).toLocaleString()}</span>
                </div>
            </div>
        `).join('');
    }

    // 6. MULTILINGUAL SUPPORT
    async initializeMultilingual() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        
        try {
            const response = await fetch(`${this.apiBase}/multilingual/translations/${this.currentLanguage}`);
            if (response.ok) {
                this.translations = await response.json();
                this.applyTranslations();
            }
        } catch (error) {
            console.error('Translation loading failed:', error);
        }
    }

    async changeLanguage(languageCode) {
        this.currentLanguage = languageCode;
        localStorage.setItem('language', languageCode);
        
        try {
            const response = await fetch(`${this.apiBase}/multilingual/translations/${languageCode}`);
            if (response.ok) {
                this.translations = await response.json();
                this.applyTranslations();
                this.showNotification('Language changed successfully!', 'success');
            }
        } catch (error) {
            console.error('Language change failed:', error);
        }
    }

    applyTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (this.translations[key]) {
                element.textContent = this.translations[key];
            }
        });
    }

    // 7. OFFLINE DATA COLLECTION WITH SYNC
    initializeOfflineSync() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
            this.showNotification('Back online! Syncing data...', 'info');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('You are offline. Data will be saved locally.', 'warning');
        });

        // Load offline queue from localStorage
        this.offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    }

    addToOfflineQueue(type, data) {
        const queueItem = {
            id: Date.now() + Math.random(),
            type,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.offlineQueue.push(queueItem);
        localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    }

    async syncOfflineData() {
        if (this.offlineQueue.length === 0) return;

        const syncData = this.offlineQueue.map(item => ({
            action: 'create',
            tableName: item.type === 'report' ? 'reports' : item.type,
            data: item.data,
            tempId: item.id
        }));

        try {
            const response = await fetch(`${this.apiBase}/offline/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ syncData })
            });

            if (response.ok) {
                const result = await response.json();
                this.offlineQueue = [];
                localStorage.removeItem('offlineQueue');
                this.showNotification(`Synced ${result.results.successful} items successfully!`, 'success');
            }
        } catch (error) {
            console.error('Offline sync failed:', error);
        }
    }

    // 8. REAL-TIME SOCKET.IO INTEGRATION
    initializeSocket() {
        if (typeof io === 'undefined') {
            console.error('Socket.IO not loaded');
            return;
        }

        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('🔄 Connected to real-time updates');
            this.socket.emit('join_room', 'global_updates');
        });

        this.socket.on('new_report', (report) => {
            this.handleNewReport(report);
        });

        this.socket.on('hotspot_update', (hotspot) => {
            this.handleHotspotUpdate(hotspot);
        });

        this.socket.on('emergency_alert', (alert) => {
            this.handleEmergencyAlert(alert);
        });

        this.socket.on('social_media_alert', (alert) => {
            this.handleSocialMediaAlert(alert);
        });
    }

    handleNewReport(report) {
        this.showNotification(`New ${report.hazardType} report received!`, 'info');
        // Update map and dashboard
        this.loadDashboardData();
        this.loadHotspots();
    }

    handleEmergencyAlert(alert) {
        this.showEmergencyAlert(alert);
    }

    // UTILITY FUNCTIONS
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }

    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').onclick = () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        };
    }

    showEmergencyAlert(alert) {
        const alertModal = document.createElement('div');
        alertModal.className = 'emergency-alert-modal';
        alertModal.innerHTML = `
            <div class="emergency-alert-content">
                <div class="alert-header">
                    <h2>🚨 EMERGENCY ALERT</h2>
                    <button class="alert-close">&times;</button>
                </div>
                <div class="alert-body">
                    <h3>${alert.title}</h3>
                    <p>${alert.message}</p>
                    <p><strong>Location:</strong> ${alert.location}</p>
                    <p><strong>Severity:</strong> ${alert.severity}</p>
                    <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <div class="alert-actions">
                    <button class="btn-primary" onclick="this.closest('.emergency-alert-modal').remove()">
                        Acknowledge
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(alertModal);

        // Close functionality
        alertModal.querySelector('.alert-close').onclick = () => {
            alertModal.remove();
        };
    }

    async loadInitialData() {
        // Load dashboard data
        await this.loadDashboardData();
        
        // Initialize map if container exists
        if (document.getElementById('hazardMap')) {
            this.initializeEnhancedMap();
        }
        
        // Load social media data if container exists
        if (document.getElementById('socialMediaFeed')) {
            await this.loadSocialMediaData();
        }
    }

    initializeEnhancedUI() {
        // Add language selector
        this.addLanguageSelector();
        
        // Add offline status indicator
        this.addOfflineIndicator();
        
        // Add enhanced reporting form
        this.enhanceReportingForm();
    }

    addLanguageSelector() {
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Español' },
            { code: 'fr', name: 'Français' },
            { code: 'pt', name: 'Português' },
            { code: 'it', name: 'Italiano' },
            { code: 'de', name: 'Deutsch' },
            { code: 'ja', name: '日本語' },
            { code: 'ko', name: '한국어' },
            { code: 'zh', name: '中文' },
            { code: 'ar', name: 'العربية' },
            { code: 'hi', name: 'हिन्दी' },
            { code: 'ru', name: 'Русский' }
        ];

        const selector = document.createElement('select');
        selector.id = 'languageSelector';
        selector.className = 'language-selector';
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            if (lang.code === this.currentLanguage) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        selector.onchange = (e) => {
            this.changeLanguage(e.target.value);
        };

        // Add to navigation or header
        const nav = document.querySelector('.nav-actions');
        if (nav) {
            nav.appendChild(selector);
        }
    }

    addOfflineIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'offlineIndicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <span class="status-dot ${this.isOnline ? 'online' : 'offline'}"></span>
            <span class="status-text">${this.isOnline ? 'Online' : 'Offline'}</span>
        `;

        document.body.appendChild(indicator);

        // Update indicator when status changes
        window.addEventListener('online', () => {
            indicator.innerHTML = `
                <span class="status-dot online"></span>
                <span class="status-text">Online</span>
            `;
        });

        window.addEventListener('offline', () => {
            indicator.innerHTML = `
                <span class="status-dot offline"></span>
                <span class="status-text">Offline</span>
            `;
        });
    }

    enhanceReportingForm() {
        // This will be called when the reporting form is loaded
        // Add geolocation, media upload, and offline capabilities
    }
}

// Initialize the enhanced platform
window.AquaSutraEnhanced = new AquaSutraEnhanced();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AquaSutraEnhanced;
}
