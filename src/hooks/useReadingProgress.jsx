import { useCallback, useEffect, useRef } from "react";
import { recordReadingHistory } from "../services/historyService";

const DEBOUNCE_TIME_MS = 15_000;
const DEBOUNCE_DELTA = 3;

const useReadingProgress = (userId, bookId) => {
  const lastSyncRef = useRef({ value: null, time: 0 });

  useEffect(() => {
    lastSyncRef.current = { value: null, time: 0 };
  }, [bookId, userId]);

  const recordProgress = useCallback(
    async (progress) => {
      if (!userId || bookId == null) return;
      const value = Number(progress);
      if (!Number.isFinite(value)) return;
      const clamped = Math.max(0, Math.min(100, value));
      try {
        await recordReadingHistory(userId, bookId, { progress: clamped });
      } catch {
        // Non-critical — reading continues regardless
      }
    },
    [userId, bookId],
  );

  const syncProgress = useCallback(
    (progress, force = false) => {
      if (!userId || bookId == null) return;
      const value = Number(progress);
      if (!Number.isFinite(value)) return;
      const clamped = Math.max(0, Math.min(100, value));

      const now = Date.now();
      const last = lastSyncRef.current;
      const delta =
        last.value === null ? clamped : Math.abs(clamped - last.value);
      const elapsed = now - (last.time ?? 0);

      if (!force && last.value !== null && delta < DEBOUNCE_DELTA && elapsed < DEBOUNCE_TIME_MS) {
        return;
      }

      lastSyncRef.current = { value: clamped, time: now };
      recordProgress(clamped);
    },
    [userId, bookId, recordProgress],
  );

  const computeProgress = useCallback((index, total) => {
    if (!Number.isFinite(index) || !Number.isFinite(total) || total <= 0) return 0;
    if (total === 1) return 100;
    return Math.max(0, Math.min(100, (index / (total - 1)) * 100));
  }, []);

  useEffect(() => {
    return () => {
      const lastValue = lastSyncRef.current.value;
      if (lastValue != null) recordProgress(lastValue);
    };
  }, [recordProgress]);

  return { syncProgress, computeProgress };
};

export default useReadingProgress;
