// Enhanced Safety Resources & Training JavaScript
let resourcesData = {
    currentCategory: 'featured',
    currentView: 'list',
    searchQuery: '',
    filters: {
        type: 'all',
        level: 'all',
        sort: 'popular'
    },
    resources: {
        featured: [
            {
                id: 'RES-001',
                title: 'Ocean Safety Fundamentals',
                type: 'course',
                description: 'Comprehensive course covering basic ocean safety principles, hazard recognition, and emergency procedures.',
                duration: '2 hours',
                difficulty: 'Beginner',
                downloads: 1247,
                rating: 4.8,
                learners: 2156,
                dateAdded: '2024-01-15',
                tags: ['safety', 'fundamentals', 'ocean', 'beginner']
            },
            {
                id: 'RES-002',
                title: 'Rip Current Identification Guide',
                type: 'pdf',
                description: 'Visual guide to identifying and escaping rip currents, with real-world examples and safety tips.',
                duration: '15 min read',
                difficulty: 'All Levels',
                downloads: 892,
                rating: 4.6,
                learners: 1834,
                dateAdded: '2024-01-20',
                tags: ['rip current', 'identification', 'safety', 'guide']
            },
            {
                id: 'RES-003',
                title: 'Emergency Response Simulation',
                type: 'interactive',
                description: 'Interactive simulation training for emergency response scenarios in marine environments.',
                duration: '45 minutes',
                difficulty: 'Intermediate',
                downloads: 634,
                rating: 4.9,
                learners: 987,
                dateAdded: '2024-01-25',
                tags: ['emergency', 'simulation', 'interactive', 'response']
            },
            {
                id: 'RES-004',
                title: 'Marine Weather Patterns',
                type: 'video',
                description: 'Understanding weather patterns and their impact on ocean safety and navigation.',
                duration: '1.5 hours',
                difficulty: 'Intermediate',
                downloads: 756,
                rating: 4.7,
                learners: 1245,
                dateAdded: '2024-02-01',
                tags: ['weather', 'patterns', 'marine', 'navigation']
            },
            {
                id: 'RES-005',
                title: 'Advanced Water Rescue Techniques',
                type: 'course',
                description: 'Professional-level water rescue techniques for emergency responders and lifeguards.',
                duration: '4 hours',
                difficulty: 'Advanced',
                downloads: 423,
                rating: 4.9,
                learners: 567,
                dateAdded: '2024-02-05',
                tags: ['rescue', 'advanced', 'professional', 'lifeguard']
            }
        ],
        swimming: [
            {
                id: 'SWIM-001',
                title: 'Water Safety for Beginners',
                type: 'video',
                description: 'Essential swimming safety techniques and water awareness for new swimmers.',
                duration: '30 minutes',
                difficulty: 'Beginner',
                downloads: 2156,
                rating: 4.7,
                learners: 3245,
                dateAdded: '2024-01-10',
                tags: ['swimming', 'water safety', 'beginner', 'techniques']
            },
            {
                id: 'SWIM-002',
                title: 'Drowning Prevention Checklist',
                type: 'pdf',
                description: 'Comprehensive checklist for preventing drowning incidents in various water environments.',
                duration: '10 min read',
                difficulty: 'All Levels',
                downloads: 1834,
                rating: 4.8,
                learners: 2987,
                dateAdded: '2024-01-12',
                tags: ['drowning', 'prevention', 'checklist', 'safety']
            },
            {
                id: 'SWIM-003',
                title: 'Advanced Swimming Techniques',
                type: 'course',
                description: 'Professional swimming techniques for competitive and recreational swimmers.',
                duration: '2.5 hours',
                difficulty: 'Advanced',
                downloads: 892,
                rating: 4.9,
                learners: 1456,
                dateAdded: '2024-02-08',
                tags: ['advanced', 'swimming', 'techniques', 'competitive']
            }
        ],
        boating: [
            {
                id: 'BOAT-001',
                title: 'Boating Safety Certification',
                type: 'course',
                description: 'Complete certification course covering navigation rules, safety equipment, and emergency procedures.',
                duration: '4 hours',
                difficulty: 'Intermediate',
                downloads: 967,
                rating: 4.8,
                learners: 1876,
                dateAdded: '2024-01-18',
                tags: ['boating', 'certification', 'navigation', 'safety']
            },
            {
                id: 'BOAT-002',
                title: 'Marine Weather Interpretation',
                type: 'interactive',
                description: 'Interactive guide to reading and interpreting marine weather forecasts and conditions.',
                duration: '1 hour',
                difficulty: 'Advanced',
                downloads: 543,
                rating: 4.6,
                learners: 987,
                dateAdded: '2024-02-03',
                tags: ['marine', 'weather', 'forecasts', 'interpretation']
            },
            {
                id: 'BOAT-003',
                title: 'Boat Maintenance Guide',
                type: 'pdf',
                description: 'Comprehensive guide to boat maintenance, repairs, and seasonal preparation.',
                duration: '45 min read',
                difficulty: 'Beginner',
                downloads: 1234,
                rating: 4.5,
                learners: 2134,
                dateAdded: '2024-01-28',
                tags: ['boat', 'maintenance', 'repairs', 'guide']
            }
        ],
        emergency: [
            {
                id: 'EMER-001',
                title: 'Water Rescue Techniques',
                type: 'video',
                description: 'Professional water rescue techniques and safety protocols for emergency responders.',
                duration: '90 minutes',
                difficulty: 'Advanced',
                downloads: 1203,
                rating: 4.9,
                learners: 2456,
                dateAdded: '2024-01-22',
                tags: ['rescue', 'emergency', 'water', 'techniques']
            },
            {
                id: 'EMER-002',
                title: 'CPR and First Aid for Water Emergencies',
                type: 'course',
                description: 'Specialized CPR and first aid training focused on water-related emergencies.',
                duration: '3 hours',
                difficulty: 'Intermediate',
                downloads: 1456,
                rating: 4.8,
                learners: 3567,
                dateAdded: '2024-02-01',
                tags: ['cpr', 'first aid', 'emergency', 'water']
            },
            {
                id: 'EMER-003',
                title: 'Emergency Communication Protocols',
                type: 'interactive',
                description: 'Learn emergency communication procedures and distress signal protocols.',
                duration: '45 minutes',
                difficulty: 'Beginner',
                downloads: 876,
                rating: 4.7,
                learners: 1987,
                dateAdded: '2024-02-10',
                tags: ['communication', 'emergency', 'protocols', 'distress']
            }
        ],
        weather: [
            {
                id: 'WEATH-001',
                title: 'Storm Recognition and Safety',
                type: 'video',
                description: 'Identify dangerous weather patterns and learn storm safety procedures.',
                duration: '1 hour',
                difficulty: 'Intermediate',
                downloads: 1567,
                rating: 4.6,
                learners: 2345,
                dateAdded: '2024-01-30',
                tags: ['storm', 'weather', 'recognition', 'safety']
            },
            {
                id: 'WEATH-002',
                title: 'Marine Weather Forecasting',
                type: 'course',
                description: 'Advanced course on reading and interpreting marine weather forecasts.',
                duration: '2 hours',
                difficulty: 'Advanced',
                downloads: 743,
                rating: 4.8,
                learners: 1234,
                dateAdded: '2024-02-05',
                tags: ['marine', 'weather', 'forecasting', 'advanced']
            }
        ],
        equipment: [
            {
                id: 'EQUIP-001',
                title: 'Life Jacket Selection Guide',
                type: 'pdf',
                description: 'Complete guide to choosing the right life jacket for different water activities.',
                duration: '20 min read',
                difficulty: 'Beginner',
                downloads: 2134,
                rating: 4.7,
                learners: 3456,
                dateAdded: '2024-01-25',
                tags: ['life jacket', 'equipment', 'selection', 'guide']
            },
            {
                id: 'EQUIP-002',
                title: 'Safety Equipment Maintenance',
                type: 'interactive',
                description: 'Interactive guide to maintaining and inspecting marine safety equipment.',
                duration: '1.5 hours',
                difficulty: 'Intermediate',
                downloads: 987,
                rating: 4.5,
                learners: 1876,
                dateAdded: '2024-02-12',
                tags: ['safety', 'equipment', 'maintenance', 'inspection']
            }
        ],
        training: [
            {
                id: 'TRAIN-001',
                title: 'Lifeguard Certification Program',
                type: 'course',
                description: 'Complete lifeguard certification program with practical and theoretical components.',
                duration: '40 hours',
                difficulty: 'Advanced',
                downloads: 456,
                rating: 4.9,
                learners: 789,
                dateAdded: '2024-01-15',
                tags: ['lifeguard', 'certification', 'training', 'program']
            },
            {
                id: 'TRAIN-002',
                title: 'Water Safety Instructor Course',
                type: 'course',
                description: 'Become a certified water safety instructor with this comprehensive training program.',
                duration: '20 hours',
                difficulty: 'Intermediate',
                downloads: 678,
                rating: 4.8,
                learners: 1234,
                dateAdded: '2024-02-08',
                tags: ['instructor', 'water safety', 'training', 'certification']
            }
        ]
    },
    trainingProgress: [
        { name: 'Ocean Safety Fundamentals', progress: 85 },
        { name: 'Boating Safety Certification', progress: 62 },
        { name: 'Emergency Response Training', progress: 34 },
        { name: 'Weather Awareness Course', progress: 91 }
    ],
    recentDownloads: [
        { name: 'Rip Current Guide', time: '2 hours ago' },
        { name: 'Safety Equipment Checklist', time: '1 day ago' },
        { name: 'Weather Alert Protocols', time: '3 days ago' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('📚 Enhanced Safety Resources & Training Loading...');
    
    initializeResources();
    setupSearchAndFilters();
    setupViewToggle();
    populateResources('featured');
    populateTrainingProgress();
    populateRecentDownloads();
    updateLiveStats();
    
    console.log('✅ Enhanced Resources Dashboard Ready!');
});

function initializeResources() {
    // Set up any initial configurations
    updateContentTitle('Featured Resources');
}

function showCategory(category) {
    resourcesData.currentCategory = category;
    
    // Update content title
    const titles = {
        swimming: 'Swimming Safety Resources',
        boating: 'Boating Safety Resources',
        emergency: 'Emergency Response Resources',
        weather: 'Weather Awareness Resources',
        equipment: 'Safety Equipment Resources',
        training: 'Training Program Resources'
    };
    
    updateContentTitle(titles[category] || 'Resources');
    populateResources(category);
    showNotification(`📚 Showing ${titles[category] || 'resources'}`, 'info');
}

function updateContentTitle(title) {
    const titleElement = document.getElementById('content-title');
    if (titleElement) {
        titleElement.textContent = title;
    }
}

function populateResources(category) {
    const resourcesList = document.getElementById('resources-list');
    if (!resourcesList) {
        console.log('Resources list element not found');
        return;
    }
    
    let resources = resourcesData.resources[category] || resourcesData.resources.featured;
    console.log(`Populating resources for category: ${category}, found ${resources.length} resources`);
    
    // Apply search filter
    if (resourcesData.searchQuery) {
        resources = resources.filter(resource => 
            resource.title.toLowerCase().includes(resourcesData.searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(resourcesData.searchQuery.toLowerCase()) ||
            (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(resourcesData.searchQuery.toLowerCase())))
        );
        console.log(`After search filter: ${resources.length} resources`);
    }
    
    // Apply type filter
    if (resourcesData.filters.type !== 'all') {
        resources = resources.filter(resource => resource.type === resourcesData.filters.type);
        console.log(`After type filter: ${resources.length} resources`);
    }
    
    // Apply difficulty filter
    if (resourcesData.filters.level !== 'all') {
        resources = resources.filter(resource => resource.difficulty === resourcesData.filters.level);
        console.log(`After difficulty filter: ${resources.length} resources`);
    }
    
    // Apply sorting
    resources = sortResources(resources, resourcesData.filters.sort);
    
    if (resources.length === 0) {
        resourcesList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6B7280;">
                <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                <h3 style="margin-bottom: 8px; color: #374151;">No resources found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button onclick="resetFilters()" style="margin-top: 16px; padding: 8px 16px; background: #10B981; color: white; border: none; border-radius: 8px; cursor: pointer;">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    const viewClass = resourcesData.currentView === 'grid' ? 'resource-grid' : 'resource-list';
    resourcesList.className = viewClass;
    
    resourcesList.innerHTML = resources.map(resource => `
        <div class="resource-item ${resourcesData.currentView}" onclick="showResourceDetails('${resource.id}')">
            <div class="resource-header">
                <div>
                    <div class="resource-title">${resource.title}</div>
                    <div class="resource-badges">
                        <div class="resource-type ${resource.type}">${resource.type.toUpperCase()}</div>
                        <div class="difficulty-badge">${resource.difficulty}</div>
                    </div>
                </div>
            </div>
            <div class="resource-desc">${resource.description}</div>
            <div class="resource-meta">
                <div class="resource-stats">
                    <div class="stat">
                        <span>⏱️</span> ${resource.duration}
                    </div>
                    <div class="stat">
                        <span>⭐</span> ${resource.rating || 4.5}
                    </div>
                    <div class="stat">
                        <span>👥</span> ${formatNumber(resource.learners || resource.downloads)}
                    </div>
                    <div class="stat">
                        <span>📥</span> ${formatNumber(resource.downloads)}
                    </div>
                </div>
                <div class="resource-actions">
                    <button class="action-btn secondary" onclick="event.stopPropagation(); previewResource('${resource.id}')">Preview</button>
                    <button class="action-btn primary" onclick="event.stopPropagation(); downloadResource('${resource.id}')">Download</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add staggered animation
    const items = resourcesList.querySelectorAll('.resource-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
    
    console.log(`Successfully populated ${resources.length} resources`);
}

function populateTrainingProgress() {
    const progressContainer = document.getElementById('training-progress');
    if (!progressContainer) return;
    
    progressContainer.innerHTML = resourcesData.trainingProgress.map(item => `
        <div class="progress-item">
            <div class="progress-header">
                <span class="progress-title">${item.name}</span>
                <span class="progress-percent">${item.progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${item.progress}%;"></div>
            </div>
        </div>
    `).join('');
}

function populateRecentDownloads() {
    const downloadsContainer = document.getElementById('recent-downloads');
    if (!downloadsContainer) return;
    
    downloadsContainer.innerHTML = resourcesData.recentDownloads.map(item => `
        <div class="quick-link" onclick="showDownloadDetails('${item.name}')">
            <span class="quick-link-icon">📄</span>
            <div>
                <div class="quick-link-text">${item.name}</div>
                <div style="font-size: 12px; color: #6B7280;">${item.time}</div>
            </div>
        </div>
    `).join('');
}

function showResourceDetails(resourceId) {
    // Find resource across all categories
    let resource = null;
    for (const category in resourcesData.resources) {
        resource = resourcesData.resources[category].find(r => r.id === resourceId);
        if (resource) break;
    }
    
    if (resource) {
        showNotification(`📚 ${resource.title} - ${resource.type.toUpperCase()} (${resource.duration})`, 'info');
    }
}

function previewResource(resourceId) {
    showNotification('👁️ Opening resource preview...', 'info');
}

function downloadResource(resourceId) {
    // Find and update download count
    for (const category in resourcesData.resources) {
        const resource = resourcesData.resources[category].find(r => r.id === resourceId);
        if (resource) {
            resource.downloads++;
            
            // Add to recent downloads
            resourcesData.recentDownloads.unshift({
                name: resource.title,
                time: 'Just now'
            });
            
            // Keep only 5 most recent
            if (resourcesData.recentDownloads.length > 5) {
                resourcesData.recentDownloads = resourcesData.recentDownloads.slice(0, 5);
            }
            
            populateResources(resourcesData.currentCategory);
            populateRecentDownloads();
            showNotification(`📥 Downloaded: ${resource.title}`, 'success');
            break;
        }
    }
}

function showEmergencyContacts() {
    showNotification('📞 Emergency Contacts: 911 (Emergency), Coast Guard (VHF 16), Marine Police', 'info');
}

function showSafetyChecklist() {
    showNotification('✅ Safety Checklist: Life jackets, Communication device, Weather check, Float plan', 'info');
}

function showWeatherAlerts() {
    showNotification('⚠️ Current Weather: Clear conditions, Light winds, No active alerts', 'success');
}

function showCertifications() {
    showNotification('🏆 Available Certifications: Boating Safety, Water Rescue, First Aid, Weather Awareness', 'info');
}

function showDownloadDetails(itemName) {
    showNotification(`📄 Recent Download: ${itemName}`, 'info');
}

// Simulate training progress updates
function updateTrainingProgress() {
    resourcesData.trainingProgress.forEach(item => {
        if (Math.random() < 0.3 && item.progress < 100) { // 30% chance to progress
            item.progress = Math.min(100, item.progress + Math.floor(Math.random() * 5) + 1);
        }
    });
    
    populateTrainingProgress();
}

// Start periodic updates
setInterval(() => {
    updateTrainingProgress();
    
    // Occasionally add new downloads
    if (Math.random() < 0.1) { // 10% chance
        const sampleResources = [
            'Marine Weather Guide',
            'Safety Equipment Manual',
            'Emergency Procedures Handbook',
            'Navigation Rules Summary'
        ];
        
        const randomResource = sampleResources[Math.floor(Math.random() * sampleResources.length)];
        resourcesData.recentDownloads.unshift({
            name: randomResource,
            time: 'Just now'
        });
        
        if (resourcesData.recentDownloads.length > 5) {
            resourcesData.recentDownloads = resourcesData.recentDownloads.slice(0, 5);
        }
        
        populateRecentDownloads();
        showNotification(`📥 New resource downloaded: ${randomResource}`, 'success');
    }
}, 30000); // Update every 30 seconds

// Enhanced search and filter functionality
function setupSearchAndFilters() {
    console.log('Setting up search and filters...');
    
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const typeFilter = document.getElementById('type-filter');
    const levelFilter = document.getElementById('level-filter');
    const sortFilter = document.getElementById('sort-filter');
    const filterReset = document.getElementById('filter-reset');
    
    console.log('Found elements:', {
        searchInput: !!searchInput,
        searchClear: !!searchClear,
        typeFilter: !!typeFilter,
        levelFilter: !!levelFilter,
        sortFilter: !!sortFilter,
        filterReset: !!filterReset
    });
    
    if (searchInput) {
        console.log('Setting up search input listeners');
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', showSearchSuggestions);
        searchInput.addEventListener('blur', hideSearchSuggestions);
    } else {
        console.error('Search input not found!');
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', clearSearch);
    } else {
        console.warn('Search clear button not found');
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            console.log('Type filter changed to:', e.target.value);
            resourcesData.filters.type = e.target.value;
            applyFilters();
        });
    } else {
        console.warn('Type filter not found');
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', (e) => {
            console.log('Level filter changed to:', e.target.value);
            resourcesData.filters.level = e.target.value;
            applyFilters();
        });
    } else {
        console.warn('Level filter not found');
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            console.log('Sort filter changed to:', e.target.value);
            resourcesData.filters.sort = e.target.value;
            applyFilters();
        });
    } else {
        console.warn('Sort filter not found');
    }
    
    if (filterReset) {
        filterReset.addEventListener('click', resetFilters);
    } else {
        console.warn('Filter reset button not found');
    }
    
    console.log('Search and filters setup complete');
}

function handleSearch(e) {
    const query = e.target.value;
    console.log('Search query:', query);
    resourcesData.searchQuery = query;
    
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
        clearBtn.style.display = query ? 'block' : 'none';
    }
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        console.log('Applying search filter for:', query);
        applyFilters();
        if (query) {
            showSearchSuggestions();
        } else {
            hideSearchSuggestions();
        }
    }, 300);
}

function showSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    const searchInput = document.getElementById('search-input');
    
    if (!suggestionsContainer || !searchInput) {
        console.log('Search suggestions elements not found');
        return;
    }
    
    const query = searchInput.value.toLowerCase();
    if (!query) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    // Generate suggestions from all resources
    const allResources = Object.values(resourcesData.resources).flat();
    const suggestions = [];
    
    allResources.forEach(resource => {
        if (resource.title.toLowerCase().includes(query)) {
            suggestions.push({ text: resource.title, type: 'title' });
        }
        if (resource.tags && Array.isArray(resource.tags)) {
            resource.tags.forEach(tag => {
                if (tag.toLowerCase().includes(query) && !suggestions.find(s => s.text === tag)) {
                    suggestions.push({ text: tag, type: 'tag' });
                }
            });
        }
    });
    
    if (suggestions.length > 0) {
        suggestionsContainer.innerHTML = suggestions.slice(0, 5).map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text.replace(/'/g, "\\'")}')"> 
                <strong>${suggestion.text}</strong>
                <span style="color: #9CA3AF; font-size: 12px; margin-left: 8px;">${suggestion.type}</span>
            </div>
        `).join('');
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

function hideSearchSuggestions() {
    setTimeout(() => {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }, 200);
}

function selectSuggestion(text) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = text;
        resourcesData.searchQuery = text;
        applyFilters();
        hideSearchSuggestions();
    }
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    
    if (searchInput) {
        searchInput.value = '';
        resourcesData.searchQuery = '';
    }
    
    if (searchClear) {
        searchClear.style.display = 'none';
    }
    
    applyFilters();
}

function resetFilters() {
    resourcesData.searchQuery = '';
    resourcesData.filters = {
        type: 'all',
        level: 'all',
        sort: 'popular'
    };
    
    // Reset UI elements
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const levelFilter = document.getElementById('level-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchClear = document.getElementById('search-clear');
    
    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';
    if (levelFilter) levelFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'popular';
    if (searchClear) searchClear.style.display = 'none';
    
    applyFilters();
    showNotification('🔄 Filters reset successfully', 'success');
}

function applyFilters() {
    populateResources(resourcesData.currentCategory);
}

function sortResources(resources, sortBy) {
    switch (sortBy) {
        case 'popular':
            return resources.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        case 'recent':
            return resources.sort((a, b) => new Date(b.dateAdded || '2024-01-01') - new Date(a.dateAdded || '2024-01-01'));
        case 'title':
            return resources.sort((a, b) => a.title.localeCompare(b.title));
        case 'duration':
            return resources.sort((a, b) => {
                const aDuration = parseDuration(a.duration);
                const bDuration = parseDuration(b.duration);
                return aDuration - bDuration;
            });
        default:
            return resources;
    }
}

function parseDuration(duration) {
    const match = duration.match(/(\d+(?:\.\d+)?)\s*(hour|min|hr)/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit.includes('hour') || unit.includes('hr')) {
        return value * 60; // Convert to minutes
    }
    return value;
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            resourcesData.currentView = view;
            
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Re-populate with new view
            populateResources(resourcesData.currentCategory);
        });
    });
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function updateLiveStats() {
    const totalResourcesEl = document.getElementById('total-resources');
    const activeLearnersEl = document.getElementById('active-learners');
    
    if (totalResourcesEl) {
        const totalResources = Object.values(resourcesData.resources).flat().length;
        totalResourcesEl.textContent = totalResources;
    }
    
    if (activeLearnersEl) {
        const totalLearners = Object.values(resourcesData.resources).flat()
            .reduce((sum, resource) => sum + (resource.learners || 0), 0);
        activeLearnersEl.textContent = formatNumber(totalLearners);
    }
}

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
            notification.style.background = 'linear-gradient(135deg, #10B981, #059669)';
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
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .fade-in {
        animation: fadeIn 0.6s ease forwards;
    }
    .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    .resource-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .resource-item.grid {
        aspect-ratio: 1.2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .resource-item.grid .resource-desc {
        flex: 1;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
`;
document.head.appendChild(style);
