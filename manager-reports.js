// Manager Reports Dashboard JavaScript
const API_BASE_URL = window.location.origin;

// Global state
let currentUser = null;
let allReports = [];
let filteredReports = [];
let managerMap = null;
let heatmapLayer = null;
let markersLayer = null;
let currentReportId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeManagerDashboard();
});

async function initializeManagerDashboard() {
    console.log('🔄 Initializing Manager Dashboard...');
    
    // Check if user is logged in and has manager permissions
    currentUser = getCurrentUser();
    if (!currentUser || !hasManagerPermissions()) {
        showAccessDenied();
        return;
    }
    
    // Initialize map
    initializeEnhancedMap();
    
    // Load reports data
    await loadAllReports();
    
    // Update dashboard overview
    updateDashboardOverview();
    
    console.log('✅ Manager Dashboard initialized');
}

function getCurrentUser() {
    const userData = localStorage.getItem('aquasutra_user');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    return null;
}

function hasManagerPermissions() {
    return currentUser && (currentUser.role === 'manager' || currentUser.role === 'admin');
}

function showAccessDenied() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="access-denied">
            <div class="access-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M22 22L42 42M22 42L42 22" stroke="currentColor" stroke-width="2"/>
                </svg>
            </div>
            <h3>Access Denied</h3>
            <p>You need manager permissions to access this dashboard.</p>
            <button class="btn-primary" onclick="window.location.href='index.html'">Return Home</button>
        </div>
    `;
}

function initializeEnhancedMap() {
    try {
        // Initialize map centered on India
        managerMap = L.map('managerMap').setView([20.5937, 78.9629], 5);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(managerMap);
        
        // Initialize layers
        markersLayer = L.layerGroup().addTo(managerMap);
        
        console.log('✅ Enhanced map initialized');
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

async function loadAllReports() {
    try {
        showLoadingState();
        
        // For demo purposes, generate mock data
        // In production, this would fetch from: /api/reports/all
        allReports = generateMockManagerReports();
        filteredReports = [...allReports];
        
        renderReports();
        updateMapData();
        hideLoadingState();
        
    } catch (error) {
        console.error('Error loading reports:', error);
        showErrorState();
    }
}

function generateMockManagerReports() {
    const hazardTypes = ['high_waves', 'strong_current', 'pollution', 'marine_life', 'weather', 'debris'];
    const statuses = ['pending', 'verified', 'resolved', 'rejected'];
    const severities = ['low', 'medium', 'high'];
    const locations = [
        { name: 'Mumbai Coast', lat: 19.0760, lng: 72.8777 },
        { name: 'Chennai Marina', lat: 13.0827, lng: 80.2707 },
        { name: 'Goa Beaches', lat: 15.2993, lng: 74.1240 },
        { name: 'Kerala Backwaters', lat: 9.9312, lng: 76.2673 },
        { name: 'Andaman Islands', lat: 11.7401, lng: 92.6586 },
        { name: 'Kolkata Port', lat: 22.5726, lng: 88.3639 },
        { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 }
    ];
    
    const reports = [];
    const reportCount = Math.floor(Math.random() * 30) + 20; // 20-50 reports
    
    for (let i = 0; i < reportCount; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Last 30 days
        
        reports.push({
            id: `report_${i + 1}`,
            hazard_type: hazardTypes[Math.floor(Math.random() * hazardTypes.length)],
            description: `Hazard report from citizen - ${getHazardDescription(hazardTypes[Math.floor(Math.random() * hazardTypes.length)])}`,
            location: location.name,
            latitude: location.lat + (Math.random() - 0.5) * 0.5,
            longitude: location.lng + (Math.random() - 0.5) * 0.5,
            severity: severities[Math.floor(Math.random() * severities.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            created_at: createdDate.toISOString(),
            updated_at: new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            reporter_name: `Citizen ${i + 1}`,
            reporter_email: `citizen${i + 1}@example.com`,
            verification_notes: Math.random() > 0.7 ? 'Verified by coastal patrol team' : null
        });
    }
    
    return reports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getHazardDescription(type) {
    const descriptions = {
        high_waves: 'Dangerous wave conditions observed',
        strong_current: 'Strong rip currents detected',
        pollution: 'Water pollution or oil spill reported',
        marine_life: 'Dangerous marine life sighting',
        weather: 'Severe weather conditions',
        debris: 'Floating debris hazard'
    };
    return descriptions[type] || 'Ocean hazard reported';
}

function updateDashboardOverview() {
    const urgentCount = allReports.filter(r => r.severity === 'high' && r.status === 'pending').length;
    const pendingCount = allReports.filter(r => r.status === 'pending').length;
    const verifiedToday = allReports.filter(r => {
        const today = new Date().toDateString();
        return r.status === 'verified' && new Date(r.updated_at).toDateString() === today;
    }).length;
    const totalCount = allReports.length;
    
    document.getElementById('urgentReports').textContent = urgentCount;
    document.getElementById('pendingReports').textContent = pendingCount;
    document.getElementById('verifiedReports').textContent = verifiedToday;
    document.getElementById('totalReports').textContent = totalCount;
}

function renderReports() {
    const reportsList = document.getElementById('reportsList');
    const recentReports = filteredReports.slice(0, 10); // Show latest 10
    
    if (recentReports.length === 0) {
        reportsList.innerHTML = '<div class="no-reports">No reports found</div>';
        return;
    }
    
    reportsList.innerHTML = recentReports.map(report => `
        <div class="manager-report-card ${report.status}" onclick="showReportDetails('${report.id}')">
            <div class="report-priority ${report.severity}"></div>
            <div class="report-content">
                <div class="report-header">
                    <span class="hazard-icon">${getHazardIcon(report.hazard_type)}</span>
                    <span class="hazard-type">${formatHazardType(report.hazard_type)}</span>
                    <span class="status-badge ${report.status}">${formatStatus(report.status)}</span>
                </div>
                <h4 class="report-title">${report.description}</h4>
                <div class="report-meta">
                    <span class="location">📍 ${report.location}</span>
                    <span class="reporter">👤 ${report.reporter_name}</span>
                    <span class="time">⏰ ${formatTimeAgo(report.created_at)}</span>
                </div>
            </div>
            <div class="report-actions">
                ${report.status === 'pending' ? `
                    <button class="action-btn verify" onclick="event.stopPropagation(); showVerificationModal('${report.id}')">
                        Verify
                    </button>
                ` : ''}
                <button class="action-btn view" onclick="event.stopPropagation(); showReportDetails('${report.id}')">
                    View
                </button>
            </div>
        </div>
    `).join('');
}

function updateMapData() {
    if (!managerMap || !markersLayer) return;
    
    // Clear existing markers
    markersLayer.clearLayers();
    
    // Add markers for each report
    filteredReports.forEach(report => {
        if (report.latitude && report.longitude) {
            const color = getSeverityColor(report.severity);
            const icon = getStatusIcon(report.status);
            
            const marker = L.circleMarker([report.latitude, report.longitude], {
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                radius: report.severity === 'high' ? 10 : report.severity === 'medium' ? 7 : 5,
                weight: 2
            }).addTo(markersLayer);
            
            marker.bindPopup(`
                <div class="map-popup">
                    <h4>${icon} ${formatHazardType(report.hazard_type)}</h4>
                    <p><strong>Location:</strong> ${report.location}</p>
                    <p><strong>Severity:</strong> ${formatSeverity(report.severity)}</p>
                    <p><strong>Status:</strong> ${formatStatus(report.status)}</p>
                    <p><strong>Reporter:</strong> ${report.reporter_name}</p>
                    <button onclick="showReportDetails('${report.id}')" class="btn-primary btn-sm">View Details</button>
                </div>
            `);
        }
    });
    
    // Update heatmap if enabled
    updateHeatmap();
}

function updateHeatmap() {
    if (heatmapLayer) {
        managerMap.removeLayer(heatmapLayer);
    }
    
    const heatData = filteredReports
        .filter(r => r.latitude && r.longitude)
        .map(r => {
            const intensity = r.severity === 'high' ? 1.0 : r.severity === 'medium' ? 0.6 : 0.3;
            return [r.latitude, r.longitude, intensity];
        });
    
    if (heatData.length > 0 && typeof L.heatLayer === 'function') {
        heatmapLayer = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
                0.0: 'blue',
                0.3: 'cyan',
                0.5: 'lime',
                0.7: 'yellow',
                1.0: 'red'
            }
        });
    }
}

function toggleHeatmap() {
    const btn = document.getElementById('toggleHeatmap');
    if (heatmapLayer && managerMap.hasLayer(heatmapLayer)) {
        managerMap.removeLayer(heatmapLayer);
        btn.classList.remove('active');
    } else if (heatmapLayer) {
        managerMap.addLayer(heatmapLayer);
        btn.classList.add('active');
    }
}

function togglePins() {
    const btn = document.getElementById('togglePins');
    if (markersLayer && managerMap.hasLayer(markersLayer)) {
        managerMap.removeLayer(markersLayer);
        btn.classList.remove('active');
    } else if (markersLayer) {
        managerMap.addLayer(markersLayer);
        btn.classList.add('active');
    }
}

function centerMap() {
    if (managerMap) {
        managerMap.setView([20.5937, 78.9629], 5);
    }
}

function filterReports() {
    const statusFilter = document.getElementById('statusFilter').value;
    const severityFilter = document.getElementById('severityFilter').value;
    
    filteredReports = allReports.filter(report => {
        if (statusFilter && report.status !== statusFilter) return false;
        if (severityFilter && report.severity !== severityFilter) return false;
        return true;
    });
    
    renderReports();
    updateMapData();
}

function showReportDetails(reportId) {
    const report = allReports.find(r => r.id === reportId);
    if (!report) return;
    
    const modal = document.getElementById('reportDetailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Report #${reportId}`;
    
    modalBody.innerHTML = `
        <div class="report-details-manager">
            <div class="detail-header">
                <div class="detail-status">
                    <span class="status-badge ${report.status}">${formatStatus(report.status)}</span>
                    <span class="severity-badge severity-${report.severity}">${formatSeverity(report.severity)} Risk</span>
                </div>
                <div class="detail-dates">
                    <div>Submitted: ${formatDateTime(report.created_at)}</div>
                    <div>Updated: ${formatDateTime(report.updated_at)}</div>
                </div>
            </div>
            
            <div class="detail-content">
                <div class="detail-section">
                    <h4>Hazard Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Type:</label>
                            <span>${getHazardIcon(report.hazard_type)} ${formatHazardType(report.hazard_type)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Location:</label>
                            <span>${report.location}</span>
                        </div>
                        <div class="detail-item">
                            <label>Coordinates:</label>
                            <span>${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Severity:</label>
                            <span class="severity-${report.severity}">${formatSeverity(report.severity)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Reporter Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Name:</label>
                            <span>${report.reporter_name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${report.reporter_email}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Description</h4>
                    <p class="description-text">${report.description}</p>
                </div>
                
                ${report.verification_notes ? `
                    <div class="detail-section">
                        <h4>Verification Notes</h4>
                        <div class="verification-notes">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
                                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            <p>${report.verification_notes}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="detail-actions">
                ${report.status === 'pending' ? `
                    <button class="btn-primary" onclick="showVerificationModal('${report.id}')">Verify Report</button>
                ` : ''}
                <button class="btn-secondary" onclick="focusOnMap('${report.id}')">Show on Map</button>
                <button class="btn-secondary" onclick="closeReportModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function showVerificationModal(reportId) {
    currentReportId = reportId;
    const modal = document.getElementById('verificationModal');
    modal.style.display = 'flex';
    
    // Reset form
    document.getElementById('verificationForm').reset();
}

