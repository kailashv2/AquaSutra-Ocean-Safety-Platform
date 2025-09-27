// Report Hazard Interface JavaScript
let reportData = {
    selectedPriority: null,
    formData: {}
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚨 Hazard Reporting Interface Loading...');
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    
    initializeReportInterface();
    setupFormInteractions();
    setupPrioritySelector();
    setupFileUploads();
    setupHazardTypeSelector();
    setupWeatherSelector();
    setupLocationFeatures();
    setupAIAssessment();
    
    // Animate elements on load
    setTimeout(() => {
        animateElementsOnLoad();
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✅ Hazard Reporting Interface Ready!');
});

// Initialize the report interface
function initializeReportInterface() {
    // Set default incident time to now
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const timeInput = document.querySelector('input[name="incident_time"]');
    if (timeInput) {
        timeInput.value = localDateTime;
    }
    
    // Check if user came from hazard map and pre-fill location if available
    const urlParams = new URLSearchParams(window.location.search);
    const mapLocation = urlParams.get('location');
    if (mapLocation) {
        const locationInput = document.querySelector('input[name="location"]');
        if (locationInput) {
            locationInput.value = decodeURIComponent(mapLocation);
            showNotification('Location pre-filled from map', 'info');
        }
    }
    
    // Check referrer to show appropriate back button
    updateBackButton();
    
    // Add form validation
    setupFormValidation();
}

// Update back button based on referrer
function updateBackButton() {
    const referrer = document.referrer;
    const backBtn = document.querySelector('.back-btn');
    
    if (referrer.includes('hazard-map.html')) {
        backBtn.href = 'hazard-map.html';
        backBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Map
        `;
    }
}

// Animate elements on load
function animateElementsOnLoad() {
    const elements = document.querySelectorAll('.report-hero, .emergency-notice, .form-container');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate form sections
    setTimeout(() => {
        const sections = document.querySelectorAll('.form-section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 600);
}

// Setup form interactions
function setupFormInteractions() {
    const form = document.getElementById('hazard-report-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Add focus animations to form inputs
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.15)';
        });
        
        input.addEventListener('blur', (e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
        });
    });
    
    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', validateField);
    });
}

// Setup priority selector
function setupPrioritySelector() {
    const priorityOptions = document.querySelectorAll('.priority-option');
    const severityInput = document.getElementById('severity-input');
    
    priorityOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            priorityOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Update hidden input
            const priority = option.dataset.priority;
            reportData.selectedPriority = priority;
            if (severityInput) {
                severityInput.value = priority;
            }
            
            // Add selection animation
            option.style.transform = 'scale(1.05)';
            setTimeout(() => {
                option.style.transform = 'scale(1)';
            }, 200);
            
            showNotification(`Priority set to ${priority.toUpperCase()}`, 'info');
        });
        
        // Add hover effects
        option.addEventListener('mouseenter', () => {
            if (!option.classList.contains('selected')) {
                option.style.transform = 'translateY(-4px)';
                option.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
            }
        });
        
        option.addEventListener('mouseleave', () => {
            if (!option.classList.contains('selected')) {
                option.style.transform = 'translateY(0)';
                option.style.boxShadow = 'none';
            }
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField({ target: field });
        });
    });
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('invalid');
        field.style.borderColor = '#EF4444';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('invalid');
            field.style.borderColor = '#EF4444';
            return false;
        }
    }
    
    // Phone validation (if provided)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            field.classList.add('invalid');
            field.style.borderColor = '#EF4444';
            return false;
        }
    }
    
    // Field is valid
    field.classList.add('valid');
    field.style.borderColor = '#10B981';
    return true;
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate all fields
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Check if hazard type is selected
    if (!data.hazard_type) {
        showNotification('Please select a hazard type', 'error');
        document.querySelector('.hazard-type-grid').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Check if priority is selected
    if (!reportData.selectedPriority) {
        showNotification('Please select a priority level', 'error');
        document.querySelector('.priority-selector').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Submitting Report...
    `;
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await submitHazardReport(data);
        
        // Show success message
        showSuccessModal(data);
        
    } catch (error) {
        showNotification('Error submitting report. Please try again.', 'error');
        console.error('Submission error:', error);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Submit hazard report
async function submitHazardReport(data) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            // Add additional data
            data.id = `HAZ-${Date.now()}`;
            data.timestamp = new Date().toISOString();
            data.status = 'pending';
            data.severity = reportData.selectedPriority;
            
            // Store in local storage for demonstration
            const reports = JSON.parse(localStorage.getItem('hazardReports') || '[]');
            reports.unshift(data);
            localStorage.setItem('hazardReports', JSON.stringify(reports));
            
            resolve(data);
        }, 2000);
    });
}

