import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaStar, FaQuoteLeft, FaWater, FaUsers, FaShieldAlt, FaGlobeAmericas } from 'react-icons/fa';

const StatsSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, 
    rgba(0, 102, 255, 0.05) 0%, 
    rgba(139, 92, 246, 0.05) 50%,
    rgba(20, 184, 166, 0.05) 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 6rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${props => props.color || '#00d4ff'}, 
      ${props => props.color2 || '#8b5cf6'});
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.color || '#00d4ff'};
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 15px ${props => props.color || '#00d4ff'}50);
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, 
    ${props => props.color || '#00d4ff'} 0%, 
    ${props => props.color2 || '#8b5cf6'} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #cbd5e1;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const TestimonialCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, 
      rgba(0, 212, 255, 0.3) 0%, 
      transparent 50%, 
      rgba(139, 92, 246, 0.3) 100%);
    border-radius: 20px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const QuoteIcon = styled.div`
  font-size: 2rem;
  color: #00d4ff;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #e2e8f0;
  margin-bottom: 2rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.2rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.2rem;
`;

const AuthorTitle = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.2rem;
  margin-top: 0.5rem;
  
  svg {
    color: #fbbf24;
    filter: drop-shadow(0 0 5px #fbbf24);
  }
`;

const PremiumStats = () => {
  const stats = [
    {
      icon: FaWater,
      number: "24/7",
      label: "Ocean Monitoring",
      color: "#00d4ff",
      color2: "#0066ff"
    },
    {
      icon: FaUsers,
      number: "10K+",
      label: "Active Users",
      color: "#8b5cf6",
      color2: "#6366f1"
    },
    {
      icon: FaShieldAlt,
      number: "99.9%",
      label: "Uptime Guarantee",
      color: "#10b981",
      color2: "#059669"
    },
    {
      icon: FaGlobeAmericas,
      number: "50+",
      label: "Countries Covered",
      color: "#f59e0b",
      color2: "#d97706"
    }
  ];

  const testimonials = [
    {
      text: "AquaSutra has revolutionized how we monitor coastal safety. The AI-powered alerts have helped us prevent multiple potential disasters and the community reporting feature is invaluable.",
      author: "Dr. Sarah Chen",
      title: "Marine Safety Director",
      rating: 5,
      avatar: "SC"
    },
    {
      text: "As a coastal emergency coordinator, I rely on AquaSutra daily. The real-time data and predictive analytics have significantly improved our response times and decision-making process.",
      author: "Captain Mike Rodriguez",
      title: "Emergency Response Coordinator",
      rating: 5,
      avatar: "MR"
    },
    {
      text: "The mobile app is incredibly intuitive and the offline capabilities have been a game-changer for our remote beach monitoring stations. Highly recommended for any coastal safety operation.",
      author: "Emma Thompson",
      title: "Beach Safety Manager",
      rating: 5,
      avatar: "ET"
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
    hidden: { y: 30, opacity: 0 },
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
    <StatsSection>
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <SectionTitle variants={itemVariants}>
            Trusted by Professionals
          </SectionTitle>
          
          <SectionSubtitle variants={itemVariants}>
            Join thousands of ocean safety professionals who trust AquaSutra
          </SectionSubtitle>

          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                color={stat.color}
                color2={stat.color2}
              >
                <StatIcon color={stat.color}>
                  <stat.icon />
                </StatIcon>
                <StatNumber color={stat.color} color2={stat.color2}>
                  {stat.number}
                </StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>

          <SectionTitle variants={itemVariants} style={{ marginTop: '4rem' }}>
            What Our Users Say
          </SectionTitle>

          <TestimonialsGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <QuoteIcon>
                  <FaQuoteLeft />
                </QuoteIcon>
                <TestimonialText>
                  "{testimonial.text}"
                </TestimonialText>
                <TestimonialAuthor>
                  <AuthorAvatar>
                    {testimonial.avatar}
                  </AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>{testimonial.author}</AuthorName>
                    <AuthorTitle>{testimonial.title}</AuthorTitle>
                    <StarRating>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </StarRating>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        </motion.div>
      </Container>
    </StatsSection>
  );
};

export default PremiumStats;