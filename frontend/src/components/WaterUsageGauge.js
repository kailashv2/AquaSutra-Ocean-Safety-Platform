import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const fillAnimation = keyframes`
  0% {
    height: 0%;
  }
  100% {
    height: var(--fill-level);
  }
`;

const waveAnimation = keyframes`
  0% {
    transform: translateX(0) translateY(0) rotate(0);
  }
  50% {
    transform: translateX(-25%) translateY(2px) rotate(0);
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0);
  }
`;

const Container = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #06b6d4);
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 20px 40px 0 rgba(31, 38, 135, 0.5),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  font-family: 'Space Grotesk', sans-serif;
  background: linear-gradient(135deg, #ffffff 0%, #14b8a6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '💧';
    font-size: 1.5rem;
    filter: drop-shadow(0 0 10px #14b8a6);
  }
`;

const GaugeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const GaugeWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
`;

const GaugeOuter = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    inset 0 0 20px rgba(20, 184, 166, 0.2),
    0 0 20px rgba(20, 184, 166, 0.3);
`;

const GaugeFill = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--fill-level);
  background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
  border-radius: 50% 50% 0 0;
  animation: ${fillAnimation} 2s ease-out forwards;
  box-shadow: 
    0 0 20px rgba(20, 184, 166, 0.5),
    inset 0 0 10px rgba(6, 182, 212, 0.3);
`;

const GaugeWave = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23ffffff22'/%3E%3C/svg%3E");
  background-position: 0 bottom;
  background-repeat: repeat-x;
  animation: ${waveAnimation} 3s ease-in-out infinite;
`;

const GaugeCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  height: 75%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const GaugeValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatsContainer = styled.div`
  flex: 1;
  padding-left: 2rem;
  
  @media (max-width: 768px) {
    padding-left: 0;
    padding-top: 1.5rem;
  }
`;

const StatRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Space Grotesk', sans-serif;
`;

const WaterUsageGauge = ({ percentage = 65, stats = {} }) => {
  const defaultStats = {
    daily: '320 L',
    weekly: '2,240 L',
    monthly: '9,600 L',
    trend: '-5% from last month'
  };
  
  const mergedStats = { ...defaultStats, ...stats };
  
  return (
    <Container
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <Title>Water Usage Monitor</Title>
      <GaugeContainer>
        <GaugeWrapper>
          <GaugeOuter>
            <GaugeFill style={{ '--fill-level': `${percentage}%` }} />
            <GaugeWave />
          </GaugeOuter>
          <GaugeCenter>
            <GaugeValue>{percentage}%</GaugeValue>
          </GaugeCenter>
        </GaugeWrapper>
        
        <StatsContainer>
          <StatRow
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ x: 5 }}
          >
            <StatLabel>📅 Daily Usage:</StatLabel>
            <StatValue>{mergedStats.daily}</StatValue>
          </StatRow>
          <StatRow
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <StatLabel>📆 Weekly Usage:</StatLabel>
            <StatValue>{mergedStats.weekly}</StatValue>
          </StatRow>
          <StatRow
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ x: 5 }}
          >
            <StatLabel>📈 Monthly Usage:</StatLabel>
            <StatValue>{mergedStats.monthly}</StatValue>
          </StatRow>
          <StatRow
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ x: 5 }}
          >
            <StatLabel>📊 Trend:</StatLabel>
            <StatValue style={{ 
              color: mergedStats.trend.includes('-') ? '#10b981' : '#ef4444',
              filter: `drop-shadow(0 0 5px ${mergedStats.trend.includes('-') ? '#10b981' : '#ef4444'})`
            }}>
              {mergedStats.trend}
            </StatValue>
          </StatRow>
        </StatsContainer>
      </GaugeContainer>
    </Container>
  );
};

export default WaterUsageGauge;