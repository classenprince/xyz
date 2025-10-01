import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, onMenuSelect }) => {
  const icon = {
    home: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    add: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    users: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    clipboard: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="3" width="10" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="4" y="7" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    leaf: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21s3-6 12-6c0-9 6-12 6-12 0 8-2 18-12 18-3 0-6 0-6 0Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    chat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v9Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    doctor: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6v1H4v-1Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    edit: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: icon.home },
    { id: 'add-patient', label: 'Add new Patient', icon: icon.add },
    { id: 'patients', label: 'Patients', icon: icon.users },
    { id: 'patient-details', label: 'View/Edit Patient Details', icon: icon.edit },
    { id: 'diet-chart', label: 'Get Diet Chart', icon: icon.clipboard },
    { id: 'herb-wiki', label: 'HerbWiki', icon: icon.leaf },
    { id: 'chat-history', label: 'Chat History', icon: icon.chat },
    { id: 'profile', label: 'Doctor\'s Profile', icon: icon.doctor }
  ];

  const handleItemClick = (itemId) => {
    onMenuSelect(itemId);
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="sidebar-content">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className="sidebar-item"
              onClick={() => handleItemClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
