// Authentication Guard System for AquaSutra
class AuthGuard {
    constructor() {
        this.currentUser = null;
        this.redirectAfterLogin = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupAuthListeners();
    }

    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('aquasutra_user');
            const token = localStorage.getItem('aquasutra_token');
            
            if (userData && token) {
                this.currentUser = JSON.parse(userData);
                // Verify token is still valid (basic check)
                if (this.isTokenExpired(token)) {
                    this.logout();
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.logout();
        }
    }

    isTokenExpired(token) {
        try {
            // Basic JWT token expiry check
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp && payload.exp < currentTime;
        } catch (error) {
            return true; // If we can't parse the token, consider it expired
        }
    }

    isAuthenticated() {
        return this.currentUser !== null && localStorage.getItem('aquasutra_token') !== null;
    }

    hasRole(requiredRole) {
        if (!this.isAuthenticated()) return false;
        
        const userRole = this.currentUser.role;
        
        // Role hierarchy: admin > manager > user
        const roleHierarchy = {
            'admin': 3,
            'manager': 2,
            'user': 1,
            'citizen': 1
        };
        
        const userLevel = roleHierarchy[userRole] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;
        
        return userLevel >= requiredLevel;
    }

    requireAuth(redirectUrl = null) {
        if (!this.isAuthenticated()) {
            this.redirectAfterLogin = redirectUrl || window.location.href;
            this.showLoginRequired();
            return false;
        }
        return true;
    }

    requireRole(requiredRole, redirectUrl = null) {
        if (!this.requireAuth(redirectUrl)) {
            return false;
        }
        
        if (!this.hasRole(requiredRole)) {
            this.showInsufficientPermissions(requiredRole);
            return false;
        }
        
        return true;
    }

    showLoginRequired() {
        // Create login required overlay
        const overlay = document.createElement('div');
        overlay.id = 'auth-required-overlay';
        overlay.className = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-modal">
                <div class="auth-modal-content">
                    <div class="auth-icon">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="M32 16V32M32 40H32.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h3>Login Required</h3>
                    <p>You need to be logged in to access this feature. Please log in to continue.</p>
                    <div class="auth-actions">
                        <button class="btn-primary" onclick="authGuard.showLoginModal()">Log In</button>
                        <button class="btn-secondary" onclick="authGuard.showSignupModal()">Sign Up</button>
                    </div>
                    <button class="auth-close" onclick="authGuard.closeAuthOverlay()">&times;</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    }

    showInsufficientPermissions(requiredRole) {
        const overlay = document.createElement('div');
        overlay.id = 'auth-required-overlay';
        overlay.className = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-modal">
                <div class="auth-modal-content">
                    <div class="auth-icon error">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="M22 22L42 42M22 42L42 22" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </div>
                    <h3>Access Denied</h3>
                    <p>You need ${this.formatRole(requiredRole)} permissions to access this feature.</p>
                    <div class="auth-actions">
                        <button class="btn-primary" onclick="window.location.href='index.html'">Return Home</button>
                    </div>
                    <button class="auth-close" onclick="authGuard.closeAuthOverlay()">&times;</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    }

    closeAuthOverlay() {
        const overlay = document.getElementById('auth-required-overlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = '';
        }
    }

