import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import RealTimeHazardMap from '../components/HazardMap';
import WaterQualityChart from '../components/WaterQualityChart';
import WaterUsageGauge from '../components/WaterUsageGauge';
import { FaGlobe, FaExclamationTriangle, FaShieldAlt, FaTachometerAlt, FaArrowLeft } from 'react-icons/fa';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: #f8fafc;
  padding: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(30, 64, 175, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(13, 148, 136, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const BackButton = styled(motion.button)`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: #f8fafc;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(30, 64, 175, 0.8);
    border-color: rgba(30, 64, 175, 0.5);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.1);
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  svg {
    color: #0ea5e9;
    filter: drop-shadow(0 0 10px #0ea5e9);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    border-color: rgba(30, 64, 175, 0.3);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${props => props.color || '#1e40af'}, ${props => props.colorSecondary || '#0ea5e9'});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 15px ${props => props.color || '#1e40af'}30;
`;

const StatValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
`;

const StatLabel = styled.div`
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 500;
`;

const StatChange = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '${props => props.positive ? '↗' : '↘'}';
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MapSection = styled(motion.div)`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PremiumDashboard = ({ onBack }) => {
  const mockStats = [
    {
      icon: FaExclamationTriangle,
      value: '12',
      label: 'Active Alerts',
      change: '+3',
      positive: false,
      color: '#ef4444',
      colorSecondary: '#dc2626'
    },
    {
      icon: FaShieldAlt,
      value: '98.2%',
      label: 'Safety Score',
      change: '+0.5%',
      positive: true,
      color: '#10b981',
      colorSecondary: '#059669'
    },
    {
      icon: FaGlobe,
      value: '247',
      label: 'Stations Online',
      change: '+2',
      positive: true,
      color: '#0ea5e9',
      colorSecondary: '#0284c7'
    },
    {
      icon: FaTachometerAlt,
      value: '1.2s',
      label: 'Response Time',
      change: '-0.3s',
      positive: true,
      color: '#7c3aed',
      colorSecondary: '#6366f1'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <DashboardContainer>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {onBack && (
              <BackButton
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowLeft />
                Back to Home
              </BackButton>
            )}
            <Title variants={itemVariants}>
              <FaGlobe />
              Real-Time Ocean Safety Dashboard
            </Title>
          </div>
        </Header>

        <StatsGrid>
          {mockStats.map((stat, index) => (
            <StatCard
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <StatHeader>
                <StatIcon color={stat.color} colorSecondary={stat.colorSecondary}>
                  <stat.icon />
                </StatIcon>
                <StatChange positive={stat.positive}>
                  {stat.change}
                </StatChange>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <MainGrid>
          <MapSection variants={itemVariants}>
            <SectionTitle>
              🌊 Live Hazard Monitoring
            </SectionTitle>
            <RealTimeHazardMap 
              height="500px"
              autoRefresh={true}
              refreshInterval={10000} // 10 seconds for demo
              showControls={true}
              showLegend={true}
              center={[15.9129, 79.7400]} // India center
              zoom={6}
            />
          </MapSection>

          <SidePanel>
            <motion.div variants={itemVariants}>
              <WaterQualityChart />
            </motion.div>
            <motion.div variants={itemVariants}>
              <WaterUsageGauge percentage={78} />
            </motion.div>
          </SidePanel>
        </MainGrid>
      </motion.div>
    </DashboardContainer>
  );
};

export default PremiumDashboard;