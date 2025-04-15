import React, { ReactNode } from 'react';
import './Sidebar.css';

interface SidebarProps {
    title: string;
    children: ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ title, children }) => {
    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">{title}</h2>
            <div className="sidebar-buttons">
                {children}
            </div>
        </aside>
    );
};
