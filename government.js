// Enhanced Government Integration Portal JavaScript
let governmentData = {
    currentUser: null,
    isAuthenticated: false,
    pendingReports: [],
    approvedReports: [],
    rejectedReports: [],
    agencies: [
        {
            id: 'NOAA',
            name: 'NOAA',
            fullName: 'National Oceanic and Atmospheric Administration',
            status: 'connected',
            description: 'Weather and ocean data integration for enhanced forecasting',
            lastSync: new Date(Date.now() - 300000) // 5 minutes ago
        },
        {
            id: 'USCG',
            name: 'USCG',
            fullName: 'U.S. Coast Guard',
            status: 'connected',
            description: 'Emergency response coordination and maritime safety',
            lastSync: new Date(Date.now() - 180000) // 3 minutes ago
        },
        {
            id: 'EPA',
            name: 'EPA',
            fullName: 'Environmental Protection Agency',
            status: 'connected',
            description: 'Environmental compliance and pollution monitoring',
            lastSync: new Date(Date.now() - 600000) // 10 minutes ago
        },
        {
            id: 'FEMA',
            name: 'FEMA',
            fullName: 'Federal Emergency Management Agency',
            status: 'connected',
            description: 'Disaster response and emergency management coordination',
            lastSync: new Date(Date.now() - 900000) // 15 minutes ago
        },
        {
            id: 'NWS',
            name: 'NWS',
            fullName: 'National Weather Service',
            status: 'connected',
            description: 'Weather alerts and forecasting data integration',
            lastSync: new Date(Date.now() - 240000) // 4 minutes ago
        },
        {
            id: 'DHS',
            name: 'DHS',
            fullName: 'Department of Homeland Security',
            status: 'pending',
            description: 'Security protocols and threat assessment integration',
            lastSync: null
        }
    ],
    stats: {
        connectedAgencies: 12,
        dataReports: 847,
        complianceScore: 98,
        responseTime: 2.3,
        pendingReports: 15,
        approvedReports: 234,
        rejectedReports: 12
    },
    users: [
        {
            id: 'gov001',
            username: 'gov.admin',
            password: 'admin123',
            name: 'Government Administrator',
            role: 'admin',
            clearance: 'Level 4',
            department: 'Ocean Safety Division',
            permissions: ['approve_reports', 'reject_reports', 'manage_users', 'view_analytics']
        },
        {
            id: 'gov002',
            username: 'safety.officer',
            password: 'safety456',
            name: 'Safety Officer',
            role: 'officer',
            clearance: 'Level 3',
            department: 'Emergency Response',
            permissions: ['approve_reports', 'reject_reports', 'view_analytics']
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏛️ Government Integration Portal Loading...');
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    
    initializeGovernmentPortal();
    populateAgencies();
    updateDashboardStats();
    initializeSampleReports();
    
    // Animate elements on load
    setTimeout(() => {
        animateElementsOnLoad();
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✅ Government Integration Portal Ready!');
});

// Initialize sample reports for demonstration
function initializeSampleReports() {
    governmentData.pendingReports = [
        {
            id: 'RPT-001',
            title: 'Rip Current Warning - Miami Beach',
            type: 'hazard',
            severity: 'high',
            location: 'Miami Beach, FL',
            reporter: 'John Smith',
            timestamp: new Date(Date.now() - 3600000),
            description: 'Strong rip current observed near lifeguard station 5',
            status: 'pending'
        },
        {
            id: 'RPT-002', 
            title: 'Oil Spill Detected',
            type: 'emergency',
            severity: 'critical',
            location: 'Santa Monica Bay, CA',
            reporter: 'Coast Guard Unit',
            timestamp: new Date(Date.now() - 1800000),
            description: 'Small oil spill detected near marina',
            status: 'pending'
        }
    ];
}

// Initialize government portal
function initializeGovernmentPortal() {
    // Set up real-time updates
    setInterval(() => {
        updateDashboardStats();
        updateAgencyStatus();
    }, 30000); // Update every 30 seconds
}

// Animate elements on load
function animateElementsOnLoad() {
    const elements = document.querySelectorAll('.hero-section, .services-grid, .dashboard-section, .agencies-section, .access-portal');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate service cards
    setTimeout(() => {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }, 800);
}

// Populate agencies grid
function populateAgencies() {
    const agenciesGrid = document.getElementById('agencies-grid');
    if (!agenciesGrid) return;
    
    agenciesGrid.innerHTML = governmentData.agencies.map(agency => `
        <div class="agency-card" onclick="showAgencyDetails('${agency.id}')">
            <div class="agency-header">
                <div class="agency-logo">${agency.name}</div>
                <div>
                    <div class="agency-name">${agency.fullName}</div>
                    <div class="agency-status ${agency.status}">${agency.status.toUpperCase()}</div>
                </div>
            </div>
            <div class="agency-description">${agency.description}</div>
            <div style="margin-top: 12px; font-size: 12px; color: #9CA3AF;">
                ${agency.lastSync ? `Last sync: ${getTimeAgo(agency.lastSync)}` : 'Pending connection'}
            </div>
        </div>
    `).join('');
}

// Update dashboard statistics
function updateDashboardStats() {
    // Simulate real-time updates
    governmentData.stats.dataReports += Math.floor(Math.random() * 3);
    governmentData.stats.complianceScore = Math.max(95, Math.min(100, governmentData.stats.complianceScore + (Math.random() - 0.5) * 0.5));
    governmentData.stats.responseTime = Math.max(1.5, Math.min(4.0, governmentData.stats.responseTime + (Math.random() - 0.5) * 0.2));
    
    // Update DOM elements
    animateStatUpdate('connected-agencies', governmentData.stats.connectedAgencies);
    animateStatUpdate('data-reports', governmentData.stats.dataReports);
    animateStatUpdate('compliance-score', Math.round(governmentData.stats.complianceScore) + '%');
    animateStatUpdate('response-time', governmentData.stats.responseTime.toFixed(1) + 'm');
}

// Animate stat updates
function animateStatUpdate(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element && element.textContent !== newValue.toString()) {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#10B981';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '#F59E0B';
        }, 150);
    }
}