function closeReportModal() {
    document.getElementById('reportDetailsModal').style.display = 'none';
}

function closeVerificationModal() {
    document.getElementById('verificationModal').style.display = 'none';
    currentReportId = null;
}

function focusOnMap(reportId) {
    const report = allReports.find(r => r.id === reportId);
    if (report && report.latitude && report.longitude && managerMap) {
        managerMap.setView([report.latitude, report.longitude], 12);
        closeReportModal();
    }
}

// Handle verification form submission
document.getElementById('verificationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const status = document.getElementById('verificationStatus').value;
    const notes = document.getElementById('verificationNotes').value;
    
    if (!currentReportId || !status) return;
    
    try {
        // In production, this would call: PUT /api/reports/${currentReportId}/verify
        await updateReportStatus(currentReportId, status, notes);
        
        closeVerificationModal();
        await loadAllReports(); // Refresh data
        updateDashboardOverview();
        
        showNotification('Report status updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating report:', error);
        showNotification('Error updating report status', 'error');
    }
});

async function updateReportStatus(reportId, status, notes) {
    // Mock implementation - in production this would be an API call
    const report = allReports.find(r => r.id === reportId);
    if (report) {
        report.status = status;
        report.verification_notes = notes;
        report.updated_at = new Date().toISOString();
    }
}

