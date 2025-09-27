// Enhanced AI Analytics Dashboard - Advanced Features
class AIAnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.models = {};
        this.realTimeData = {};
        this.updateInterval = null;
        this.init();
    }

    init() {
        console.log('🤖 Initializing AI Analytics Command Center...');
        
        this.initializeCharts();
        this.initializeRealTimeFeed();
        this.startRealTimeUpdates();
        this.setupEventListeners();
        this.loadInitialData();
        
        console.log('✅ AI Analytics Dashboard Ready!');
    }

    // Initialize all charts
    initializeCharts() {
        this.initPredictionChart();
        this.initNeuralChart();
        this.initHazardTimeline();
    }

    // Prediction Analysis Chart
    initPredictionChart() {
        const ctx = document.getElementById('prediction-chart');
        if (!ctx) return;

        const canvas = document.createElement('canvas');
        ctx.appendChild(canvas);

        this.charts.prediction = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['High Accuracy', 'Medium Accuracy', 'Low Accuracy'],
                datasets: [{
                    data: [75, 20, 5],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Neural Network Activity Chart
    initNeuralChart() {
        const ctx = document.getElementById('neural-chart');
        if (!ctx) return;

        const canvas = document.createElement('canvas');
        ctx.appendChild(canvas);

        const data = this.generateNeuralData();

        this.charts.neural = new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Processing Load',
                    data: data.values,
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: 'white' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        beginAtZero: true,
                        max: 100
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Hazard Timeline Chart
    initHazardTimeline() {
        const ctx = document.getElementById('hazard-timeline');
        if (!ctx) return;

        const canvas = document.createElement('canvas');
        ctx.appendChild(canvas);

        const data = this.generateHazardTimelineData();

        this.charts.timeline = new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Wave Height Predictions',
                        data: data.waves,
                        borderColor: 'rgba(6, 182, 212, 1)',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Risk Level',
                        data: data.risk,
                        borderColor: 'rgba(245, 158, 11, 1)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Weather Severity',
                        data: data.weather,
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { 
                            color: 'white',
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Generate sample neural network data
    generateNeuralData() {
        const labels = [];
        const values = [];
        const now = new Date();

        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.getHours().toString().padStart(2, '0') + ':00');
            values.push(Math.random() * 40 + 50 + Math.sin(i * 0.5) * 10);
        }

        return { labels, values };
    }

    // Generate hazard timeline data
    generateHazardTimelineData() {
        const labels = [];
        const waves = [];
        const risk = [];
        const weather = [];
        const now = new Date();

        for (let i = 0; i < 24; i++) {
            const time = new Date(now.getTime() + i * 60 * 60 * 1000);
            labels.push(time.getHours().toString().padStart(2, '0') + ':00');
            
            waves.push(Math.random() * 3 + 1 + Math.sin(i * 0.3) * 0.5);
            risk.push(Math.random() * 60 + 20 + Math.cos(i * 0.2) * 15);
            weather.push(Math.random() * 80 + 10 + Math.sin(i * 0.4) * 20);
        }

        return { labels, waves, risk, weather };
    }

    // Initialize real-time feed
    initializeRealTimeFeed() {
        this.feedItems = [
            {
                icon: '🔮',
                message: 'Wave height prediction updated for Miami Beach',
                time: 'Just now',
                type: 'prediction',
                color: 'rgba(99, 102, 241, 0.2)'
            },
            {
                icon: '⚠️',
                message: 'Anomaly detected in sensor data from Sensor NYC-001',
                time: '2 min ago',
                type: 'alert',
                color: 'rgba(245, 158, 11, 0.2)'
            },
            {
                icon: '🧠',
                message: 'Neural network training completed for weather model',
                time: '5 min ago',
                type: 'training',
                color: 'rgba(16, 185, 129, 0.2)'
            },
            {
                icon: '📊',
                message: 'Risk assessment model accuracy improved to 97.3%',
                time: '8 min ago',
                type: 'improvement',
                color: 'rgba(6, 182, 212, 0.2)'
            },
            {
                icon: '🎯',
                message: 'New pattern identified in current flow data',
                time: '12 min ago',
                type: 'discovery',
                color: 'rgba(139, 92, 246, 0.2)'
            }
        ];

        this.updateFeed();
    }

    // Update real-time feed
    updateFeed() {
        const feedContainer = document.getElementById('ai-feed');
        if (!feedContainer) return;

        feedContainer.innerHTML = this.feedItems.map(item => `
            <div class="feed-item">
                <div class="feed-icon" style="background: ${item.color};">
                    ${item.icon}
                </div>
                <div class="feed-content">
                    <div class="feed-message">${item.message}</div>
                    <div class="feed-time">${item.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Start real-time updates
    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateMetrics();
            this.updateCharts();
            this.updateModels();
            this.addNewFeedItem();
        }, 5000); // Update every 5 seconds
    }

    // Update dashboard metrics
    updateMetrics() {
        const metrics = {
            accuracy: (Math.random() * 3 + 95).toFixed(1),
            models: Math.floor(Math.random() * 3) + 11,
            dataPoints: (Math.random() * 0.5 + 2.2).toFixed(1),
            responseTime: (Math.random() * 0.1 + 0.2).toFixed(2),
            threatLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]
        };

        this.animateMetricUpdate('accuracy-value', metrics.accuracy + '%');
        this.animateMetricUpdate('models-count', metrics.models);
        this.animateMetricUpdate('data-points', metrics.dataPoints + 'M');
        this.animateMetricUpdate('response-time', metrics.responseTime + 's');
        this.animateMetricUpdate('threat-level', metrics.threatLevel);
    }

    // Animate metric updates
    animateMetricUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }

    // Update charts with new data
    updateCharts() {
        // Update neural network chart
        if (this.charts.neural) {
            const newData = this.generateNeuralData();
            this.charts.neural.data.labels = newData.labels;
            this.charts.neural.data.datasets[0].data = newData.values;
            this.charts.neural.update('none');
        }

        // Update timeline chart
        if (this.charts.timeline) {
            const newData = this.generateHazardTimelineData();
            this.charts.timeline.data.labels = newData.labels;
            this.charts.timeline.data.datasets[0].data = newData.waves;
            this.charts.timeline.data.datasets[1].data = newData.risk;
            this.charts.timeline.data.datasets[2].data = newData.weather;
            this.charts.timeline.update('none');
        }
    }

    // Update model metrics
    updateModels() {
        const models = {
            wave: {
                accuracy: (Math.random() * 2 + 95).toFixed(1),
                latency: (Math.random() * 0.05 + 0.1).toFixed(2)
            },
            weather: {
                accuracy: (Math.random() * 3 + 92).toFixed(1),
                latency: (Math.random() * 0.08 + 0.15).toFixed(2)
            },
            risk: {
                progress: Math.min(100, Math.floor(Math.random() * 5) + 75),
                eta: (Math.random() * 1 + 1.5).toFixed(1)
            }
        };

        this.animateMetricUpdate('wave-accuracy', models.wave.accuracy + '%');
        this.animateMetricUpdate('wave-latency', models.wave.latency + 's');
        this.animateMetricUpdate('weather-accuracy', models.weather.accuracy + '%');
        this.animateMetricUpdate('weather-latency', models.weather.latency + 's');
        this.animateMetricUpdate('risk-progress', models.risk.progress + '%');
        this.animateMetricUpdate('risk-eta', models.risk.eta + 'h');
    }

    // Add new feed item
    addNewFeedItem() {
        const newItems = [
            {
                icon: '🔄',
                message: 'Model retraining initiated based on new data patterns',
                time: 'Just now',
                type: 'update',
                color: 'rgba(99, 102, 241, 0.2)'
            },
            {
                icon: '📈',
                message: 'Prediction confidence increased for next 6 hours',
                time: 'Just now',
                type: 'confidence',
                color: 'rgba(16, 185, 129, 0.2)'
            },
            {
                icon: '🌊',
                message: 'Ocean current model updated with satellite data',
                time: 'Just now',
                type: 'data',
                color: 'rgba(6, 182, 212, 0.2)'
            },
            {
                icon: '⚡',
                message: 'Processing speed optimized by 15% across all models',
                time: 'Just now',
                type: 'optimization',
                color: 'rgba(139, 92, 246, 0.2)'
            }
        ];

        const randomItem = newItems[Math.floor(Math.random() * newItems.length)];
        
        // Update timestamps for existing items
        this.feedItems = this.feedItems.map(item => {
            const currentTime = item.time;
            if (currentTime === 'Just now') item.time = '1 min ago';
            else if (currentTime.includes('min ago')) {
                const mins = parseInt(currentTime) + 1;
                item.time = `${mins} min ago`;
            }
            return item;
        });

        // Add new item at the beginning
        this.feedItems.unshift(randomItem);
        
        // Keep only last 8 items
        this.feedItems = this.feedItems.slice(0, 8);
        
        this.updateFeed();
    }

    // Setup event listeners
    setupEventListeners() {
        // Chart period buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const period = e.target.dataset.period;
                this.updateChartPeriod(period);
            });
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        });
    }

    // Update chart period
    updateChartPeriod(period) {
        console.log(`Updating charts for period: ${period}`);
        // In a real implementation, this would fetch data for the selected period
        this.updateCharts();
    }

    // Load initial data
    loadInitialData() {
        // Simulate loading initial data
        setTimeout(() => {
            this.showNotification('AI models synchronized successfully', 'success');
        }, 1000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            border-left: 4px solid var(--ai-primary);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Advanced Feature Functions
function openFeature(featureType) {
    const features = {
        anomaly: {
            title: 'Anomaly Detection System',
            description: 'Advanced machine learning algorithms continuously monitor ocean data streams to identify unusual patterns, potential equipment failures, and emerging threats.',
            capabilities: [
                'Real-time data stream analysis',
                'Statistical anomaly detection',
                'Pattern recognition algorithms',
                'Automated alert generation',
                'Historical trend comparison'
            ]
        },
        forecasting: {
            title: 'Predictive Forecasting Engine',
            description: 'AI-powered forecasting system that predicts ocean conditions, weather patterns, and potential hazards up to 72 hours in advance.',
            capabilities: [
                'Multi-model ensemble forecasting',
                'Weather pattern prediction',
                'Ocean current modeling',
                'Wave height forecasting',
                'Risk probability assessment'
            ]
        },
        optimization: {
            title: 'Response Optimization System',
            description: 'Intelligent system that optimizes emergency response routes, resource allocation, and deployment strategies based on real-time conditions.',
            capabilities: [
                'Route optimization algorithms',
                'Resource allocation planning',
                'Response time minimization',
                'Multi-objective optimization',
                'Dynamic strategy adjustment'
            ]
        },
        insights: {
            title: 'Smart Insights Generator',
            description: 'Advanced analytics engine that processes complex ocean data to generate actionable insights and recommendations for decision makers.',
            capabilities: [
                'Data correlation analysis',
                'Trend identification',
                'Risk assessment reports',
                'Actionable recommendations',
                'Executive dashboards'
            ]
        }
    };

    const feature = features[featureType];
    if (!feature) return;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 1rem;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            color: white;
            position: relative;
        ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">×</button>
            
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--ai-primary);">
                ${feature.title}
            </h2>
            
            <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem; opacity: 0.9;">
                ${feature.description}
            </p>
            
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Key Capabilities:</h3>
            
            <ul style="list-style: none; padding: 0;">
                ${feature.capabilities.map(capability => `
                    <li style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.5rem 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    ">
                        <span style="color: var(--ai-success);">✓</span>
                        <span>${capability}</span>
                    </li>
                `).join('')}
            </ul>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: linear-gradient(135deg, var(--ai-primary), var(--ai-secondary));
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiDashboard = new AIAnalyticsDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.aiDashboard && window.aiDashboard.updateInterval) {
        clearInterval(window.aiDashboard.updateInterval);
    }
});
