import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import '../styles/AnalyticsPanel.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPanel = ({ data }) => {
  const { t } = useTranslation();

  if (!data) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  // Prepare data for hazard type chart
  const hazardChartData = {
    labels: [
      t('hazards.flood'),
      t('hazards.tsunami'),
      t('hazards.highWaves'),
      t('hazards.coastalDamage')
    ],
    datasets: [
      {
        label: t('analytics.reportCount'),
        data: [
          data.hazardCounts.flood,
          data.hazardCounts.tsunami,
          data.hazardCounts.highWaves,
          data.hazardCounts.coastalDamage
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare data for sentiment analysis chart
  const sentimentChartData = {
    labels: [
      t('socialFeed.positive'),
      t('socialFeed.neutral'),
      t('socialFeed.negative')
    ],
    datasets: [
      {
        data: [
          data.sentimentAnalysis.positive,
          data.sentimentAnalysis.neutral,
          data.sentimentAnalysis.negative
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="analytics-panel">
      <div className="chart-container">
        <h3>{t('analytics.hazardDistribution')}</h3>
        <Bar 
          data={hazardChartData} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      </div>

      <div className="chart-container">
        <h3>{t('analytics.sentimentAnalysis')}</h3>
        <Pie 
          data={sentimentChartData}
          options={{
            responsive: true
          }}
        />
      </div>

      <div className="trending-keywords">
        <h3>{t('analytics.trendingKeywords')}</h3>
        <ul className="keyword-list">
          {data.trendingKeywords.map((item, index) => (
            <li key={index} className="keyword-item">
              <span className="keyword">#{item.keyword}</span>
              <span className="count">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="hotspots">
        <h3>{t('analytics.hotspots')}</h3>
        <ul className="hotspot-list">
          {data.hotspots.map((item, index) => (
            <li key={index} className="hotspot-item">
              <span className="location">{item.location}</span>
              <span className="count">{item.count} {t('analytics.reports')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsPanel;