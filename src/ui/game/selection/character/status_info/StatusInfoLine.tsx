import React from "react";
import "./StatusInfoLine.css"; // Corresponding CSS file

export interface StatusInfoLineProps {
  label: string;
  text?: string | null;
  iconSrc?: string;
  iconAlt?: string;
  children?: React.ReactNode; 
}

export const StatusInfoLine: React.FC<StatusInfoLineProps> = ({
  label,
  text,
  iconSrc,
  iconAlt,
  children,
}) => {
  return (
    <div className="status-info-line text-bg">
      <div className="status-label">{label}</div>
      {text && <span className="status-text-value">{text}</span>}
      {iconSrc && <img className="status-inline-icon" src={iconSrc} alt={iconAlt || label} />}
      {children && <div className="status-children-container">{children}</div>}
    </div>
  );
};