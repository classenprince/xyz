import React, { useState, useRef, useEffect } from 'react';
import DietPlanGenerator from './DietPlanGenerator';
import PatientAnalysis from './PatientAnalysis';
import './ChatInterface.css';

const ChatInterface = ({ messages, onAddMessage, isSidebarOpen, onToggleSidebar, theme, onToggleTheme, onSetTheme, selectedPatient, serverStatus, onAddNewPatient }) => {
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [patientData, setPatientData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const messagesEndRef = useRef(null);

  const dietSteps = [
    { key: 'prakriti', question: 'What is the patient\'s natural constitution (Prakriti)? Please specify dominant dosha from birth:', placeholder: 'e.g., Vata-Pitta dominant, Kapha secondary' },
    { key: 'vikruti', question: 'What is the current imbalanced state (Vikruti)? Please provide current dosha levels:', placeholder: 'e.g., Vata: 3.5, Pitta: 2.5, Kapha: 1' },
    { key: 'roga', question: 'What are the patient\'s main health concerns or symptoms (Roga)?', placeholder: 'e.g., Abdominal Gas, Heat in body, Digestive issues' },
    { key: 'climate', question: 'What is the patient\'s current climate and season?', placeholder: 'e.g., Hot and humid summer, Cold winter, Rainy season' },
    { key: 'age', question: 'What is the patient\'s age?', placeholder: 'e.g., 29' },
    { key: 'weight', question: 'What is the patient\'s weight?', placeholder: 'e.g., 50kg' },
    { key: 'height', question: 'What is the patient\'s height?', placeholder: 'e.g., 5\'5"' },
    { key: 'gender', question: 'What is the patient\'s gender?', placeholder: 'e.g., Female' },
    { key: 'agni', question: 'How is the patient\'s digestive fire (Agni)? Describe appetite and digestion:', placeholder: 'e.g., Strong appetite, slow digestion, irregular hunger' },
    { key: 'foodPreferences', question: 'What are the patient\'s taste preferences (Rasa)? Which tastes do they crave or avoid?', placeholder: 'e.g., Loves sweet and salty, avoids bitter, craves spicy' },
    { key: 'dietaryHabits', question: 'What are the patient\'s current dietary habits and lifestyle?', placeholder: 'e.g., Vegetarian, moderate appetite, prefers warm foods, exercises regularly' },
    { key: 'mealFrequency', question: 'What is the patient\'s preferred meal frequency and timing?', placeholder: 'e.g., 3 main meals + 1 snack, dinner by 7 PM' },
    { key: 'targetCalories', question: 'What is the target daily calorie intake based on activity level?', placeholder: 'e.g., 2200 kcal/day for moderate activity' }
  ];

  const quickActions = [
    { 
      id: 'diet-chart', 
      label: 'Create Diet Chart',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    { 
      id: 'herb-consultation', 
      label: 'Herb Consultation',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 21s3-6 12-6c0-9 6-12 6-12 0 8-2 18-12 18-3 0-6 0-6 0Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 'patient-analysis', 
      label: 'Patient Analysis',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 'lifestyle-tips', 
      label: 'Lifestyle Tips',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.doctor-profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
      if (!event.target.closest('.quick-actions-container')) {
        setIsQuickActionsOpen(false);
      }
    };

    if (isProfileDropdownOpen || isQuickActionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isQuickActionsOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAction = (actionId) => {
    setIsQuickActionsOpen(false);
    
    switch(actionId) {
      case 'diet-chart':
        handleMenuSelect({id: 'diet-chart'});
        break;
      case 'herb-consultation':
        handleHerbConsultation();
        break;
      case 'patient-analysis':
        handleMenuSelect('patient-analysis');
        break;
      case 'lifestyle-tips':
        handleLifestyleTips();
        break;
      default:
        break;
    }
  };

  const handleHerbConsultation = () => {
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'I can help you with herb consultation! Please describe the patient\'s condition, symptoms, and any specific concerns. I\'ll suggest appropriate Ayurvedic herbs based on their Prakriti, Vikriti, and current health status.'
    };
    onAddMessage(botMessage);
  };

  const handleLifestyleTips = () => {
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'I\'d be happy to provide personalized lifestyle tips based on Ayurvedic principles! Please share details about the patient\'s daily routine, sleep patterns, exercise habits, work schedule, and any specific lifestyle concerns they have.'
    };
    onAddMessage(botMessage);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    };

    onAddMessage(userMessage);

    if (currentView === 'diet-chart' && currentStep < dietSteps.length) {
      // Store the patient data, ensuring all values are strings to prevent React render errors
      const newPatientData = {
        ...patientData,
        [dietSteps[currentStep].key]: String(inputValue).trim()
      };
      setPatientData(newPatientData);

      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      setTimeout(() => {
        if (nextStep < dietSteps.length) {
          // Ask next question
          const botMessage = {
            id: Date.now() + 1,
            type: 'bot',
            content: dietSteps[nextStep].question
          };
          onAddMessage(botMessage);
        } else {
          // All data collected, generate diet plan
          const completionMessage = {
            id: Date.now() + 1,
            type: 'bot',
            content: 'Perfect! I have collected all the necessary information. Let me generate a personalized diet chart for your patient.',
            showDietPlan: true,
            patientData: newPatientData
          };
          onAddMessage(completionMessage);
        }
      }, 1000);
    } else {
      // Default response for other conversations
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Thank you for your message. How else can I assist you with Ayurvedic healthcare today?'
        };
        onAddMessage(botMessage);
      }, 1000);
    }

    setInputValue('');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuSelect = async (option) => {
    setIsMenuOpen(false);
    
    if (option.id === 'diet-chart') {
      // Load patients from API and show selection
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          const botMessage = {
            id: Date.now(),
            type: 'bot',
            content: 'I can help you create a personalized Ayurvedic diet chart! Please choose a patient:',
            showPatientSelection: true,
            availablePatients: data.data
          };
          onAddMessage(botMessage);
        } else {
          const botMessage = {
            id: Date.now(),
            type: 'bot',
            content: 'No patients found in the database. Would you like to add a new patient first?',
            showPatientOptions: true
          };
          onAddMessage(botMessage);
        }
      } catch (error) {
        console.error('Error loading patients:', error);
        const botMessage = {
          id: Date.now(),
          type: 'bot',
          content: 'I can help you create a personalized Ayurvedic diet chart! Would you like to:',
          showPatientOptions: true
        };
        onAddMessage(botMessage);
      }
    } else if (option === 'patient-analysis') {
      // Load patients for constitutional analysis
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          const botMessage = {
            id: Date.now(),
            type: 'bot',
            content: 'I can provide a comprehensive Ayurvedic constitutional analysis covering Prakriti, Vikriti, Dosha understanding, and practical health insights. Please choose a patient for analysis:',
            showPatientAnalysisSelection: true,
            availablePatients: data.data
          };
          onAddMessage(botMessage);
        } else {
          const botMessage = {
            id: Date.now(),
            type: 'bot',
            content: 'No patients found for analysis. Please add a patient first using the sidebar.'
          };
          onAddMessage(botMessage);
        }
      } catch (error) {
        console.error('Error loading patients for analysis:', error);
        const botMessage = {
          id: Date.now(),
          type: 'bot',
          content: 'I can provide comprehensive Ayurvedic patient analysis! Would you like to analyze an existing patient or add a new one?',
          showPatientOptions: true
        };
        onAddMessage(botMessage);
      }
    }
  };

  const handlePatientSelection = (patient) => {
    // Use the selected patient for diet generation
    const patientForDiet = convertPatientToDietData(patient);
    setPatientData(patientForDiet);
    setCurrentStep(dietSteps.length);
    setCurrentView('diet-chart');
    
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Perfect! I'll create a personalized Ayurvedic diet plan for ${patient.name}. Based on their ${getDominantDosha(patient.prakriti)} dominant Prakriti and current health profile, let me generate their diet chart.`
    };
    onAddMessage(botMessage);

    setTimeout(() => {
      const completionMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Diet plan ready for ${patient.name}! I've analyzed their Ayurvedic constitution and current health conditions.`,
        showDietPlan: true,
        patientData: patientForDiet
      };
      onAddMessage(completionMessage);
    }, 2000);
  };

  const handlePatientAnalysisSelection = (patient) => {
    // Use the selected patient for constitutional analysis
    const patientForAnalysis = convertPatientToDietData(patient);
    setPatientData(patientForAnalysis);
    setCurrentView('patient-analysis');
    
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Excellent! I'll provide a comprehensive Ayurvedic constitutional analysis for ${patient.name}. This will include detailed insights about their Prakriti, Vikriti, and practical understanding of their dosha imbalances.`
    };
    onAddMessage(botMessage);

    setTimeout(() => {
      const analysisMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Complete Ayurvedic analysis ready for ${patient.name}! This covers their constitutional makeup, current imbalances, and actionable health insights.`,
        showPatientAnalysis: true,
        patientData: patientForAnalysis
      };
      onAddMessage(analysisMessage);
    }, 2000);
  };

  const handlePatientChoice = (choice) => {
    if (choice === 'existing') {
      if (selectedPatient) {
        handlePatientSelection(selectedPatient);
      } else {
        const botMessage = {
          id: Date.now(),
          type: 'bot',
          content: 'Please select a patient from the sidebar first, or choose to add a new patient.'
        };
        onAddMessage(botMessage);
      }
    } else if (choice === 'new') {
      // Trigger the add new patient form
      if (onAddNewPatient) {
        onAddNewPatient();
      }
      const botMessage = {
        id: Date.now(),
        type: 'bot',
        content: 'Great! Please fill out the patient form that just opened. Once you save the patient details, I\'ll be able to create their personalized diet chart.'
      };
      onAddMessage(botMessage);
    }
  };

  const getDominantDosha = (prakriti) => {
    if (!prakriti) return 'balanced';
    const { vata = 0, pitta = 0, kapha = 0 } = prakriti;
    if (vata >= pitta && vata >= kapha) return 'Vata';
    if (pitta >= kapha) return 'Pitta';
    return 'Kapha';
  };

  const convertPatientToDietData = (patient) => {
    console.log('🔍 Converting patient data for diet generation:', patient);
    
    // Safe function to convert nested objects to strings
    const safeStringify = (obj, fallback = 'Not specified') => {
      if (!obj) return fallback;
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'number') return obj.toString();
      if (Array.isArray(obj)) {
        return obj.map(item => 
          typeof item === 'string' ? item : 
          typeof item === 'object' && item?.condition ? item.condition : 
          String(item)
        ).join(', ') || fallback;
      }
      if (typeof obj === 'object') {
        // For dosha objects, format as "Vata: X, Pitta: Y, Kapha: Z"
        if (obj.vata !== undefined || obj.pitta !== undefined || obj.kapha !== undefined) {
          return `Vata: ${obj.vata || 0}, Pitta: ${obj.pitta || 0}, Kapha: ${obj.kapha || 0}`;
        }
        // For other objects, extract meaningful values
        return Object.values(obj).filter(Boolean).join(', ') || fallback;
      }
      return String(obj);
    };
    
    // CRITICAL: Keep the original _id and full patient structure for API calls
    return {
      _id: patient._id, // This is ESSENTIAL for MongoDB lookup
      name: safeStringify(patient.name, 'Unnamed Patient'),
      age: safeStringify(patient.age, 'Age not specified'),
      gender: safeStringify(patient.gender, 'Gender not specified'),
      
      // Keep original structures for backend processing
      prakriti: patient.prakriti,
      vikriti: patient.vikriti,
      roga: patient.roga,
      physicalMeasurements: patient.physicalMeasurements,
      dietaryHabits: patient.dietaryHabits,
      lifestyle: patient.lifestyle,
      environment: patient.environment,
      contactInfo: patient.contactInfo,
      
      // SAFE STRING VERSIONS for any UI display
      prakritiDisplay: safeStringify(patient.prakriti),
      vikritiDisplay: safeStringify(patient.vikriti),
      rogaDisplay: safeStringify(patient.roga, 'No health concerns specified'),
      climateDisplay: safeStringify(patient.environment?.climate, 'Climate not specified'),
      weightDisplay: patient.physicalMeasurements?.weight ? 
        `${patient.physicalMeasurements.weight.value || 'Not specified'}${patient.physicalMeasurements.weight.unit || ''}` : 
        'Weight not specified',
      heightDisplay: patient.physicalMeasurements?.height?.feet ? 
        `${patient.physicalMeasurements.height.feet}'${patient.physicalMeasurements.height.inches || 0}"` : 
        'Height not specified',
      agniDisplay: safeStringify(patient.dietaryHabits?.appetite, 'Appetite not specified'),
      foodPreferencesDisplay: patient.dietaryHabits ? 
        `${patient.dietaryHabits.type || 'Diet type not specified'}, ${patient.dietaryHabits.foodPreferences?.temperature || 'temperature preference not specified'} foods` :
        'Food preferences not specified',
      targetCaloriesDisplay: safeStringify(patient.dietaryHabits?.targetCalories, 'Target calories not specified') + ' kcal/day'
    };
  };

  const handleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileAction = (action) => {
    setIsProfileDropdownOpen(false);
    
    switch (action) {
      case 'profile':
        // Navigate to profile page or show profile modal
        console.log('Navigating to doctor profile...');
        break;
      case 'settings':
        // Navigate to settings page
        console.log('Opening settings...');
        break;
      case 'schedule':
        // Navigate to schedule page
        console.log('Opening schedule...');
        break;
      case 'patients':
        // Navigate to patients list
        console.log('Opening patients list...');
        break;
      case 'logout':
        // Handle logout
        console.log('Logging out...');
        // In a real app, you would clear tokens and redirect to login
        if (window.confirm('Are you sure you want to sign out?')) {
          // Perform logout
          window.location.href = '/login';
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getCurrentPlaceholder = () => {
    if (currentView === 'diet-chart' && currentStep < dietSteps.length) {
      return dietSteps[currentStep].placeholder;
    }
    return 'Ask anything...';
  };

  return (
    <div className="chat-interface">
      {/* Header */}
      <div className="chat-header">
        {!isSidebarOpen && (
          <button className="sidebar-toggle" onClick={onToggleSidebar}>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
        <h1 className="chat-title">Ayurvedic Assistant</h1>
        <div className="header-actions">
          <select
            className="theme-select"
            value={theme}
            onChange={(e) => onSetTheme && onSetTheme(e.target.value)}
            title="Select theme"
            aria-label="Select theme"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="coal">Coal</option>
            <option value="paper">Paper</option>
            <option value="gray">Gray</option>
          </select>
          <button className="theme-toggle" onClick={onToggleTheme} title={`Switch theme (current: ${theme})`} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              theme === 'coal' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3l2.39 4.84L20 9.27l-3.8 3.7.9 5.25L12 16.9l-4.1 2.15.9-5.25L5 9.27l5.61-1.43L12 3z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
                </svg>
              ) : theme === 'gray' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 8h12M6 12h10M6 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )
            )}
          </button>
          <div className="doctor-profile-dropdown">
            <button className="profile-trigger" onClick={handleProfileDropdown}>
              <div className="doctor-avatar">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face" alt="Doctor" className="avatar-image" />
              </div>
              <div className="doctor-info">
                <span className="doctor-name">Dr. Mohan Mehta</span>
                <span className="doctor-specialty">Internal Medicine</span>
              </div>
              <svg className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isProfileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <div className="doctor-avatar-large">
                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face" alt="Doctor" className="avatar-image-large" />
                  </div>
                  <div className="doctor-details">
                    <h3>Dr. Mohan Mehta</h3>
                    <p>Internal Medicine</p>
                    <span className="status-indicator" aria-label="Online">
                      <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '6px'}}>
                        <circle cx="5" cy="5" r="5" fill="#10a37f"/>
                      </svg>
                      Online
                    </span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-items">
                  <button className="dropdown-item" onClick={() => handleProfileAction('profile')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>View Profile</span>
                  </button>
                  
                  <button className="dropdown-item" onClick={() => handleProfileAction('settings')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5842 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6642 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6642 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01131 9.77251C4.28063 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Settings</span>
                  </button>
                  
                  <button className="dropdown-item" onClick={() => handleProfileAction('schedule')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Schedule</span>
                  </button>
                  
                  <button className="dropdown-item" onClick={() => handleProfileAction('patients')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7007C21.7033 16.0473 20.9995 15.5885 20.2 15.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 18.9078 6.11683 18.7176 6.94973C18.5274 7.78263 18.0661 8.52521 17.4253 9.03932C16.7845 9.55343 15.9989 9.80697 15.2 9.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>My Patients</span>
                  </button>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout" onClick={() => handleProfileAction('logout')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 1 && (
          <div className="welcome-section">
            <div className="welcome-avatar" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2>How can I help you today?</h2>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => handleMenuSelect({id: 'diet-chart'})}
              >
                <span className="qa-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <span>Create Diet Chart</span>
              </button>
              <button className="quick-action-btn">
                <span className="qa-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21s3-6 12-6c0-9 6-12 6-12 0 8-2 18-12 18-3 0-6 0-6 0Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                <span>Herb Consultation</span>
              </button>
              <button className="quick-action-btn" onClick={() => handleMenuSelect('patient-analysis')}>
                <span className="qa-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3v18M21 21H3M7 15l3-6 3 6 3-9 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Patient Analysis</span>
              </button>
              <button className="quick-action-btn">
                <span className="qa-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <span>Lifestyle Tips</span>
              </button>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'bot' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="3" ry="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="7" r="4" fill="currentColor"/>
                  <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6v1H4v-1z" fill="currentColor"/>
                </svg>
              )}
            </div>
            <div className="message-content">
              {message.content}
              {message.showPatientSelection && (
                <div className="patient-selection-container">
                  <div className="patient-list">
                    {message.availablePatients.map((patient) => (
                      <button 
                        key={patient._id}
                        className="patient-card"
                        onClick={() => handlePatientSelection(patient)}
                      >
                        <div className="patient-avatar">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="patient-info">
                          <h4>{patient.name}</h4>
                          <p>{patient.age}y, {patient.gender}</p>
                          <p className="constitution">{getDominantDosha(patient.prakriti)} dominant</p>
                          {patient.roga && patient.roga.length > 0 && (
                            <p className="health-issues">
                              {patient.roga.map(r => typeof r === 'string' ? r : r.condition).slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="select-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="add-new-patient-option">
                    <button 
                      className="choice-btn new-patient"
                      onClick={() => handlePatientChoice('new')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16 21V19C16 16.7909 14.2091 15 12 15C9.79086 15 8 16.7909 8 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 14V10M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Add New Patient
                    </button>
                  </div>
                </div>
              )}
              {message.showPatientOptions && (
                <div className="patient-choice-buttons">
                  <button 
                    className="choice-btn existing-patient"
                    onClick={() => handlePatientChoice('existing')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Use Existing Patient
                    {selectedPatient && (
                      <span className="selected-patient-name">({selectedPatient.name})</span>
                    )}
                  </button>
                  <button 
                    className="choice-btn new-patient"
                    onClick={() => handlePatientChoice('new')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M16 21V19C16 16.7909 14.2091 15 12 15C9.79086 15 8 16.7909 8 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 14V10M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add New Patient
                  </button>
                </div>
              )}
              {message.showPatientAnalysisSelection && (
                <div className="patient-selection-container">
                  <div className="patient-list">
                    {message.availablePatients.map((patient) => (
                      <button 
                        key={patient._id}
                        className="patient-card"
                        onClick={() => handlePatientAnalysisSelection(patient)}
                      >
                        <div className="patient-avatar">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="patient-info">
                          <h4>{patient.name}</h4>
                          <p>{patient.age}y, {patient.gender}</p>
                          <p className="constitution">{getDominantDosha(patient.prakriti)} dominant</p>
                          {patient.roga && patient.roga.length > 0 && (
                            <p className="health-issues">
                              {patient.roga.map(r => typeof r === 'string' ? r : r.condition).slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="select-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="add-new-patient-option">
                    <button 
                      className="choice-btn new-patient"
                      onClick={() => handlePatientChoice('new')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16 21V19C16 16.7909 14.2091 15 12 15C9.79086 15 8 16.7909 8 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 14V10M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Add New Patient
                    </button>
                  </div>
                </div>
              )}
              {message.showDietPlan && (
                <DietPlanGenerator patientData={message.patientData} />
              )}
              {message.showPatientAnalysis && (
                <PatientAnalysis patientData={message.patientData} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="input-container">
        <div className="input-wrapper">
          {/* Quick Actions Dropdown */}
          <div className="quick-actions-container">
            <button 
              className="quick-actions-btn"
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              title="Quick Actions"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {isQuickActionsOpen && (
              <div className="quick-actions-dropdown">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    className="quick-action-item"
                    onClick={() => handleQuickAction(action.id)}
                  >
                    <span className="action-icon">{action.icon}</span>
                    <span className="action-label">{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={getCurrentPlaceholder()}
            className="chat-input"
          />
          
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <p className="input-footer">
          Ayurvedic Assistant can make mistakes. Please consult with a qualified Ayurvedic practitioner for personalized advice.
        </p>
      </div>

    </div>
  );
};

export default ChatInterface;
