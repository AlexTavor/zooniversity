import React from "react";
import "./TreePanelDataView.css";

interface DropEntry {
  type: string;
  amount: number;
}

interface TreePanelData {
  drops: DropEntry[];
  cutProgress: number;
  maxCutProgress: number;
}

const dropIcons: Record<string, string> = {
  wood: "assets/icons/wood_icon.png",
  food: "assets/icons/food_icon.png"
};

export const TreePanelDataView: React.FC<{
  data: TreePanelData;
  collapsed: boolean;
}> = ({ data, collapsed }) => {
  const { drops, cutProgress, maxCutProgress } = data;
  const isCutDown = cutProgress == 0;

  if (collapsed) {
    return (
      <div className="character-panel-collapsed">
        {drops.map((drop, index) => (
          <div key={index} className="icon">
            <img
              className="icon"
              src={dropIcons[drop.type] || ""}
              alt={drop.type}
            />
            <span className="small-label">{drop.amount}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="character-panel-expanded">
      <div className="drops-info">
        {drops.map((drop, index) => (
          <div key={index} className="drop-line">
            <img className="inline-icon" src={dropIcons[drop.type] || ""} alt={drop.type} />
            <span className="label">{drop.amount}</span>
          </div>
        ))}
      </div>
      <div className="progress-line">
        <span className="label">Chop Progress:</span>
        <span className="value">
          {isCutDown ? "CUT DOWN" : `${cutProgress} / ${maxCutProgress}`}
        </span>
      </div>
    </div>
  );
};