// Show success modal
function showSuccessModal(data) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(15px);
        animation: fadeIn 0.4s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(25px);
        border-radius: 24px;
        padding: 48px;
        max-width: 550px;
        width: 90vw;
        text-align: center;
        box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 8px 32px rgba(16, 185, 129, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        border: 1.5px solid rgba(255, 255, 255, 0.3);
        animation: modalSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    `;
    
    modalContent.innerHTML = `
        <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%); border-radius: 50%; filter: blur(20px);"></div>
        <div style="position: relative; z-index: 2;">
            <div style="font-size: 72px; margin-bottom: 24px; animation: bounce 0.8s ease;">🌊</div>
            <h2 style="color: #10B981; font-size: 32px; font-weight: 800; margin-bottom: 16px; background: linear-gradient(135deg, #10B981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Report Submitted Successfully!</h2>
            <p style="color: #6B7280; font-size: 18px; line-height: 1.6; margin-bottom: 32px;">
                Thank you for helping keep our waters safe! Your hazard report has been submitted and will be reviewed by our emergency response team.
            </p>
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05)); border: 2px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #10B981, #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">📋</div>
                    <div style="color: #166534; font-weight: 700; font-size: 16px;">Report ID: ${data.id}</div>
                </div>
                <p style="color: #166534; font-size: 14px; margin: 0;">📧 You will receive email updates on the status of this report</p>
                <p style="color: #166534; font-size: 14px; margin: 8px 0 0 0;">⏱️ Expected response time: < 15 minutes</p>
            </div>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <button onclick="window.location.href='hazard-map.html'" style="padding: 14px 28px; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); display: flex; align-items: center; gap: 8px;">
                    🗺️ View on Live Map
                </button>
                <button onclick="window.location.href='index.html'" style="padding: 14px 28px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); display: flex; align-items: center; gap: 8px;">
                    🏠 Back to Home
                </button>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Auto-redirect after 10 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 10000);
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

// File Upload Management
let uploadedFiles = {
    images: [],
    videos: []
};

function setupFileUploads() {
    setupImageUpload();
    setupVideoUpload();
}

function setupImageUpload() {
    const imageUpload = document.getElementById('image-upload');
    const imageUploadArea = document.getElementById('image-upload-area');
    const imagePreview = document.getElementById('image-preview');

    if (!imageUpload || !imageUploadArea || !imagePreview) return;

    // Click to upload
    imageUploadArea.addEventListener('click', () => imageUpload.click());

    // File selection
    imageUpload.addEventListener('change', (e) => handleImageFiles(e.target.files));

    // Drag and drop
    setupDragAndDrop(imageUploadArea, handleImageFiles);
}

function setupVideoUpload() {
    const videoUpload = document.getElementById('video-upload');
    const videoUploadArea = document.getElementById('video-upload-area');
    const videoPreview = document.getElementById('video-preview');

    if (!videoUpload || !videoUploadArea || !videoPreview) return;

    // Click to upload
    videoUploadArea.addEventListener('click', () => videoUpload.click());

    // File selection
    videoUpload.addEventListener('change', (e) => handleVideoFiles(e.target.files));

    // Drag and drop
    setupDragAndDrop(videoUploadArea, handleVideoFiles);
}

function setupDragAndDrop(area, handleFiles) {
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('dragover');
    });

    area.addEventListener('dragleave', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
    });

    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleImageFiles(files) {
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (uploadedFiles.images.length + files.length > maxFiles) {
        showNotification(`Maximum ${maxFiles} images allowed`, 'error');
        return;
    }

    Array.from(files).forEach(file => {
        if (!allowedTypes.includes(file.type)) {
            showNotification(`${file.name} is not a supported image format`, 'error');
            return;
        }

        if (file.size > maxSize) {
            showNotification(`${file.name} is too large (max 10MB)`, 'error');
            return;
        }

        const fileId = Date.now() + Math.random();
        uploadedFiles.images.push({ id: fileId, file, name: file.name, size: file.size });
        createImagePreview(file, fileId);
    });

    updateImageUploadVisibility();
}

