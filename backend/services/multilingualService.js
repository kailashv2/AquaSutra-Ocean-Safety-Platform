const db = require('../config/db');

class MultilingualService {
  constructor() {
    this.supportedLanguages = {
      'en': {
        name: 'English',
        nativeName: 'English',
        rtl: false,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      },
      'es': {
        name: 'Spanish',
        nativeName: 'Español',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      },
      'fr': {
        name: 'French',
        nativeName: 'Français',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      },
      'pt': {
        name: 'Portuguese',
        nativeName: 'Português',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      },
      'it': {
        name: 'Italian',
        nativeName: 'Italiano',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      },
      'de': {
        name: 'German',
        nativeName: 'Deutsch',
        rtl: false,
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h'
      },
      'ja': {
        name: 'Japanese',
        nativeName: '日本語',
        rtl: false,
        dateFormat: 'YYYY/MM/DD',
        timeFormat: '24h'
      },
      'ko': {
        name: 'Korean',
        nativeName: '한국어',
        rtl: false,
        dateFormat: 'YYYY.MM.DD',
        timeFormat: '24h'
      },
      'zh': {
        name: 'Chinese',
        nativeName: '中文',
        rtl: false,
        dateFormat: 'YYYY/MM/DD',
        timeFormat: '24h'
      },
      'ar': {
        name: 'Arabic',
        nativeName: 'العربية',
        rtl: true,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h'
      },
      'hi': {
        name: 'Hindi',
        nativeName: 'हिन्दी',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h'
      },
      'ru': {
        name: 'Russian',
        nativeName: 'Русский',
        rtl: false,
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h'
      }
    };

    this.translations = new Map();
    this.hazardKeywords = new Map();
    this.loadTranslations();
  }

