import React, { useEffect, useRef, useState } from "react";
import { PanelDefinition, DisplayTraitType } from "../../../game/display/setup/ViewDefinition.ts";
import { EventBus } from "../../../game/EventBus.ts";
import "./SelectionPanel.css";
import { UIEvent } from "../../../game/consts/UIEvent.ts";
import { UIConfig } from "../../../game/consts/UIConfig.ts";
import { GameEvent } from "../../../game/consts/GameEvent.ts";
import { PanelActionImplementation } from "../../../game/display/game/tools/selection/SelectionPanelModule.ts";
import { ActionButton } from "./ActionButton.tsx";
import { useSelectedTool } from "./useSelectedTool.ts";

const traitIcons: Record<DisplayTraitType, string> = {
    [DisplayTraitType.WOOD]: "assets/icons/wood_icon.png",
    [DisplayTraitType.FOOD]: "assets/icons/food_icon.png",
    [DisplayTraitType.NONE]: "",
};

type PanelData = { actionsImpl?: PanelActionImplementation[] } & PanelDefinition;

export const SelectionPanel: React.FC = () => {
    const [visiblePanel, setVisiblePanel] = useState<PanelData | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [fadeState, setFadeState] = useState<"fade-in" | "fade-out">("fade-in");
    const [isCollapsed, setIsCollapsed] = useState(false);

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handleShow = (panel: PanelData | null) => {
            if (!panel) {
                setFadeState("fade-out");
                setIsVisible(false);
                timeoutRef.current = window.setTimeout(() => {
                    setVisiblePanel(null);
                }, UIConfig.PanelTransitionMs);
                return;
            }

            if (!visiblePanel) {
                setVisiblePanel(panel);
                setFadeState("fade-in");
                setIsVisible(true);
                return;
            }

            setFadeState("fade-out");
            setIsVisible(false);
            timeoutRef.current = window.setTimeout(() => {
                setVisiblePanel(panel);
                setFadeState("fade-in");
                setIsVisible(true);
            }, UIConfig.PanelTransitionMs);
        };

        EventBus.on(UIEvent.ShowPanelCalled, handleShow);
        return () => {
            EventBus.off(UIEvent.ShowPanelCalled, handleShow);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [visiblePanel]);

    const toggleHeight = () => setIsCollapsed(prev => !prev);

    return (
        <div className={`selection-panel ${isVisible ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
            <div className={`selection-panel-content ${fadeState}`}>
                {visiblePanel && (
                    <div
                        className="selection-panel-bg"
                        style={{ backgroundImage: `url(${visiblePanel.imagePath})` }}
                    >
                        <div className="selection-panel-info" onClick={toggleHeight}>
                            {visiblePanel.traits && visiblePanel.traits.length > 0 && (
                                <div className="traits-container">
                                    {visiblePanel.traits.map((trait, idx) => (
                                        <div key={idx} className="trait">
                                            <img
                                                src={traitIcons[trait.type]}
                                                alt={`trait-${trait.type}`}
                                                className="trait-icon"
                                            />
                                            <span className="trait-value">{trait.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <h2><span className="text-bg">{visiblePanel.title}</span></h2>
                            <p><span className="text-bg">{visiblePanel.description}</span></p>
                        </div>
                        <div className="selection-panel-controls">{/* buttons */}</div>
                        <button
                            className="selection-panel-close"
                            onClick={() => {
                                EventBus.emit(GameEvent.SelectionChanged, -1);
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Always-visible action bar */}
            {visiblePanel?.actionsImpl && visiblePanel.actionsImpl.length > 0 && (
                <div className="selection-panel-actions">
                    {visiblePanel.actionsImpl.map((action, index) => (
                        <ActionButton key={index} action={action}/>
                    ))}
                </div>
            )}
        </div>
    );
};
