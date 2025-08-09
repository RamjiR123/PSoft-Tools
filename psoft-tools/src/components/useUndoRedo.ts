import { useCallback, useEffect, useState } from 'react';
import { Edge, Node, useReactFlow } from '@xyflow/react';

type UseUndoRedoOptions = {
  maxHistorySize: number;
  enableShortcuts: boolean;
};

type UseUndoRedo = (options?: UseUndoRedoOptions) => {
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

type HistoryItem = {
  nodes: Node[];
  edges: Edge[];
};

const defaultOptions: UseUndoRedoOptions = {
  maxHistorySize: 100,
  enableShortcuts: true,
};

// helper to shallow-clone node/edge state so that snapshots are not mutated
const clone = (nodes: Node[], edges: Edge[]): HistoryItem => ({
  nodes: nodes.map((n) => ({ ...n, data: n.data ? { ...n.data } : n.data })),
  edges: edges.map((e) => ({ ...e, data: e.data ? { ...e.data } : e.data })),
});

// https://redux.js.org/usage/implementing-undo-history
export const useUndoRedo: UseUndoRedo = ({
  maxHistorySize = defaultOptions.maxHistorySize,
  enableShortcuts = defaultOptions.enableShortcuts,
} = defaultOptions) => {
  // the past and future arrays store the states that we can jump to
  const [past, setPast] = useState<HistoryItem[]>([]);
  const [future, setFuture] = useState<HistoryItem[]>([]);
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const takeSnapshot = useCallback(() => {
    // push the current graph to the past state
    setPast((p) => [
      ...p.slice(p.length - maxHistorySize + 1, p.length),
      clone(getNodes(), getEdges()),
    ]);
    // whenever we take a new snapshot, the redo operations need to be cleared to avoid state mismatches
    setFuture([]);
  }, [getNodes, getEdges, maxHistorySize]);

  const undo = useCallback(() => {
    // get the last state that we want to go back to
    const pastState = past[past.length - 1];
    if (pastState) {
      // first we remove the state from the history
      setPast((p) => p.slice(0, p.length - 1));
      // we store the current graph for the redo operation
      setFuture((f) => [...f, clone(getNodes(), getEdges())]);
      // now we can set the graph to the past state
      setNodes(pastState.nodes);
      setEdges(pastState.edges);
    }
  }, [setNodes, setEdges, getNodes, getEdges, past]);

  const redo = useCallback(() => {
    // get the next state we want to go forward to
    const futureState = future[future.length - 1];
    if (futureState) {
      // remove the state from future
      setFuture((f) => f.slice(0, f.length - 1));
      // store the current state in past for undo later
      setPast((p) => [...p, clone(getNodes(), getEdges())]);
      // set the graph to the future state
      setNodes(futureState.nodes);
      setEdges(futureState.edges);
    }
  }, [setNodes, setEdges, getNodes, getEdges, future]);

  useEffect(() => {
    // this effect is used to attach the global event handlers
    if (!enableShortcuts) {
      return;
    }
    const keyDownHandler = (event: KeyboardEvent) => {
      if (
        event.key === 'z' &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        redo();
      } else if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
        undo();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [undo, redo, enableShortcuts]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
};

export default useUndoRedo;