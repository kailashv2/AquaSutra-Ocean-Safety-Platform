// Enhanced Government Admin Interface JavaScript
let adminData = {
    currentUser: {
        id: 'gov001',
        name: 'Government Administrator',
        role: 'admin',
        clearance: 'Level 4',
        avatar: 'GA',
        permissions: ['approve_reports', 'reject_reports', 'manage_users', 'view_analytics', 'system_settings']
    },
    reports: [
        {
            id: 'RPT-001',
            title: 'Rip Current Warning - Miami Beach',
            type: 'hazard',
            severity: 'high',
            location: 'Miami Beach, FL',
            reporter: 'John Smith',
            timestamp: new Date(Date.now() - 3600000),
            description: 'Strong rip current observed near lifeguard station 5. Multiple swimmers affected.',
            status: 'pending',
            priority: 'high'
        },
        {
            id: 'RPT-002',
            title: 'Oil Spill Detected',
            type: 'emergency',
            severity: 'critical',
            location: 'Santa Monica Bay, CA',
            reporter: 'Coast Guard Unit',
            timestamp: new Date(Date.now() - 1800000),
            description: 'Small oil spill detected near marina. Environmental response required.',
            status: 'pending',
            priority: 'critical'
        },
        {
            id: 'RPT-003',
            title: 'Shark Sighting Alert',
            type: 'hazard',
            severity: 'medium',
            location: 'Huntington Beach, CA',
            reporter: 'Lifeguard Station 3',
            timestamp: new Date(Date.now() - 7200000),
            description: 'Great white shark spotted 200 yards offshore. Beach closure recommended.',
            status: 'pending',
            priority: 'medium'
        }
    ],
    users: [
        {
            id: 'gov001',
            name: 'Government Administrator',
            email: 'admin@gov.aquasutra.com',
            role: 'admin',
            clearance: 'Level 4',
            department: 'Ocean Safety Division',
            status: 'active',
            lastLogin: new Date(Date.now() - 300000)
        },
        {
            id: 'gov002',
            name: 'Safety Officer Johnson',
            email: 'johnson@gov.aquasutra.com',
            role: 'officer',
            clearance: 'Level 3',
            department: 'Emergency Response',
            status: 'active',
            lastLogin: new Date(Date.now() - 1800000)
        }
    ],
    auditTrail: [
        {
            id: 'AUD-001',
            action: 'Report Approved',
            user: 'Government Administrator',
            details: 'Approved report RPT-045: Beach Closure Advisory',
            timestamp: new Date(Date.now() - 900000),
            type: 'approval'
        },
        {
            id: 'AUD-002',
            action: 'User Login',
            user: 'Safety Officer Johnson',
            details: 'Successful login from IP 192.168.1.100',
            timestamp: new Date(Date.now() - 1800000),
            type: 'security'
        }
    ],
    stats: {
        pendingReports: 15,
        approvedReports: 234,
        rejectedReports: 12,
        activeUsers: 8
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏛️ Government Admin Interface Loading...');
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Initialize with staggered loading
    setTimeout(() => {
        initializeAdminInterface();
    }, 500);
    
    setTimeout(() => {
        populateDashboard();
    }, 800);
    
    setTimeout(() => {
        populateReports();
    }, 1100);
    
    setTimeout(() => {
        populateUsers();
    }, 1400);
    
    setTimeout(() => {
        populateAuditTrail();
    }, 1700);
    
    setTimeout(() => {
        startRealTimeUpdates();
        
        // Hide loading overlay with fade effect
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
        
        console.log('✅ Government Admin Interface Ready!');
        showNotification('🏛️ Government Admin Interface Ready!', 'success');
        
        // Start real-time clock
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
    }, 2000);
});

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Initialize admin interface
function initializeAdminInterface() {
    // Add smooth animations to all elements
    const elements = document.querySelectorAll('.stat-card, .nav-item, .report-card, .user-card, .audit-item');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add hover effects to navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateX(0) scale(1)';
            }
        });
    });
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections with fade effect
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.classList.remove('active');
        }, 200);
    });
    
    // Remove active class from nav items with animation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        item.style.transform = 'translateX(0) scale(1)';
    });
    
    // Show selected section with premium animation
    setTimeout(() => {
        const targetSection = document.getElementById(sectionId);
        targetSection.classList.add('active');
        
        // Premium slide-in animation
        setTimeout(() => {
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
            
            // Add bounce effect to section title
            const sectionTitle = targetSection.querySelector('.section-title, h2');
            if (sectionTitle) {
                sectionTitle.classList.add('bounce-effect');
                setTimeout(() => {
                    sectionTitle.classList.remove('bounce-effect');
                }, 1000);
            }
        }, 100);
    }, 200);
    
    // Add active class to clicked nav item with premium effect
    const activeNavItem = event.target.closest('.nav-item');
    activeNavItem.classList.add('active');
    activeNavItem.style.transform = 'translateX(8px) scale(1.02)';
    
    // Add glow effect temporarily
    activeNavItem.classList.add('premium-highlight');
    setTimeout(() => {
        activeNavItem.classList.remove('premium-highlight');
    }, 2000);
    
    showNotification(`📋 Switched to ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`, 'info');
}

