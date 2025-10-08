// Role-based Navigation System for AquaSutra
class RoleBasedNavigation {
    constructor() {
        this.currentUser = null;
        this.navigationConfig = {
            citizen: [
                { name: 'Home', href: 'index.html', icon: '🏠' },
                { name: 'Live Map', href: 'hazard-map.html', icon: '🗺️' },
                { name: 'Report Hazard', href: 'report-hazard.html', icon: '⚠️' },
                { name: 'My Reports', href: 'my-reports.html', icon: '📋' },
                { name: 'Resources', href: 'resources.html', icon: '📚' }
            ],
            manager: [
                { name: 'Home', href: 'index.html', icon: '🏠' },
                { name: 'Dashboard', href: 'premium-dashboard.html', icon: '📊' },
                { name: 'Live Map', href: 'hazard-map.html', icon: '🗺️' },
                { name: 'Analytics', href: 'analytics.html', icon: '📈' },
                { name: 'All Reports', href: 'manager-reports.html', icon: '📋' },
                { name: 'Government', href: 'government.html', icon: '🏛️' }
            ],
            admin: [
                { name: 'Home', href: 'index.html', icon: '🏠' },
                { name: 'Admin Dashboard', href: 'admin-dashboard.html', icon: '⚙️' },
                { name: 'User Management', href: 'user-management.html', icon: '👥' },
                { name: 'System Analytics', href: 'analytics-enhanced.html', icon: '📊' },
                { name: 'All Reports', href: 'manager-reports.html', icon: '📋' },
                { name: 'Settings', href: 'admin-settings.html', icon: '🔧' }
            ]
        };
        this.init();
    }

