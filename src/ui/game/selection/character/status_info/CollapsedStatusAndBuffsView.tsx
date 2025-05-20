import React from "react";
import "./CollapsedStatusAndBuffsView.css";
import { DisplayableBuffData } from "../../../../../game/display/game/data_panel/character/deriveBuffs";
import { BuffView } from "../../../buffs/BuffView";

export interface CollapsedStatusAndBuffsViewProps {
  scheduleText: string;
  scheduleIconPath: string;
  actionText: string; // This would be data.currentPerformedAction.toString()
  actionIconPath: string;
  activeBuffs?: DisplayableBuffData[];
}

export const CollapsedStatusAndBuffsView: React.FC<CollapsedStatusAndBuffsViewProps> = ({
  scheduleText,
  scheduleIconPath,
  actionText,
  actionIconPath,
  activeBuffs,
}) => {
  return (
    <div className="collapsed-status-buffs-view">
      <img 
        className="collapsed-icon" 
        src={scheduleIconPath} 
        alt={scheduleText} 
        title={`Scheduled: ${scheduleText}`} 
      />
      <img 
        className="collapsed-icon" 
        src={actionIconPath} 
        alt={actionText} 
        title={`Action: ${actionText}`} 
      />
      {activeBuffs?.map(buffData => (
        <BuffView key={buffData.key} data={buffData} />
      ))}
    </div>
  );
};