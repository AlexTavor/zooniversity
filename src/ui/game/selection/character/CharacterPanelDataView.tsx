import { CharacterScheduleIconType } from "../../../../game/display/game/data_panel/character/characterPanelReducer";
import { CharacterAction } from "../../../../game/logic/action-intent/actionIntentData";
import { DisplayableBuffData, BuffView } from "../../buffs/BuffView";

interface CharacterPanelUIData {
  currentStatusText: string;
  currentPerformedAction: CharacterAction;
  currentScheduleIndex: number;
  currentScheduleText: string; 
  scheduleIconTypes: CharacterScheduleIconType[];
  activeBuffs?: DisplayableBuffData[]; // Optional, in case reducer doesn't provide it yet
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
      <div className="character-panel-collapsed">
        <img className="icon" src={currentScheduleDisplayIcon} alt={data.currentScheduleText} title={`Scheduled: ${data.currentScheduleText}`} />
        <img className="icon" src={currentActionIcon} alt={data.currentPerformedAction.toString()} title={`Action: ${data.currentPerformedAction}`} />
        {data.activeBuffs && data.activeBuffs.length > 0 && (
          <div className="icon buff-summary-collapsed" title={`${data.activeBuffs.length} active effect(s)`}>
            <img src={data.activeBuffs[0].iconAssetKey || "assets/icons/default_buff_icon.png"} alt="Buffs" />
            {data.activeBuffs.length > 1 ? <span>+{data.activeBuffs.length -1}</span> : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="character-panel-expanded">
      <div className="info-block">
        <p className="text-bg info-line" title={data.currentPerformedAction.toString()}>
          Status: {data.currentStatusText} 
           <img className="inline-icon" src={currentActionIcon} alt={data.currentPerformedAction.toString()} />
        </p>
        <p className="text-bg info-line">
          Schedule: {data.currentScheduleText}
          <img className="inline-icon" src={currentScheduleDisplayIcon} alt={data.currentScheduleText} />
        </p>
      </div>

      {data.activeBuffs && data.activeBuffs.length > 0 && (
        <div className="buffs-display-section">
          {/* You might want a label like "Active Effects:" here */}
          <div className="buffs-display-bar">
            {data.activeBuffs.map((buffData) => (
              <BuffView key={buffData.key} data={buffData} />
            ))}
          </div>
        </div>
      )}

      <div className="schedule-bar-wrapper">
        <div className="schedule-bar">
          {data.scheduleIconTypes.map((iconType, index) => {
            const scheduleIcon = scheduleBarIcons[iconType] || "assets/icons/idle_icon.png";
            const scheduleEntryText = (Object.keys(CharacterScheduleIconType) as Array<keyof typeof CharacterScheduleIconType>)
                .find(key => CharacterScheduleIconType[key] === iconType) || "Task";
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