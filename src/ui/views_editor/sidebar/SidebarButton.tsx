import React from 'react';
import './Sidebar.css';

interface SidebarButtonProps {
    label: string;
    icon?: string; // Emoji or URL path
    isActive: boolean;
    onClick: () => void;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({ label, icon, isActive, onClick }) => {
    return (
        <button className={`sidebar-button ${isActive ? 'active' : ''}`} onClick={onClick}>
            {icon && (
                icon.startsWith('http') || icon.includes('/') ? (
                    <img src={icon} alt="" className="sidebar-icon" />
                ) : (
                    <span className="sidebar-icon">{icon}</span>
                )
            )}
            <span className="sidebar-label">{label}</span>
        </button>
    );
};
