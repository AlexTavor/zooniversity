import { ECS } from "../../ECS";

export interface StoryOption {
    label: string;
    nextPageId?: string;
    condition?: (ecs: ECS) => boolean;
    effect?: (ecs: ECS) => void;
    close?: boolean;
    entity?: number;
}

export interface StoryEventPage {
    id: string;
    imagePath: string;
    text: string;
    options: StoryOption[];
    entity?: number;
}

export interface StoryEventDefinition {
    id: string;
    pages: Record<string, StoryEventPage>;
    startPageId: string;
    entity?: number;
}
