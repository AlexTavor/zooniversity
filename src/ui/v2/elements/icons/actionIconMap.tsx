import { CharacterAction } from '../../../../game/logic/intent/intent-to-action/actionIntentData';

export const actionIconMap: Partial<Record<CharacterAction, string>> = {
    [CharacterAction.IDLE]: 'assets/icons/idle_icon.png',
    [CharacterAction.WALKING]: 'assets/icons/walk_icon.png',
    [CharacterAction.CHOPPING]: 'assets/icons/axe_icon.png',
    [CharacterAction.SLEEPING]: 'assets/icons/sleep_icon.png',
    [CharacterAction.RELAXING]: 'assets/icons/relax_icon.png',
    [CharacterAction.STUDYING]: 'assets/icons/book_icon.png',
    [CharacterAction.BUILDING]: 'assets/icons/build_icon.png',
    [CharacterAction.STROLLING]: 'assets/icons/relax_icon.png',
    [CharacterAction.EATING]: 'assets/icons/eat_icon.png',
};
