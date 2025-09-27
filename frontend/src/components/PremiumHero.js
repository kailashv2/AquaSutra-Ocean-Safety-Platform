import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaArrowRight, FaPlay, FaShieldAlt, FaWaveSquare, FaRocket } from 'react-icons/fa';

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at center, rgba(0, 102, 255, 0.1) 0%, transparent 70%);
  overflow: hidden;
  padding: 2rem;
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  color: rgba(14, 165, 233, 0.4);
  filter: drop-shadow(0 0 10px currentColor);
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 1000px;
  z-index: 2;
  position: relative;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 64, 175, 0.3);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(30, 64, 175, 0.5);
  margin-bottom: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #f8fafc;
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: #f8fafc;
  line-height: 1.2;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  color: #e2e8f0;
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(motion.button)`
  background: linear-gradient(135deg, #1e40af, #0ea5e9);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #0ea5e9;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 2rem 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #0ea5e9, #6366f1);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #0ea5e9;
  margin-bottom: 0.5rem;
  font-family: 'Orbitron', sans-serif;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WaveIndicator = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 2rem;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

const PremiumHero = ({ onReportClick, onDashboardClick }) => {
  const floatingIconsData = [
    { icon: FaWaveSquare, x: '10%', y: '20%', delay: 0 },
    { icon: FaShieldAlt, x: '85%', y: '30%', delay: 1 },
    { icon: FaRocket, x: '15%', y: '70%', delay: 2 },
    { icon: FaWaveSquare, x: '80%', y: '80%', delay: 3 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <HeroContainer>
      <FloatingElements>
        {floatingIconsData.map((item, index) => (
          <FloatingIcon
            key={index}
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: item.delay
            }}
          >
            <item.icon />
          </FloatingIcon>
        ))}
      </FloatingElements>

      <HeroContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Badge variants={itemVariants}>
            <FaShieldAlt />
            AI-Powered Ocean Safety Platform
          </Badge>

          <MainTitle variants={itemVariants}>
            AquaSutra
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Ocean Guardian
            </span>
          </MainTitle>

          <Subtitle variants={itemVariants}>
            Revolutionary AI technology meets community-driven safety. Monitor ocean hazards 
            in real-time, report incidents instantly, and protect coastal communities with 
            the power of collective intelligence and advanced analytics.
          </Subtitle>

          <ButtonGroup variants={itemVariants}>
            <PrimaryButton
              onClick={onReportClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Report Ocean Hazard
              <FaArrowRight />
            </PrimaryButton>

            <SecondaryButton
              onClick={onDashboardClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay />
              View Live Dashboard
            </SecondaryButton>
          </ButtonGroup>

          <StatsContainer variants={itemVariants}>
            <StatCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <StatNumber>24/7</StatNumber>
              <StatLabel>Real-time Monitoring</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <StatNumber>AI</StatNumber>
              <StatLabel>Powered Analytics</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <StatNumber>∞</StatNumber>
              <StatLabel>Community Driven</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <StatNumber>⚡</StatNumber>
              <StatLabel>Instant Alerts</StatLabel>
            </StatCard>
          </StatsContainer>
        </motion.div>
      </HeroContent>

      <WaveIndicator
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🌊
      </WaveIndicator>
    </HeroContainer>
  );
};

export default PremiumHero;