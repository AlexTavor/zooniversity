import { CharacterScheduleIconType } from "../../../../game/display/game/data_panel/character/characterPanelReducer";
import { DisplayableBuffData } from "../../../../game/display/game/data_panel/character/deriveBuffs";
import { CharacterAction } from "../../../../game/logic/action-intent/actionIntentData";
import { ScheduleBarView } from "./schedule/ScheduleBarView";
import { CollapsedStatusAndBuffsView } from "./status_info/CollapsedStatusAndBuffsView";
import { StatusOrBuffView } from "./status_info/StatusOrBuffView";
import "./CharacterPanelDataView.css";

interface CharacterPanelUIData {
  currentStatusText: string;
  currentPerformedAction: CharacterAction;
  currentScheduleIndex: number;
  currentScheduleText: string; 
  scheduleIconTypes: CharacterScheduleIconType[];
  activeBuffs?: DisplayableBuffData[];
}

const scheduleBarIcons: Record<CharacterScheduleIconType, string> = {
  [CharacterScheduleIconType.HARVEST]: "assets/icons/axe_icon.png",
  [CharacterScheduleIconType.SLEEP]: "assets/icons/sleep_icon.png",
  [CharacterScheduleIconType.STUDY]: "assets/icons/book_icon.png",
  [CharacterScheduleIconType.REST]: "assets/icons/relax_icon.png",
  [CharacterScheduleIconType.BUILD]: "assets/icons/build_icon.png", 
  [CharacterScheduleIconType.NONE]: "assets/icons/idle_icon.png", 
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
  if (!data) {
    return null;
  }
  
  const currentActionIcon = performedActionIcons[data.currentPerformedAction] || "assets/icons/idle_icon.png";
  const currentHourScheduleIconType = data.scheduleIconTypes[data.currentScheduleIndex] || CharacterScheduleIconType.NONE;
  const currentScheduleDisplayIcon = scheduleBarIcons[currentHourScheduleIconType];

  if (collapsed) {
    return (
      <CollapsedStatusAndBuffsView
        scheduleText={data.currentScheduleText}
        scheduleIconPath={currentScheduleDisplayIcon}
        actionText={data.currentPerformedAction.toString()}
        actionIconPath={currentActionIcon}
        activeBuffs={data.activeBuffs}
    /> 
    );
  }

  return (
    <div className="character-panel-expanded">
      <StatusOrBuffView
        statusText={data.currentStatusText}
        currentPerformedAction={data.currentPerformedAction}
        scheduleText={data.currentScheduleText}
        scheduleIconSrc={currentScheduleDisplayIcon} 
        activeBuffs={data.activeBuffs}
      />
      <ScheduleBarView 
        scheduleIconTypes={data.scheduleIconTypes} 
        currentScheduleIndex={data.currentScheduleIndex} 
      />
    </div>
  );
};