function handleVideoFiles(files) {
    const maxFiles = 3;
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];

    if (uploadedFiles.videos.length + files.length > maxFiles) {
        showNotification(`Maximum ${maxFiles} videos allowed`, 'error');
        return;
    }

    Array.from(files).forEach(file => {
        if (!allowedTypes.includes(file.type)) {
            showNotification(`${file.name} is not a supported video format`, 'error');
            return;
        }

        if (file.size > maxSize) {
            showNotification(`${file.name} is too large (max 50MB)`, 'error');
            return;
        }

        const fileId = Date.now() + Math.random();
        uploadedFiles.videos.push({ id: fileId, file, name: file.name, size: file.size });
        createVideoPreview(file, fileId);
    });

    updateVideoUploadVisibility();
}

function createImagePreview(file, fileId) {
    const imagePreview = document.getElementById('image-preview');
    const reader = new FileReader();

    reader.onload = (e) => {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'file-preview';
        previewDiv.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button class="remove-file" onclick="removeFile('images', '${fileId}')">×</button>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
        `;
        imagePreview.appendChild(previewDiv);
    };

    reader.readAsDataURL(file);
}

function createVideoPreview(file, fileId) {
    const videoPreview = document.getElementById('video-preview');
    const previewDiv = document.createElement('div');
    previewDiv.className = 'file-preview';
    
    // For videos, we'll show a placeholder since creating video thumbnails is complex
    previewDiv.innerHTML = `
        <div class="video-placeholder">🎥</div>
        <button class="remove-file" onclick="removeFile('videos', '${fileId}')">×</button>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
    `;
    
    videoPreview.appendChild(previewDiv);
}

function removeFile(type, fileId) {
    uploadedFiles[type] = uploadedFiles[type].filter(f => f.id != fileId);
    
    if (type === 'images') {
        updateImagePreview();
        updateImageUploadVisibility();
    } else {
        updateVideoPreview();
        updateVideoUploadVisibility();
    }
    
    showNotification('File removed', 'success');
}

function updateImagePreview() {
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '';
    
    uploadedFiles.images.forEach(fileObj => {
        createImagePreview(fileObj.file, fileObj.id);
    });
}

function updateVideoPreview() {
    const videoPreview = document.getElementById('video-preview');
    videoPreview.innerHTML = '';
    
    uploadedFiles.videos.forEach(fileObj => {
        createVideoPreview(fileObj.file, fileObj.id);
    });
}

function updateImageUploadVisibility() {
    const imageUploadArea = document.getElementById('image-upload-area');
    if (uploadedFiles.images.length >= 5) {
        imageUploadArea.style.display = 'none';
    } else {
        imageUploadArea.style.display = 'block';
    }
}

function updateVideoUploadVisibility() {
    const videoUploadArea = document.getElementById('video-upload-area');
    if (uploadedFiles.videos.length >= 3) {
        videoUploadArea.style.display = 'none';
    } else {
        videoUploadArea.style.display = 'block';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add enhanced CSS animations and styles
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
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes modalSlideIn {
        from { transform: scale(0.9) translateY(-20px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
        40%, 43% { transform: translate3d(0, -20px, 0) rotate(-5deg); }
        70% { transform: translate3d(0, -10px, 0) rotate(3deg); }
        90% { transform: translate3d(0, -4px, 0) rotate(-1deg); }
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    .btn::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
    }
    
    .btn:hover::after {
        left: 100%;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .form-input.valid, .form-select.valid, .form-textarea.valid {
        border-color: #10B981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
    
    .form-input.invalid, .form-select.invalid, .form-textarea.invalid {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .hazard-card.selected {
        border-color: #3B82F6 !important;
        background: rgba(59, 130, 246, 0.1) !important;
        transform: scale(1.05) !important;
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2) !important;
    }
    
    .weather-option.selected {
        border-color: #10B981 !important;
        background: rgba(16, 185, 129, 0.1) !important;
        transform: scale(1.1) !important;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2) !important;
    }
    
    .hazard-card:hover:not(.selected) {
        transform: translateY(-4px) scale(1.02) !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
    }
    
    .weather-option:hover:not(.selected) {
        transform: scale(1.05) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    }
`;
document.head.appendChild(style);

// Setup hazard type selector cards
function setupHazardTypeSelector() {
    const hazardCards = document.querySelectorAll('.hazard-card');
    const hazardTypeInput = document.getElementById('hazard-type-input');
    
    hazardCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            hazardCards.forEach(c => {
                c.style.transform = 'scale(1)';
                c.style.boxShadow = 'none';
                c.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            card.classList.add('selected');
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            
            // Update hidden input
            const hazardType = card.dataset.type;
            if (hazardTypeInput) {
                hazardTypeInput.value = hazardType;
            }
            
            // Trigger AI assessment
            updateAIAssessment(hazardType);
            
            showNotification(`Selected: ${card.querySelector('div:nth-child(2)').textContent}`, 'success');
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(-4px) scale(1.02)';
                card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            }
        });
    });
}

