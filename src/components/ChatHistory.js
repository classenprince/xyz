import React from 'react';
import './ChatHistory.css';

const ChatHistory = ({ isOpen, onToggle, chats, currentChatId, onNewChat, onSelectChat, onPatientHistory, onHerbWiki, onRefreshPatients, onPatientDetails, serverStatus }) => {
  return (
    <div className={`chat-history ${isOpen ? 'open' : 'closed'}`}>
      {/* Header */}
      <div className="chat-history-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <span className="plus-icon">+</span>
          Add New Patient
        </button>
        
        <button className="toggle-sidebar-btn" onClick={onToggle}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="sidebar-navigation">
        <button 
          className="nav-btn refresh-btn"
          onClick={() => onRefreshPatients && onRefreshPatients()}
          title="Refresh patient list"
        >
          <span className="nav-icon">🔄</span>
          <span className="nav-text">Refresh Patients</span>
          <span className={`server-status ${serverStatus}`}></span>
        </button>
        
        <button 
          className="nav-btn patient-history-btn"
          onClick={() => onPatientHistory && onPatientHistory()}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-text">Patient History</span>
        </button>
        
        <button 
          className="nav-btn herb-wiki-btn"
          onClick={() => onHerbWiki && onHerbWiki()}
        >
          <span className="nav-icon">🌿</span>
          <span className="nav-text">HerbWiki</span>
        </button>
        
        <button 
          className="nav-btn patient-details-btn"
          onClick={() => onPatientDetails && onPatientDetails()}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-text">Patient Details</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {chats.length === 0 ? (
          <div className="no-chats">
            <p>No patients added yet</p>
            <small>Add a new patient to begin</small>
          </div>
        ) : (
          chats.map((chat) => (
            <div 
              key={chat.id}
              className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-item-content">
                <div className="chat-title">{chat.title}</div>
                <div className="chat-preview">{chat.preview}</div>
                <div className="chat-timestamp">
                  {new Date(chat.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="chat-item-actions">
                <button className="action-btn" aria-label="More options">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5" cy="12" r="2" fill="currentColor"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    <circle cx="19" cy="12" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="chat-history-footer">
        <div className="doctor-profile">
          <div className="doctor-avatar" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="7" r="4" fill="#fff"/>
              <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6v1H4v-1z" fill="#fff"/>
            </svg>
          </div>
          <div className="doctor-info">
            <div className="doctor-name">Dr. Mohan Mehta</div>
            <div className="doctor-status">Online</div>
          </div>
        </div>
        
        <div className="footer-actions">
          <button className="footer-btn" title="Settings" aria-label="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.4 15a1 1 0 0 1 .2 1.1l-.3.6a2 2 0 0 0 .3 2.3l.1.1-1.4 1.4-.1-.1a2 2 0 0 0-2.3-.3l-.6.3a1 1 0 0 1-1.1-.2l-.5-.5a2 2 0 0 0-2.2 0l-.5.5a1 1 0 0 1-1.1.2l-.6-.3a2 2 0 0 0-2.3.3l-.1.1-1.4-1.4.1-.1a2 2 0 0 0 .3-2.3l-.3-.6a1 1 0 0 1 .2-1.1l.5-.5a2 2 0 0 0 0-2.2l-.5-.5a1 1 0 0 1-.2-1.1l.3-.6a2 2 0 0 0-.3-2.3l-.1-.1L6 3.1l.1.1a2 2 0 0 0 2.3.3l.6-.3a1 1 0 0 1 1.1.2l.5.5a2 2 0 0 0 2.2 0l.5-.5a1 1 0 0 1 1.1-.2l.6.3a2 2 0 0 0 2.3-.3l.1-.1 1.4 1.4-.1.1a2 2 0 0 0-.3 2.3l.3.6a1 1 0 0 1-.2 1.1l-.5.5a2 2 0 0 0 0 2.2l.5.5Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button className="footer-btn" title="Help" aria-label="Help">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.1 9a3 3 0 1 1 5.8 1c0 1.5-1.5 2-2.1 2.6-.3.3-.4.7-.4 1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