// Dashboard functions
function populateDashboard() {
    // Update statistics with animation
    animateCounter('pending-count', adminData.stats.pendingReports);
    animateCounter('approved-count', adminData.stats.approvedReports);
    animateCounter('rejected-count', adminData.stats.rejectedReports);
    animateCounter('users-count', adminData.stats.activeUsers);
    
    // Populate recent activity
    const recentActivity = document.getElementById('recent-activity');
    const recentAudits = adminData.auditTrail.slice(0, 5);
    
    recentActivity.innerHTML = recentAudits.map(audit => `
        <div class="audit-item" style="margin-bottom: 12px; animation: slideInLeft 0.5s ease;">
            <div class="audit-icon">${getAuditIcon(audit.type)}</div>
            <div class="audit-content">
                <div class="audit-action">${audit.action}</div>
                <div class="audit-details">${audit.details}</div>
                <div class="audit-time">${formatTimestamp(audit.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

// Report management functions
function populateReports() {
    const reportsContainer = document.getElementById('reports-container');
    
    reportsContainer.innerHTML = adminData.reports.map((report, index) => `
        <div class="report-card" style="animation-delay: ${index * 0.1}s;">
            <div class="report-header">
                <div>
                    <div class="report-title">${report.title}</div>
                    <div class="report-badges">
                        <span class="badge ${report.severity}">${report.severity.toUpperCase()}</span>
                        <span class="badge" style="background: #E5E7EB; color: #374151;">${report.type.toUpperCase()}</span>
                    </div>
                    <div style="font-size: 14px; color: #6B7280; margin-top: 8px;">
                        📍 ${report.location} • 👤 ${report.reporter}
                    </div>
                </div>
                <div style="text-align: right; font-size: 12px; color: #9CA3AF;">
                    ${formatTimestamp(report.timestamp)}
                </div>
            </div>
            
            <div style="margin: 12px 0; color: #374151; line-height: 1.5;">
                ${report.description}
            </div>
            
            <div class="report-actions">
                <button class="btn btn-approve" onclick="approveReport('${report.id}')">
                    ✅ Approve
                </button>
                <button class="btn btn-reject" onclick="rejectReport('${report.id}')">
                    ❌ Reject
                </button>
                <button class="btn btn-view" onclick="viewReportDetails('${report.id}')">
                    👁️ Details
                </button>
            </div>
        </div>
    `).join('');
}

// User management functions
function populateUsers() {
    const usersContainer = document.getElementById('users-container');
    
    usersContainer.innerHTML = adminData.users.map((user, index) => `
        <div class="user-card" style="animation-delay: ${index * 0.1}s;">
            <div class="user-info-card">
                <div class="user-avatar">${user.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="user-details">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                    <p style="margin-top: 4px;">
                        <span class="role-badge">${user.role.toUpperCase()}</span>
                        <span style="margin-left: 8px; font-size: 12px; color: #6B7280;">
                            ${user.clearance} • ${user.department}
                        </span>
                    </p>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">
                    Last login: ${formatTimestamp(user.lastLogin)}
                </div>
                <button class="btn" style="background: #3B82F6; color: white; margin-right: 8px;" onclick="editUser('${user.id}')">
                    ✏️ Edit
                </button>
                <button class="btn" style="background: #EF4444; color: white;" onclick="deactivateUser('${user.id}')">
                    🚫 Deactivate
                </button>
            </div>
        </div>
    `).join('');
}

// Audit trail functions
function populateAuditTrail() {
    const auditTrail = document.getElementById('audit-trail');
    
    auditTrail.innerHTML = adminData.auditTrail.map((audit, index) => `
        <div class="audit-item" style="animation-delay: ${index * 0.1}s;">
            <div class="audit-icon">${getAuditIcon(audit.type)}</div>
            <div class="audit-content">
                <div class="audit-action">${audit.action}</div>
                <div class="audit-details">${audit.details}</div>
                <div class="audit-time">${formatTimestamp(audit.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

// Report action functions
function approveReport(reportId) {
    const reportIndex = adminData.reports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
        const report = adminData.reports[reportIndex];
        
        // Add to audit trail
        adminData.auditTrail.unshift({
            id: `AUD-${Date.now()}`,
            action: 'Report Approved',
            user: adminData.currentUser.name,
            details: `Approved report ${reportId}: ${report.title}`,
            timestamp: new Date(),
            type: 'approval'
        });
        
        // Remove from pending reports
        adminData.reports.splice(reportIndex, 1);
        adminData.stats.pendingReports--;
        adminData.stats.approvedReports++;
        
        showNotification(`✅ Report "${report.title}" approved successfully`, 'success');
        
        // Refresh displays
        populateReports();
        populateDashboard();
        populateAuditTrail();
    }
}

function rejectReport(reportId) {
    const reportIndex = adminData.reports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
        const report = adminData.reports[reportIndex];
        
        // Add to audit trail
        adminData.auditTrail.unshift({
            id: `AUD-${Date.now()}`,
            action: 'Report Rejected',
            user: adminData.currentUser.name,
            details: `Rejected report ${reportId}: ${report.title}`,
            timestamp: new Date(),
            type: 'rejection'
        });
        
        // Remove from pending reports
        adminData.reports.splice(reportIndex, 1);
        adminData.stats.pendingReports--;
        adminData.stats.rejectedReports++;
        
        showNotification(`❌ Report "${report.title}" rejected`, 'warning');
        
        // Refresh displays
        populateReports();
        populateDashboard();
        populateAuditTrail();
    }
}

function viewReportDetails(reportId) {
    const report = adminData.reports.find(r => r.id === reportId);
    if (report) {
        // Create detailed modal for report
        const modal = createDetailModal('Report Details', `
            <div style="max-width: 600px;">
                <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 20px;">${report.title}</h3>
                    <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                        <span style="background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${report.severity.toUpperCase()}
                        </span>
                        <span style="background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${report.type.toUpperCase()}
                        </span>
                    </div>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">📍 ${report.location}</p>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <h4 style="margin-bottom: 12px; color: #374151;">Report Details:</h4>
                    <div style="background: #F8FAFC; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <p style="margin: 0 0 8px 0; color: #374151;"><strong>Reporter:</strong> ${report.reporter}</p>
                        <p style="margin: 0 0 8px 0; color: #374151;"><strong>Time:</strong> ${formatTimestamp(report.timestamp)}</p>
                        <p style="margin: 0 0 8px 0; color: #374151;"><strong>Priority:</strong> ${report.priority}</p>
                        <p style="margin: 0; color: #374151;"><strong>Status:</strong> ${report.status}</p>
                    </div>
                    <div style="background: #F8FAFC; padding: 16px; border-radius: 8px;">
                        <h5 style="margin: 0 0 8px 0; color: #374151;">Description:</h5>
                        <p style="margin: 0; color: #374151; line-height: 1.6;">${report.description}</p>
                    </div>
                </div>
                
                <div style="text-align: center; display: flex; gap: 12px; justify-content: center;">
                    <button onclick="approveReport('${report.id}'); closeDetailModal();" style="padding: 12px 24px; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        ✅ Approve Report
                    </button>
                    <button onclick="rejectReport('${report.id}'); closeDetailModal();" style="padding: 12px 24px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        ❌ Reject Report
                    </button>
                    <button onclick="closeDetailModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `);
        
        showNotification(`👁️ Viewing details for: ${report.title}`, 'info');
    }
}

// User management functions
function addNewUser() {
    // Create add user modal
    const modal = createDetailModal('Add New User', `
        <div style="max-width: 500px;">
            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">👥</div>
                <h3 style="margin: 0 0 8px 0; font-size: 20px;">Add New Government User</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 14px;">Create a new user account with appropriate permissions</p>
            </div>
            
            <form onsubmit="handleAddUser(event)" style="margin-bottom: 24px;">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Full Name</label>
                    <input type="text" id="new-user-name" placeholder="Enter full name" 
                           style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Email Address</label>
                    <input type="email" id="new-user-email" placeholder="Enter email address" 
                           style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Role</label>
                    <select id="new-user-role" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                        <option value="">Select Role</option>
                        <option value="admin">Administrator</option>
                        <option value="officer">Safety Officer</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Department</label>
                    <input type="text" id="new-user-department" placeholder="Enter department" 
                           style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                </div>
                
                <div style="text-align: center; display: flex; gap: 12px; justify-content: center;">
                    <button type="submit" style="padding: 12px 24px; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        ➕ Create User
                    </button>
                    <button type="button" onclick="closeDetailModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);
    
    showNotification('➕ Add New User form opened', 'info');
}

function editUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        // Create edit user modal
        const modal = createDetailModal('Edit User', `
            <div style="max-width: 500px;">
                <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">✏️</div>
                    <h3 style="margin: 0 0 8px 0; font-size: 20px;">Edit User Account</h3>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">Update user information and permissions</p>
                </div>
                
                <form onsubmit="handleEditUser(event, '${userId}')" style="margin-bottom: 24px;">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Full Name</label>
                        <input type="text" id="edit-user-name" value="${user.name}" 
                               style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Email Address</label>
                        <input type="email" id="edit-user-email" value="${user.email}" 
                               style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Role</label>
                        <select id="edit-user-role" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
                            <option value="officer" ${user.role === 'officer' ? 'selected' : ''}>Safety Officer</option>
                            <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Department</label>
                        <input type="text" id="edit-user-department" value="${user.department}" 
                               style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                    </div>
                    
                    <div style="text-align: center; display: flex; gap: 12px; justify-content: center;">
                        <button type="submit" style="padding: 12px 24px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            ✏️ Update User
                        </button>
                        <button type="button" onclick="closeDetailModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `);
        
        showNotification(`✏️ Editing user: ${user.name}`, 'info');
    }
}

function deactivateUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        // Create confirmation modal
        const modal = createDetailModal('Deactivate User', `
            <div style="max-width: 400px; text-align: center;">
                <div style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🚱</div>
                    <h3 style="margin: 0 0 8px 0; font-size: 20px;">Deactivate User Account</h3>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">This action will disable the user's access</p>
                </div>
                
                <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <p style="margin: 0; color: #991B1B; font-weight: 600;">Are you sure you want to deactivate:</p>
                    <p style="margin: 8px 0 0 0; color: #991B1B; font-size: 18px; font-weight: 700;">${user.name}</p>
                    <p style="margin: 4px 0 0 0; color: #991B1B; font-size: 14px;">${user.email}</p>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button onclick="confirmDeactivateUser('${userId}'); closeDetailModal();" style="padding: 12px 24px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        🚱 Yes, Deactivate
                    </button>
                    <button onclick="closeDetailModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Cancel
                    </button>
                </div>
            </div>
        `);
        
        showNotification(`🚱 Deactivation confirmation for: ${user.name}`, 'warning');
    }
}

// Filter functions
function filterReports() {
    const filter = document.getElementById('report-filter').value;
    showNotification(`🔍 Filtering reports by: ${filter}`, 'info');
    // Filter logic would be implemented here
    populateReports();
}

function refreshReports() {
    showNotification('🔄 Refreshing reports...', 'info');
    populateReports();
}

// Utility functions
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1000;
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        
        element.textContent = currentValue;
        element.style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.1})`;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.style.transform = 'scale(1)';
        }
    }
    
    updateCounter();
}

function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
}

function getAuditIcon(type) {
    switch (type) {
        case 'approval': return '✅';
        case 'rejection': return '❌';
        case 'security': return '🔐';
        case 'user': return '👤';
        case 'system': return '⚙️';
        default: return '📋';
    }
}

// Real-time updates
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time data updates
        const randomChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        
        if (randomChange !== 0) {
            adminData.stats.pendingReports = Math.max(0, adminData.stats.pendingReports + randomChange);
            
            // Update counter with animation
            const element = document.getElementById('pending-count');
            element.style.transform = 'scale(1.2)';
            element.style.color = '#10B981';
            
            setTimeout(() => {
                element.textContent = adminData.stats.pendingReports;
                element.style.transform = 'scale(1)';
                element.style.color = '#1E40AF';
            }, 200);
        }
    }, 15000); // Update every 15 seconds
}

// Additional admin functions
function refreshDashboard() {
    showNotification('🔄 Refreshing dashboard data...', 'info');
    
    // Simulate data refresh with animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 25px 60px rgba(59, 130, 246, 0.25)';
            
            setTimeout(() => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.12)';
            }, 300);
        }, index * 100);
    });
    
    // Update stats with new values
    setTimeout(() => {
        populateDashboard();
        populateAuditTrail();
        showNotification('✅ Dashboard refreshed successfully', 'success');
    }, 1000);
}

function exportAuditLog() {
    showNotification('📄 Exporting audit log...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        const csvContent = adminData.auditTrail.map(audit => 
            `"${audit.timestamp.toISOString()}","${audit.user}","${audit.action}","${audit.details}"`
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        showNotification('✅ Audit log exported successfully', 'success');
    }, 1500);
}

function backupSettings() {
    showNotification('💾 Creating system backup...', 'info');
    
    // Simulate backup process
    setTimeout(() => {
        const backupData = {
            timestamp: new Date().toISOString(),
            users: adminData.users,
            settings: {
                sessionTimeout: 30,
                autoApprove: false
            },
            stats: adminData.stats
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        showNotification('✅ System backup created successfully', 'success');
    }, 2000);
}

// Go back to government portal
function goBackToPortal() {
    showNotification('← Returning to Government Portal...', 'info');
    
    // Add fade out animation
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'government.html';
    }, 300);
}

// Logout function
function logout() {
    showNotification('🔐 Logging out...', 'info');
    
    // Add logout animation
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'government.html';
    }, 500);
}

// Notification system
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
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        font-family: 'Inter', sans-serif;
        backdrop-filter: blur(10px);
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
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add enhanced CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    .stat-card:hover {
        animation: pulse 0.6s ease-in-out;
    }
    
    .report-card, .user-card, .audit-item {
        animation: slideInLeft 0.5s ease forwards;
    }
    
    .premium-highlight {
        animation: glow 2s infinite;
    }
    
    .bounce-effect {
        animation: bounce 1s ease;
    }
    
    /* Premium hover effects */
    .premium-card {
        position: relative;
        overflow: hidden;
    }
    
    .premium-card::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transform: rotate(45deg);
        transition: all 0.6s ease;
        opacity: 0;
    }
    
    .premium-card:hover::after {
        opacity: 1;
        transform: rotate(45deg) translate(50%, 50%);
    }
`;
document.head.appendChild(style);