// Update agency status
function updateAgencyStatus() {
    governmentData.agencies.forEach(agency => {
        if (agency.status === 'connected' && Math.random() < 0.1) {
            agency.lastSync = new Date();
        }
    });
    
    populateAgencies();
}

// Service portal functions
function showDataSharingPortal() {
    const modal = createGovernmentModal('📊 Data Sharing Portal', `
        <div style="max-width: 700px;">
            <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent); transform: rotate(45deg); animation: shimmer 3s infinite;"></div>
                <h3 style="margin: 0 0 12px 0; font-size: 20px; position: relative;">🔒 Secure Data Exchange Platform</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 14px; position: relative; color: white;">Real-time ocean safety data sharing with authorized government agencies and emergency services</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: linear-gradient(135deg, #F8FAFC, #EFF6FF); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(59, 130, 246, 0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">📈</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 18px;">1,247</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Reports Shared Today</div>
                </div>
                <div style="background: linear-gradient(135deg, #F0FDF4, #ECFDF5); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">🔄</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 18px;">Live</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Real-time Sync</div>
                </div>
                <div style="background: linear-gradient(135deg, #FFFBEB, #FEF3C7); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(245, 158, 11, 0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(245, 158, 11, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">🛡️</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 18px;">AES-256</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Encrypted Transfer</div>
                </div>
                <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(236, 72, 153, 0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(236, 72, 153, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">⚡</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 18px;">< 2s</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Response Time</div>
                </div>
            </div>
            
            <div style="background: rgba(59, 130, 246, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #3B82F6;">
                <h4 style="margin: 0 0 12px 0; color: #1E40AF; font-weight: 700;">🌊 Available Data Streams:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Real-time hazard reports and alerts</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Ocean condition monitoring data</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Emergency response coordination</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Compliance and regulatory reporting</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Weather and environmental data</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Incident management and tracking</div>
                </div>
            </div>
            
            <div style="text-align: center; display: flex; gap: 12px; justify-content: center;">
                <button onclick="accessDataPortal()" style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)';">
                    🚀 Access Data Portal
                </button>
                <button onclick="downloadAPI()" style="background: rgba(255, 255, 255, 0.9); border: 2px solid #3B82F6; color: #3B82F6; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='#3B82F6'; this.style.color='white';" onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'; this.style.color='#3B82F6';">
                    📋 API Documentation
                </button>
                <button onclick="closeModal()" style="background: #F3F4F6; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 500; color: #6B7280;">
                    Close
                </button>
            </div>
        </div>
    `);
}

