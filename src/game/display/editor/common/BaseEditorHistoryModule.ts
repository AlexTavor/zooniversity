import {DisplayModule} from "../../setup/DisplayModule.ts";
import {EventBus} from "../../../EventBus.ts";

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

export class HistoryContext<T> {
    constructor(public makeSnapshot:()=>T, public applySnapshot:(snapshot: T)=>void, public getDirty:()=>boolean) {}
}

export class BaseEditorHistoryModule<T> extends DisplayModule<HistoryContext<T>> {
    private editor!: HistoryContext<T>;
    private stack!: StateStack<T>;
    
    // Hack rather than a proper system for deciding when to push to the stack :(
    private awaitingDirty: boolean = false;
    
    public init(editor: HistoryContext<T>): void {
        this.editor = editor;

        this.stack = new StateStack(this.editor.makeSnapshot());

        EventBus.on(HistoryEvents.Undo, this.handleUndo);
        EventBus.on(HistoryEvents.Redo, this.handleRedo);
    }

    public update(): void {
        if (this.awaitingDirty) {
            this.awaitingDirty = false;
            return;
        }
        
        if (this.editor.getDirty()) {
            this.stack.push(this.editor.makeSnapshot());
        }
    }

    public destroy(): void {
        EventBus.off(HistoryEvents.Undo, this.handleUndo);
        EventBus.off(HistoryEvents.Redo, this.handleRedo);
    }

    private handleUndo = () => {
        const snapshot = this.stack.undo();
        this.awaitingDirty = true;
        if (snapshot) this.editor.applySnapshot(snapshot);
    };

    private handleRedo = () => {
        const snapshot = this.stack.redo();
        this.awaitingDirty = true;
        if (snapshot) this.editor.applySnapshot(snapshot);
    };
}
