import React from "react";
import "./CharacterPanelDataView.css"; 
import { CharacterAction } from "../../../../game/logic/action-intent/actionIntentData"; 
import { CharacterScheduleDisplayType } from "../../../../game/display/game/data_panel/PanelTypeReducers"; 

// Interface for the data prop, reflecting new enum types
interface CharacterPanelUIData {
  currentScheduleIndex: number;
  currentSchedule: CharacterScheduleDisplayType; 
  currentAction: CharacterAction;
  schedule: CharacterScheduleDisplayType[];
}

const scheduleDisplayIcons: Record<CharacterScheduleDisplayType, string> = {
  [CharacterScheduleDisplayType.HARVEST]: "assets/icons/axe_icon.png",
  [CharacterScheduleDisplayType.SLEEP]: "assets/icons/sleep_icon.png",
  [CharacterScheduleDisplayType.STUDY]: "assets/icons/book_icon.png",
  [CharacterScheduleDisplayType.REST]: "assets/icons/relax_icon.png",
  [CharacterScheduleDisplayType.BUILD]: "assets/icons/build_icon.png", 
  [CharacterScheduleDisplayType.NONE]: "assets/icons/idle_icon.png",
};

const performedActionIcons: Record<CharacterAction, string> = {
  [CharacterAction.IDLE]: "assets/icons/idle_icon.png",
  [CharacterAction.WALKING]: "assets/icons/walk_icon.png",
  [CharacterAction.CHOPPING]: "assets/icons/axe_icon.png",
  [CharacterAction.BUILDING]: "assets/icons/build_icon.png",
  [CharacterAction.STUDYING]: "assets/icons/book_icon.png",
  [CharacterAction.SLEEPING]: "assets/icons/sleep_icon.png",
  [CharacterAction.STROLLING]: "assets/icons/walk_icon.png",
  [CharacterAction.RELAXING]: "assets/icons/relax_icon.png",
  [CharacterAction.NONE]: "assets/icons/idle_icon.png",
};

export const CharacterPanelDataView: React.FC<{
  data: CharacterPanelUIData;
  collapsed: boolean;
}> = ({ data, collapsed }) => {
  if (!data) { // Guard against undefined data
    return null;
  }
  
  // Ensure fallback if a new enum member was added but not yet to the icon map
  const currentScheduleIcon = scheduleDisplayIcons[data.currentSchedule] || "assets/icons/idle_icon.png";
  const currentActionIcon = performedActionIcons[data.currentAction] || "assets/icons/idle_icon.png";

  if (collapsed) {
    return (
      <div className="character-panel-collapsed">
        <img className="icon" src={currentScheduleIcon} alt={data.currentSchedule} title={`Scheduled: ${data.currentSchedule}`} />
        <img className="icon" src={currentActionIcon} alt={data.currentAction} title={`Action: ${data.currentAction}`} />
      </div>
    );
  }

  return (
    <div className="character-panel-expanded">
      <div className="info-block">
        <p className="text-bg info-line">
          Current Schedule: {data.currentSchedule}
          <img className="inline-icon" src={currentScheduleIcon} alt={data.currentSchedule} />
        </p>
        <p className="text-bg info-line">
          Current Action: {data.currentAction}
          <img className="inline-icon" src={currentActionIcon} alt={data.currentAction} />
        </p>
      </div>
      <div className="schedule-bar-wrapper">
        <div className="schedule-bar">
          {data.schedule.map((entry, index) => {
            const scheduleIcon = scheduleDisplayIcons[entry] || "assets/icons/idle_icon.png";
            return (
              <div
                key={index}
                className={`slot ${index === data.currentScheduleIndex ? "active" : ""}`}
                title={entry}
              >
                <img src={scheduleIcon} alt={entry} className="slot-icon" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};