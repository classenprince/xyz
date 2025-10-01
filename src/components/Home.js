import React from 'react';
import ChatInterface from './ChatInterface';
import PatientForm from './PatientForm';
import PatientDetailsViewer from './PatientDetailsViewer';

const Home = ({ 
  messages,
  onAddMessage,
  isSidebarOpen,
  onToggleSidebar,
  theme,
  onToggleTheme,
  onSetTheme,
  selectedPatient,
  serverStatus,
  onAddNewPatient,
  showPatientForm,
  isEditingPatient,
  onPatientSave,
  onPatientFormCancel,
  showPatientDetailsViewer,
  onClosePatientDetailsViewer
}) => {
  return (
    <>
      <div className="main-content">
        <ChatInterface 
          messages={messages}
          onAddMessage={onAddMessage}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={onToggleSidebar}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onSetTheme={onSetTheme}
          selectedPatient={selectedPatient}
          serverStatus={serverStatus}
          onAddNewPatient={onAddNewPatient}
        />
      </div>

      {showPatientForm && (
        <PatientForm
          patient={selectedPatient}
          isEditing={isEditingPatient}
          onSave={onPatientSave}
          onCancel={onPatientFormCancel}
        />
      )}

      {showPatientDetailsViewer && (
        <PatientDetailsViewer 
          onClose={onClosePatientDetailsViewer}
        />
      )}
    </>
  );
};

export default Home;
