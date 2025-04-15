//@ts-ignore
import React from 'react';
import { useSidePanel } from './useSidePanel';

export function SidePanelHost() {
    const { content, title, open, toggle } = useSidePanel();

    if (!open || !content) return null;

    return (
        <div className="side-panel">
            <div className="side-panel-header" onClick={toggle}>
                <span>{title}</span>
                <span className="toggle">−</span>
            </div>
            <div className="side-panel-content">{content}</div>
        </div>
    );
}
