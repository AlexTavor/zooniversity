import React from "react";
import "./StatusInfoLine.css"; // Corresponding CSS file

export interface StatusInfoLineProps {
  label: string;
  text?: string | null;
  iconSrc?: string;
  iconAlt?: string;
  /** For embedding more complex content like a series of BuffView components */
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
    <p className="status-info-line text-bg"> {/* Moved text-bg here for consistent background */}
      <span className="status-label">{label}</span>
      {text && <span className="status-text-value">{text}</span>}
      {iconSrc && <img className="status-inline-icon" src={iconSrc} alt={iconAlt || label} />}
      {children && <div className="status-children-container">{children}</div>}
    </p>
  );
};