// Add premium interactive features
function addPremiumFeatures() {
    // Add premium card class to all cards
    const cards = document.querySelectorAll('.stat-card, .report-card, .user-card');
    cards.forEach(card => {
        card.classList.add('premium-card');
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Initialize premium features
setTimeout(() => {
    addPremiumFeatures();
}, 2500);

// Modal system for detailed views
function createDetailModal(title, content) {
    const overlay = document.createElement('div');
    overlay.id = 'detail-modal';
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
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 0;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 0 24px;">
            <h2 style="margin: 0; color: #1E293B; font-weight: 800; font-size: 24px;">${title}</h2>
            <button onclick="closeDetailModal()" style="background: #F3F4F6; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>
        <div style="padding: 24px;">
            ${content}
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDetailModal();
    });
    
    return overlay;
}

function closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.remove();
    }
}

// Form handling functions
function handleAddUser(event) {
    event.preventDefault();
    
    const name = document.getElementById('new-user-name').value;
    const email = document.getElementById('new-user-email').value;
    const role = document.getElementById('new-user-role').value;
    const department = document.getElementById('new-user-department').value;
    
    // Create new user object
    const newUser = {
        id: 'gov' + String(Date.now()).slice(-3),
        name: name,
        email: email,
        role: role,
        clearance: role === 'admin' ? 'Level 4' : role === 'officer' ? 'Level 3' : 'Level 2',
        department: department,
        status: 'active',
        lastLogin: new Date()
    };
    
    // Add to users array
    adminData.users.push(newUser);
    adminData.stats.activeUsers++;
    
    // Add to audit trail
    adminData.auditTrail.unshift({
        id: `AUD-${Date.now()}`,
        action: 'User Created',
        user: adminData.currentUser.name,
        details: `Created new user: ${name} (${role})`,
        timestamp: new Date(),
        type: 'user'
    });
    
    closeDetailModal();
    populateUsers();
    populateDashboard();
    populateAuditTrail();
    
    showNotification(`✅ User "${name}" created successfully`, 'success');
}

