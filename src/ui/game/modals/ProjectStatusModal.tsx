import React from "react";
import styled from "@emotion/styled";

interface ProjectStatusModalProps {
    onClose: () => void;
}

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
`;

const ModalContent = styled.div`
    background-color: #2c2f33;
    color: #dde;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #444;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
`;

const Title = styled.h2`
    margin: 0;
    text-align: center;
    font-weight: 500;
    border-bottom: 1px solid #444;
    padding-bottom: 12px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const SectionTitle = styled.h3`
    margin: 0;
    font-weight: 600;
    color: #ffd700;
    font-size: 1.1rem;
`;

const FeatureList = styled.ul`
    list-style-type: "✓  ";
    padding-left: 20px;
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6;

    &.upcoming {
        list-style-type: "-  ";
    }
`;

export const ProjectStatusModal: React.FC<ProjectStatusModalProps> = ({ onClose }) => {
    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <Title>Project Status</Title>
                <Section>
                    <SectionTitle>Implemented Features</SectionTitle>
                    <FeatureList>
                        <li>Core simulation engine with a modular Entity-Component-System (ECS).</li>
                        <li>Character AI driven by needs (sleep, hunger) and an editable hourly schedule.</li>
                        <li>Interactive world with selectable trees, buildings, and characters.</li>
                        <li>Systems for harvesting wood and foraging for food, including resource regeneration.</li>
                        <li>Character buffs (e.g., "Rested") and debuffs (e.g., "Tired") that affect stats.</li>
                        <li>A foundational story and event system for narrative encounters.</li>
                        <li>A day/night cycle and weather system.</li>
                    </FeatureList>
                </Section>
                <Section>
                    <SectionTitle>Upcoming Features</SectionTitle>
                    <FeatureList className="upcoming">
                        <li>Responsive UI.</li>
                        <li>Student characters with unique traits and goals.</li>
                        <li>A complete "Study" behavior loop tied to new buildings and exams.</li>
                        <li>Advanced crafting with secondary resources and player-managed workshop orders.</li>
                        <li>Player-triggered actions that consume resources to create effects.</li>
                        <li>Deeper narrative with a main story arc and more complex events.</li>
                        <li>A construction system for building on explored caves.</li>
                        <li>Saving and loading the game.</li>
                    </FeatureList>
                </Section>
            </ModalContent>
        </ModalBackdrop>
    );
};