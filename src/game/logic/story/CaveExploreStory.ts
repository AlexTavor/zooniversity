import { StoryEventDefinition } from "./StoryEventTypes";
import { ECS } from "../../ECS";

export const CaveExploreStory: StoryEventDefinition = {
    id: "cave_explore",
    startPageId: "intro",

    pages: {
        intro: {
            id: "intro",
            imagePath: "assets/story/cave_intro.png",
            text: `You stand before a mossy cave entrance. A faint rustle echoes from within, followed by a soft squeak. 
Could someone—or something—be inside? The breeze carries the scent of damp earth and mushrooms.`,
            options: [
                { label: "Leave quietly", close: true },
                { label: "Sneak in", nextPageId: "sneak" },
                { label: "Call softly into the cave", nextPageId: "call" },
            ],
        },

        sneak: {
            id: "sneak",
            imagePath: "assets/story/cave_sneak.png",
            text: `You tiptoe into the dimness, careful not to disturb the moss underfoot. Suddenly, you hear a tiny sneeze.`,
            options: [
                {
                    label: "Peek around the rock",
                    nextPageId: "reveal_sproutling",
                },
                {
                    label: "Back away politely",
                    close: true,
                },
            ],
        },

        call: {
            id: "call",
            imagePath: "assets/story/cave_call.png",
            text: `"Hello?" you whisper. A soft *"honk!"* replies. Something waddles closer.`,
            options: [
                {
                    label: "Stand your ground",
                    nextPageId: "reveal_sproutling",
                },
                {
                    label: "Hide and watch",
                    nextPageId: "reveal_sproutling",
                },
            ],
        },

        reveal_sproutling: {
            id: "reveal_sproutling",
            imagePath: "assets/story/sproutling_reveal.png",
            text: `A tiny Sproutling emerges! Its leafy head shakes from side to side, trying to appear intimidating—but it stumbles on a root and tumbles forward in a squeaky puff.`,
            options: [
                {
                    label: "Help it up",
                    nextPageId: "friend",
                },
                {
                    label: "Offer it a snack",
                    nextPageId: "friend",
                },
            ],
        },

        friend: {
            id: "friend",
            imagePath: "assets/story/sproutling_friend.png",
            text: `The Sproutling beams! It flutters its leafy arms and gives you a shiny acorn as thanks. You’re now friends.`,
            options: [
                {
                    label: "Wave goodbye",
                    close: true,
                    effect: (_ecs: ECS) => {
                        console.log("Friendship with sproutling recorded.");
                        // Example: Add friendship component, flag, or item
                    },
                },
            ],
        },
    },
};
