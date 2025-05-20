import React from "react";
import "./ScheduleBarView.css";
import { CharacterScheduleIconType } from "../../../../../game/display/game/data_panel/character/characterPanelReducer";

interface ScheduleBarViewProps {
  scheduleIconTypes: CharacterScheduleIconType[];
  currentScheduleIndex: number;
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

export const ScheduleBarView: React.FC<ScheduleBarViewProps> = ({
  scheduleIconTypes,
  currentScheduleIndex,
}) => {
  if (!scheduleIconTypes || scheduleIconTypes.length === 0) {
    return null; // Don't render if there's no schedule data
  }

  return (
    <div className="schedule-bar-wrapper">
      <div className="schedule-bar">
        {scheduleIconTypes.map((iconType, index) => {
          const scheduleIcon = scheduleBarIcons[iconType] || "assets/icons/idle_icon.png";
          // Derive text for title attribute from the enum key name
          const scheduleEntryText =
            (Object.keys(CharacterScheduleIconType) as Array<
              keyof typeof CharacterScheduleIconType
            >).find(
              (key) => CharacterScheduleIconType[key] === iconType
            ) || "Task";

          return (
            <div
              key={index}
              className={`schedule-slot ${
                index === currentScheduleIndex ? "active" : ""
              }`}
              title={scheduleEntryText}
            >
              <img
                src={scheduleIcon}
                alt={scheduleEntryText}
                className="schedule-slot-icon"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};