// AI Analytics Dashboard JavaScript
let analyticsData = {
    predictions: [
        {
            id: 'PRED-001',
            title: 'High Wave Activity Forecast',
            description: 'Wave heights expected to reach 3.2m in Miami Beach area within 6 hours',
            confidence: 'high',
            probability: 89,
            timeframe: '6 hours',
            location: 'Miami Beach, FL'
        },
        {
            id: 'PRED-002',
            title: 'Weather Pattern Analysis',
            description: 'Storm system approaching Pacific coast, moderate impact expected',
            confidence: 'medium',
            probability: 73,
            timeframe: '12 hours',
            location: 'Pacific Coast'
        },
        {
            id: 'PRED-003',
            title: 'Current Anomaly Detection',
            description: 'Unusual current patterns detected in San Francisco Bay',
            confidence: 'low',
            probability: 56,
            timeframe: '24 hours',
            location: 'San Francisco Bay'
        }
    ],
    models: [
        {
            id: 'MODEL-001',
            name: 'Wave Prediction Neural Network',
            type: 'Deep Learning',
            icon: '🌊',
            status: 'active',
            accuracy: 94.2,
            lastTrained: '2 hours ago'
        },
        {
            id: 'MODEL-002',
            name: 'Weather Pattern Classifier',
            type: 'Random Forest',
            icon: '🌦️',
            status: 'active',
            accuracy: 87.8,
            lastTrained: '6 hours ago'
        },
        {
            id: 'MODEL-003',
            name: 'Risk Assessment Engine',
            type: 'Ensemble',
            icon: '⚠️',
            status: 'training',
            accuracy: 91.5,
            lastTrained: '1 day ago'
        },
        {
            id: 'MODEL-004',
            name: 'Anomaly Detection System',
            type: 'Isolation Forest',
            icon: '🔍',
            status: 'idle',
            accuracy: 82.3,
            lastTrained: '3 days ago'
        }
    ],
    currentChart: 'accuracy'
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 AI Analytics Dashboard Loading...');
    
    initializeAnalytics();
    populatePredictions();
    populateModels();
    generateChart();
    startRealTimeUpdates();
    
    console.log('✅ AI Analytics Dashboard Ready!');
});

function initializeAnalytics() {
    updateInsights();
    
    // Set up auto-refresh for insights
    setInterval(() => {
        updateInsights();
        updateModelAccuracies();
    }, 30000); // Update every 30 seconds
}

function updateInsights() {
    // Simulate dynamic insights updates
    const predictionAccuracy = 90 + Math.random() * 8; // 90-98%
    const riskLevels = ['Low', 'Medium', 'High'];
    const currentRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const patternsFound = Math.floor(Math.random() * 10) + 3; // 3-12 patterns
    const optimizationScore = 80 + Math.random() * 15; // 80-95%
    
    // Update DOM elements with animation
    animateValue('prediction-accuracy', predictionAccuracy.toFixed(1) + '%');
    animateValue('risk-score', currentRisk);
    animateValue('patterns-found', patternsFound);
    animateValue('optimization-score', Math.round(optimizationScore) + '%');
    
    // Update confidence bars
    updateConfidenceBar(0, predictionAccuracy);
    updateConfidenceBar(2, patternsFound * 8); // Convert to percentage
    updateConfidenceBar(3, optimizationScore);
}

function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element && element.textContent !== newValue) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

function updateConfidenceBar(index, percentage) {
    const bars = document.querySelectorAll('.confidence-fill');
    if (bars[index]) {
        bars[index].style.width = Math.min(percentage, 100) + '%';
    }
}

function populatePredictions() {
    const predictionsList = document.getElementById('predictions-list');
    if (!predictionsList) return;
    
    if (analyticsData.predictions.length === 0) {
        predictionsList.innerHTML = '<p style="color: #10B981; text-align: center; padding: 20px;">✅ No active predictions</p>';
        return;
    }
    
    predictionsList.innerHTML = analyticsData.predictions.map(prediction => `
        <div class="prediction-item ${prediction.confidence}-confidence" onclick="showPredictionDetails('${prediction.id}')">
            <div class="prediction-header">
                <div class="prediction-title">${prediction.title}</div>
                <div class="confidence-badge ${prediction.confidence}">${prediction.probability}%</div>
            </div>
            <div class="prediction-desc">${prediction.description}</div>
            <div class="prediction-meta">
                <span>📍 ${prediction.location}</span>
                <span>⏰ ${prediction.timeframe}</span>
            </div>
        </div>
    `).join('');
}

