import { useCallback, useEffect, useRef, useState } from "react";

const UNDO_WINDOW_SECONDS = 10;

export function useUndoWindow() {
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimeLeft, setUndoTimeLeft] = useState(UNDO_WINDOW_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearUndoTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismissUndo = useCallback(() => {
    clearUndoTimer();
    setShowUndo(false);
  }, [clearUndoTimer]);

  const startUndoCountdown = useCallback(() => {
    clearUndoTimer();
    setUndoTimeLeft(UNDO_WINDOW_SECONDS);
    setShowUndo(true);

    timerRef.current = setInterval(() => {
      setUndoTimeLeft((prev) => {
        if (prev <= 1) {
          clearUndoTimer();
          setShowUndo(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearUndoTimer]);

  useEffect(() => () => clearUndoTimer(), [clearUndoTimer]);

  return {
    showUndo,
    undoTimeLeft,
    startUndoCountdown,
    dismissUndo,
  };
}
