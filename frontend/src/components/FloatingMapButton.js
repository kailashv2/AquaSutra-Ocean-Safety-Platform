import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaMap, FaTimes } from 'react-icons/fa';
import RealTimeHazardMap from './HazardMap';

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af, #0ea5e9);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    box-shadow: 0 12px 35px rgba(30, 64, 175, 0.6);
  }
`;

const MapOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const MapContainer = styled(motion.div)`
  width: 95%;
  height: 85%;
  max-width: 1400px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.1);
  }
`;

const FloatingMapButton = () => {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <FloatingButton
        onClick={() => setShowMap(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 8px 25px rgba(30, 64, 175, 0.4)',
            '0 12px 35px rgba(30, 64, 175, 0.6)',
            '0 8px 25px rgba(30, 64, 175, 0.4)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        title="View Real-Time Hazard Map"
      >
        <FaMap />
      </FloatingButton>

      <AnimatePresence>
        {showMap && (
          <MapOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMap(false)}
          >
            <MapContainer
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setShowMap(false)}>
                <FaTimes />
              </CloseButton>
              
              <RealTimeHazardMap 
                height="100%"
                autoRefresh={true}
                refreshInterval={5000} // 5 seconds for demo
                showControls={true}
                showLegend={true}
                center={[15.9129, 79.7400]} // India center
                zoom={6}
              />
            </MapContainer>
          </MapOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMapButton;