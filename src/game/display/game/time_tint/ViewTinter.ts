import {View} from "../../setup/View.ts";
import {getColorForMinute, SPRITE_TINT_GRADIENT} from "./getColorForMinute.ts";


export class ViewTinter {
    private views = new Set<View>();

    add(view: View): void {
        this.views.add(view);
    }

    remove(view: View): void {
        this.views.delete(view);
    }

    clear(): void {
        this.views.clear();
    }

    update(minute: number, totalMinutesInDay: number): void {
        const color = getColorForMinute(minute, totalMinutesInDay, SPRITE_TINT_GRADIENT);

        for (const view of this.views) {
            view.getSprite()?.setTint(color);
        }
    }
}