import React from 'react';
import styled from '@emotion/styled';
import { divideTime } from '../../../hooks/useGameTime';

export interface CharacterThoughtsData {
  currentStatusText: string;
  thoughtsLog?: { timestamp: number; value: string }[];
}

interface CharacterThoughtsContentProps {
  data: CharacterThoughtsData;
}

const ThoughtsContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
`;

const CurrentStatusText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #c0c0c0;
  font-style: italic;
`;

const ThoughtsLogWrapper = styled.div`
  flex-grow: 1;
  min-height: 50px;
  border: 1px solid #2a2c2e;
  border-radius: 4px;
  padding: 8px;
  overflow-y: auto;
  background-color: rgba(0,0,0,0.1);

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.15); border-radius: 3px; }
  &::-webkit-scrollbar-track { background-color: transparent; }
`;

const NoThoughtsMessage = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  text-align: center;
  padding-top: 10px;
`;

export const CharacterThoughtsContent: React.FC<CharacterThoughtsContentProps> = ({ data }) => {
  const { currentStatusText, thoughtsLog } = data;

  return (
    <ThoughtsContentWrapper>
      <CurrentStatusText>{currentStatusText}</CurrentStatusText>
      <ThoughtsLogWrapper>
        {(!thoughtsLog || thoughtsLog.length === 0) ? (
          <NoThoughtsMessage>No recent thoughts.</NoThoughtsMessage>
        ) : (
          thoughtsLog.map((thought, index) => {
            const t = divideTime(thought.timestamp);
            return <div key={index}>
                {`${t.minute}|${t.day}|${t.hour}|${t.minute}`}: {thought.value}
            </div>
            }
          )
        )}
      </ThoughtsLogWrapper>
    </ThoughtsContentWrapper>
  );
};