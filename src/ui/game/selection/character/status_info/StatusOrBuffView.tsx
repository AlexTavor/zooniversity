import React from "react";
import { DisplayableBuffData } from "../../../../../game/display/game/data_panel/character/deriveBuffs";
import { CharacterAction } from "../../../../../game/logic/action-intent/actionIntentData";
import { BuffView } from "../../../buffs/BuffView";
import { StatusInfoLine } from "./StatusInfoLine";

// Icon map for performed actions - kept local to this component or could be imported from a shared consts file
const performedActionIcons: Record<CharacterAction, string> = {
  [CharacterAction.IDLE]: "assets/icons/wait_icon.png",
  [CharacterAction.WALKING]: "assets/icons/walk_icon.png",
  [CharacterAction.CHOPPING]: "assets/icons/axe_icon.png",
  [CharacterAction.BUILDING]: "assets/icons/build_icon.png",
  [CharacterAction.STUDYING]: "assets/icons/book_icon.png",
  [CharacterAction.SLEEPING]: "assets/icons/sleep_icon.png",
  [CharacterAction.STROLLING]: "assets/icons/walk_icon.png", // Strolling might share walk or have its own
  [CharacterAction.RELAXING]: "assets/icons/relax_icon.png",
  [CharacterAction.NONE]: "assets/icons/wait_icon.png", // Or a question mark icon
};

interface StatusOrBuffViewProps {
  statusText: string;
  currentPerformedAction: CharacterAction;
  scheduleText: string;
  scheduleIconSrc: string; // Pass the direct icon source for schedule
  activeBuffs?: DisplayableBuffData[];
}

export const StatusOrBuffView: React.FC<StatusOrBuffViewProps> = ({
  statusText,
  currentPerformedAction,
  scheduleText,
  scheduleIconSrc,
  activeBuffs,
}) => {
  const currentActionIcon = performedActionIcons[currentPerformedAction] || "assets/icons/idle_icon.png";

  return (
    <div className="status-buff-view-wrapper">
        {activeBuffs && activeBuffs.length > 0 && (
          <>{activeBuffs.map((buffData) => (
            <StatusInfoLine key={buffData.key} label={buffData.description}>
              <BuffView key={buffData.key} data={buffData} />
            </StatusInfoLine>
          ))}</>
      )}
      <StatusInfoLine 
        label="Status" 
        text={statusText} 
        iconSrc={currentActionIcon} 
        iconAlt={currentPerformedAction.toString()} 
      />
      <StatusInfoLine 
        label="Schedule" 
        text={scheduleText} 
        iconSrc={scheduleIconSrc} 
        iconAlt={scheduleText}
      />
    </div>
  );
};