// Setup weather selector
function setupWeatherSelector() {
    const weatherOptions = document.querySelectorAll('.weather-option');
    const weatherInput = document.getElementById('weather-input');
    
    weatherOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            weatherOptions.forEach(opt => {
                opt.style.transform = 'scale(1)';
                opt.style.boxShadow = 'none';
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            option.classList.add('selected');
            option.style.transform = 'scale(1.1)';
            option.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            
            // Update hidden input
            const weather = option.dataset.weather;
            if (weatherInput) {
                weatherInput.value = weather;
            }
            
            showNotification(`Weather: ${option.querySelector('div:nth-child(2)').textContent}`, 'info');
        });
        
        // Add hover effects
        option.addEventListener('mouseenter', () => {
            if (!option.classList.contains('selected')) {
                option.style.transform = 'scale(1.05)';
                option.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }
        });
        
        option.addEventListener('mouseleave', () => {
            if (!option.classList.contains('selected')) {
                option.style.transform = 'scale(1)';
                option.style.boxShadow = 'none';
            }
        });
    });
}

// Setup location features
function setupLocationFeatures() {
    const getLocationBtn = document.getElementById('get-location-btn');
    const locationInput = document.querySelector('input[name="location"]');
    
    if (getLocationBtn && locationInput) {
        getLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                getLocationBtn.innerHTML = '🔄 Getting Location...';
                getLocationBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude.toFixed(6);
                        const lng = position.coords.longitude.toFixed(6);
                        locationInput.value = `GPS: ${lat}, ${lng}`;
                        
                        // Try to get address from coordinates
                        reverseGeocode(lat, lng, locationInput);
                        
                        getLocationBtn.innerHTML = '✅ Location Set';
                        getLocationBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        
                        showNotification('Location detected successfully!', 'success');
                        
                        setTimeout(() => {
                            getLocationBtn.innerHTML = '📍 Get Current Location';
                            getLocationBtn.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
                            getLocationBtn.disabled = false;
                        }, 3000);
                    },
                    (error) => {
                        getLocationBtn.innerHTML = '❌ Location Failed';
                        getLocationBtn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
                        
                        showNotification('Unable to get location. Please enter manually.', 'error');
                        
                        setTimeout(() => {
                            getLocationBtn.innerHTML = '📍 Get Current Location';
                            getLocationBtn.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
                            getLocationBtn.disabled = false;
                        }, 3000);
                    }
                );
            } else {
                showNotification('Geolocation not supported by this browser', 'error');
            }
        });
    }
}

// Reverse geocoding (simplified)
function reverseGeocode(lat, lng, input) {
    // In a real app, you'd use a geocoding service like Google Maps API
    // For demo purposes, we'll just use the coordinates
    setTimeout(() => {
        input.value = `GPS: ${lat}, ${lng} (Coastal Area)`;
    }, 1000);
}