function showEmergencyCoordination() {
    const modal = createGovernmentModal('🚨 Emergency Coordination Hub', `
        <div style="max-width: 700px;">
            <div style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 20px;">🚨 Multi-Agency Response Center</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 14px; color: white;">Real-time emergency coordination with Coast Guard, Marine Police, and Emergency Services</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #FEF2F2; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 8px;">⏱️</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">2.3m</div>
                    <div style="font-size: 12px; color: #6B7280;">Avg Response Time</div>
                </div>
                <div style="background: #F0FDF4; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 8px;">🔴</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">24/7</div>
                    <div style="font-size: 12px; color: #6B7280;">Active Status</div>
                </div>
                <div style="background: #EFF6FF; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 8px;">🚁</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">12</div>
                    <div style="font-size: 12px; color: #6B7280;">Active Units</div>
                </div>
            </div>
            
            <div style="text-align: center; display: flex; gap: 12px; justify-content: center;">
                <button onclick="accessEmergencyHub()" style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                    🚨 Access Emergency Hub
                </button>
                <button onclick="closeModal()" style="background: #F3F4F6; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `);
}

function showPolicyIntegration() {
    const modal = createGovernmentModal('⚖️ Policy Integration Center', `
        <div style="max-width: 700px;">
            <div style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 20px;">⚖️ Legislative Framework Center</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 14px; color: white;">Integration with policy frameworks and legislative requirements</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #F3E8FF; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 8px;">📜</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">47</div>
                    <div style="font-size: 12px; color: #6B7280;">Active Policies</div>
                </div>
                <div style="background: #F0FDF4; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 8px;">✅</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">100%</div>
                    <div style="font-size: 12px; color: #6B7280;">Alignment Score</div>
                </div>
            </div>
            
            <div style="text-align: center; display: flex; gap: 12px; justify-content: center;">
                <button onclick="explorePolicyTools()" style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                    ⚖️ Explore Policy Tools
                </button>
                <button onclick="closeModal()" style="background: #F3F4F6; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `);
}

function showComplianceCenter() {
    const modal = createGovernmentModal('📋 Regulatory Compliance Center', `
        <div style="max-width: 700px;">
            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent); transform: rotate(45deg); animation: shimmer 3s infinite;"></div>
                <h3 style="margin: 0 0 12px 0; font-size: 20px; position: relative;">✅ Automated Compliance Dashboard</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 14px; position: relative; color: white;">Real-time monitoring and automated reporting for maritime safety and environmental regulations</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: linear-gradient(135deg, #F0FDF4, #DCFCE7); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.2); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">📈</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">98.7%</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Compliance Score</div>
                </div>
                <div style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(59, 130, 246, 0.2); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">🔄</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">Auto</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Sync Enabled</div>
                </div>
                <div style="background: linear-gradient(135deg, #FFFBEB, #FEF3C7); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(245, 158, 11, 0.2); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(245, 158, 11, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">📊</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">24/7</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Live Monitoring</div>
                </div>
                <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(236, 72, 153, 0.2); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(236, 72, 153, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 28px; margin-bottom: 8px;">🎯</div>
                    <div style="font-weight: 700; color: #1F2937; font-size: 20px;">Zero</div>
                    <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Violations</div>
                </div>
            </div>
            
            <div style="background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #10B981;">
                <h4 style="margin: 0 0 12px 0; color: #065F46; font-weight: 700;">🛡️ Compliance Areas Monitored:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Maritime safety regulations (SOLAS/MARPOL)</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Environmental protection standards (EPA)</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Emergency response protocols (USCG)</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Data privacy and security (GDPR/CCPA)</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> Coastal zone management regulations</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✅</span> International maritime law compliance</div>
                </div>
            </div>
            
            <div style="text-align: center; display: flex; gap: 12px; justify-content: center;">
                <button onclick="viewComplianceDashboard()" style="background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)';">
                    📊 View Dashboard
                </button>
                <button onclick="generateReport()" style="background: rgba(255, 255, 255, 0.9); border: 2px solid #10B981; color: #10B981; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='#10B981'; this.style.color='white';" onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'; this.style.color='#10B981';">
                    📋 Generate Report
                </button>
                <button onclick="closeModal()" style="background: #F3F4F6; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 500; color: #6B7280;">
                    Close
                </button>
            </div>
        </div>
    `);
}

