import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { getBooksByGenre } from "../services/manageBookService";
import { useQueries } from "@tanstack/react-query";
const DEFAULT_PAGE_SIZE = 12;

/**
 * Custom hook for lazy loading genre books using Intersection Observer
 *
 * @param {Array<number>} genreIds - Array of genre IDs to lazy load
 * @param {Object} options - Configuration options
 * @param {number} options.pageSize - Books per genre (default: 12)
 * @param {string} options.rootMargin - Intersection Observer root margin (default: "100px")
 * @param {number} options.threshold - Intersection Observer threshold (default: 0.1)
 * @param {boolean} options.enabled - Enable lazy loading (default: true)
 *
 * @returns {Object} - { genreBooks, genreLoaded, setGenreRef, loadGenreBooks }
 *
 */
const useLazyLoadGenres = ({
  pageSize = DEFAULT_PAGE_SIZE,
  rootMargin = "100px",
  threshold = 0.1,
  enabled = true,
} = {}) => {
  const [intersectedGenres, setIntersectedGenres] = useState([]);
  const genreRefs = useRef({});
  const observerRef = useRef(null);
  
  // ✅ Dùng ref cho enabled để không trigger lại effect
  const enabledRef = useRef(enabled);
  useLayoutEffect(() => {
    enabledRef.current = enabled;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!enabledRef.current) return;

        const newGenreIds = [];
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const genreId = Number(entry.target.dataset.genreId);
          if (!genreId) return;
          newGenreIds.push(genreId);
        });

        if (newGenreIds.length === 0) return;

        setIntersectedGenres((prev) => {
          const filtered = newGenreIds.filter((id) => !prev.includes(id));
          return filtered.length > 0 ? [...prev, ...filtered] : prev;
        });
      },
      { root: null, rootMargin, threshold }
    );

    observerRef.current = observer;
    Object.values(genreRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [rootMargin, threshold]); 

  const setGenreRef = useCallback(
    (genreId) => (el) => {
      if (genreRefs.current[genreId] === el) return;
      genreRefs.current[genreId] = el;
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    },
    []
  );

  const genreQueries = useQueries({
    queries: intersectedGenres.map((genreId) => ({
      queryKey: ["genreBooks", genreId],
      queryFn: () => getBooksByGenre(genreId, { page: 0, size: pageSize }),
      staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
      gcTime: 10 * 60 * 1000,
    })),
    // Combine results into genreBooks and genreLoaded maps
    combine: useCallback((results) => {
      const booksMap = {};
      const loadedMap = {};
      intersectedGenres.forEach((genreId, index) => {
        const query = results[index];
        booksMap[genreId] = query?.isPending
          ? undefined
          : Array.isArray(query?.data?.content)
            ? query.data.content
            : [];
        loadedMap[genreId] = query?.isSuccess || query?.isError || false;
      });
      return { genreBooks: booksMap, genreLoaded: loadedMap };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intersectedGenres]), // ✅ combine nhận intersectedGenres qua closure
  });

  return {
    genreBooks: genreQueries.genreBooks,
    genreLoaded: genreQueries.genreLoaded,
    setGenreRef,
  };
};

export default useLazyLoadGenres;
