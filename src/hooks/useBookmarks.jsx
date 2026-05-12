import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from "../services/bookmarkService.js";

const BOOKMARKS_LIMIT = 100;

function mapBookmarkFromApi(bookmark) {
  const trimmedNote = bookmark?.note?.trim() ?? "";
  return {
    id: bookmark.id,
    cfi: bookmark.locationInBook,
    note:
      trimmedNote ||
      (bookmark.pageNumber ? `Trang ${bookmark.pageNumber}` : "Dấu trang"),
    pageNumber: bookmark.pageNumber ?? null,
    createdAt: bookmark.createdAt ?? null,
  };
}

const useBookmarks = (userId, bookId) => {
  const queryClient = useQueryClient();
  const enabled = !!userId && bookId != null;
  const queryKey = ["bookmarks", userId, bookId];

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await fetchBookmarks(bookId);
      return Array.isArray(data) ? data.map(mapBookmarkFromApi) : [];
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createBookmark(bookId, payload),
    onSuccess: (created) => {
      const mapped = mapBookmarkFromApi(created);
      queryClient.setQueryData(queryKey, (prev = []) =>
        [mapped, ...prev].slice(0, BOOKMARKS_LIMIT),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ bookmarkId, payload }) =>
      updateBookmark(bookmarkId, payload),
    onSuccess: (updated) => {
      const mapped = mapBookmarkFromApi(updated);
      queryClient.setQueryData(queryKey, (prev = []) =>
        prev.map((b) => (b.id === mapped.id ? mapped : b)),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bookmarkId) => deleteBookmark(bookmarkId),
    onMutate: async (bookmarkId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (prev = []) =>
        prev.filter((b) => b.id !== bookmarkId),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
  });

  const toggleBookmark = useCallback(
    (currentCfi, { chapterTitle, page }) => {
      if (!currentCfi || !enabled) return;

      const existing = bookmarks.find((b) => b.cfi === currentCfi);
      if (existing) {
        deleteMutation.mutate(existing.id);
      } else {
        createMutation.mutate({
          pageNumber: Number.isFinite(page) ? page : null,
          locationInBook: currentCfi,
          note:
            chapterTitle ||
            (Number.isFinite(page) ? `Trang ${page}` : "Dấu trang"),
        });
      }
    },
    [bookmarks, enabled, createMutation, deleteMutation],
  );

  const renameBookmark = useCallback(
    (id, newText) => {
      const target = bookmarks.find((b) => b.id === id);
      if (!target || !enabled) return;
      const trimmed = newText?.trim();
      const fallbackNote =
        target.note ||
        (target.pageNumber ? `Trang ${target.pageNumber}` : "Dấu trang");
      updateMutation.mutate({
        bookmarkId: id,
        payload: { note: trimmed || fallbackNote },
      });
    },
    [bookmarks, enabled, updateMutation],
  );

  const removeBookmark = useCallback(
    (id) => {
      if (!enabled) return;
      deleteMutation.mutate(id);
    },
    [enabled, deleteMutation],
  );

  const isBookmarked = useCallback(
    (cfi) => !!cfi && bookmarks.some((b) => b.cfi === cfi),
    [bookmarks],
  );

  const isMutating = useMemo(
    () =>
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    [createMutation.isPending, updateMutation.isPending, deleteMutation.isPending],
  );

  return {
    bookmarks,
    isLoading,
    isMutating,
    toggleBookmark,
    renameBookmark,
    removeBookmark,
    isBookmarked,
  };
};

export default useBookmarks;