// Agency details function
function showAgencyDetails(agencyId) {
    const agency = governmentData.agencies.find(a => a.id === agencyId);
    if (agency) {
        showNotification(`${agency.fullName} - Status: ${agency.status.toUpperCase()}`, 'info');
    }
}

// Government Login System
function showGovernmentLogin() {
    if (governmentData.isAuthenticated) {
        // Navigate to government admin interface in same tab
        window.location.href = 'government-admin.html';
        return;
    }
    
    const modal = createGovernmentModal('🔐 Government Login', `
        <div style="max-width: 400px;">
            <div style="background: linear-gradient(135deg, #1E40AF, #3B82F6); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">🏛️</div>
                <h3 style="margin: 0 0 8px 0; font-size: 20px;">Secure Government Access</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 14px;">Authorized Personnel Only</p>
            </div>
            
            <form onsubmit="handleGovernmentLogin(event)" style="margin-bottom: 24px;">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Username</label>
                    <input type="text" id="gov-username" placeholder="Enter government username" 
                           style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151;">Password</label>
                    <input type="password" id="gov-password" placeholder="Enter secure password" 
                           style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;" required>
                </div>
                
                <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #1E40AF, #3B82F6); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 16px;">
                    🔐 Secure Login
                </button>
            </form>
            
            <div style="background: #F0F9FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; color: #1E40AF; font-size: 14px;">Demo Credentials:</h4>
                <div style="font-size: 13px; color: #1E40AF; line-height: 1.4;">
                    <strong>Admin:</strong> gov.admin / admin123<br>
                    <strong>Officer:</strong> safety.officer / safety456
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="closeModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer; color: #6B7280;">
                    Cancel
                </button>
            </div>
        </div>
    `);
}

function handleGovernmentLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('gov-username').value;
    const password = document.getElementById('gov-password').value;
    
    const user = governmentData.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        governmentData.currentUser = user;
        governmentData.isAuthenticated = true;
        
        // Update UI
        document.getElementById('auth-name').textContent = user.name;
        document.getElementById('auth-level').textContent = user.clearance;
        
        closeModal();
        showNotification(`✅ Welcome ${user.name}! Access granted.`, 'success');
        
        // Navigate to government admin interface in same tab
        setTimeout(() => {
            window.location.href = 'government-admin.html';
        }, 1000);
    } else {
        showNotification('❌ Invalid credentials. Access denied.', 'error');
    }
}

// Portal access functions
function requestGovernmentAccess() {
    if (!governmentData.isAuthenticated) {
        showGovernmentLogin();
    } else {
        showNotification('🔐 Government access request submitted for review', 'info');
    }
}

function viewDocumentation() {
    showNotification('📚 Opening API documentation and integration guides', 'info');
}

function accessDataPortal() {
    closeModal();
    showNotification('📊 Connecting to secure data sharing portal...', 'info');
}

function viewComplianceReport() {
    closeModal();
    showNotification('📋 Generating comprehensive compliance report...', 'success');
}

