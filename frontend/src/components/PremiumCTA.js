import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaRocket, FaArrowRight, FaDownload, FaPlay } from 'react-icons/fa';

const CTASection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.98) 0%, 
    rgba(30, 41, 59, 0.95) 50%,
    rgba(15, 23, 42, 0.98) 100%);
  position: relative;
  overflow: hidden;
`;

const CTAContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
  animation: backgroundPulse 8s ease-in-out infinite;
  z-index: 1;
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const FloatingCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.1) 0%, 
    rgba(139, 92, 246, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 212, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  margin-bottom: 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CTATitle = styled(motion.h2)`
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: #f8fafc;
  line-height: 1.2;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const CTASubtitle = styled(motion.p)`
  font-size: 1.4rem;
  color: #e2e8f0;
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(motion.button)`
  background: linear-gradient(135deg, #0066ff, #00d4ff);
  color: white;
  border: none;
  padding: 18px 36px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 10px 30px rgba(0, 102, 255, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 18px 36px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #00d4ff;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const FeatureHighlights = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureHighlight = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.2rem;
  color: #00d4ff;
`;

const FeatureText = styled.div`
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.95rem;
`;

const PremiumCTA = ({ onGetStarted, onWatchDemo }) => {
  const features = [
    { icon: '🚀', text: 'Instant Setup' },
    { icon: '🔒', text: 'Enterprise Security' },
    { icon: '🌊', text: 'Real-time Monitoring' },
    { icon: '📱', text: 'Mobile Ready' }
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

  const floatingElements = [
    { size: 100, x: '10%', y: '20%', delay: 0 },
    { size: 150, x: '85%', y: '30%', delay: 2 },
    { size: 80, x: '15%', y: '75%', delay: 4 },
    { size: 120, x: '80%', y: '80%', delay: 6 }
  ];

  return (
    <CTASection>
      <BackgroundGradient />
      
      <FloatingElements>
        {floatingElements.map((element, index) => (
          <FloatingCircle
            key={index}
            style={{
              width: element.size,
              height: element.size,
              left: element.x,
              top: element.y
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: element.delay
            }}
          />
        ))}
      </FloatingElements>

      <CTAContainer>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <Badge variants={itemVariants}>
            <FaRocket />
            Limited Time Offer
          </Badge>

          <CTATitle variants={itemVariants}>
            Ready to Transform
            <br />
            Ocean Safety?
          </CTATitle>

          <CTASubtitle variants={itemVariants}>
            Join the future of coastal protection with AquaSutra's AI-powered platform. 
            Get started today and experience the difference that intelligent monitoring makes.
          </CTASubtitle>

          <ButtonGroup variants={itemVariants}>
            <PrimaryButton
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <FaArrowRight />
            </PrimaryButton>

            <SecondaryButton
              onClick={onWatchDemo}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay />
              Watch Demo
            </SecondaryButton>
          </ButtonGroup>

          <FeatureHighlights variants={itemVariants}>
            {features.map((feature, index) => (
              <FeatureHighlight
                key={index}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureText>{feature.text}</FeatureText>
              </FeatureHighlight>
            ))}
          </FeatureHighlights>
        </motion.div>
      </CTAContainer>
    </CTASection>
  );
};

export default PremiumCTA;