function handleEditUser(event, userId) {
    event.preventDefault();
    
    const name = document.getElementById('edit-user-name').value;
    const email = document.getElementById('edit-user-email').value;
    const role = document.getElementById('edit-user-role').value;
    const department = document.getElementById('edit-user-department').value;
    
    // Find and update user
    const userIndex = adminData.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const oldName = adminData.users[userIndex].name;
        
        adminData.users[userIndex] = {
            ...adminData.users[userIndex],
            name: name,
            email: email,
            role: role,
            clearance: role === 'admin' ? 'Level 4' : role === 'officer' ? 'Level 3' : 'Level 2',
            department: department
        };
        
        // Add to audit trail
        adminData.auditTrail.unshift({
            id: `AUD-${Date.now()}`,
            action: 'User Updated',
            user: adminData.currentUser.name,
            details: `Updated user: ${oldName} -> ${name}`,
            timestamp: new Date(),
            type: 'user'
        });
        
        closeDetailModal();
        populateUsers();
        populateAuditTrail();
        
        showNotification(`✅ User "${name}" updated successfully`, 'success');
    }
}

function confirmDeactivateUser(userId) {
    const userIndex = adminData.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const user = adminData.users[userIndex];
        
        // Update user status
        adminData.users[userIndex].status = 'inactive';
        adminData.stats.activeUsers--;
        
        // Add to audit trail
        adminData.auditTrail.unshift({
            id: `AUD-${Date.now()}`,
            action: 'User Deactivated',
            user: adminData.currentUser.name,
            details: `Deactivated user: ${user.name}`,
            timestamp: new Date(),
            type: 'user'
        });
        
        populateUsers();
        populateDashboard();
        populateAuditTrail();
        
        showNotification(`🚱 User "${user.name}" deactivated`, 'warning');
    }
}