    showLoginModal() {
        this.closeAuthOverlay();
        
        // Create login modal
        const modal = document.createElement('div');
        modal.id = 'login-modal-overlay';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Login to AquaSutra</h2>
                    <span class="close" onclick="authGuard.closeLoginModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="authLoginForm" class="auth-form">
                        <div class="form-group">
                            <label for="authLoginEmail">Email</label>
                            <input type="email" id="authLoginEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="authLoginPassword">Password</label>
                            <input type="password" id="authLoginPassword" name="password" required>
                        </div>
                        <button type="submit" class="btn-primary">Login</button>
                        
                        <div class="auth-divider">
                            <span>or</span>
                        </div>
                        
                        <button type="button" class="btn-google" onclick="authGuard.handleGoogleLogin()">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M19.99 10.187c0-.82-.069-1.417-.216-2.037H10.2v3.698h5.62c-.113.955-.725 2.394-2.084 3.365l-.01.066 3.026 2.347.21.02c1.926-1.778 3.037-4.392 3.037-7.459z" fill="#4285F4"/>
                                <path d="M10.2 19.931c2.753 0 5.064-.886 6.753-2.414l-3.226-2.433c-.901.579-2.024.921-3.527.921-2.702 0-4.987-1.746-5.801-4.156l-.063.006-3.047 2.37-.04.059c1.689 3.346 5.15 5.647 8.951 5.647z" fill="#34A853"/>
                                <path d="M4.397 11.849c-.24-.706-.374-1.456-.374-2.228 0-.773.135-1.522.374-2.228l-.006-.07-3.087-2.397-.051.024C.584 6.377 0 8.148 0 9.621c0 1.473.584 3.244 1.253 4.668l3.144-2.44z" fill="#FBBC04"/>
                                <path d="M10.2 3.853c1.914 0 3.206.809 3.943 1.484l2.878-2.81C15.253.985 12.953 0 10.2 0 6.398 0 2.937 2.301 1.248 5.647l3.144 2.44C5.207 5.698 7.492 3.853 10.2 3.853z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>
                        
                        <p class="auth-switch">Don't have an account? <a href="#" onclick="authGuard.switchToSignup()">Sign up</a></p>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup form handler
        document.getElementById('authLoginForm').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });
    }

    showSignupModal() {
        this.closeAuthOverlay();
        
        const modal = document.createElement('div');
        modal.id = 'signup-modal-overlay';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Join AquaSutra</h2>
                    <span class="close" onclick="authGuard.closeSignupModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="authSignupForm" class="auth-form">
                        <div class="form-group">
                            <label for="authSignupName">Full Name</label>
                            <input type="text" id="authSignupName" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="authSignupEmail">Email</label>
                            <input type="email" id="authSignupEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="authSignupPassword">Password</label>
                            <input type="password" id="authSignupPassword" name="password" required>
                        </div>
                        <div class="form-group">
                            <label for="authUserRole">I am a...</label>
                            <select id="authUserRole" name="role" required>
                                <option value="user">👥 Citizen - Report hazards and receive alerts</option>
                                <option value="manager">🏛️ Manager - Verify reports and manage alerts</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-primary">Create Account</button>
                        
                        <div class="auth-divider">
                            <span>or</span>
                        </div>
                        
                        <button type="button" class="btn-google" onclick="authGuard.handleGoogleLogin()">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M19.99 10.187c0-.82-.069-1.417-.216-2.037H10.2v3.698h5.62c-.113.955-.725 2.394-2.084 3.365l-.01.066 3.026 2.347.21.02c1.926-1.778 3.037-4.392 3.037-7.459z" fill="#4285F4"/>
                                <path d="M10.2 19.931c2.753 0 5.064-.886 6.753-2.414l-3.226-2.433c-.901.579-2.024.921-3.527.921-2.702 0-4.987-1.746-5.801-4.156l-.063.006-3.047 2.37-.04.059c1.689 3.346 5.15 5.647 8.951 5.647z" fill="#34A853"/>
                                <path d="M4.397 11.849c-.24-.706-.374-1.456-.374-2.228 0-.773.135-1.522.374-2.228l-.006-.07-3.087-2.397-.051.024C.584 6.377 0 8.148 0 9.621c0 1.473.584 3.244 1.253 4.668l3.144-2.44z" fill="#FBBC04"/>
                                <path d="M10.2 3.853c1.914 0 3.206.809 3.943 1.484l2.878-2.81C15.253.985 12.953 0 10.2 0 6.398 0 2.937 2.301 1.248 5.647l3.144 2.44C5.207 5.698 7.492 3.853 10.2 3.853z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>
                        
                        <p class="auth-switch">Already have an account? <a href="#" onclick="authGuard.switchToLogin()">Login</a></p>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup form handler
        document.getElementById('authSignupForm').addEventListener('submit', (e) => {
            this.handleSignup(e);
        });
    }

    switchToSignup() {
        this.closeLoginModal();
        this.showSignupModal();
    }

    switchToLogin() {
        this.closeSignupModal();
        this.showLoginModal();
    }

    closeLoginModal() {
        const modal = document.getElementById('login-modal-overlay');
        if (modal) modal.remove();
    }

    closeSignupModal() {
        const modal = document.getElementById('signup-modal-overlay');
        if (modal) modal.remove();
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${window.location.origin}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.onLoginSuccess(result.user, result.token);
            } else {
                this.showError(result.message || 'Login failed');
            }
        } catch (error) {
            this.showError('Login failed. Please try again.');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${window.location.origin}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.onLoginSuccess(result.user, result.token);
            } else {
                this.showError(result.message || 'Registration failed');
            }
        } catch (error) {
            this.showError('Registration failed. Please try again.');
        }
    }

    async handleGoogleLogin() {
        // Placeholder for Google login - integrate with existing Google OAuth
        this.showError('Google login integration coming soon!');
    }

    onLoginSuccess(user, token) {
        this.currentUser = user;
        localStorage.setItem('aquasutra_user', JSON.stringify(user));
        localStorage.setItem('aquasutra_token', token);
        
        this.closeLoginModal();
        this.closeSignupModal();
        
        // Update navigation
        if (window.roleNavigation) {
            window.roleNavigation.onUserLogin(user);
        }
        
        // Redirect to original page or reload current page
        if (this.redirectAfterLogin) {
            window.location.href = this.redirectAfterLogin;
        } else {
            window.location.reload();
        }
        
        this.showSuccess(`Welcome ${user.username}!`);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('aquasutra_user');
        localStorage.removeItem('aquasutra_token');
        
        // Update navigation
        if (window.roleNavigation) {
            window.roleNavigation.onUserLogout();
        }
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    setupAuthListeners() {
        // Listen for storage changes (logout in other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'aquasutra_user' && !e.newValue) {
                this.currentUser = null;
                window.location.href = 'index.html';
            }
        });
    }

    formatRole(role) {
        const roles = {
            'user': 'Citizen',
            'citizen': 'Citizen',
            'manager': 'Manager',
            'admin': 'Administrator'
        };
        return roles[role] || role;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility method to protect page content
    protectPageContent(requiredRole = null) {
        if (requiredRole && !this.requireRole(requiredRole)) {
            return false;
        } else if (!requiredRole && !this.requireAuth()) {
            return false;
        }
        return true;
    }
}

// Initialize global auth guard
window.authGuard = new AuthGuard();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthGuard;
}