function refreshReports() {
    loadAllReports();
    showNotification('Reports refreshed', 'info');
}

function exportReports() {
    // Mock export functionality
    showNotification('Export functionality coming soon!', 'info');
}

// Utility functions
function getHazardIcon(type) {
    const icons = {
        high_waves: '🌊',
        strong_current: '🌀',
        pollution: '🛢️',
        marine_life: '🦈',
        weather: '⛈️',
        debris: '🗑️'
    };
    return icons[type] || '⚠️';
}

function formatHazardType(type) {
    const types = {
        high_waves: 'High Waves',
        strong_current: 'Strong Current',
        pollution: 'Pollution',
        marine_life: 'Marine Life',
        weather: 'Weather',
        debris: 'Debris'
    };
    return types[type] || 'Other';
}

function formatStatus(status) {
    const statuses = {
        pending: 'Pending Review',
        verified: 'Verified',
        resolved: 'Resolved',
        rejected: 'Rejected'
    };
    return statuses[status] || status;
}

function formatSeverity(severity) {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString();
}

function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
}

function getSeverityColor(severity) {
    const colors = {
        high: '#EF4444',
        medium: '#F59E0B',
        low: '#10B981'
    };
    return colors[severity] || colors.low;
}

function getStatusIcon(status) {
    const icons = {
        pending: '⏳',
        verified: '✅',
        resolved: '🔒',
        rejected: '❌'
    };
    return icons[status] || '❓';
}

function showLoadingState() {
    document.getElementById('reportsLoading').style.display = 'flex';
    document.getElementById('reportsList').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('reportsLoading').style.display = 'none';
    document.getElementById('reportsList').style.display = 'block';
}

function showErrorState() {
    const container = document.getElementById('reportsContainer');
    container.innerHTML = `
        <div class="error-state">
            <h3>Error Loading Reports</h3>
            <p>Unable to load reports. Please try again.</p>
            <button class="btn-primary" onclick="loadAllReports()">Retry</button>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    // Use existing notification system if available
    if (typeof createNotification === 'function') {
        createNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}
