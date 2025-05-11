import React from "react";
import "./CharacterPanelDataView.css";
import { CharacterAction, CharacterScheduleType } from "../../../game/display/game/tools/selection/PanelTypeReducers";

interface CharacterPanelData {
  currentScheduleIndex: number;
  currentSchedule: CharacterScheduleType;
  currentAction: CharacterAction;
  schedule: CharacterScheduleType[];
}

const scheduleIcons: Record<CharacterScheduleType, string> = {
  [CharacterScheduleType.HARVEST]: "assets/icons/axe_icon.png",
  [CharacterScheduleType.SLEEP]: "assets/icons/sleep_icon.png",
  [CharacterScheduleType.STUDY]: "assets/icons/book_icon.png",
  [CharacterScheduleType.REST]: "assets/icons/relax_icon.png"
};

const actionIcons: Record<CharacterAction, string> = {
  [CharacterAction.NONE]: "assets/icons/idle_icon.png",
  [CharacterAction.WALKING]: "assets/icons/walk_icon.png",
  [CharacterAction.CHOPPING]: "assets/icons/axe_icon.png",
  [CharacterAction.WAITING]: "assets/icons/wait_icon.png",
  [CharacterAction.SLEEPING]: "assets/icons/sleep_icon.png",
  [CharacterAction.RELAXING]: "assets/icons/relax_icon.png",
  [CharacterAction.STUDYING]: "assets/icons/book_icon.png",
  [CharacterAction.BUILDING]: "assets/icons/build_icon.png"
};

export const CharacterPanelDataView: React.FC<{
  data: CharacterPanelData;
  collapsed: boolean;
}> = ({ data, collapsed }) => {
  if (collapsed) {
    return (
      <div className="character-panel-collapsed">
        <img className="icon" src={scheduleIcons[data.currentSchedule]} alt="schedule" />
        <img className="icon" src={actionIcons[data.currentAction]} alt="action" />
      </div>
    );
  }

  return (
    <div className="character-panel-expanded">
      <div className="info-block">
        <p className="text-bg info-line">
          Current Schedule: {data.currentSchedule}
          <img className="inline-icon" src={scheduleIcons[data.currentSchedule]} alt="schedule" />
        </p>
        <p className="text-bg info-line">
          Current Action: {data.currentAction}
          <img className="inline-icon" src={actionIcons[data.currentAction]} alt="action" />
        </p>
      </div>
      <div className="schedule-bar-wrapper">
        <div className="schedule-bar">
          {data.schedule.map((entry, index) => (
            <div
              key={index}
              className={`slot ${index === data.currentScheduleIndex ? "active" : ""}`}
            >
              <img src={scheduleIcons[entry]} alt={entry} className="slot-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
