// src/ui/common/BuffView.tsx (example path)

import React from 'react';
import './BuffView.css';
// Assuming these enums are accessible for DisplayableBuffEffect type
// You might need to import them from your 'actionIntentData.ts' or a shared types file
// import { AffectedStat, BuffEffectApplicationType } from '../../../game/logic/buffs/data/buffsData'; 

// Interface for the individual effect display string
export interface DisplayableBuffEffect {
    stat: any; // Replace 'any' with 'AffectedStat' enum once imported
    value: number;
    applicationType: any; // Replace 'any' with 'BuffEffectApplicationType' enum once imported
    effectText: string; 
}

// Interface for the data prop this component expects
export interface DisplayableBuffData {
    key: string; 
    displayName: string;
    iconAssetKey: string;
    description: string;
    effects: DisplayableBuffEffect[];
    totalDurationMinutes: number;
    remainingDurationMinutes: number; 
    isBuff: boolean; 
}

interface BuffViewProps {
  data: DisplayableBuffData;
}

export const BuffView: React.FC<BuffViewProps> = ({ data }) => {
  // Calculate progress, ensuring totalDuration is not zero to avoid NaN
  const progressPercent = (data.totalDurationMinutes > 0 && data.remainingDurationMinutes >= 0)
    ? (data.remainingDurationMinutes / data.totalDurationMinutes) * 100
    : (data.remainingDurationMinutes > 0 ? 100 : 0); // Full if positive duration but no total, 0 if no remaining

  const buffClass = data.isBuff ? 'is-buff' : 'is-debuff';
  
  const effectLines = data.effects.map(e => e.effectText).join('\n');
  const durationText = data.totalDurationMinutes > 0 
    ? `Remaining: ${data.remainingDurationMinutes}m / ${data.totalDurationMinutes}m`
    : "Permanent (or externally managed)";

  const tooltipText = 
    `${data.displayName}
    ${data.description}
    Effects:
    ${effectLines}
    ${durationText}`;

  return (
    <div 
      className={`buff-view-container ${buffClass}`} 
      title={tooltipText}
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