import {ViewDefinition} from "../../../setup/ViewDefinition.ts";
import {DisplayModule} from "../../../setup/DisplayModule.ts";
import {ViewsEditorModule} from "../../ViewsEditorModule.ts";
import {EventBus} from "../../../../EventBus.ts"; 

export type Snapshot = {
    viewMap: Record<number, ViewDefinition>;
    activeViewId: number | null;
};

enum HistoryEvents {
    Undo = 'editor-undo',
    Redo = 'editor-redo',
}

class StateStack<T> {
    private undoStack: T[] = [];
    private redoStack: T[] = [];

    constructor(initial: T) {
        this.undoStack.push(this.clone(initial));
    }

    private clone(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    get current(): T {
        return this.undoStack[this.undoStack.length - 1];
    }

    push(state: T): void {
        this.undoStack.push(this.clone(state));
        this.redoStack = [];
    }

    undo(): T | null {
        if (this.undoStack.length > 1) {
            const popped = this.undoStack.pop();
            if (popped) this.redoStack.push(popped);
        }
        return this.current;
    }

    redo(): T | null {
        if (this.redoStack.length > 0) {
            const restored = this.redoStack.pop();
            if (restored) this.undoStack.push(restored);
        }
        return this.current;
    }

    clear(): void {
        const base = this.current;
        this.undoStack = [base];
        this.redoStack = [];
    }
}

export class EditorHistoryModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private stack!: StateStack<Snapshot>;
    
    // Hack rather than a proper system for deciding when to push to the stack :(
    private awaitingDirty: boolean = false;
    
    public init(editor: ViewsEditorModule): void {
        this.editor = editor;

        this.stack = new StateStack(this.makeSnapshot());

        EventBus.on(HistoryEvents.Undo, this.handleUndo);
        EventBus.on(HistoryEvents.Redo, this.handleRedo);
    }

    public update(): void {
        if (this.awaitingDirty) {
            this.awaitingDirty = false;
            return;
        }
        
        if (this.editor.dirty) {
            this.stack.push(this.makeSnapshot());
        }
    }

    public destroy(): void {
        EventBus.off(HistoryEvents.Undo, this.handleUndo);
        EventBus.off(HistoryEvents.Redo, this.handleRedo);
    }

    private handleUndo = () => {
        const snapshot = this.stack.undo();
        if (snapshot) this.applySnapshot(snapshot);
    };

    private handleRedo = () => {
        const snapshot = this.stack.redo();
        if (snapshot) this.applySnapshot(snapshot);
    };

    private makeSnapshot(): Snapshot {
        return {
            viewMap: JSON.parse(JSON.stringify(this.editor.viewMap)),
            activeViewId: this.editor.activeViewId,
        };
    }

    private applySnapshot(snapshot: Snapshot): void {
        this.editor.state.applySnapshot(snapshot);
        this.awaitingDirty = true;
        this.editor.requestSync();
    }
}