function accessEmergencyHub() {
    closeModal();
    showNotification('🚨 Accessing multi-agency emergency coordination hub...', 'info');
}

function explorePolicyTools() {
    closeModal();
    showNotification('⚖️ Opening policy integration and compliance tools...', 'info');
}

// Report Management Dashboard
function showReportManagementDashboard() {
    if (!governmentData.isAuthenticated) {
        showGovernmentLogin();
        return;
    }
    
    const modal = createGovernmentModal('📋 Report Management Dashboard', `
        <div style="max-width: 900px;">
            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0 0 8px 0; font-size: 20px;">📋 Report Management</h3>
                        <p style="margin: 0; opacity: 0.9;">Review and approve hazard reports</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: 800;">${governmentData.pendingReports.length}</div>
                        <div style="font-size: 14px; opacity: 0.9;">Pending Reports</div>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #FEF3C7; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: #D97706;">${governmentData.pendingReports.length}</div>
                    <div style="font-size: 14px; color: #6B7280;">Pending Review</div>
                </div>
                <div style="background: #DCFCE7; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: #16A34A;">${governmentData.stats.approvedReports}</div>
                    <div style="font-size: 14px; color: #6B7280;">Approved</div>
                </div>
                <div style="background: #FEE2E2; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: #DC2626;">${governmentData.stats.rejectedReports}</div>
                    <div style="font-size: 14px; color: #6B7280;">Rejected</div>
                </div>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h4 style="margin-bottom: 16px; color: #374151;">Pending Reports for Review:</h4>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${generateReportsList()}
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="closeModal()" style="padding: 12px 24px; background: #F3F4F6; border: none; border-radius: 8px; cursor: pointer;">
                    Close Dashboard
                </button>
            </div>
        </div>
    `);
}

function generateReportsList() {
    if (governmentData.pendingReports.length === 0) {
        return '<div style="text-align: center; padding: 40px; color: #6B7280;">No pending reports to review</div>';
    }
    
    return governmentData.pendingReports.map(report => `
        <div style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 16px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h5 style="margin: 0 0 4px 0; color: #1F2937; font-size: 16px;">${report.title}</h5>
                    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                        <span style="background: ${getSeverityColor(report.severity)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${report.severity.toUpperCase()}
                        </span>
                        <span style="background: #F3F4F6; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #6B7280;">
                            ${report.type.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div style="text-align: right; font-size: 12px; color: #6B7280;">
                    ${formatTimestamp(report.timestamp)}
                </div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">📍 ${report.location}</div>
                <div style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">👤 Reported by: ${report.reporter}</div>
                <div style="font-size: 14px; color: #374151; line-height: 1.4;">${report.description}</div>
            </div>
            
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button onclick="approveReport('${report.id}')" 
                        style="padding: 8px 16px; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    ✅ Approve
                </button>
                <button onclick="rejectReport('${report.id}')" 
                        style="padding: 8px 16px; background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    ❌ Reject
                </button>
                <button onclick="viewReportDetails('${report.id}')" 
                        style="padding: 8px 16px; background: #F3F4F6; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
                    👁️ Details
                </button>
            </div>
        </div>
    `).join('');
}

function approveReport(reportId) {
    const reportIndex = governmentData.pendingReports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
        const report = governmentData.pendingReports[reportIndex];
        report.status = 'approved';
        report.approvedBy = governmentData.currentUser.name;
        report.approvedAt = new Date();
        
        governmentData.approvedReports.push(report);
        governmentData.pendingReports.splice(reportIndex, 1);
        governmentData.stats.approvedReports++;
        governmentData.stats.pendingReports--;
        
        showNotification(`✅ Report "${report.title}" approved successfully`, 'success');
        
        // Refresh the dashboard
        closeModal();
        setTimeout(() => showReportManagementDashboard(), 500);
    }
}

