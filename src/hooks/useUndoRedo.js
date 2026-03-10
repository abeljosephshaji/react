import { useState, useCallback } from 'react';

/**
 * Custom hook to manage undo/redo history state
 * @param {any} initialPresent - Initial state
 * @returns {object} - { state, set, undo, redo, canUndo, canRedo }
 */
export function useUndoRedo(initialPresent) {
    const [state, setState] = useState({
        past: [],
        present: initialPresent,
        future: [],
    });

    const canUndo = state.past.length !== 0;
    const canRedo = state.future.length !== 0;

    // Undo operation
    const undo = useCallback(() => {
        setState((currentState) => {
            if (currentState.past.length === 0) return currentState;

            const previous = currentState.past[currentState.past.length - 1];
            const newPast = currentState.past.slice(0, currentState.past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [currentState.present, ...currentState.future],
            };
        });
    }, []);

    // Redo operation
    const redo = useCallback(() => {
        setState((currentState) => {
            if (currentState.future.length === 0) return currentState;

            const next = currentState.future[0];
            const newFuture = currentState.future.slice(1);

            return {
                past: [...currentState.past, currentState.present],
                present: next,
                future: newFuture,
            };
        });
    }, []);

    // Set new state
    const set = useCallback((newPresent) => {
        setState((currentState) => {
            const nextPresent = typeof newPresent === 'function' ? newPresent(currentState.present) : newPresent;
            if (nextPresent === currentState.present) {
                return currentState;
            }
            return {
                past: [...currentState.past, currentState.present],
                present: nextPresent,
                future: [],
            };
        });
    }, []);

    const reset = useCallback((newPresent) => {
        setState({
            past: [],
            present: newPresent,
            future: [],
        });
    }, []);

    return {
        state: state.present,
        set,
        undo,
        redo,
        canUndo,
        canRedo,
        reset,
    };
}
