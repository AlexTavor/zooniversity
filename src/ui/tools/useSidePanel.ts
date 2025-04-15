import { useSyncExternalStore } from 'react';
import React from 'react';

type PanelSnapshot = {
    open: boolean;
    title: string;
    content: React.ReactNode;
};

let isOpen = false;
let panelContent: React.ReactNode = null;
let panelTitle = '';
const listeners = new Set<() => void>();

let cachedSnapshot: PanelSnapshot = {
    open: isOpen,
    title: panelTitle,
    content: panelContent,
};

function updateSnapshot() {
    cachedSnapshot = {
        open: isOpen,
        title: panelTitle,
        content: panelContent,
    };
}

function notify() {
    updateSnapshot();
    listeners.forEach(fn => fn());
}

export function openPanel(title: string, content: React.ReactNode) {
    isOpen = true;
    panelTitle = title;
    panelContent = content;
    notify();
}

export function closePanel() {
    isOpen = false;
    notify();
}

export function togglePanel() {
    isOpen = !isOpen;
    notify();
}

export function useSidePanel(): PanelSnapshot & { toggle: () => void } {
    useSyncExternalStore(
        (cb) => {
            listeners.add(cb);
            return () => listeners.delete(cb);
        },
        () => cachedSnapshot
    );

    return {
        ...cachedSnapshot,
        toggle: togglePanel
    };
}
