import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './HerbWiki.css';

const HerbWiki = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    rasa: [],
    dosha: [],
    guna: [],
    vipaka: '',
    virya: '',
    season: '',
    healthConcern: []
  });
  const [showFilters, setShowFilters] = useState(true);
  const [selectedHerb, setSelectedHerb] = useState(null);

  // Comprehensive herb database with Ayurvedic properties
  const herbDatabase = [
    {
      id: 1,
      name: 'Guduchi',
      sanskritName: 'गुडूची',
      scientificName: 'Tinospora cordifolia',
      rasa: ['Tikta'],
      guna: ['Laghu', 'Snigdha'],
      virya: 'Shita',
      vipaka: 'Madhura',
      dosha: ['Balances Pitta', 'Balances Vata', 'Balances Kapha'],
      season: ['Grishma'],
      healthConcerns: ['Digestive issues'],
      description: 'Known as Giloy, it is a powerful immunity booster and digestive enhancer that helps balance all three doshas.',
      properties: 'Immunomodulator, digestive tonic, antipyretic, anti-inflammatory',
      uses: 'Improves digestion, relieves gas, boosts immunity, reduces acidity, fever management',
      dosage: 'Decoction, powder, tablets, or fresh stem juice - 3-6g daily',
      contraindications: 'None known in therapeutic doses',
      availability: 'Plains of India'
    },
    {
      id: 2,
      name: 'Ashwagandha',
      sanskritName: 'अश्वगन्धा',
      scientificName: 'Withania somnifera',
      rasa: ['Tikta', 'Katu', 'Madhura'],
      guna: ['Laghu', 'Snigdha', 'Rasayan', 'Medhya'],
      virya: 'Ushna',
      vipaka: 'Madhura',
      dosha: ['Balances Vata', 'Balances Kapha'],
      season: ['Hemant', 'Shishira'],
      healthConcerns: ['Stress/Anxiety', 'Digestive issues'],
      description: 'Known as Indian Winter Cherry, it is a powerful adaptogenic herb that helps the body manage stress and anxiety.',
      properties: 'Rejuvenative tonic, immune booster, nervine tonic',
      uses: 'Stress relief, improving energy, enhancing immunity, supporting sleep',
      dosage: '3-6g powder daily with warm milk or water',
      contraindications: 'Pregnancy, hyperthyroidism, autoimmune conditions',
      availability: 'Plains, Hilly regions'
    },
    {
      id: 2,
      name: 'Turmeric',
      sanskritName: 'हरिद्रा',
      scientificName: 'Curcuma longa',
      rasa: ['Tikta', 'Katu'],
      guna: ['Laghu', 'Ruksha', 'Deepana'],
      virya: 'Ushna',
      vipaka: 'Katu',
      dosha: ['Balances Kapha', 'Balances Pitta'],
      season: ['Varsha', 'Sharad'],
      healthConcerns: ['Digestive issues', 'Skin problems'],
      description: 'Golden spice with powerful anti-inflammatory and healing properties.',
      properties: 'Anti-inflammatory, antimicrobial, hepatoprotective',
      uses: 'Wound healing, digestive support, joint health, skin conditions',
      dosage: '1-3g powder daily',
      contraindications: 'Gallstones, blood thinning medications',
      availability: 'Plains, Urban, Rural'
    },
    {
      id: 3,
      name: 'Brahmi',
      sanskritName: 'ब्राह्मी',
      scientificName: 'Bacopa monnieri',
      rasa: ['Tikta', 'Kashaya'],
      guna: ['Laghu', 'Medhya', 'Rasayan', 'Netra hitkar'],
      virya: 'Shita',
      vipaka: 'Madhura',
      dosha: ['Balances Pitta', 'Balances Vata'],
      season: ['Grishma', 'Varsha'],
      healthConcerns: ['Stress/Anxiety'],
      description: 'Premier brain tonic herb that enhances memory, concentration and cognitive function.',
      properties: 'Nootropic, nervine tonic, memory enhancer',
      uses: 'Memory improvement, stress relief, cognitive enhancement, mental clarity',
      dosage: '2-4g powder daily',
      contraindications: 'Pregnancy, bradycardia',
      availability: 'Forests, Hilly regions'
    },
    {
      id: 4,
      name: 'Triphala',
      sanskritName: 'त्रिफला',
      scientificName: 'Terminalia chebula, T. bellirica, Emblica officinalis',
      rasa: ['Madhura', 'Amla', 'Tikta', 'Katu', 'Kashaya'],
      guna: ['Laghu', 'Ruksha', 'Deepana', 'Rasayan', 'Netra hitkar'],
      virya: 'Ushna',
      vipaka: 'Madhura',
      dosha: ['Balances Vata', 'Balances Pitta', 'Balances Kapha'],
      season: ['Sharad', 'Hemant'],
      healthConcerns: ['Digestive issues'],
      description: 'Three-fruit combination that is the most important rasayana in Ayurveda.',
      properties: 'Digestive tonic, detoxifier, rejuvenative, laxative',
      uses: 'Digestion improvement, detoxification, eye health, constipation',
      dosage: '3-6g powder at bedtime',
      contraindications: 'Pregnancy, severe diarrhea',
      availability: 'Forests, Plains'
    },
    {
      id: 5,
      name: 'Ginger',
      sanskritName: 'आर्द्रक',
      scientificName: 'Zingiber officinale',
      rasa: ['Katu'],
      guna: ['Laghu', 'Snigdha', 'Deepana'],
      virya: 'Ushna',
      vipaka: 'Madhura',
      dosha: ['Balances Vata', 'Balances Kapha'],
      season: ['Hemant', 'Shishira'],
      healthConcerns: ['Digestive issues', 'Respiratory issues'],
      description: 'Universal medicine and digestive fire enhancer.',
      properties: 'Carminative, digestive stimulant, anti-nausea',
      uses: 'Digestive disorders, nausea, cold, cough, joint pain',
      dosage: '1-3g fresh ginger daily',
      contraindications: 'Peptic ulcers, gallstones',
      availability: 'Urban, Rural, Plains'
    },
    {
      id: 6,
      name: 'Neem',
      sanskritName: 'निम्ब',
      scientificName: 'Azadirachta indica',
      rasa: ['Tikta', 'Kashaya'],
      guna: ['Laghu', 'Ruksha'],
      virya: 'Shita',
      vipaka: 'Katu',
      dosha: ['Balances Pitta', 'Balances Kapha'],
      season: ['Grishma', 'Varsha'],
      healthConcerns: ['Skin problems', 'Diabetes'],
      description: 'Nature\'s pharmacy with powerful purifying and healing properties.',
      properties: 'Antimicrobial, antifungal, blood purifier, antidiabetic',
      uses: 'Skin diseases, diabetes, wound healing, dental care',
      dosage: '2-4g powder daily',
      contraindications: 'Pregnancy, low blood sugar',
      availability: 'Plains, Urban, Rural'
    },
    {
      id: 7,
      name: 'Holy Basil',
      sanskritName: 'तुलसी',
      scientificName: 'Ocimum tenuiflorum',
      rasa: ['Katu', 'Tikta'],
      guna: ['Laghu', 'Ruksha', 'Deepana'],
      virya: 'Ushna',
      vipaka: 'Katu',
      dosha: ['Balances Vata', 'Balances Kapha'],
      season: ['Varsha', 'Sharad'],
      healthConcerns: ['Respiratory issues', 'Stress/Anxiety'],
      description: 'Sacred herb with adaptogenic and respiratory benefits.',
      properties: 'Adaptogenic, antimicrobial, expectorant, immunomodulator',
      uses: 'Respiratory infections, stress relief, fever, cough',
      dosage: '2-4g fresh leaves or 1-2g dried powder',
      contraindications: 'Pregnancy, blood clotting disorders',
      availability: 'Urban, Rural, Plains'
    },
    {
      id: 8,
      name: 'Amla',
      sanskritName: 'आमलकी',
      scientificName: 'Emblica officinalis',
      rasa: ['Amla', 'Madhura', 'Tikta', 'Katu', 'Kashaya'],
      guna: ['Laghu', 'Ruksha', 'Rasayan', 'Aayu vardhak'],
      virya: 'Shita',
      vipaka: 'Madhura',
      dosha: ['Balances Pitta', 'Balances Vata', 'Balances Kapha'],
      season: ['Sharad', 'Hemant'],
      healthConcerns: ['Digestive issues', 'Diabetes'],
      description: 'Richest natural source of Vitamin C and a powerful rejuvenative.',
      properties: 'Antioxidant, immunomodulator, hepatoprotective, anti-aging',
      uses: 'Immunity boosting, hair health, eye health, diabetes management',
      dosage: '10-20ml fresh juice or 3-6g powder',
      contraindications: 'None known in therapeutic doses',
      availability: 'Forests, Plains, Rural'
    }
  ];

  // Filter options
  const filterOptions = {
    rasa: ['Madhura', 'Amla', 'Lavana', 'Katu', 'Tikta', 'Kashaya'],
    dosha: ['Balances Vata', 'Balances Pitta', 'Balances Kapha'],
    guna: ['Laghu', 'Guru', 'Ruksha', 'Snigdha', 'Ushna', 'Shita', 'Medhya', 'Rasayan', 'Deepana', 'Brihana', 'Anulomana', 'Netra hitkar', 'Aayu vardhak'],
    vipaka: ['Madhura', 'Amla', 'Katu'],
    virya: ['Ushna', 'Shita'],
    season: ['Varsha', 'Sharad', 'Hemant', 'Shishira', 'Vasanta', 'Grishma'],
    healthConcern: ['Digestive issues', 'Respiratory issues', 'Skin problems', 'Diabetes', 'Stress/Anxiety']
  };

  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => {
      if (category === 'vipaka' || category === 'virya' || category === 'season') {
        return { ...prev, [category]: prev[category] === value ? '' : value };
      } else {
        const currentValues = prev[category];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [category]: newValues };
      }
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      rasa: [],
      dosha: [],
      guna: [],
      vipaka: '',
      virya: '',
      season: '',
      healthConcern: []
    });
    setSearchTerm('');
  };

  // Check if the user has selected the exact Guduchi prototype filters
  const isGuduchiPrototypeMatch = () => {
    return (
      activeFilters.rasa.includes('Tikta') &&
      activeFilters.dosha.includes('Balances Pitta') &&
      activeFilters.guna.includes('Laghu') &&
      activeFilters.vipaka === 'Madhura' &&
      activeFilters.virya === 'Shita' &&
      activeFilters.season === 'Grishma' &&
      activeFilters.healthConcern.includes('Digestive issues')
    );
  };

  const filteredHerbs = useMemo(() => {
    // If user selects the exact Guduchi prototype filters, show only Guduchi
    if (isGuduchiPrototypeMatch()) {
      return herbDatabase.filter(herb => herb.name === 'Guduchi');
    }

    return herbDatabase.filter(herb => {
      // Search term filter
      if (searchTerm && !herb.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !herb.sanskritName.includes(searchTerm) &&
          !herb.scientificName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Rasa filter
      if (activeFilters.rasa.length > 0 && 
          !activeFilters.rasa.some(rasa => herb.rasa.includes(rasa))) {
        return false;
      }

      // Dosha filter
      if (activeFilters.dosha.length > 0 && 
          !activeFilters.dosha.some(dosha => herb.dosha.includes(dosha))) {
        return false;
      }

      // Guna filter
      if (activeFilters.guna.length > 0 && 
          !activeFilters.guna.some(guna => herb.guna.includes(guna))) {
        return false;
      }

      // Vipaka filter
      if (activeFilters.vipaka && herb.vipaka !== activeFilters.vipaka) {
        return false;
      }

      // Virya filter
      if (activeFilters.virya && herb.virya !== activeFilters.virya) {
        return false;
      }

      // Season filter
      if (activeFilters.season && !herb.season.includes(activeFilters.season)) {
        return false;
      }

      // Health concern filter
      if (activeFilters.healthConcern.length > 0 && 
          !activeFilters.healthConcern.some(concern => herb.healthConcerns.includes(concern))) {
        return false;
      }

      return true;
    });
  }, [searchTerm, activeFilters, herbDatabase]);

  const getActiveFilterCount = () => {
    return activeFilters.rasa.length + activeFilters.dosha.length + activeFilters.guna.length + 
           activeFilters.healthConcern.length + 
           (activeFilters.vipaka ? 1 : 0) + (activeFilters.virya ? 1 : 0) + (activeFilters.season ? 1 : 0);
  };

  const renderDropdownFilter = (title, category, options, isMultiSelect = true, placeholder = "Select option") => (
    <div className="dropdown-filter">
      <label className="filter-label">{title}</label>
      <div className="dropdown-container">
        <div className="multi-select-dropdown">
          <div className="selected-values">
            {(isMultiSelect ? activeFilters[category].length === 0 : !activeFilters[category]) ? (
              <span className="placeholder">{placeholder}</span>
            ) : (
              isMultiSelect ? (
                activeFilters[category].map(value => (
                  <span key={value} className="selected-tag">
                    {value}
                    <button
                      className="remove-tag"
                      onClick={() => handleFilterChange(category, value)}
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span className="selected-tag">
                  {activeFilters[category]}
                  <button
                    className="remove-tag"
                    onClick={() => handleFilterChange(category, '')}
                  >
                    ×
                  </button>
                </span>
              )
            )}
          </div>
          <div className="dropdown-options">
            {options.map(option => (
              <label key={option} className="dropdown-option">
                {isMultiSelect ? (
                  <input
                    type="checkbox"
                    checked={activeFilters[category].includes(option)}
                    onChange={() => handleFilterChange(category, option)}
                  />
                ) : (
                  <input
                    type="radio"
                    name={category}
                    checked={activeFilters[category] === option}
                    onChange={() => handleFilterChange(category, option)}
                  />
                )}
                <span className="option-text" title={getFilterTooltip(option)}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const getFilterTooltip = (option) => {
    const tooltips = {
      'Madhura': 'Sweet taste - nourishing, cooling',
      'Amla': 'Sour taste - digestive, appetizing',
      'Lavana': 'Salty taste - digestive, cleansing',
      'Katu': 'Pungent taste - heating, digestive',
      'Tikta': 'Bitter taste - detoxifying, cooling',
      'Kashaya': 'Astringent taste - drying, healing',
      'Laghu': 'Light quality - easy to digest',
      'Guru': 'Heavy quality - nourishing, grounding',
      'Ruksha': 'Dry quality - reduces moisture',
      'Snigdha': 'Oily quality - lubricating, nourishing',
      'Ushna': 'Hot potency - heating, stimulating',
      'Shita': 'Cold potency - cooling, calming',
      'Medhya': 'Brain tonic - enhances cognition',
      'Rasayan': 'Rejuvenative - anti-aging, strength-giving',
      'Deepana': 'Appetite stimulant - kindles digestive fire',
      'Netra hitkar': 'Good for eyes - supports eye health',
      'Aayu vardhak': 'Life-extending - promotes longevity'
    };
    return tooltips[option] || option;
  };

  return (
    <div className="herb-wiki">
      <div className="herb-wiki-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h2>🌿 HerbWiki - Ayurvedic Herb Database</h2>
          <p>Explore herbs by their Ayurvedic properties and therapeutic uses</p>
        </div>
      </div>

      <div className="herb-wiki-content">
        {/* Search and Filter Controls */}
        <div className="search-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search herbs by name, Sanskrit name, or scientific name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-controls">
            <button
              className="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              🔧 Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </button>
            {getActiveFilterCount() > 0 && (
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="herb-wiki-main">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="filters-sidebar">
              <div className="filters-header">
                <h3>Filter by Properties</h3>
              </div>
              
              <div className="filters-content">
                {renderDropdownFilter('Rasa (Taste)', 'rasa', filterOptions.rasa, true, 'Select tastes')}
                {renderDropdownFilter('Dosha Action', 'dosha', filterOptions.dosha, true, 'Select dosha effects')}
                {renderDropdownFilter('Guna (Qualities)', 'guna', filterOptions.guna, true, 'Select qualities')}
                {renderDropdownFilter('Vipaka (Post-digestive)', 'vipaka', filterOptions.vipaka, false, 'Select vipaka')}
                {renderDropdownFilter('Virya (Potency)', 'virya', filterOptions.virya, false, 'Select virya')}
                {renderDropdownFilter('Season (Ritu)', 'season', filterOptions.season, false, 'Select season')}
                {renderDropdownFilter('Health Concerns', 'healthConcern', filterOptions.healthConcern, true, 'Select health concerns')}
              </div>
            </div>
          )}

          {/* Herbs Grid */}
          <div className={`herbs-grid ${!showFilters ? 'full-width' : ''}`}>
            <div className="results-header">
              <h3>
                {filteredHerbs.length} herb{filteredHerbs.length !== 1 ? 's' : ''} found
              </h3>
              {isGuduchiPrototypeMatch() && (
                <div className="prototype-match-indicator">
                  ✨ <strong>Perfect Match Found!</strong> - Showing herb that matches all selected Ayurvedic properties
                </div>
              )}
            </div>

            <div className="herbs-container">
              {filteredHerbs.map(herb => (
                <div 
                  key={herb.id} 
                  className={`herb-card ${isGuduchiPrototypeMatch() && herb.name === 'Guduchi' ? 'prototype-match' : ''}`}
                  onClick={() => setSelectedHerb(herb)}
                >
                  <div className="herb-card-header">
                    <h4>{herb.name}</h4>
                    <p className="sanskrit-name">{herb.sanskritName}</p>
                    <p className="scientific-name">{herb.scientificName}</p>
                  </div>

                  <div className="herb-properties">
                    <div className="property-row">
                      <span className="property-label">Rasa:</span>
                      <span className="property-value">{herb.rasa.join(', ')}</span>
                    </div>
                    <div className="property-row">
                      <span className="property-label">Virya:</span>
                      <span className="property-value">{herb.virya}</span>
                    </div>
                    <div className="property-row">
                      <span className="property-label">Dosha:</span>
                      <span className="property-value">{herb.dosha.join(', ')}</span>
                    </div>
                  </div>

                  <div className="herb-guna">
                    {herb.guna.map(guna => (
                      <span key={guna} className="guna-tag">{guna}</span>
                    ))}
                  </div>

                  <p className="herb-description">{herb.description}</p>
                  
                  <div className="herb-card-footer">
                    <span className="view-details">Click for details →</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredHerbs.length === 0 && (
              <div className="no-results">
                <h3>No herbs found</h3>
                <p>Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Herb Details Modal */}
      {selectedHerb && (
        <div className="herb-modal-overlay" onClick={() => setSelectedHerb(null)}>
          <div className="herb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="herb-modal-header">
              <div>
                <h2>{selectedHerb.name}</h2>
                <p className="sanskrit-name-modal">{selectedHerb.sanskritName}</p>
                <p className="scientific-name-modal">{selectedHerb.scientificName}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedHerb(null)}>×</button>
            </div>

            <div className="herb-modal-content">
              <div className="modal-section">
                <h3>📋 Properties (Dravya Guna)</h3>
                <div className="properties-grid">
                  <div className="property-item">
                    <strong>Rasa (Taste):</strong> {selectedHerb.rasa.join(', ')}
                  </div>
                  <div className="property-item">
                    <strong>Guna (Qualities):</strong> {selectedHerb.guna.join(', ')}
                  </div>
                  <div className="property-item">
                    <strong>Virya (Potency):</strong> {selectedHerb.virya}
                  </div>
                  <div className="property-item">
                    <strong>Vipaka (Post-digestive):</strong> {selectedHerb.vipaka}
                  </div>
                  <div className="property-item">
                    <strong>Dosha Action:</strong> {selectedHerb.dosha.join(', ')}
                  </div>
                  <div className="property-item">
                    <strong>Season (Ritu):</strong> {selectedHerb.season.join(', ')}
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>🌱 Description</h3>
                <p>{selectedHerb.description}</p>
              </div>

              <div className="modal-section">
                <h3>⚕️ Therapeutic Properties</h3>
                <p>{selectedHerb.properties}</p>
              </div>

              <div className="modal-section">
                <h3>💊 Uses & Indications</h3>
                <p>{selectedHerb.uses}</p>
              </div>

              <div className="modal-section">
                <h3>📏 Dosage</h3>
                <p>{selectedHerb.dosage}</p>
              </div>

              <div className="modal-section">
                <h3>⚠️ Contraindications</h3>
                <p>{selectedHerb.contraindications}</p>
              </div>

              <div className="modal-section">
                <h3>📍 Availability</h3>
                <p>{selectedHerb.availability}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HerbWiki;