// Setup AI Assessment
function setupAIAssessment() {
    // Initialize AI assessment when form data changes
    const form = document.getElementById('hazard-report-form');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                updateAIAssessmentFromForm();
            });
        });
    }
}

// Update AI assessment based on hazard type
function updateAIAssessment(hazardType) {
    const aiSection = document.getElementById('ai-assessment');
    const contentDiv = document.getElementById('risk-assessment-content');
    
    if (!aiSection || !contentDiv) return;
    
    const assessments = {
                high_waves: {
                    risk: 'HIGH',
                    color: '#EF4444',
                    factors: ['Wave height > 2.5m', 'Strong offshore winds', 'Coastal flooding risk'],
                    recommendations: ['Issue small craft advisory', 'Close beaches to swimming', 'Monitor conditions closely'],
                    response: 'Coast Guard and Beach Patrol'
                },
                strong_current: {
                    risk: 'HIGH',
                    color: '#EF4444',
                    factors: ['Rip current formation', 'Swimmer safety risk', 'Rescue difficulty'],
                    recommendations: ['Post warning signs', 'Increase lifeguard presence', 'Public safety announcement'],
                    response: 'Lifeguard Services and Marine Rescue'
                },
                pollution: {
                    risk: 'EXTREME',
                    color: '#7C2D12',
                    factors: ['Environmental contamination', 'Public health risk', 'Marine ecosystem impact'],
                    recommendations: ['Immediate area closure', 'Environmental response team', 'Water quality testing'],
                    response: 'Environmental Protection Agency'
                },
                marine_life: {
                    risk: 'MEDIUM',
                    color: '#F59E0B',
                    factors: ['Wildlife behavior change', 'Human-animal interaction', 'Seasonal patterns'],
                    recommendations: ['Monitor wildlife activity', 'Public awareness campaign', 'Safe distance guidelines'],
                    response: 'Marine Biology Team'
                },
                weather: {
                    risk: 'HIGH',
                    color: '#EF4444',
                    factors: ['Severe weather conditions', 'Visibility reduction', 'Navigation hazard'],
                    recommendations: ['Weather advisory', 'Port closure consideration', 'Emergency preparedness'],
                    response: 'National Weather Service'
                },
                debris: {
                    risk: 'MEDIUM',
                    color: '#F59E0B',
                    factors: ['Navigation obstruction', 'Vessel damage risk', 'Environmental impact'],
                    recommendations: ['Mark hazard location', 'Debris removal operation', 'Navigation warning'],
                    response: 'Coast Guard and Harbor Master'
                }
    };
    
    const assessment = assessments[hazardType];
    if (assessment) {
        contentDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <div style="font-size: 24px; font-weight: 800; color: ${assessment.color}; margin-bottom: 4px;">${assessment.risk} RISK</div>
                    <div style="font-size: 14px; color: #6B7280;">Automated risk classification</div>
                </div>
                <div style="background: ${assessment.color}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">AI ANALYSIS</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                    <div style="font-weight: 600; color: #1E293B; margin-bottom: 8px; font-size: 14px;">🔍 Risk Factors</div>
                    <ul style="margin: 0; padding-left: 16px; color: #6B7280; font-size: 13px;">
                        ${assessment.factors.map(factor => `<li style="margin-bottom: 4px;">${factor}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <div style="font-weight: 600; color: #1E293B; margin-bottom: 8px; font-size: 14px;">💡 Recommendations</div>
                    <ul style="margin: 0; padding-left: 16px; color: #6B7280; font-size: 13px;">
                        ${assessment.recommendations.map(rec => `<li style="margin-bottom: 4px;">${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 12px;">
                <div style="font-weight: 600; color: #1E40AF; font-size: 14px; margin-bottom: 4px;">👥 Response Team</div>
                <div style="color: #1E40AF; font-size: 13px;">${assessment.response}</div>
            </div>
        `;
        
        aiSection.style.display = 'block';
        aiSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Update AI assessment from form data
function updateAIAssessmentFromForm() {
    const hazardType = document.getElementById('hazard-type-input')?.value;
    const priority = document.getElementById('severity-input')?.value;
    
    if (hazardType && priority) {
        updateAIAssessment(hazardType);
    }
}

console.log('📄 Enhanced report hazard script loaded with advanced UI/UX features');
