import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaRobot, 
  FaMapMarkedAlt, 
  FaUsers, 
  FaBell, 
  FaChartLine, 
  FaMobile,
  FaShieldAlt,
  FaGlobe,
  FaLightbulb
} from 'react-icons/fa';

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.95) 0%, 
    rgba(30, 41, 59, 0.9) 50%,
    rgba(51, 65, 85, 0.95) 100%);
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #f8fafc;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.3rem;
  color: #e2e8f0;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 3rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${props => props.accentColor || '#00d4ff'}, 
      ${props => props.secondaryColor || '#8b5cf6'});
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(0, 212, 255, 0.02) 0%, 
      transparent 50%, 
      rgba(139, 92, 246, 0.02) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, 
    ${props => props.accentColor || '#00d4ff'}, 
    ${props => props.secondaryColor || '#8b5cf6'});
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      ${props => props.accentColor || '#00d4ff'}, 
      ${props => props.secondaryColor || '#8b5cf6'});
    border-radius: 22px;
    z-index: -1;
    filter: blur(10px);
    opacity: 0.7;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: white;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f8fafc;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const FeatureDescription = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
`;

const FeatureTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(0, 212, 255, 0.2);
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
`;

const PremiumFeatures = () => {
  const features = [
    {
      icon: FaRobot,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze ocean patterns, weather data, and social media feeds to predict and identify potential hazards before they become critical.",
      tags: ["Machine Learning", "Predictive Analytics", "Real-time Processing"],
      accentColor: "#1e40af",
      secondaryColor: "#0ea5e9"
    },
    {
      icon: FaMapMarkedAlt,
      title: "Interactive Hazard Mapping",
      description: "Real-time visualization of ocean hazards with precise geolocation, severity indicators, and crowd-sourced verification from the global community.",
      tags: ["Live Mapping", "Geolocation", "Community Verified"],
      accentColor: "#7c3aed",
      secondaryColor: "#6366f1"
    },
    {
      icon: FaUsers,
      title: "Community Collaboration",
      description: "Connect with ocean safety professionals, local authorities, and community members to share insights, verify reports, and coordinate emergency responses.",
      tags: ["Social Network", "Verification", "Emergency Response"],
      accentColor: "#14b8a6",
      secondaryColor: "#06b6d4"
    },
    {
      icon: FaBell,
      title: "Instant Alert System",
      description: "Receive immediate notifications about ocean hazards in your area through multiple channels including SMS, email, and push notifications with severity-based prioritization.",
      tags: ["Push Notifications", "SMS Alerts", "Priority System"],
      accentColor: "#f59e0b",
      secondaryColor: "#d97706"
    },
    {
      icon: FaChartLine,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive analytics with trend analysis, pattern recognition, and predictive modeling to help authorities make informed decisions about coastal safety.",
      tags: ["Data Visualization", "Trend Analysis", "Predictive Models"],
      accentColor: "#ef4444",
      secondaryColor: "#dc2626"
    },
    {
      icon: FaMobile,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices with offline capabilities, GPS integration, and one-tap emergency reporting for users in remote coastal areas.",
      tags: ["Mobile Optimized", "Offline Mode", "GPS Integration"],
      accentColor: "#10b981",
      secondaryColor: "#059669"
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
    hidden: { y: 50, opacity: 0 },
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
    <FeaturesSection>
      <BackgroundPattern />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <SectionTitle variants={itemVariants}>
          Premium Features
        </SectionTitle>
        
        <SectionSubtitle variants={itemVariants}>
          Cutting-edge technology meets intuitive design for the ultimate ocean safety experience
        </SectionSubtitle>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 } 
              }}
              accentColor={feature.accentColor}
              secondaryColor={feature.secondaryColor}
            >
              <IconContainer 
                accentColor={feature.accentColor}
                secondaryColor={feature.secondaryColor}
              >
                <FeatureIcon>
                  <feature.icon />
                </FeatureIcon>
              </IconContainer>
              
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              
              <FeatureTags>
                {feature.tags.map((tag, tagIndex) => (
                  <Tag key={tagIndex}>{tag}</Tag>
                ))}
              </FeatureTags>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </motion.div>
    </FeaturesSection>
  );
};

export default PremiumFeatures;