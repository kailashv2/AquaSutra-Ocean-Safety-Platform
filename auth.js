// Authentication System for AquaSutra
let currentUser = null;

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
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result));
                    currentUser = result;
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
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role'),
                organization: formData.get('organization')
            };

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signupData)
                });

                const result = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result));
                    currentUser = result;
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

    // Check if user is already logged in
    checkAuthStatus();
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        updateUIForLoggedInUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions && currentUser) {
        navActions.innerHTML = `
            <div class="user-menu">
                <span class="user-greeting">Hello, ${currentUser.name}</span>
                <span class="user-role">${getRoleDisplayName(currentUser.role)}</span>
                <button class="btn-primary" onclick="openDashboard()">Dashboard</button>
                <button class="btn-secondary" onclick="logout()">Logout</button>
            </div>
        `;
    }
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
