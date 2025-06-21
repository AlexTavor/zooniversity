import { Component, Entity } from "../../../ECS";

/**
 * Stores the entity ID of a character's assigned "home" base.
 * This could be a dormitory, a work building like a WoodDojo, or another central point
 * used as a reference for behaviors like strolling or context-based task targeting.
 */
export class HomeComponent extends Component {
    /**
     * @param homeEntityId The entity ID of the character's assigned home structure.å
     */
    constructor(public homeEntityId: Entity) {
        super();
    }
}
