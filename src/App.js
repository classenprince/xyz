import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ChatHistory from './components/ChatHistory';
import Home from './components/Home';
import HerbWiki from './components/HerbWiki';
import apiService from './services/api';
import './App.css';

// Main App content component that uses router hooks
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your Ayurvedic assistant. How can I help you with personalized Ayurvedic healthcare today?'
    }
  ]);
  const [patients, setPatients] = useState([]);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [showPatientDetailsViewer, setShowPatientDetailsViewer] = useState(false);
  const [serverStatus, setServerStatus] = useState('unknown');

  // Theme state with persistence (supports 'dark' | 'light' | 'coal' | 'paper' | 'gray')
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark' || stored === 'coal' || stored === 'paper' || stored === 'gray') return stored;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  // Check server status and load patients on component mount
  useEffect(() => {
    checkServerStatus();
    loadPatients();
  }, []);

  const checkServerStatus = async () => {
    try {
      const health = await apiService.checkServerHealth();
      setServerStatus(health.success ? 'connected' : 'disconnected');
    } catch (error) {
      setServerStatus('disconnected');
    }
  };

  const loadPatients = async (retryCount = 0) => {
    try {
      console.log('Loading patients from database...');
      const result = await apiService.getAllPatients({ limit: 50 });
      console.log('API result:', result);
      
      if (result.success) {
        setPatients(result.data);
        console.log('Patients loaded:', result.data.length);
        
        // Convert patients to chats format for sidebar
        const patientChats = result.data.map(patient => ({
          id: patient._id,
          title: patient.name,
          timestamp: new Date(patient.createdAt || patient.updatedAt || new Date()),
          preview: `${patient.age}y ${patient.gender}, ${getDominantDosha(patient.prakriti)} dominant`,
          type: 'patient'
        }));
        setChats(patientChats);
        console.log('Patient chats set:', patientChats);
        setServerStatus('connected');
      } else {
        console.log('API returned unsuccessful result:', result);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setServerStatus('disconnected');
      
      // Retry up to 3 times with increasing delay
      if (retryCount < 3) {
        console.log(`Retrying to load patients... Attempt ${retryCount + 1}`);
        setTimeout(() => loadPatients(retryCount + 1), (retryCount + 1) * 2000);
      }
    }
  };

  const getDominantDosha = (prakriti) => {
    if (!prakriti) return 'Constitution';
    const { vata = 0, pitta = 0, kapha = 0 } = prakriti;
    if (vata >= pitta && vata >= kapha) return 'Vata';
    if (pitta >= kapha) return 'Pitta';
    return 'Kapha';
  };

  const toggleTheme = () => setTheme(prev => (
    prev === 'dark' ? 'light' :
    prev === 'light' ? 'coal' :
    prev === 'coal' ? 'paper' :
    prev === 'paper' ? 'gray' : 'dark'
  ));
  const setThemeExplicit = (value) => {
    const allowed = ['dark', 'light', 'coal', 'paper', 'gray'];
    if (allowed.includes(value)) setTheme(value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addNewPatient = () => {
    setSelectedPatient(null);
    setIsEditingPatient(false);
    setShowPatientForm(true);
  };

  const handlePatientSave = async (patientData) => {
    try {
      await loadPatients(); // Refresh the patient list
      setShowPatientForm(false);
      setSelectedPatient(null);
      setIsEditingPatient(false);
      
      // Show success message
      const successMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Patient ${patientData.name} has been ${isEditingPatient ? 'updated' : 'added'} successfully! You can now generate personalized Ayurvedic diet recommendations.`
      };
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      console.error('Error handling patient save:', error);
    }
  };

  const handlePatientFormCancel = () => {
    setShowPatientForm(false);
    setSelectedPatient(null);
    setIsEditingPatient(false);
  };

  const selectChat = async (chatId) => {
    setCurrentChatId(chatId);
    
    // Find the selected patient
    const patient = patients.find(p => p._id === chatId);
    if (patient) {
      setSelectedPatient(patient);
      // Load patient-specific messages
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          content: `Hello! I've loaded ${patient.name}'s profile. Based on their ${patient.dominantPrakriti || 'constitution'} dominant Prakriti and current health conditions, I can help generate personalized Ayurvedic diet recommendations. What would you like to know?`
        }
      ]);
    } else {
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          content: 'Chat history loaded. How can I assist you?'
        }
      ]);
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
    
    // Update chat title based on first user message
    if (message.type === 'user' && currentChatId) {
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              title: message.content.slice(0, 50) + (message.content.length > 50 ? '...' : ''),
              preview: message.content.slice(0, 80) + (message.content.length > 80 ? '...' : '')
            }
          : chat
      ));
    }
  };

  const handlePatientHistory = () => {
    console.log('Opening Patient History...');
    // Add a system message to show the feature is being accessed
    const systemMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Patient History feature accessed. Here you can view all patient records, previous consultations, and medical history. This feature will be integrated with your hospital management system.'
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleHerbWiki = () => {
    console.log('Opening HerbWiki...');
    navigate('/herbwiki');
  };

  const handlePatientDetails = () => {
    console.log('Opening Patient Details Editor...');
    setShowPatientDetailsViewer(true);
  };

  return (
    <div className={`app ${theme}`}>
      {/* Sidebar should be visible on all pages */}
      <ChatHistory 
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={addNewPatient}
        onSelectChat={selectChat}
        onPatientHistory={handlePatientHistory}
        onHerbWiki={handleHerbWiki}
        onPatientDetails={handlePatientDetails}
        onRefreshPatients={loadPatients}
        serverStatus={serverStatus}
      />
      
      {/* Routes for different pages */}
      <Routes>
        <Route path="/" element={
          <Home 
            messages={messages}
            onAddMessage={addMessage}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSetTheme={setThemeExplicit}
            selectedPatient={selectedPatient}
            serverStatus={serverStatus}
            onAddNewPatient={addNewPatient}
            showPatientForm={showPatientForm}
            isEditingPatient={isEditingPatient}
            onPatientSave={handlePatientSave}
            onPatientFormCancel={handlePatientFormCancel}
            showPatientDetailsViewer={showPatientDetailsViewer}
            onClosePatientDetailsViewer={() => setShowPatientDetailsViewer(false)}
          />
        } />
        <Route path="/herbwiki" element={<HerbWiki />} />
      </Routes>
    </div>
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
