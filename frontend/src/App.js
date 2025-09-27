import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { analyticsService, reportsService } from './services/api';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { BiArrowBack } from 'react-icons/bi';
import PremiumHero from './components/PremiumHero';
import PremiumFeatures from './components/PremiumFeatures';
import PremiumStats from './components/PremiumStats';
import PremiumCTA from './components/PremiumCTA';
import PremiumDashboard from './components/PremiumDashboard';
import FloatingMapButton from './components/FloatingMapButton';

// Error message component
const ErrorMessage = styled.div`
  color: #ef4444;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

// Enhanced Background Animation Component with more effects
const BackgroundAnimation = () => {
  return (
    <div className="background-animation">
      <div className="water-drop"></div>
      <div className="water-drop"></div>
      <div className="water-drop"></div>
      <div className="water-drop"></div>
      <div className="water-drop"></div>
      <div className="water-drop"></div>
    </div>
  );
};

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
`;

const BackToHome = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  
  &:hover {
    color: #3b82f6;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const ModalSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  position: absolute;
  top: 1rem;
  right: 1rem;
  
  &:hover {
    color: #1e293b;
  }
`;

const Form = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  
  & > * {
    flex: 1;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #475569;
`;

const Link = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #9ca3af;
  font-size: 0.875rem;
  
  &:before, &:after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }
  
  &:before {
    margin-right: 1rem;
  }
  
  &:after {
    margin-left: 1rem;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  > button {
    flex: 1;
  }
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.75rem;
  width: 100%;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const SocialIcon = styled.span`
  margin-right: 0.5rem;
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 1.5rem;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-bottom: 1.25rem;
  
  & > a {
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(226, 232, 240, 0.1);
  position: relative;
  z-index: 10;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: #f8fafc;
  
  &:before {
    content: '';
    display: inline-block;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #1e40af, #0ea5e9);
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 0 0 15px rgba(30, 64, 175, 0.4);
  }
`;

const MenuItems = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.a`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
  
  &:after {
    content: '▾';
    margin-left: 5px;
    font-size: 0.8rem;
  }
  
  &:hover {
    color: #0ea5e9;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  color: #e2e8f0;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #0ea5e9;
  }
`;

const SignUpButton = styled.button`
  background: linear-gradient(135deg, #1e40af, #0ea5e9);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8, #0284c7);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
  }
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 1rem;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    z-index: -1;
    opacity: 0.1;
  }
  
  &:before {
    background: #a5b4fc;
    top: -100px;
    left: -100px;
  }
  
  &:after {
    background: #93c5fd;
    bottom: -50px;
    right: -50px;
  }
`;

const MainHeading = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SubHeading = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 2rem;
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 700px;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(motion.button)`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2563eb;
  }
  
  &:after {
    content: '→';
  }
`;

const SecondaryButton = styled(motion.button)`
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
  
  &:before {
    content: '↓';
  }
`;

const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
`;

const Shape = styled.div`
  position: absolute;
  border-radius: 50%;
  background: ${props => props.color || '#e0f2fe'};
  opacity: ${props => props.opacity || '0.1'};
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
`;

const Footer = styled(motion.footer)`
  padding: 1.5rem;
  text-align: center;
  background: white;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
`;

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [reportError, setReportError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    waveHeight: { value: '2.4m', change: '0.3m', positive: true },
    waterTemp: { value: '22°C', change: '1.5°C', positive: false },
    activeAlerts: { value: '3', change: '2', positive: false },
    safetyIndex: { value: '76%', change: '5%', positive: true }
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Hazard report form state
  const [hazardType, setHazardType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');

  const { login, signup, currentUser, logout, loginWithGoogle, loginWithFacebook } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  
  // Fetch dashboard data
  useEffect(() => {
    // Fetch dashboard data when user is logged in
    if (currentUser) {
      const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
          const data = await analyticsService.getDashboardData();
          setDashboardData(data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDashboardData();
      
      // Set up polling for real-time updates (every 30 seconds)
      const intervalId = setInterval(async () => {
        try {
          const data = await analyticsService.getDashboardData();
          setDashboardData(data);
        } catch (error) {
          console.error('Error updating dashboard data:', error);
        }
      }, 30000);
      
      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      setIsLoading(true);
      await login(email, password);
      setShowLoginModal(false);
      // Reset form
      setEmail('');
      setPassword('');
    } catch (error) {
      setLoginError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    setIsLoading(true);
    
    try {
      await signup(name, email, password);
      setShowSignupModal(false);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setSignupError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError('');
    setIsLoading(true);
    
    try {
      await reportsService.submitHazardReport({
        type: hazardType,
        location,
        description,
        severity,
        reportedBy: currentUser?.id || 'anonymous'
      });
      
      setShowReportModal(false);
      // Reset form
      setHazardType('');
      setLocation('');
      setDescription('');
      setSeverity('medium');
      
      // Show success notification
      alert('Hazard report submitted successfully!');
    } catch (error) {
      setReportError(error.message || 'Failed to submit hazard report');
    } finally {
      setIsLoading(false);
    }
  };

  // Show dashboard if requested
  if (showDashboard) {
    return <PremiumDashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <AppContainer>
      <BackgroundAnimation />
      <BackgroundShapes>
        <Shape size="200px" top="10%" left="5%" color="#bfdbfe" />
        <Shape size="150px" top="60%" right="10%" color="#93c5fd" opacity="0.15" />
        <Shape size="100px" bottom="20%" left="20%" color="#a5b4fc" opacity="0.1" />
        <Shape size="300px" top="40%" right="-100px" color="#dbeafe" opacity="0.08" />
      </BackgroundShapes>
      
      <NavBar>
        <Logo>AquaSutra</Logo>
        <MenuItems>
          <MenuItem href="#monitoring">Monitoring</MenuItem>
          <MenuItem href="#emergency">Emergency Response</MenuItem>
          <MenuItem href="#analytics">AI Analytics</MenuItem>
          <MenuItem href="#resources">Resources</MenuItem>
          <MenuItem href="#government">Government</MenuItem>
          <MenuItem href="#pricing">Pricing</MenuItem>
        </MenuItems>
        <AuthButtons>
          <LoginButton onClick={() => setShowLoginModal(true)}>Log in</LoginButton>
          <SignUpButton onClick={() => setShowSignupModal(true)}>Sign up free</SignUpButton>
        </AuthButtons>
      </NavBar>
      
      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <BackToHome onClick={() => setShowLoginModal(false)}>
                ← Back to home
              </BackToHome>
              <ModalHeader>
                <ModalTitle>Welcome back</ModalTitle>
                <ModalSubtitle>Sign in to your AquaSutra account</ModalSubtitle>
              </ModalHeader>
              <Form onSubmit={handleLogin}>
                {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
                <FormGroup>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </FormGroup>
                <CheckboxContainer>
                  <Checkbox 
                    type="checkbox" 
                    id="remember-me" 
                  />
                  <CheckboxLabel htmlFor="remember-me">Remember me</CheckboxLabel>
                </CheckboxContainer>
                <ForgotPassword>
                  <Link href="#">Forgot password?</Link>
                </ForgotPassword>
                <SubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </SubmitButton>
              </Form>
              <OrDivider>or continue with</OrDivider>
              <SocialButtonsContainer>
                <SocialButton onClick={() => {
                  setIsLoading(true);
                  loginWithGoogle()
                    .then(() => {
                      setShowLoginModal(false);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      setLoginError(err.message || 'Failed to login with Google');
                      setIsLoading(false);
                    });
                }}>
                  <FaGoogle style={{ marginRight: '8px' }} /> Google
                </SocialButton>
                <SocialButton onClick={() => {
                  setIsLoading(true);
                  loginWithFacebook()
                    .then(() => {
                      setShowLoginModal(false);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      setLoginError(err.message || 'Failed to login with Facebook');
                      setIsLoading(false);
                    });
                }}>
                  <FaFacebook style={{ marginRight: '8px' }} /> Facebook
                </SocialButton>
              </SocialButtonsContainer>
              <BottomText>
                Don't have an account? <Link href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}>Sign up for free</Link>
              </BottomText>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Signup Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSignupModal(false)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <BackToHome onClick={() => setShowSignupModal(false)}>
                ← Back to home
              </BackToHome>
              <ModalHeader>
                <ModalTitle>Create your account</ModalTitle>
                <ModalSubtitle>Join AquaSutra and start monitoring ocean safety today</ModalSubtitle>
              </ModalHeader>
              <Form onSubmit={handleSignup}>
                {signupError && <ErrorMessage>{signupError}</ErrorMessage>}
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="signup-firstname">First name</Label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="signup-lastname">Last name</Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                  </FormGroup>
                </FormRow>
                <FormGroup>
                  <Label htmlFor="signup-email">Email address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                </FormGroup>
                <CheckboxContainer>
                  <Checkbox 
                    type="checkbox" 
                    id="terms" 
                    required
                  />
                  <CheckboxLabel htmlFor="terms">
                    I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>
                  </CheckboxLabel>
                </CheckboxContainer>
                <CheckboxContainer>
                  <Checkbox 
                    type="checkbox" 
                    id="updates" 
                  />
                  <CheckboxLabel htmlFor="updates">
                    Send me updates about new features and emergency alerts
                  </CheckboxLabel>
                </CheckboxContainer>
                <SubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </SubmitButton>
              </Form>
              <OrDivider>or sign up with</OrDivider>
              <SocialButtonsContainer>
                <SocialButton onClick={() => {
                  setIsLoading(true);
                  loginWithGoogle()
                    .then(() => {
                      setShowSignupModal(false);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      setSignupError(err.message || 'Failed to signup with Google');
                      setIsLoading(false);
                    });
                }}>
                  <FaGoogle style={{ marginRight: '8px' }} /> Google
                </SocialButton>
                <SocialButton onClick={() => {
                  setIsLoading(true);
                  loginWithFacebook()
                    .then(() => {
                      setShowSignupModal(false);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      setSignupError(err.message || 'Failed to signup with Facebook');
                      setIsLoading(false);
                    });
                }}>
                  <FaFacebook style={{ marginRight: '8px' }} /> Facebook
                </SocialButton>
              </SocialButtonsContainer>
              <BottomText>
                Already have an account? <Link href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}>Sign in</Link>
              </BottomText>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Report Hazard Modal */}
      <AnimatePresence>
        {showReportModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReportModal(false)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <BackToHome onClick={() => setShowReportModal(false)}>
                ← Back to home
              </BackToHome>
              <ModalHeader>
                <ModalTitle>Report Ocean Hazard</ModalTitle>
                <ModalSubtitle>Help keep our oceans safe by reporting hazards</ModalSubtitle>
              </ModalHeader>
              <Form onSubmit={handleReportSubmit}>
                {reportError && <ErrorMessage>{reportError}</ErrorMessage>}
                <FormGroup>
                  <Label htmlFor="hazard-type">Hazard Type</Label>
                  <Input
                    as="select"
                    id="hazard-type"
                    value={hazardType}
                    onChange={(e) => setHazardType(e.target.value)}
                    required
                  >
                    <option value="">Select hazard type</option>
                    <option value="flood">🌊 Flood</option>
                    <option value="tsunami">⚠️ Tsunami Warning</option>
                    <option value="highWaves">🌊 High Waves</option>
                    <option value="coastalDamage">🏚️ Coastal Damage</option>
                    <option value="pollution">🛢️ Water Pollution</option>
                    <option value="other">🔍 Other</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location or coordinates"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="severity">Severity Level</Label>
                  <Input
                    as="select"
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    as="textarea"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed description of the hazard"
                    rows="4"
                    required
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                </FormGroup>
                <SubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Submitting Report...' : 'Submit Hazard Report'}
                </SubmitButton>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Premium Hero Section */}
      <PremiumHero 
        onReportClick={() => setShowReportModal(true)}
        onDashboardClick={() => setShowDashboard(true)}
      />
      
      {/* Premium Features Section */}
      <PremiumFeatures />
      
      {/* Premium Stats & Testimonials */}
      <PremiumStats />
      
      {/* Premium CTA Section */}
      <PremiumCTA 
        onGetStarted={() => setShowSignupModal(true)}
        onWatchDemo={() => window.open('https://youtube.com', '_blank')}
      />
      
      {/* Premium Footer */}
      <Footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🌊
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.2rem' }}>AquaSutra</div>
              <div style={{ opacity: '0.7', fontSize: '0.9rem' }}>Ocean Safety Platform</div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            flexWrap: 'wrap',
            fontSize: '0.9rem'
          }}>
            <a href="#privacy" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact</a>
            <a href="#api" style={{ color: '#cbd5e1', textDecoration: 'none' }}>API</a>
          </div>
          
          <div style={{ opacity: '0.8', fontSize: '0.9rem' }}>
            &copy; 2025 AquaSutra. All rights reserved.
          </div>
        </div>
      </Footer>
      
      {/* Floating Real-Time Map Button */}
      <FloatingMapButton />
    </AppContainer>
  );
}

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      // Simulate login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login attempt with:', { email, password });
      // Success - redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    setIsLoading(true);
    
    try {
      // Simulate signup - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Signup attempt with:', { name, email, password });
      // Success - redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setSignupError('Could not create account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;