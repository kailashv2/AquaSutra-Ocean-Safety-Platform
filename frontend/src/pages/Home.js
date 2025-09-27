import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { t } = useTranslation();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
        
        <div className="action-buttons">
          {currentUser ? (
            <Link to="/report" className="btn btn-primary btn-large">
              <i className="fas fa-exclamation-triangle"></i> {t('home.reportHazard')}
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                {t('auth.login')}
              </Link>
              <Link to="/register" className="btn btn-primary">
                {t('auth.register')}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="hazard-types">
        <h2>{t('home.hazardTypes')}</h2>
        <div className="hazard-grid">
          <div className="hazard-card">
            <div className="hazard-icon">🌊</div>
            <h3>{t('hazards.flood')}</h3>
          </div>
          <div className="hazard-card">
            <div className="hazard-icon">⚠️</div>
            <h3>{t('hazards.tsunami')}</h3>
          </div>
          <div className="hazard-card">
            <div className="hazard-icon">🌊</div>
            <h3>{t('hazards.highWaves')}</h3>
          </div>
          <div className="hazard-card">
            <div className="hazard-icon">🏚️</div>
            <h3>{t('hazards.coastalDamage')}</h3>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>{t('home.aboutTitle')}</h2>
        <p>{t('home.aboutDescription')}</p>
      </div>
    </div>
  );
};

export default Home;