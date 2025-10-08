// Authentication System for AquaSutra
let currentUser = null;

// Simple auth persistence - check immediately on page load
(function() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            currentUser = JSON.parse(user);
            console.log('🔄 Auto-login with stored data:', currentUser);
            
            // Wait for DOM to be ready, then update UI
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    updateUIForLoggedInUser();
                });
            } else {
                updateUIForLoggedInUser();
            }
        } catch (e) {
            console.error('Error parsing stored user data:', e);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    }
})();

// Show Login Modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

// Show Signup Modal
function showSignupModal() {
    document.getElementById('signupModal').style.display = 'flex';
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Switch between modals
function switchToSignup() {
    closeModal('loginModal');
    showSignupModal();
}

function switchToLogin() {
    closeModal('signupModal');
    showLoginModal();
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    currentUser = result.user;
                    updateUIForLoggedInUser();
                    closeModal('loginModal');
                    showNotification('Login successful!', 'success');
                } else {
                    showNotification(result.message || 'Login failed', 'error');
                }
            } catch (error) {
                showNotification('Network error. Please try again.', 'error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const signupData = {
                username: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role'),
                organization: formData.get('organization')
            };

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signupData)
                });

                const result = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    currentUser = result.user;
                    updateUIForLoggedInUser();
                    closeModal('signupModal');
                    showNotification('Account created successfully!', 'success');
                } else {
                    showNotification(result.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showNotification('Network error. Please try again.', 'error');
            }
        });
    }

    // Auth check is now handled immediately on page load above
    console.log('🎯 DOM ready, current user:', currentUser);
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    console.log('🔍 Checking auth status:', { 
        hasToken: !!token, 
        hasUser: !!user,
        tokenPreview: token ? token.substring(0, 20) + '...' : null,
        userData: user ? JSON.parse(user) : null
    });
    
    if (token && user) {
        try {
            // For now, just trust the local storage and skip server validation
            // This will keep users logged in across refreshes
            currentUser = JSON.parse(user);
            console.log('✅ Using cached user data:', currentUser);
            updateUIForLoggedInUser();
            
            // Optional: Validate in background without blocking UI
            validateTokenInBackground(token);
        } catch (error) {
            console.error('🚨 Error parsing user data:', error);
            clearAuthData();
        }
    } else {
        console.log('🚫 No token or user data found, staying logged out');
    }
}

// Background token validation (non-blocking)
async function validateTokenInBackground(token) {
    try {
        console.log('📡 Background token validation...');
        const response = await fetch('/api/validate-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.log('❌ Background validation failed, token expired');
            // Only logout if token is actually expired, not on network errors
            if (response.status === 401 || response.status === 403) {
                clearAuthData();
                showNotification('Session expired. Please login again.', 'warning');
            }
        } else {
            console.log('✅ Background validation successful');
        }
    } catch (error) {
        console.log('🌐 Background validation failed (network issue):', error.message);
        // Don't logout on network errors
    }
}

// Clear authentication data
function clearAuthData() {
    console.log('🚨 CLEARING AUTH DATA - User being logged out');
    console.trace('Logout trace:'); // This will show us where logout is being called from
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    currentUser = null;
    // Don't reload the page, just update UI
    updateUIForLoggedOutUser();
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <button class="btn-primary" onclick="showLoginModal()">Login</button>
            <button class="btn-secondary" onclick="showSignupModal()">Sign Up</button>
        `;
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    console.log('🎨 Updating UI for logged in user:', currentUser);
    
    // Try multiple times in case DOM isn't ready
    function tryUpdateUI(attempts = 0) {
        const navActions = document.querySelector('.nav-actions');
        console.log(`🔍 Attempt ${attempts + 1}: Nav actions element found:`, !!navActions);
        
        if (navActions && currentUser) {
            console.log('✅ Updating nav with user menu');
            navActions.innerHTML = `
                <div class="user-menu">
                    <span class="user-greeting">Hello, ${currentUser.username || 'User'}</span>
                    <span class="user-role">${getRoleDisplayName(currentUser.role || 'user')}</span>
                    <button class="btn-primary" onclick="openDashboard()">Dashboard</button>
                    <button class="btn-secondary" onclick="logout()">Logout</button>
                </div>
            `;
            return true; // Success
        } else if (attempts < 5) {
            // Try again after a short delay
            setTimeout(() => tryUpdateUI(attempts + 1), 100);
        } else {
            console.log('❌ Failed to update UI after 5 attempts:', {
                hasNavActions: !!navActions,
                hasCurrentUser: !!currentUser,
                currentUser: currentUser
            });
        }
    }
    
    tryUpdateUI();
}

// Open Premium Dashboard
function openDashboard() {
    window.open('premium-dashboard.html', '_blank');
}

// Get role display name
function getRoleDisplayName(role) {
    const roleNames = {
        'citizen': '👥 Citizen',
        'official': '🏛️ Official',
        'analyst': '📊 Analyst',
        'emergency_responder': '🚨 Emergency Responder',
        'administrator': '⚙️ Administrator'
    };
    return roleNames[role] || role;
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    currentUser = null;
    location.reload();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
