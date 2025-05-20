import React from 'react';
import './BuffView.css';
import { DisplayableBuffData } from '../../../game/display/game/data_panel/character/deriveBuffs';

interface BuffViewProps {
  data: DisplayableBuffData;
}

export const BuffView: React.FC<BuffViewProps> = ({ data }) => {
  const progressPercent = (data.totalDurationMinutes > 0 && data.remainingDurationMinutes >= 0)
    ? (data.remainingDurationMinutes / data.totalDurationMinutes) * 100
    : (data.remainingDurationMinutes > 0 ? 100 : 0); 

  const buffClass = data.isBuff ? 'is-buff' : 'is-debuff';
  
  return (
    <div 
      className={`buff-view-container ${buffClass}`} 
    >
      <div className="buff-view-background-bar">
        <div 
          className="buff-view-progress-fill" 
          style={{ height: `${progressPercent}%` }} 
        />
      </div>
      <img 
        src={data.iconAssetKey} 
        alt={data.displayName} 
        className="buff-view-icon" 
      />
    </div>
  );
};