function populateModels() {
    const modelsList = document.getElementById('models-list');
    if (!modelsList) return;
    
    modelsList.innerHTML = analyticsData.models.map(model => `
        <div class="model-item" onclick="showModelDetails('${model.id}')">
            <div class="model-info">
                <span class="model-icon">${model.icon}</span>
                <div>
                    <div class="model-name">${model.name}</div>
                    <div class="model-type">${model.type} • ${model.accuracy}% accuracy</div>
                </div>
            </div>
            <div class="model-status ${model.status}">${model.status.toUpperCase()}</div>
        </div>
    `).join('');
}

function generateChart() {
    const chartContainer = document.getElementById('analytics-chart');
    if (!chartContainer) return;
    
    // Generate sample data based on current chart type
    let dataPoints = [];
    let maxValue = 100;
    
    switch (analyticsData.currentChart) {
        case 'accuracy':
            dataPoints = Array.from({length: 24}, () => 85 + Math.random() * 10);
            maxValue = 100;
            break;
        case 'predictions':
            dataPoints = Array.from({length: 24}, () => Math.floor(Math.random() * 50) + 10);
            maxValue = 60;
            break;
        case 'performance':
            dataPoints = Array.from({length: 24}, () => 70 + Math.random() * 25);
            maxValue = 100;
            break;
    }
    
    // Clear existing chart
    chartContainer.innerHTML = '';
    
    // Create chart bars
    dataPoints.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${(value / maxValue) * 100}%`;
        bar.title = `${analyticsData.currentChart}: ${value.toFixed(1)}${analyticsData.currentChart === 'predictions' ? '' : '%'}`;
        
        // Add click handler
        bar.addEventListener('click', () => {
            showChartDataPoint(value, index);
        });
        
        chartContainer.appendChild(bar);
        
        // Animate bar appearance
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
        }, index * 30);
    });
}

function switchChart(chartType) {
    analyticsData.currentChart = chartType;
    
    // Update active tab
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Regenerate chart
    generateChart();
    showNotification(`📊 Switched to ${chartType} visualization`, 'info');
}

function showChartDataPoint(value, index) {
    const timeAgo = `${23 - index} hours ago`;
    showNotification(`📊 ${analyticsData.currentChart}: ${value.toFixed(1)}${analyticsData.currentChart === 'predictions' ? '' : '%'} (${timeAgo})`, 'info');
}

function refreshPredictions() {
    // Simulate updating predictions
    analyticsData.predictions.forEach(prediction => {
        prediction.probability += (Math.random() - 0.5) * 10;
        prediction.probability = Math.max(30, Math.min(95, prediction.probability));
    });
    
    // Occasionally add new prediction
    if (Math.random() < 0.3) {
        const newPredictions = [
            {
                id: `PRED-${Date.now()}`,
                title: 'Tidal Pattern Shift',
                description: 'Unusual tidal patterns detected in coastal areas',
                confidence: 'medium',
                probability: Math.floor(Math.random() * 30) + 60,
                timeframe: '8 hours',
                location: 'Coastal Areas'
            }
        ];
        
        analyticsData.predictions.unshift(newPredictions[0]);
        if (analyticsData.predictions.length > 5) {
            analyticsData.predictions.pop();
        }
    }
    
    populatePredictions();
    showNotification('🔮 Predictions updated with latest AI analysis', 'success');
}

function showPredictionDetails(predictionId) {
    const prediction = analyticsData.predictions.find(p => p.id === predictionId);
    if (prediction) {
        showNotification(`🔮 ${prediction.title} - ${prediction.probability}% confidence`, 'info');
    }
}

function showModelDetails(modelId) {
    const model = analyticsData.models.find(m => m.id === modelId);
    if (model) {
        showNotification(`🧠 ${model.name} - ${model.accuracy}% accuracy (${model.status.toUpperCase()})`, 'info');
    }
}

function updateModelAccuracies() {
    analyticsData.models.forEach(model => {
        if (model.status === 'active') {
            // Simulate small accuracy changes
            model.accuracy += (Math.random() - 0.5) * 0.5;
            model.accuracy = Math.max(75, Math.min(98, model.accuracy));
        }
    });
    
    populateModels();
}

function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time AI updates
        updateInsights();
        
        // Occasionally update predictions
        if (Math.random() < 0.2) {
            refreshPredictions();
        }
        
        // Update model statuses
        if (Math.random() < 0.1) {
            const randomModel = analyticsData.models[Math.floor(Math.random() * analyticsData.models.length)];
            const statuses = ['active', 'training', 'idle'];
            randomModel.status = statuses[Math.floor(Math.random() * statuses.length)];
            populateModels();
            showNotification(`🧠 ${randomModel.name} status changed to ${randomModel.status.toUpperCase()}`, 'info');
        }
    }, 15000); // Update every 15 seconds
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
            notification.style.background = 'linear-gradient(135deg, #8B5CF6, #7C3AED)';
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
    .chart-bar {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: bottom;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