  // Load translations from database or initialize default ones
  async loadTranslations() {
    try {
      await this.initializeTranslations();
      console.log('Multilingual service initialized');
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  // Initialize default translations
  async initializeTranslations() {
    // Create translations table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS translations (
        id SERIAL PRIMARY KEY,
        key VARCHAR(200) NOT NULL,
        language VARCHAR(10) NOT NULL,
        value TEXT NOT NULL,
        context VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(key, language)
      )
    `);

    // Create hazard keywords table
    await db.query(`
      CREATE TABLE IF NOT EXISTS hazard_keywords (
        id SERIAL PRIMARY KEY,
        language VARCHAR(10) NOT NULL,
        keyword VARCHAR(100) NOT NULL,
        hazard_type VARCHAR(50) NOT NULL,
        weight FLOAT DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(language, keyword, hazard_type)
      )
    `);

    // Load existing translations
    const translationsResult = await db.query('SELECT key, language, value FROM translations');
    for (const row of translationsResult.rows) {
      if (!this.translations.has(row.language)) {
        this.translations.set(row.language, new Map());
      }
      this.translations.get(row.language).set(row.key, row.value);
    }

    // Load hazard keywords
    const keywordsResult = await db.query('SELECT language, keyword, hazard_type, weight FROM hazard_keywords');
    for (const row of keywordsResult.rows) {
      if (!this.hazardKeywords.has(row.language)) {
        this.hazardKeywords.set(row.language, new Map());
      }
      if (!this.hazardKeywords.get(row.language).has(row.hazard_type)) {
        this.hazardKeywords.get(row.language).set(row.hazard_type, []);
      }
      this.hazardKeywords.get(row.language).get(row.hazard_type).push({
        keyword: row.keyword,
        weight: row.weight
      });
    }

    // Initialize default translations if empty
    if (this.translations.size === 0) {
      await this.initializeDefaultTranslations();
    }

    // Initialize default hazard keywords if empty
    if (this.hazardKeywords.size === 0) {
      await this.initializeDefaultHazardKeywords();
    }
  }

  // Initialize default translations
  async initializeDefaultTranslations() {
    const defaultTranslations = {
      // Common UI elements
      'common.loading': {
        en: 'Loading...',
        es: 'Cargando...',
        fr: 'Chargement...',
        pt: 'Carregando...',
        it: 'Caricamento...',
        de: 'Laden...',
        ja: '読み込み中...',
        ko: '로딩 중...',
        zh: '加载中...',
        ar: 'جاري التحميل...',
        hi: 'लोड हो रहा है...',
        ru: 'Загрузка...'
      },
      'common.save': {
        en: 'Save',
        es: 'Guardar',
        fr: 'Enregistrer',
        pt: 'Salvar',
        it: 'Salva',
        de: 'Speichern',
        ja: '保存',
        ko: '저장',
        zh: '保存',
        ar: 'حفظ',
        hi: 'सेव करें',
        ru: 'Сохранить'
      },
      'common.cancel': {
        en: 'Cancel',
        es: 'Cancelar',
        fr: 'Annuler',
        pt: 'Cancelar',
        it: 'Annulla',
        de: 'Abbrechen',
        ja: 'キャンセル',
        ko: '취소',
        zh: '取消',
        ar: 'إلغاء',
        hi: 'रद्द करें',
        ru: 'Отмена'
      },
      // Hazard types
      'hazard.tsunami': {
        en: 'Tsunami',
        es: 'Tsunami',
        fr: 'Tsunami',
        pt: 'Tsunami',
        it: 'Tsunami',
        de: 'Tsunami',
        ja: '津波',
        ko: '쓰나미',
        zh: '海啸',
        ar: 'تسونامي',
        hi: 'सुनामी',
        ru: 'Цунами'
      },
      'hazard.hurricane': {
        en: 'Hurricane',
        es: 'Huracán',
        fr: 'Ouragan',
        pt: 'Furacão',
        it: 'Uragano',
        de: 'Hurrikan',
        ja: 'ハリケーン',
        ko: '허리케인',
        zh: '飓风',
        ar: 'إعصار',
        hi: 'तूफान',
        ru: 'Ураган'
      },
      'hazard.flood': {
        en: 'Flood',
        es: 'Inundación',
        fr: 'Inondation',
        pt: 'Inundação',
        it: 'Alluvione',
        de: 'Hochwasser',
        ja: '洪水',
        ko: '홍수',
        zh: '洪水',
        ar: 'فيضان',
        hi: 'बाढ़',
        ru: 'Наводнение'
      },
      'hazard.storm': {
        en: 'Storm',
        es: 'Tormenta',
        fr: 'Tempête',
        pt: 'Tempestade',
        it: 'Tempesta',
        de: 'Sturm',
        ja: '嵐',
        ko: '폭풍',
        zh: '风暴',
        ar: 'عاصفة',
        hi: 'तूफान',
        ru: 'Шторм'
      },
      'hazard.earthquake': {
        en: 'Earthquake',
        es: 'Terremoto',
        fr: 'Tremblement de terre',
        pt: 'Terremoto',
        it: 'Terremoto',
        de: 'Erdbeben',
        ja: '地震',
        ko: '지진',
        zh: '地震',
        ar: 'زلزال',
        hi: 'भूकंप',
        ru: 'Землетрясение'
      },
      // Report status
      'status.verified': {
        en: 'Verified',
        es: 'Verificado',
        fr: 'Vérifié',
        pt: 'Verificado',
        it: 'Verificato',
        de: 'Verifiziert',
        ja: '確認済み',
        ko: '확인됨',
        zh: '已验证',
        ar: 'مُتحقق',
        hi: 'सत्यापित',
        ru: 'Проверено'
      },
      'status.unverified': {
        en: 'Unverified',
        es: 'No verificado',
        fr: 'Non vérifié',
        pt: 'Não verificado',
        it: 'Non verificato',
        de: 'Nicht verifiziert',
        ja: '未確認',
        ko: '미확인',
        zh: '未验证',
        ar: 'غير مُتحقق',
        hi: 'असत्यापित',
        ru: 'Не проверено'
      },
      // Severity levels
      'severity.low': {
        en: 'Low',
        es: 'Bajo',
        fr: 'Faible',
        pt: 'Baixo',
        it: 'Basso',
        de: 'Niedrig',
        ja: '低',
        ko: '낮음',
        zh: '低',
        ar: 'منخفض',
        hi: 'कम',
        ru: 'Низкий'
      },
      'severity.medium': {
        en: 'Medium',
        es: 'Medio',
        fr: 'Moyen',
        pt: 'Médio',
        it: 'Medio',
        de: 'Mittel',
        ja: '中',
        ko: '보통',
        zh: '中',
        ar: 'متوسط',
        hi: 'मध्यम',
        ru: 'Средний'
      },
      'severity.high': {
        en: 'High',
        es: 'Alto',
        fr: 'Élevé',
        pt: 'Alto',
        it: 'Alto',
        de: 'Hoch',
        ja: '高',
        ko: '높음',
        zh: '高',
        ar: 'عالي',
        hi: 'उच्च',
        ru: 'Высокий'
      },
      'severity.critical': {
        en: 'Critical',
        es: 'Crítico',
        fr: 'Critique',
        pt: 'Crítico',
        it: 'Critico',
        de: 'Kritisch',
        ja: '緊急',
        ko: '위험',
        zh: '紧急',
        ar: 'حرج',
        hi: 'गंभीर',
        ru: 'Критический'
      },
      // Notifications
      'notification.new_report': {
        en: 'New hazard report in your area',
        es: 'Nuevo reporte de peligro en tu área',
        fr: 'Nouveau rapport de danger dans votre région',
        pt: 'Novo relatório de perigo na sua área',
        it: 'Nuovo rapporto di pericolo nella tua zona',
        de: 'Neuer Gefahrenbericht in Ihrer Nähe',
        ja: 'あなたの地域で新しい危険レポート',
        ko: '귀하의 지역에 새로운 위험 보고서',
        zh: '您所在地区的新危险报告',
        ar: 'تقرير خطر جديد في منطقتك',
        hi: 'आपके क्षेत्र में नई खतरा रिपोर्ट',
        ru: 'Новый отчет об опасности в вашем районе'
      },
      'notification.emergency_alert': {
        en: 'Emergency Alert',
        es: 'Alerta de Emergencia',
        fr: 'Alerte d\'Urgence',
        pt: 'Alerta de Emergência',
        it: 'Allerta di Emergenza',
        de: 'Notfallalarm',
        ja: '緊急警報',
        ko: '긴급 경보',
        zh: '紧急警报',
        ar: 'تنبيه طوارئ',
        hi: 'आपातकालीन चेतावनी',
        ru: 'Экстренное предупреждение'
      }
    };

    // Insert translations into database
    for (const [key, translations] of Object.entries(defaultTranslations)) {
      for (const [lang, value] of Object.entries(translations)) {
        await db.query(`
          INSERT INTO translations (key, language, value)
          VALUES ($1, $2, $3)
          ON CONFLICT (key, language) DO NOTHING
        `, [key, lang, value]);

        // Store in memory
        if (!this.translations.has(lang)) {
          this.translations.set(lang, new Map());
        }
        this.translations.get(lang).set(key, value);
      }
    }

    console.log('Default translations initialized');
  }

  // Initialize default hazard keywords
  async initializeDefaultHazardKeywords() {
    const defaultKeywords = {
      en: {
        tsunami: ['tsunami', 'tidal wave', 'seismic wave', 'ocean wave'],
        hurricane: ['hurricane', 'cyclone', 'typhoon', 'tropical storm'],
        flood: ['flood', 'flooding', 'overflow', 'inundation', 'deluge'],
        storm: ['storm', 'thunderstorm', 'severe weather', 'tempest'],
        earthquake: ['earthquake', 'quake', 'seismic', 'tremor', 'shake']
      },
      es: {
        tsunami: ['tsunami', 'maremoto', 'ola sísmica'],
        hurricane: ['huracán', 'ciclón', 'tifón', 'tormenta tropical'],
        flood: ['inundación', 'desbordamiento', 'crecida', 'diluvio'],
        storm: ['tormenta', 'tempestad', 'temporal', 'borrasca'],
        earthquake: ['terremoto', 'temblor', 'sismo', 'sacudida']
      },
      fr: {
        tsunami: ['tsunami', 'raz-de-marée', 'vague sismique'],
        hurricane: ['ouragan', 'cyclone', 'typhon', 'tempête tropicale'],
        flood: ['inondation', 'crue', 'débordement', 'déluge'],
        storm: ['tempête', 'orage', 'bourrasque', 'tourmente'],
        earthquake: ['tremblement de terre', 'séisme', 'secousse']
      },
      pt: {
        tsunami: ['tsunami', 'maremoto', 'onda sísmica'],
        hurricane: ['furacão', 'ciclone', 'tufão', 'tempestade tropical'],
        flood: ['inundação', 'enchente', 'alagamento', 'dilúvio'],
        storm: ['tempestade', 'temporal', 'tormenta', 'borrasca'],
        earthquake: ['terremoto', 'tremor', 'abalo sísmico', 'sismo']
      }
    };

    // Insert keywords into database
    for (const [lang, hazardTypes] of Object.entries(defaultKeywords)) {
      for (const [hazardType, keywords] of Object.entries(hazardTypes)) {
        for (const keyword of keywords) {
          await db.query(`
            INSERT INTO hazard_keywords (language, keyword, hazard_type, weight)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (language, keyword, hazard_type) DO NOTHING
          `, [lang, keyword, hazardType, 1.0]);
        }

        // Store in memory
        if (!this.hazardKeywords.has(lang)) {
          this.hazardKeywords.set(lang, new Map());
        }
        if (!this.hazardKeywords.get(lang).has(hazardType)) {
          this.hazardKeywords.get(lang).set(hazardType, []);
        }
        this.hazardKeywords.get(lang).set(hazardType, 
          keywords.map(keyword => ({ keyword, weight: 1.0 }))
        );
      }
    }

    console.log('Default hazard keywords initialized');
  }

  // Get translation for a key in specified language
  translate(key, language = 'en', fallback = null) {
    if (!this.translations.has(language)) {
      language = 'en'; // Fallback to English
    }

    const langTranslations = this.translations.get(language);
    if (langTranslations && langTranslations.has(key)) {
      return langTranslations.get(key);
    }

    // Try English as fallback
    if (language !== 'en' && this.translations.has('en')) {
      const enTranslations = this.translations.get('en');
      if (enTranslations && enTranslations.has(key)) {
        return enTranslations.get(key);
      }
    }

    return fallback || key;
  }

  // Get multiple translations
  translateMultiple(keys, language = 'en') {
    const result = {};
    for (const key of keys) {
      result[key] = this.translate(key, language);
    }
    return result;
  }

  // Detect language from text
  detectLanguage(text) {
    // Simple language detection based on character patterns
    // In a real implementation, you'd use a proper language detection library
    
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh'; // Chinese
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja'; // Japanese
    if (/[\uac00-\ud7af]/.test(text)) return 'ko'; // Korean
    if (/[\u0600-\u06ff]/.test(text)) return 'ar'; // Arabic
    if (/[\u0900-\u097f]/.test(text)) return 'hi'; // Hindi
    if (/[\u0400-\u04ff]/.test(text)) return 'ru'; // Russian
    
    // Check for common words in different languages
    const lowerText = text.toLowerCase();
    
    if (/\b(el|la|los|las|de|en|con|por|para|que|es|son|está|están)\b/.test(lowerText)) return 'es';
    if (/\b(le|la|les|de|du|des|en|dans|avec|pour|que|est|sont)\b/.test(lowerText)) return 'fr';
    if (/\b(o|a|os|as|de|em|com|para|que|é|são|está|estão)\b/.test(lowerText)) return 'pt';
    if (/\b(il|la|i|le|di|in|con|per|che|è|sono|sta|stanno)\b/.test(lowerText)) return 'it';
    if (/\b(der|die|das|den|dem|des|in|mit|für|dass|ist|sind)\b/.test(lowerText)) return 'de';
    
    return 'en'; // Default to English
  }

  // Get hazard keywords for language
  getHazardKeywords(language = 'en', hazardType = null) {
    if (!this.hazardKeywords.has(language)) {
      language = 'en'; // Fallback to English
    }

    const langKeywords = this.hazardKeywords.get(language);
    if (!langKeywords) return [];

    if (hazardType) {
      return langKeywords.get(hazardType) || [];
    }

    // Return all keywords for the language
    const allKeywords = [];
    for (const [type, keywords] of langKeywords.entries()) {
      allKeywords.push(...keywords.map(k => ({ ...k, hazardType: type })));
    }
    return allKeywords;
  }

  // Classify hazard type from text
  classifyHazardType(text, language = null) {
    if (!language) {
      language = this.detectLanguage(text);
    }

    const keywords = this.getHazardKeywords(language);
    const lowerText = text.toLowerCase();
    
    const scores = {};
    
    for (const { keyword, hazardType, weight } of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!scores[hazardType]) scores[hazardType] = 0;
        scores[hazardType] += weight;
      }
    }

    // Return the hazard type with highest score
    let maxScore = 0;
    let bestMatch = null;
    
    for (const [hazardType, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestMatch = hazardType;
      }
    }

    return {
      hazardType: bestMatch,
      confidence: maxScore,
      language: language,
      allScores: scores
    };
  }

  // Add new translation
  async addTranslation(key, language, value, context = null) {
    try {
      await db.query(`
        INSERT INTO translations (key, language, value, context)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (key, language) DO UPDATE SET
          value = EXCLUDED.value,
          context = EXCLUDED.context,
          updated_at = NOW()
      `, [key, language, value, context]);

      // Update memory cache
      if (!this.translations.has(language)) {
        this.translations.set(language, new Map());
      }
      this.translations.get(language).set(key, value);

      return true;
    } catch (error) {
      console.error('Error adding translation:', error);
      return false;
    }
  }

  // Add hazard keyword
  async addHazardKeyword(language, keyword, hazardType, weight = 1.0) {
    try {
      await db.query(`
        INSERT INTO hazard_keywords (language, keyword, hazard_type, weight)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (language, keyword, hazard_type) DO UPDATE SET
          weight = EXCLUDED.weight
      `, [language, keyword, hazardType, weight]);

      // Update memory cache
      if (!this.hazardKeywords.has(language)) {
        this.hazardKeywords.set(language, new Map());
      }
      if (!this.hazardKeywords.get(language).has(hazardType)) {
        this.hazardKeywords.get(language).set(hazardType, []);
      }
      
      const keywords = this.hazardKeywords.get(language).get(hazardType);
      const existingIndex = keywords.findIndex(k => k.keyword === keyword);
      
      if (existingIndex >= 0) {
        keywords[existingIndex].weight = weight;
      } else {
        keywords.push({ keyword, weight });
      }

      return true;
    } catch (error) {
      console.error('Error adding hazard keyword:', error);
      return false;
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Format date according to language preferences
  formatDate(date, language = 'en') {
    const langConfig = this.supportedLanguages[language] || this.supportedLanguages.en;
    const dateObj = new Date(date);
    
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    if (langConfig.timeFormat === '12h') {
      options.hour = 'numeric';
      options.minute = '2-digit';
      options.hour12 = true;
    } else {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    }

    return dateObj.toLocaleString(language, options);
  }

  // Get localized report data
  async getLocalizedReport(reportId, language = 'en') {
    try {
      const result = await db.query(`
        SELECT 
          r.id, r.hazard_type, r.note, r.severity, r.verification_status,
          r.created_at, ST_X(r.location::geometry) as lng, ST_Y(r.location::geometry) as lat,
          u.name as reporter_name
        FROM reports r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = $1
      `, [reportId]);

      if (result.rows.length === 0) {
        return null;
      }

      const report = result.rows[0];
      
      return {
        id: report.id,
        hazardType: this.translate(`hazard.${report.hazard_type}`, language, report.hazard_type),
        note: report.note,
        severity: this.translate(`severity.${report.severity}`, language, report.severity),
        verificationStatus: this.translate(`status.${report.verification_status}`, language, report.verification_status),
        location: {
          lat: parseFloat(report.lat),
          lng: parseFloat(report.lng)
        },
        createdAt: this.formatDate(report.created_at, language),
        reporterName: report.reporter_name
      };

    } catch (error) {
      console.error('Error getting localized report:', error);
      return null;
    }
  }

  // Get translation statistics
  async getTranslationStats() {
    try {
      const result = await db.query(`
        SELECT 
          language,
          COUNT(*) as translation_count
        FROM translations
        GROUP BY language
        ORDER BY translation_count DESC
      `);

      const keywordResult = await db.query(`
        SELECT 
          language,
          COUNT(*) as keyword_count
        FROM hazard_keywords
        GROUP BY language
        ORDER BY keyword_count DESC
      `);

      return {
        translations: result.rows,
        keywords: keywordResult.rows,
        supportedLanguages: Object.keys(this.supportedLanguages).length
      };

    } catch (error) {
      console.error('Error getting translation stats:', error);
      return { translations: [], keywords: [], supportedLanguages: 0 };
    }
  }
}

module.exports = new MultilingualService();
