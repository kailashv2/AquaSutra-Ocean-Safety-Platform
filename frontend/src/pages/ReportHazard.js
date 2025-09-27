import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { OfflineContext } from '../context/OfflineContext';
import '../styles/ReportHazard.css';

const ReportHazard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { isOnline, saveOfflineReport } = useContext(OfflineContext);
  
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [formData, setFormData] = useState({
    hazardType: '',
    note: '',
    media: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError(t('report.locationError'));
        }
      );
    } else {
      setError(t('report.geolocationNotSupported'));
    }
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, media: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const reportData = {
      ...formData,
      location,
      userId: currentUser.uid,
      timestamp: new Date().toISOString(),
      verificationStatus: 'unverified'
    };

    try {
      if (isOnline) {
        // Send to server
        const response = await fetch('http://localhost:5000/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await currentUser.getIdToken()}`
          },
          body: JSON.stringify(reportData)
        });

        if (!response.ok) {
          throw new Error(t('report.submitError'));
        }
      } else {
        // Save offline
        await saveOfflineReport(reportData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.message || t('report.submitError'));
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="report-hazard-container">
      <h1>{t('report.title')}</h1>
      
      {success && (
        <div className="success-message">
          {t('report.success')}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="hazardType">{t('report.hazardType')}</label>
          <select 
            id="hazardType" 
            name="hazardType" 
            value={formData.hazardType}
            onChange={handleChange}
            required
          >
            <option value="">{t('report.selectHazard')}</option>
            <option value="flood">🌊 {t('hazards.flood')}</option>
            <option value="tsunami">⚠️ {t('hazards.tsunami')}</option>
            <option value="highWaves">🌊 {t('hazards.highWaves')}</option>
            <option value="coastalDamage">🏚️ {t('hazards.coastalDamage')}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="media">{t('report.uploadMedia')}</label>
          <input 
            type="file" 
            id="media" 
            name="media"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">{t('report.note')}</label>
          <textarea 
            id="note" 
            name="note" 
            value={formData.note}
            onChange={handleChange}
            placeholder={t('report.notePlaceholder')}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group location-group">
          <h3>{t('report.location')}</h3>
          {location.lat && location.lng ? (
            <div className="location-display">
              <p>
                <strong>{t('report.latitude')}:</strong> {location.lat.toFixed(6)}
              </p>
              <p>
                <strong>{t('report.longitude')}:</strong> {location.lng.toFixed(6)}
              </p>
              <p className="location-note">{t('report.locationNote')}</p>
            </div>
          ) : (
            <p className="loading-location">{t('report.gettingLocation')}</p>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !location.lat || !formData.hazardType}
        >
          {loading ? t('common.loading') : t('report.submit')}
        </button>
      </form>
    </div>
  );
};

export default ReportHazard;