function rejectReport(reportId) {
    const reportIndex = governmentData.pendingReports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
        const report = governmentData.pendingReports[reportIndex];
        report.status = 'rejected';
        report.rejectedBy = governmentData.currentUser.name;
        report.rejectedAt = new Date();
        
        governmentData.rejectedReports.push(report);
        governmentData.pendingReports.splice(reportIndex, 1);
        governmentData.stats.rejectedReports++;
        governmentData.stats.pendingReports--;
        
        showNotification(`❌ Report "${report.title}" rejected`, 'warning');
        
        // Refresh the dashboard
        closeModal();
        setTimeout(() => showReportManagementDashboard(), 500);
    }
}

function viewReportDetails(reportId) {
    const report = governmentData.pendingReports.find(r => r.id === reportId);
    if (report) {
        showNotification(`👁️ Viewing details for: ${report.title}`, 'info');
    }
}

// Utility functions for report management
function getSeverityColor(severity) {
    switch (severity) {
        case 'critical': return '#DC2626';
        case 'high': return '#EA580C';
        case 'medium': return '#D97706';
        case 'low': return '#16A34A';
        default: return '#6B7280';
    }
}

function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return timestamp.toLocaleDateString();
    }
}

// Utility functions
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else {
        return `${hours}h ago`;
    }
}

// Modal system
function createGovernmentModal(title, content) {
    const overlay = document.createElement('div');
    overlay.id = 'government-modal';
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
            <button onclick="closeModal()" style="background: #F3F4F6; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>
        <div style="padding: 24px;">
            ${content}
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    return overlay;
}

function closeModal() {
    const modal = document.getElementById('government-modal');
    if (modal) {
        modal.remove();
    }
}

// Service action functions
function accessDataPortal() {
    closeModal();
    showNotification('🚀 Accessing Data Portal...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Connected to secure data exchange platform', 'success');
    }, 1500);
}

function downloadAPI() {
    showNotification('📋 Downloading API documentation...', 'info');
    
    // Simulate API documentation download
    setTimeout(() => {
        const blob = new Blob(['# AquaSutra Government API Documentation\n\nThis is a comprehensive guide to the AquaSutra Government Data API...'], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aquasutra-api-docs.md';
        a.click();
        
        showNotification('✅ API documentation downloaded successfully', 'success');
    }, 1000);
}

function viewComplianceDashboard() {
    closeModal();
    showNotification('📊 Opening Compliance Dashboard...', 'info');
    
    // Add fade out animation
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'compliance-dashboard.html';
    }, 300);
}

function generateReport() {
    showNotification('📋 Generating compliance report...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        const reportData = {
            timestamp: new Date().toISOString(),
            complianceScore: '98.7%',
            violations: 0,
            recommendations: ['Continue current monitoring protocols', 'Schedule quarterly review']
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        showNotification('✅ Compliance report generated and downloaded', 'success');
    }, 2000);
}

function accessEmergencyHub() {
    closeModal();
    showNotification('🚑 Connecting to Emergency Coordination Hub...', 'info');
    
    // Add fade out animation
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'emergency-hub.html';
    }, 300);
}

function viewResponseMetrics() {
    showNotification('📊 Loading response metrics...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Average response time: 2.3 minutes - Excellent performance', 'success');
    }, 1000);
}

function explorePolicyTools() {
    closeModal();
    showNotification('⚖️ Opening Policy Integration Center...', 'info');
    
    // Add fade out animation
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'policy-center.html';
    }, 300);
}

function downloadPolicyFramework() {
    showNotification('📋 Downloading policy framework...', 'info');
    
    // Simulate policy framework download
    setTimeout(() => {
        const policyData = {
            framework: 'Ocean Safety Policy Integration',
            version: '2.1',
            lastUpdated: new Date().toISOString(),
            sections: ['Maritime Safety', 'Environmental Protection', 'Emergency Response', 'Public Consultation']
        };
        
        const blob = new Blob([JSON.stringify(policyData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'policy-framework.json';
        a.click();
        
        showNotification('✅ Policy framework downloaded successfully', 'success');
    }, 1500);
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
            notification.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes shimmer {
        from { transform: translateX(-100%); }
        to { transform: translateX(100%); }
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes modalSlideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
