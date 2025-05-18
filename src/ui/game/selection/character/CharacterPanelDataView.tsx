// src/ui/selection/character/CharacterPanelDataView.tsx

import React from "react";
import "./CharacterPanelDataView.css"; 
// Assuming CharacterAction is in actionIntentData and CharacterScheduleIconType is from PanelTypeReducers
import { CharacterAction } from "../../../../game/logic/action-intent/actionIntentData"; 
import { CharacterScheduleIconType } from "../../../../game/display/game/data_panel/PanelTypeReducers"; 

interface CharacterPanelUIData {
  currentStatusText: string;          // The new rich "internal state" text
  currentPerformedAction: CharacterAction; // For the action icon
  currentScheduleIndex: number;
  currentScheduleText: string;        // The new descriptive schedule text
  scheduleIconTypes: CharacterScheduleIconType[]; // For the schedule bar icons
}

// Icons for the schedule bar, using CharacterScheduleIconType
const scheduleBarIcons: Record<CharacterScheduleIconType, string> = {
  [CharacterScheduleIconType.HARVEST]: "assets/icons/axe_icon.png",
  [CharacterScheduleIconType.SLEEP]: "assets/icons/sleep_icon.png",
  [CharacterScheduleIconType.STUDY]: "assets/icons/book_icon.png",
  [CharacterScheduleIconType.REST]: "assets/icons/relax_icon.png",
  [CharacterScheduleIconType.BUILD]: "assets/icons/build_icon.png", 
  [CharacterScheduleIconType.NONE]: "assets/icons/idle_icon.png", 
};

// Icons for the current performed action
const performedActionIcons: Record<CharacterAction, string> = {
  [CharacterAction.IDLE]: "assets/icons/idle_icon.png",
  [CharacterAction.WALKING]: "assets/icons/walk_icon.png",
  [CharacterAction.CHOPPING]: "assets/icons/axe_icon.png",
  [CharacterAction.BUILDING]: "assets/icons/build_icon.png",
  [CharacterAction.STUDYING]: "assets/icons/book_icon.png",
  [CharacterAction.SLEEPING]: "assets/icons/sleep_icon.png",
  [CharacterAction.STROLLING]: "assets/icons/walk_icon.png", // Using walk icon for strolling action
  [CharacterAction.RELAXING]: "assets/icons/relax_icon.png",
  [CharacterAction.NONE]: "assets/icons/wait_icon.png",
};

export const CharacterPanelDataView: React.FC<{
  data: CharacterPanelUIData;
  collapsed: boolean;
}> = ({ data, collapsed }) => {
  if (!data) {
    return null;
  }
  
  // Get icon for the current performed action
  const currentActionIcon = performedActionIcons[data.currentPerformedAction] || "assets/icons/idle_icon.png";
  // The current schedule text is now directly data.currentScheduleText
  // The icon for the current schedule item in the detailed view can be derived from scheduleIconTypes
  const currentHourScheduleIconType = data.scheduleIconTypes[data.currentScheduleIndex] || CharacterScheduleIconType.NONE;
  const currentScheduleDisplayIcon = scheduleBarIcons[currentHourScheduleIconType];


  if (collapsed) {
    return (
      <div className="character-panel-collapsed">
        {/* For collapsed view, show current schedule icon and current action icon */}
        <img className="icon" src={currentScheduleDisplayIcon} alt={data.currentScheduleText} title={`Scheduled: ${data.currentScheduleText}`} />
        <img className="icon" src={currentActionIcon} alt={data.currentPerformedAction} title={`Action: ${data.currentPerformedAction}`} />
      </div>
    );
  }

  return (
    <div className="character-panel-expanded">
      <div className="info-block">
        {/* Main status text */}
        <p className="text-bg info-line" title={data.currentPerformedAction.toString()}>
          Status: {data.currentStatusText} 
          {/* Optionally, still show the action icon here if statusText doesn't always include it */}
           <img className="inline-icon" src={currentActionIcon} alt={data.currentPerformedAction} />
        </p>
        {/* Descriptive current schedule */}
        <p className="text-bg info-line">
          Schedule: {data.currentScheduleText}
          <img className="inline-icon" src={currentScheduleDisplayIcon} alt={data.currentScheduleText} />
        </p>
      </div>
      <div className="schedule-bar-wrapper">
        <div className="schedule-bar">
          {data.scheduleIconTypes.map((iconType, index) => {
            const scheduleIcon = scheduleBarIcons[iconType] || "assets/icons/idle_icon.png";
            // To get the text for the title attribute, we might need another map or derive it if not too complex
            const scheduleEntryText = Object.keys(CharacterScheduleIconType).find(key => CharacterScheduleIconType[key as keyof typeof CharacterScheduleIconType] === iconType) || "Task";
            return (
              <div
                key={index}
                className={`slot ${index === data.currentScheduleIndex ? "active" : ""}`}
                title={scheduleEntryText}
              >
                <img src={scheduleIcon} alt={scheduleEntryText} className="slot-icon" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};