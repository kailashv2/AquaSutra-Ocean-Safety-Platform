// My Reports Page JavaScript
const API_BASE_URL = window.location.origin;

// Global state
let currentUser = null;
let allReports = [];
let filteredReports = [];
let currentPage = 1;
const reportsPerPage = 10;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeMyReports();
});

async function initializeMyReports() {
    console.log('🔄 Initializing My Reports page...');
    
    // Check if user is logged in
    currentUser = getCurrentUser();
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    // Update navigation for logged-in user
    updateNavigationForUser();
    
    // Load user's reports
    await loadUserReports();
    
    console.log('✅ My Reports page initialized');
}

function getCurrentUser() {
    // Try to get user from localStorage or session
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

function showLoginRequired() {
    const container = document.querySelector('.reports-container');
    container.innerHTML = `
        <div class="login-required">
            <div class="login-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M32 8C18.745 8 8 18.745 8 32S18.745 56 32 56S56 45.255 56 32S45.255 8 32 8Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M24 32L28 36L40 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>Login Required</h3>
            <p>Please log in to view your hazard reports and track their status.</p>
            <div class="login-actions">
                <button class="btn-primary" onclick="showLoginModal()">Log In</button>
                <button class="btn-secondary" onclick="showSignupModal()">Sign Up</button>
            </div>
        </div>
    `;
}

async function loadUserReports() {
    try {
        showLoadingState();
        
        // For now, we'll use mock data since the backend doesn't have user-specific reports endpoint
        // In a real implementation, this would be: `/api/users/${currentUser.id}/reports`
        const mockReports = generateMockUserReports();
        
        allReports = mockReports;
        filteredReports = [...allReports];
        
        updateReportsSummary();
        renderReports();
        hideLoadingState();
        
    } catch (error) {
        console.error('Error loading user reports:', error);
        showErrorState();
    }
}

function generateMockUserReports() {
    const hazardTypes = ['high_waves', 'strong_current', 'pollution', 'marine_life', 'weather', 'debris'];
    const statuses = ['pending', 'verified', 'resolved', 'rejected'];
    const locations = ['Mumbai Coast', 'Chennai Marina', 'Goa Beaches', 'Kerala Backwaters', 'Andaman Islands'];
    
    const reports = [];
    const reportCount = Math.floor(Math.random() * 15) + 5; // 5-20 reports
    
    for (let i = 0; i < reportCount; i++) {
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
        
        reports.push({
            id: `report_${i + 1}`,
            hazard_type: hazardTypes[Math.floor(Math.random() * hazardTypes.length)],
            description: `Hazard report #${i + 1} - ${getHazardDescription(hazardTypes[Math.floor(Math.random() * hazardTypes.length)])}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            created_at: createdDate.toISOString(),
            updated_at: new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            reporter_name: currentUser?.username || 'Current User',
            reporter_email: currentUser?.email || 'user@example.com',
            latitude: 19.0760 + (Math.random() - 0.5) * 10,
            longitude: 72.8777 + (Math.random() - 0.5) * 10,
            verification_notes: Math.random() > 0.5 ? 'Report verified by coastal authorities' : null
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

function updateReportsSummary() {
    const pendingCount = allReports.filter(r => r.status === 'pending').length;
    const verifiedCount = allReports.filter(r => r.status === 'verified' || r.status === 'resolved').length;
    const totalCount = allReports.length;
    
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('verifiedCount').textContent = verifiedCount;
    document.getElementById('totalCount').textContent = totalCount;
}

function renderReports() {
    const reportsList = document.getElementById('reportsList');
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    const pageReports = filteredReports.slice(startIndex, endIndex);
    
    if (pageReports.length === 0) {
        showEmptyState();
        return;
    }
    
    reportsList.innerHTML = pageReports.map(report => `
        <div class="report-card" onclick="showReportDetails('${report.id}')">
            <div class="report-header">
                <div class="report-type">
                    <span class="hazard-icon">${getHazardIcon(report.hazard_type)}</span>
                    <span class="hazard-type">${formatHazardType(report.hazard_type)}</span>
                </div>
                <div class="report-status">
                    <span class="status-badge ${report.status}">${formatStatus(report.status)}</span>
                </div>
            </div>
            
            <div class="report-content">
                <h3 class="report-title">${report.description}</h3>
                <div class="report-meta">
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        </svg>
                        <span>${report.location}</span>
                    </div>
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
                            <path d="M8 4V8L11 11" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        <span>${formatDate(report.created_at)}</span>
                    </div>
                    <div class="meta-item severity-${report.severity}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1L15 15H1L8 1Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                            <path d="M8 6V9" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
                        </svg>
                        <span>${formatSeverity(report.severity)} Risk</span>
                    </div>
                </div>
            </div>
            
            <div class="report-footer">
                <div class="report-actions">
                    <button class="action-btn view" onclick="event.stopPropagation(); showReportDetails('${report.id}')">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8S3 3 8 3S15 8 15 8S13 13 8 13S1 8 1 8Z" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        </svg>
                        View Details
                    </button>
                    ${report.status === 'pending' ? `
                        <button class="action-btn edit" onclick="event.stopPropagation(); editReport('${report.id}')">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                            Edit
                        </button>
                    ` : ''}
                </div>
                <div class="report-updated">
                    Last updated: ${formatDate(report.updated_at)}
                </div>
            </div>
        </div>
    `).join('');
    
    updatePagination();
}

function showReportDetails(reportId) {
    const report = allReports.find(r => r.id === reportId);
    if (!report) return;
    
    const modal = document.getElementById('reportDetailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Report #${reportId}`;
    
    modalBody.innerHTML = `
        <div class="report-details">
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
                
                <div class="detail-section">
                    <h4>Location Map</h4>
                    <div id="reportMap" class="report-map"></div>
                </div>
            </div>
            
            <div class="detail-actions">
                ${report.status === 'pending' ? `
                    <button class="btn-secondary" onclick="editReport('${report.id}')">Edit Report</button>
                ` : ''}
                <button class="btn-primary" onclick="closeReportModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Initialize map after modal is shown
    setTimeout(() => {
        initializeReportMap(report);
    }, 100);
}

function initializeReportMap(report) {
    const mapContainer = document.getElementById('reportMap');
    if (!mapContainer || !report.latitude || !report.longitude) return;
    
    try {
        const map = L.map('reportMap').setView([report.latitude, report.longitude], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        const marker = L.marker([report.latitude, report.longitude]).addTo(map);
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${formatHazardType(report.hazard_type)}</h4>
                <p>${report.location}</p>
                <p><strong>Severity:</strong> ${formatSeverity(report.severity)}</p>
            </div>
        `).openPopup();
        
    } catch (error) {
        console.error('Error initializing map:', error);
        mapContainer.innerHTML = '<p>Map could not be loaded</p>';
    }
}

function closeReportModal() {
    document.getElementById('reportDetailsModal').style.display = 'none';
}

function editReport(reportId) {
    // Redirect to edit form or show edit modal
    window.location.href = `report-hazard.html?edit=${reportId}`;
}

function filterReports() {
    const statusFilter = document.getElementById('statusFilter').value;
    const hazardTypeFilter = document.getElementById('hazardTypeFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredReports = allReports.filter(report => {
        // Status filter
        if (statusFilter && report.status !== statusFilter) return false;
        
        // Hazard type filter
        if (hazardTypeFilter && report.hazard_type !== hazardTypeFilter) return false;
        
        // Date filter
        if (dateFilter) {
            const reportDate = new Date(report.created_at);
            const now = new Date();
            
            switch (dateFilter) {
                case 'today':
                    if (reportDate.toDateString() !== now.toDateString()) return false;
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (reportDate < weekAgo) return false;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    if (reportDate < monthAgo) return false;
                    break;
                case 'year':
                    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    if (reportDate < yearAgo) return false;
                    break;
            }
        }
        
        // Search filter
        if (searchTerm) {
            const searchableText = `${report.description} ${report.location} ${report.hazard_type}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    renderReports();
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderReports();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    const pagination = document.getElementById('reportsPagination');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function showLoadingState() {
    document.getElementById('reportsLoading').style.display = 'flex';
    document.getElementById('reportsEmpty').style.display = 'none';
    document.getElementById('reportsList').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('reportsLoading').style.display = 'none';
    document.getElementById('reportsList').style.display = 'block';
}

function showEmptyState() {
    document.getElementById('reportsLoading').style.display = 'none';
    document.getElementById('reportsEmpty').style.display = 'flex';
    document.getElementById('reportsList').style.display = 'none';
}

function showErrorState() {
    const container = document.querySelector('.reports-container');
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M32 16V32" stroke="currentColor" stroke-width="2"/>
                    <circle cx="32" cy="44" r="2" fill="currentColor"/>
                </svg>
            </div>
            <h3>Error Loading Reports</h3>
            <p>We couldn't load your reports. Please try again later.</p>
            <button class="btn-primary" onclick="loadUserReports()">Retry</button>
        </div>
    `;
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

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString();
}

function updateNavigationForUser() {
    const navActions = document.getElementById('navActions');
    if (currentUser && navActions) {
        navActions.innerHTML = `
            <div class="user-profile">
                <span class="user-name">Welcome, ${currentUser.username}</span>
                <button class="btn-secondary" onclick="logout()">Logout</button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('aquasutra_user');
    localStorage.removeItem('aquasutra_token');
    window.location.href = 'index.html';
}

// Modal functions (if not already defined)
function showLoginModal() {
    // Implementation depends on your existing auth system
    window.location.href = 'index.html#login';
}

function showSignupModal() {
    // Implementation depends on your existing auth system
    window.location.href = 'index.html#signup';
}
