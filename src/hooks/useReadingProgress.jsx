import { useCallback, useEffect, useRef } from "react";
import { recordReadingHistory, getBookProgressById } from "../services/historyService";

// How often (ms) we allow a sync to the server while reading
const SYNC_INTERVAL_MS = 30_000; // 30 seconds between syncs
// Minimum progress change (%) needed to trigger a sync
const SYNC_MIN_DELTA = 2;

const useReadingProgress = (userId, bookId) => {
  // maxProgressRef: the highest progress reached this session (seeded from server on mount)
  const maxProgressRef = useRef(0);
  // lastSyncRef: tracks the value and time of the most recent successful API call
  const lastSyncRef = useRef({ value: null, time: 0 });

  // Reset when the book changes
  useEffect(() => {
    maxProgressRef.current = 0;
    lastSyncRef.current = { value: null, time: 0 };
  }, [bookId, userId]);

  // Seed maxProgressRef from the server so we never go below the saved value
  useEffect(() => {
    if (!userId || bookId == null) return;
    let cancelled = false;
    getBookProgressById(bookId).then((serverProgress) => {
      if (!cancelled && typeof serverProgress === "number" && serverProgress > maxProgressRef.current) {
        maxProgressRef.current = serverProgress;
        // Also mark as "synced" at this value so we don't re-send it immediately
        lastSyncRef.current = { value: serverProgress, time: Date.now() };
      }
    });
    return () => { cancelled = true; };
  }, [userId, bookId]);

  /** Fire-and-forget write to the server */
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

  /**
   * syncProgress(progress, force?)
   */
  const syncProgress = useCallback(
    (progress, force = false) => {
      if (!userId || bookId == null) return;
      const value = Number(progress);
      if (!Number.isFinite(value)) return;
      const clamped = Math.max(0, Math.min(100, value));

      // --- Monotonic gate: only advance, never retreat ---
      if (clamped <= maxProgressRef.current && !force) return;
      maxProgressRef.current = Math.max(maxProgressRef.current, clamped);

      // --- Debounce gate: time + magnitude ---
      const now = Date.now();
      const last = lastSyncRef.current;
      const advancedBy =
        last.value === null ? clamped : clamped - last.value; // always >= 0 after monotonic gate
      const elapsed = now - (last.time ?? 0);

      if (!force && last.value !== null && advancedBy < SYNC_MIN_DELTA && elapsed < SYNC_INTERVAL_MS) {
        return;
      }

      lastSyncRef.current = { value: clamped, time: now };
      recordProgress(clamped);
    },
    [userId, bookId, recordProgress],
  );

  /**
   * computeProgress(locationIndex, totalLocations) → 0–100
   * Converts an epub location index into a percentage.
   */
  const computeProgress = useCallback((index, total) => {
    if (!Number.isFinite(index) || !Number.isFinite(total) || total <= 0) return 0;
    if (total === 1) return 100;
    return Math.max(0, Math.min(100, (index / (total - 1)) * 100));
  }, []);

  // On unmount: flush the highest reached progress so it isn't lost
  useEffect(() => {
    return () => {
      const peak = maxProgressRef.current;
      const lastSynced = lastSyncRef.current.value ?? 0;
      // Only flush if there is unsaved progress
      if (peak > lastSynced) {
        recordProgress(peak);
      }
    };
  }, [recordProgress]);

  return { syncProgress, computeProgress };
};

export default useReadingProgress;

