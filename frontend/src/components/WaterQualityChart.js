import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Premium styled components
const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00d4ff, #8b5cf6);
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 20px 40px 0 rgba(31, 38, 135, 0.5),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  background: linear-gradient(135deg, #ffffff 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ChartLegend = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 500;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background: ${props => props.color};
  box-shadow: 0 0 10px ${props => props.color}50;
`;

const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 12px;
  padding-top: 1.5rem;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const Bar = styled(motion.div)`
  width: 100%;
  background: linear-gradient(135deg, ${props => props.color}, ${props => props.color}CC);
  height: ${props => props.height};
  border-radius: 8px 8px 0 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 4px 15px ${props => props.color}30;
  
  &:hover {
    opacity: 0.8;
    transform: scaleY(1.05);
    box-shadow: 0 8px 25px ${props => props.color}50;
  }
  
  &:hover::after {
    content: '${props => props.value}';
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    color: white;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const BarLabel = styled.div`
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: center;
  font-weight: 500;
`;

const WaterQualityChart = () => {
  // Sample data for water quality metrics
  const data = [
    { month: 'Jan', ph: 7.2, oxygen: 8.5, clarity: 92 },
    { month: 'Feb', ph: 7.1, oxygen: 8.3, clarity: 90 },
    { month: 'Mar', ph: 7.3, oxygen: 8.7, clarity: 94 },
    { month: 'Apr', ph: 7.4, oxygen: 8.9, clarity: 95 },
    { month: 'May', ph: 7.2, oxygen: 8.6, clarity: 93 },
    { month: 'Jun', ph: 7.0, oxygen: 8.2, clarity: 89 },
  ];
  
  // Calculate max values for scaling
  const maxOxygen = Math.max(...data.map(d => d.oxygen)) * 1.2;
  const maxClarity = 100;
  
  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <ChartHeader>
        <ChartTitle>🌊 Water Quality Metrics</ChartTitle>
        <ChartLegend>
          <LegendItem>
            <LegendColor color="#1e40af" />
            pH Level
          </LegendItem>
          <LegendItem>
            <LegendColor color="#10b981" />
            Oxygen (mg/L)
          </LegendItem>
          <LegendItem>
            <LegendColor color="#7c3aed" />
            Clarity (%)
          </LegendItem>
        </ChartLegend>
      </ChartHeader>
      
      <BarChartContainer>
        {data.map((item, index) => (
          <BarGroup key={index}>
            <div style={{ display: 'flex', height: '100%', width: '100%', gap: '3px' }}>
              <Bar 
                color="#1e40af" 
                height={`${(item.ph / 14) * 100}%`}
                value={`pH ${item.ph}`}
                initial={{ height: 0 }}
                animate={{ height: `${(item.ph / 14) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
              <Bar 
                color="#10b981" 
                height={`${(item.oxygen / maxOxygen) * 100}%`}
                value={`${item.oxygen} mg/L`}
                initial={{ height: 0 }}
                animate={{ height: `${(item.oxygen / maxOxygen) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
              />
              <Bar 
                color="#7c3aed" 
                height={`${item.clarity}%`}
                value={`${item.clarity}%`}
                initial={{ height: 0 }}
                animate={{ height: `${item.clarity}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
              />
            </div>
            <BarLabel>{item.month}</BarLabel>
          </BarGroup>
        ))}
      </BarChartContainer>
    </ChartContainer>
  );
};

export default WaterQualityChart;