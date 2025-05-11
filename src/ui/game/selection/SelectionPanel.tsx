import React, { useEffect, useRef, useState, useCallback } from "react";
import { EventBus } from "../../../game/EventBus.ts";
import { UIEvent } from "../../../game/consts/UIEvent.ts";
import { GameEvent } from "../../../game/consts/GameEvent.ts";
import { ActionButton } from "./ActionButton.tsx";
import { PanelType } from "../../../game/display/setup/ViewDefinition.ts";
import "./SelectionPanel.css";
import { PanelData } from "../../../game/display/game/tools/selection/SelectionPanelModule.ts";
import { CharacterPanelDataView } from "./CharacterPanelDataView.tsx";

const PanelTypeComponentMap: Partial<Record<PanelType, React.FC<{ data: any; collapsed: boolean }>>> = {
    [PanelType.CHARACTER]: CharacterPanelDataView
};

export const SelectionPanel: React.FC = () => {
  const [visiblePanel, setVisiblePanel] = useState<PanelData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeState, setFadeState] = useState<"fade-in" | "fade-out">("fade-in");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const handleTransitionEnd = () => {
      if (!isVisible) setVisiblePanel(null);
    };

    el.addEventListener("transitionend", handleTransitionEnd);
    return () => el.removeEventListener("transitionend", handleTransitionEnd);
  }, [isVisible]);

  useEffect(() => {
    const handleShow = (panel: PanelData | null) => {
      if (!panel) {
        setFadeState("fade-out");
        setIsVisible(false);
        return;
      }

      if (!isVisible) {
        setVisiblePanel(panel);
        setFadeState("fade-in");
        setIsVisible(true);
        return;
      }

      setFadeState("fade-out");
      setIsVisible(false);
      requestAnimationFrame(() => {
        setVisiblePanel(panel);
        setFadeState("fade-in");
        setIsVisible(true);
      });
    };

    EventBus.on(UIEvent.ShowPanelCalled, handleShow);
    return () => {
      EventBus.off(UIEvent.ShowPanelCalled, handleShow);
    };
  }, [isVisible]);

  const toggleHeight = useCallback(() => setIsCollapsed(prev => !prev), []);
  const InternalComponent = visiblePanel && PanelTypeComponentMap[visiblePanel.panelType];
  const shouldShowActions = visiblePanel?.actionsImpl?.length;

  return (
    <div className={`selection-panel ${isVisible ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
      <div ref={panelRef} className={`selection-panel-content ${fadeState}`}>
        {visiblePanel && (
          <div className="selection-panel-bg" style={{ backgroundImage: `url(${visiblePanel.imagePath})` }}>
            <div className="selection-panel-header" onClick={toggleHeight}>
              <h2><span className="text-bg">{visiblePanel.title}</span></h2>
              <p><span className="text-bg">{visiblePanel.description}</span></p>
            </div>

            <div className="selection-panel-body">
              {InternalComponent && !!visiblePanel.panelTypeData && (
                <InternalComponent data={visiblePanel.panelTypeData} collapsed={isCollapsed} />
              )}
            </div>
            <button
              className="selection-panel-close"
              onClick={() => EventBus.emit(GameEvent.SelectionChanged, -1)}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {shouldShowActions && (
        <div className="selection-panel-actions">
          {visiblePanel!.actionsImpl!.map((action, index) => (
            <ActionButton key={index} action={action} />
          ))}
        </div>
      )}
    </div>
  );
};
