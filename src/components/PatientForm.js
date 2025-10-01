import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Activity, Heart, Utensils } from 'lucide-react';
import apiService from '../services/api';
import './PatientForm.css';

const PatientForm = ({ patient = null, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    age: '',
    gender: '',
    
    // Contact Information
    contactInfo: {
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      }
    },

    // Ayurvedic Constitution
    prakriti: {
      vata: 0,
      pitta: 0,
      kapha: 0
    },
    vikriti: {
      vata: 0,
      pitta: 0,
      kapha: 0
    },

    // Health Information
    roga: [],

    // Physical Measurements
    physicalMeasurements: {
      weight: {
        value: '',
        unit: 'kg'
      },
      height: {
        feet: '',
        inches: ''
      }
    },

    // Dietary Information
    dietaryHabits: {
      type: 'Vegetarian',
      appetite: 'Moderate',
      foodPreferences: {
        temperature: 'Warm',
        taste: [],
        spiceLevel: 'Medium'
      },
      mealFrequency: {
        mainMeals: 3,
        snacks: 1
      },
      targetCalories: '',
      allergies: [],
      dislikes: []
    },

    // Lifestyle
    lifestyle: {
      activityLevel: 'Moderately Active',
      sleepPattern: {
        averageHours: 7,
        quality: 'Good'
      },
      stressLevel: 'Moderate',
      occupation: '',
      smokingStatus: 'Never',
      alcoholConsumption: 'None'
    },

    // Environment
    environment: {
      climate: 'Tropical',
      season: 'Summer'
    },

    // Temporary field for createdBy (in production, this would come from auth)
    createdBy: '507f1f77bcf86cd799439011'
  });

  const [currentRoga, setCurrentRoga] = useState('');
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [currentDislike, setCurrentDislike] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load patient data if editing
  useEffect(() => {
    if (isEditing && patient) {
      setFormData(patient);
    }
  }, [isEditing, patient]);

  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });

    // Clear error for this field
    if (errors[path]) {
      setErrors(prev => ({ ...prev, [path]: null }));
    }
  };

  const handleArrayAdd = (arrayPath, value, currentValue, setCurrentValue) => {
    if (value.trim()) {
      const current = getNestedValue(formData, arrayPath) || [];
      
      // Special handling for roga array - convert string to object
      if (arrayPath === 'roga') {
        const rogaObject = {
          condition: value.trim(),
          severity: 'Moderate', // default severity
          duration: '',
          notes: ''
        };
        handleInputChange(arrayPath, [...current, rogaObject]);
      } else {
        handleInputChange(arrayPath, [...current, value.trim()]);
      }
      
      setCurrentValue('');
    }
  };

  const handleArrayRemove = (arrayPath, index) => {
    const current = getNestedValue(formData, arrayPath) || [];
    handleInputChange(arrayPath, current.filter((_, i) => i !== index));
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 0 || formData.age > 150) newErrors.age = 'Valid age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    // Physical measurements
    if (!formData.physicalMeasurements.weight.value) newErrors['physicalMeasurements.weight.value'] = 'Weight is required';
    if (!formData.physicalMeasurements.height.feet) newErrors['physicalMeasurements.height.feet'] = 'Height is required';
    
    // Dietary habits
    if (!formData.dietaryHabits.targetCalories) newErrors['dietaryHabits.targetCalories'] = 'Target calories is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Clean up form data before sending
      const cleanedData = {
        ...formData,
        // Ensure all required fields are present and properly formatted
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        prakriti: {
          vata: parseFloat(formData.prakriti.vata) || 0,
          pitta: parseFloat(formData.prakriti.pitta) || 0,
          kapha: parseFloat(formData.prakriti.kapha) || 0
        },
        vikriti: {
          vata: parseFloat(formData.vikriti.vata) || 0,
          pitta: parseFloat(formData.vikriti.pitta) || 0,
          kapha: parseFloat(formData.vikriti.kapha) || 0
        },
        physicalMeasurements: {
          weight: {
            value: parseFloat(formData.physicalMeasurements.weight.value),
            unit: formData.physicalMeasurements.weight.unit || 'kg'
          },
          height: {
            feet: parseInt(formData.physicalMeasurements.height.feet) || 0,
            inches: parseInt(formData.physicalMeasurements.height.inches) || 0
          }
        },
        dietaryHabits: {
          ...formData.dietaryHabits,
          targetCalories: parseInt(formData.dietaryHabits.targetCalories)
        }
      };
      
      console.log('Submitting cleaned form data:', JSON.stringify(cleanedData, null, 2));
      console.log('Form validation passed, sending to API...');
      
      let result;
      if (isEditing) {
        result = await apiService.updatePatient(patient._id, cleanedData);
      } else {
        result = await apiService.createPatient(cleanedData);
      }
      
      if (result.success) {
        onSave(result.data);
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      console.error('Full error details:', error);
      
      // Display detailed validation errors if available
      let errorMessage = error.message;
      if (error.message.includes('Validation error')) {
        errorMessage = 'Please check the form data. Some fields may have validation errors.';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-form-container">
      <div className="patient-form">
        <div className="form-header">
          <h2>
            <User className="icon" />
            {isEditing ? 'Edit Patient' : 'Add New Patient'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {/* Basic Information */}
          <section className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
                  min="0"
                  max="150"
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="form-section">
            <h3><Phone className="icon" /> Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Ayurvedic Constitution */}
          <section className="form-section">
            <h3><Heart className="icon" /> Ayurvedic Constitution</h3>
            
            <div className="dosha-section">
              <h4>Prakriti (Natural Constitution)</h4>
              <div className="dosha-inputs">
                <div className="form-group">
                  <label>Vata</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.prakriti.vata}
                    onChange={(e) => handleInputChange('prakriti.vata', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Pitta</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.prakriti.pitta}
                    onChange={(e) => handleInputChange('prakriti.pitta', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Kapha</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.prakriti.kapha}
                    onChange={(e) => handleInputChange('prakriti.kapha', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="dosha-section">
              <h4>Vikriti (Current State)</h4>
              <div className="dosha-inputs">
                <div className="form-group">
                  <label>Vata</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.vikriti.vata}
                    onChange={(e) => handleInputChange('vikriti.vata', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Pitta</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.vikriti.pitta}
                    onChange={(e) => handleInputChange('vikriti.pitta', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Kapha</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.vikriti.kapha}
                    onChange={(e) => handleInputChange('vikriti.kapha', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Health Conditions */}
          <section className="form-section">
            <h4>Health Conditions (Roga)</h4>
            <div className="array-input">
              <input
                type="text"
                value={currentRoga}
                onChange={(e) => setCurrentRoga(e.target.value)}
                placeholder="Enter health condition"
              />
              <button
                type="button"
                onClick={() => handleArrayAdd('roga', currentRoga, currentRoga, setCurrentRoga)}
                className="add-btn"
              >
                Add
              </button>
            </div>
            <div className="tags">
              {(formData.roga || []).map((condition, index) => (
                <span key={index} className="tag">
                  {typeof condition === 'string' ? condition : condition.condition}
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('roga', index)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Physical Measurements */}
          <section className="form-section">
            <h3><Activity className="icon" /> Physical Measurements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Weight * (kg)</label>
                <input
                  type="number"
                  value={formData.physicalMeasurements.weight.value}
                  onChange={(e) => handleInputChange('physicalMeasurements.weight.value', parseFloat(e.target.value) || '')}
                  className={errors['physicalMeasurements.weight.value'] ? 'error' : ''}
                />
                {errors['physicalMeasurements.weight.value'] && (
                  <span className="error-text">{errors['physicalMeasurements.weight.value']}</span>
                )}
              </div>
              <div className="form-group">
                <label>Height * (feet)</label>
                <input
                  type="number"
                  value={formData.physicalMeasurements.height.feet}
                  onChange={(e) => handleInputChange('physicalMeasurements.height.feet', parseInt(e.target.value) || '')}
                  className={errors['physicalMeasurements.height.feet'] ? 'error' : ''}
                />
                {errors['physicalMeasurements.height.feet'] && (
                  <span className="error-text">{errors['physicalMeasurements.height.feet']}</span>
                )}
              </div>
              <div className="form-group">
                <label>Height (inches)</label>
                <input
                  type="number"
                  value={formData.physicalMeasurements.height.inches}
                  onChange={(e) => handleInputChange('physicalMeasurements.height.inches', parseInt(e.target.value) || '')}
                  min="0"
                  max="11"
                />
              </div>
            </div>
          </section>

          {/* Dietary Habits */}
          <section className="form-section">
            <h3><Utensils className="icon" /> Dietary Habits</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Diet Type</label>
                <select
                  value={formData.dietaryHabits.type}
                  onChange={(e) => handleInputChange('dietaryHabits.type', e.target.value)}
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
              </div>
              <div className="form-group">
                <label>Appetite</label>
                <select
                  value={formData.dietaryHabits.appetite}
                  onChange={(e) => handleInputChange('dietaryHabits.appetite', e.target.value)}
                >
                  <option value="Poor">Poor</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Good">Good</option>
                  <option value="Excessive">Excessive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Target Calories * (kcal/day)</label>
                <input
                  type="number"
                  value={formData.dietaryHabits.targetCalories}
                  onChange={(e) => handleInputChange('dietaryHabits.targetCalories', parseInt(e.target.value) || '')}
                  min="800"
                  max="5000"
                  className={errors['dietaryHabits.targetCalories'] ? 'error' : ''}
                />
                {errors['dietaryHabits.targetCalories'] && (
                  <span className="error-text">{errors['dietaryHabits.targetCalories']}</span>
                )}
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="form-actions">
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : (isEditing ? 'Update Patient' : 'Create Patient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
