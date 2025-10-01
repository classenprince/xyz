import React, { useState, useEffect } from 'react';
import './PatientDetailsViewer.css';

const PatientDetailsViewer = ({ onClose }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data);
      } else {
        setError('Failed to load patients');
      }
    } catch (err) {
      setError('Error loading patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setEditedPatient({ ...patient });
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPatient({ ...selectedPatient });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/patients/${editedPatient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Partial-Update': 'true'
        },
        body: JSON.stringify(editedPatient),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedPatient(editedPatient);
        setIsEditing(false);
        // Update the patient in the list
        setPatients(patients.map(p => p._id === editedPatient._id ? editedPatient : p));
        alert('Patient details updated successfully!');
      } else {
        setError('Failed to update patient: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      setError('Error updating patient: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value, parentField = null) => {
    if (parentField) {
      setEditedPatient(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [field]: value
        }
      }));
    } else {
      setEditedPatient(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.age?.toString().includes(searchTerm)
  );

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'Not specified';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'None';
      }
      return JSON.stringify(value);
    }
    return value.toString();
  };

  const renderEditableField = (label, value, field, parentField = null, type = 'text') => {
    if (isEditing) {
      if (type === 'textarea') {
        return (
          <div className="field-group">
            <label>{label}:</label>
            <textarea
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value, parentField)}
              rows={3}
            />
          </div>
        );
      }
      return (
        <div className="field-group">
          <label>{label}:</label>
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleInputChange(field, e.target.value, parentField)}
          />
        </div>
      );
    }
    return (
      <div className="field-display">
        <span className="field-label">{label}:</span>
        <span className="field-value">{formatValue(value)}</span>
      </div>
    );
  };

  const renderArrayField = (label, array, field) => {
    if (isEditing) {
      return (
        <div className="field-group array-field">
          <label>{label}:</label>
          <div className="array-items">
            {(array || []).map((item, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleArrayChange(field, index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(field, index)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(field)}
              className="add-btn"
            >
              + Add {label.slice(0, -1)}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="field-display">
        <span className="field-label">{label}:</span>
        <span className="field-value">{formatValue(array)}</span>
      </div>
    );
  };

  return (
    <div className="patient-details-viewer">
      <div className="viewer-main">
        <div className="viewer-header">
          <h3>Patient Details Manager</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="viewer-content">
        {/* Patient List */}
        <div className="patient-list-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading">Loading patients...</div>
          ) : (
            <div className="patient-list">
              {filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className={`patient-item ${selectedPatient?._id === patient._id ? 'selected' : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="patient-avatar">
                    {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name || 'Unknown'}</h4>
                    <p>{patient.age}y, {patient.gender}</p>
                    <p className="patient-id">ID: {patient._id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patient Details */}
        <div className="patient-details-section">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {selectedPatient ? (
            <div className="patient-details">
              <div className="details-header">
                <h4>{selectedPatient.name || 'Patient'} Details</h4>
                <div className="action-buttons">
                  {!isEditing ? (
                    <button onClick={handleEdit} className="edit-btn">
                      Edit Patient
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="save-btn"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="details-form">
                {/* Basic Information */}
                <div className="section">
                  <h5>Basic Information</h5>
                  {renderEditableField('Name', editedPatient?.name, 'name')}
                  {renderEditableField('Age', editedPatient?.age, 'age', null, 'number')}
                  {renderEditableField('Gender', editedPatient?.gender, 'gender')}
                </div>

                {/* Contact Information */}
                <div className="section">
                  <h5>Contact Information</h5>
                  {renderEditableField('Phone', editedPatient?.contactInfo?.phone, 'phone', 'contactInfo')}
                  {renderEditableField('Email', editedPatient?.contactInfo?.email, 'email', 'contactInfo', 'email')}
                  {renderEditableField('Address', editedPatient?.contactInfo?.address, 'address', 'contactInfo', 'textarea')}
                </div>

                {/* Physical Measurements */}
                <div className="section">
                  <h5>Physical Measurements</h5>
                  {renderEditableField('Weight (kg)', editedPatient?.physicalMeasurements?.weight?.value, 'value', 'physicalMeasurements.weight', 'number')}
                  {renderEditableField('Height (cm)', editedPatient?.physicalMeasurements?.height?.value, 'value', 'physicalMeasurements.height', 'number')}
                  {renderEditableField('BMI', editedPatient?.bmi, 'bmi', null, 'number')}
                </div>

                {/* Dietary Information */}
                <div className="section">
                  <h5>Dietary Information</h5>
                  {renderEditableField('Diet Type', editedPatient?.dietaryHabits?.type, 'type', 'dietaryHabits')}
                  {renderEditableField('Appetite', editedPatient?.dietaryHabits?.appetite, 'appetite', 'dietaryHabits')}
                  {renderEditableField('Target Calories', editedPatient?.dietaryHabits?.targetCalories, 'targetCalories', 'dietaryHabits', 'number')}
                  {renderArrayField('Food Allergies', editedPatient?.allergies, 'allergies')}
                  {renderArrayField('Food Dislikes', editedPatient?.dislikes, 'dislikes')}
                </div>

                {/* Health Conditions */}
                <div className="section">
                  <h5>Health Conditions (Roga)</h5>
                  {renderArrayField('Health Issues', editedPatient?.roga, 'roga')}
                </div>

                {/* Constitution */}
                <div className="section">
                  <h5>Ayurvedic Constitution</h5>
                  {renderEditableField('Vata Score', editedPatient?.prakriti?.vata, 'vata', 'prakriti', 'number')}
                  {renderEditableField('Pitta Score', editedPatient?.prakriti?.pitta, 'pitta', 'prakriti', 'number')}
                  {renderEditableField('Kapha Score', editedPatient?.prakriti?.kapha, 'kapha', 'prakriti', 'number')}
                </div>

                {/* Current Imbalance */}
                <div className="section">
                  <h5>Current Imbalance (Vikriti)</h5>
                  {renderEditableField('Vata Level', editedPatient?.vikriti?.vata, 'vata', 'vikriti', 'number')}
                  {renderEditableField('Pitta Level', editedPatient?.vikriti?.pitta, 'pitta', 'vikriti', 'number')}
                  {renderEditableField('Kapha Level', editedPatient?.vikriti?.kapha, 'kapha', 'vikriti', 'number')}
                </div>

                {/* Metadata */}
                <div className="section">
                  <h5>System Information</h5>
                  <div className="field-display">
                    <span className="field-label">Patient ID:</span>
                    <span className="field-value">{selectedPatient._id}</span>
                  </div>
                  <div className="field-display">
                    <span className="field-label">Created:</span>
                    <span className="field-value">{new Date(selectedPatient.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="field-display">
                    <span className="field-label">Last Updated:</span>
                    <span className="field-value">{new Date(selectedPatient.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="field-display">
                    <span className="field-label">Status:</span>
                    <span className="field-value">{selectedPatient.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a patient from the list to view and edit their details</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default PatientDetailsViewer;