    init() {
        // Load current user from localStorage or session
        this.loadCurrentUser();
        
        // Update navigation based on user role
        this.updateNavigation();
        
        // Listen for user login/logout events
        this.setupEventListeners();
    }

    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.currentUser = null;
        }
    }

    updateNavigation() {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;

        // Determine user role (default to 'citizen' if not logged in)
        const userRole = this.currentUser?.role || 'citizen';
        
        // Get navigation items for the user's role
        const navItems = this.navigationConfig[userRole] || this.navigationConfig.citizen;
        
        // Clear existing navigation
        navMenu.innerHTML = '';
        
        // Add navigation items
        navItems.forEach(item => {
            const navLink = document.createElement('a');
            navLink.href = item.href;
            navLink.className = 'nav-link';
            navLink.innerHTML = `${item.icon} ${item.name}`;
            
            // Add active class if current page
            if (this.isCurrentPage(item.href)) {
                navLink.classList.add('active');
            }
            
            navMenu.appendChild(navLink);
        });

        // Update user actions in navigation
        this.updateUserActions();
    }

    updateUserActions() {
        const navActions = document.getElementById('navActions');
        if (!navActions) return;

        if (this.currentUser) {
            // User is logged in - show user profile
            navActions.innerHTML = `
                <div class="user-profile-nav">
                    <div class="user-avatar-nav ${this.getUserAvatarClass()}">
                        ${this.getUserAvatarIcon()}
                    </div>
                    <div class="user-info-nav">
                        <span class="user-name-nav">${this.currentUser.username}</span>
                        <span class="user-role-nav">${this.formatRole(this.currentUser.role)}</span>
                    </div>
                    <div class="user-dropdown">
                        <button class="dropdown-toggle" onclick="toggleUserDropdown()">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <div class="dropdown-menu" id="userDropdownMenu">
                            <a href="#" class="dropdown-item" onclick="showProfileModal()">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
                                    <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="currentColor"/>
                                </svg>
                                Profile
                            </a>
                            <a href="#" class="dropdown-item" onclick="showSettingsModal()">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                    <path d="M13.4 8C13.4 8.5 13.3 9 13.1 9.4L14.5 10.5C14.6 10.6 14.6 10.8 14.5 10.9L13.1 13.1C13 13.2 12.8 13.2 12.7 13.1L11 12.3C10.6 12.6 10.1 12.8 9.6 12.9L9.4 14.8C9.4 14.9 9.3 15 9.2 15H6.8C6.7 15 6.6 14.9 6.6 14.8L6.4 12.9C5.9 12.8 5.4 12.6 5 12.3L3.3 13.1C3.2 13.2 3 13.2 2.9 13.1L1.5 10.9C1.4 10.8 1.4 10.6 1.5 10.5L2.9 9.4C2.7 9 2.6 8.5 2.6 8C2.6 7.5 2.7 7 2.9 6.6L1.5 5.5C1.4 5.4 1.4 5.2 1.5 5.1L2.9 2.9C3 2.8 3.2 2.8 3.3 2.9L5 3.7C5.4 3.4 5.9 3.2 6.4 3.1L6.6 1.2C6.6 1.1 6.7 1 6.8 1H9.2C9.3 1 9.4 1.1 9.4 1.2L9.6 3.1C10.1 3.2 10.6 3.4 11 3.7L12.7 2.9C12.8 2.8 13 2.8 13.1 2.9L14.5 5.1C14.6 5.2 14.6 5.4 14.5 5.5L13.1 6.6C13.3 7 13.4 7.5 13.4 8Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                </svg>
                                Settings
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item logout-item" onclick="handleLogout()">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M11 5L14 8L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                                Sign Out
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // User is not logged in - show login/signup buttons
            navActions.innerHTML = `
                <button class="btn-secondary" onclick="showLoginModal()">Log in</button>
                <button class="btn-primary" onclick="showSignupModal()">Sign up free</button>
            `;
        }
    }

    getUserAvatarClass() {
        const role = this.currentUser?.role || 'citizen';
        const avatarClasses = {
            citizen: 'avatar-citizen',
            manager: 'avatar-manager',
            admin: 'avatar-admin'
        };
        return avatarClasses[role] || 'avatar-citizen';
    }

    getUserAvatarIcon() {
        const role = this.currentUser?.role || 'citizen';
        const avatarIcons = {
            citizen: '👤',
            manager: '👨‍💼',
            admin: '👨‍💻'
        };
        return avatarIcons[role] || '👤';
    }

    formatRole(role) {
        const roleNames = {
            citizen: 'Citizen',
            user: 'Citizen',
            manager: 'Manager',
            admin: 'Administrator'
        };
        return roleNames[role] || 'User';
    }

    isCurrentPage(href) {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';
        const targetFile = href.split('/').pop();
        return currentFile === targetFile;
    }

    setupEventListeners() {
        // Listen for storage changes (user login/logout in other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'user') {
                this.loadCurrentUser();
                this.updateNavigation();
            }
        });

        // Listen for custom events
        document.addEventListener('userLoggedIn', (e) => {
            this.currentUser = e.detail.user;
            this.updateNavigation();
        });

        document.addEventListener('userLoggedOut', () => {
            this.currentUser = null;
            this.updateNavigation();
        });
    }

    // Method to be called when user logs in
    onUserLogin(user) {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        this.updateNavigation();
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user } }));
    }

    // Method to be called when user logs out
    onUserLogout() {
        this.currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        this.updateNavigation();
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
    }

    // Check if user has permission for a specific action
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const rolePermissions = {
            citizen: ['report:create', 'report:view:own', 'map:view:basic'],
            manager: ['report:create', 'report:view:all', 'report:verify', 'map:view:detailed', 'analytics:view', 'dashboard:access'],
            admin: ['all:access', 'user:manage', 'system:configure']
        };
        
        const userRole = this.currentUser.role || 'citizen';
        const permissions = rolePermissions[userRole] || [];
        
        return permissions.includes(permission) || permissions.includes('all:access');
    }

    // Redirect user based on their role
    redirectToRoleDashboard() {
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        const roleDashboards = {
            citizen: 'my-reports.html',
            manager: 'premium-dashboard.html',
            admin: 'admin-dashboard.html'
        };
        
        const dashboard = roleDashboards[this.currentUser.role] || 'index.html';
        window.location.href = dashboard;
    }
}

// Global functions for dropdown and user actions
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function showProfileModal() {
    toggleUserDropdown();
    // Implementation depends on existing modal system
    if (typeof createModal === 'function') {
        createModal('User Profile', `
            <div class="profile-content">
                <h3>Profile Information</h3>
                <p>Profile management coming soon...</p>
                <button class="btn-primary" onclick="closeModal()">Close</button>
            </div>
        `);
    }
}

function showSettingsModal() {
    toggleUserDropdown();
    // Implementation depends on existing modal system
    if (typeof createModal === 'function') {
        createModal('Settings', `
            <div class="settings-content">
                <h3>User Settings</h3>
                <p>Settings panel coming soon...</p>
                <button class="btn-primary" onclick="closeModal()">Close</button>
            </div>
        `);
    }
}

function handleLogout() {
    if (window.roleNavigation) {
        window.roleNavigation.onUserLogout();
    }
    window.location.href = 'index.html';
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdownMenu');
    const toggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && !dropdown.contains(e.target) && !toggle?.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Initialize role-based navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.roleNavigation = new RoleBasedNavigation();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoleBasedNavigation;
}
