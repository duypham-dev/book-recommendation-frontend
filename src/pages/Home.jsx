import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Hero from "../components/home/Hero";
import BookCarousel from "../components/common/BookCarousel";
import ScrollToTop from "../components/common/ScrollToTop";

import TopBooksShowcase, {
  TopBooksSkeleton,
} from "../components/home/TopBooksShowcase";
import GenreShowcase from "../components/home/GenreShowcase";
import SideGenreItem from "../components/home/SideGenreItem";
import GenreCarouselItem from "../components/home/GenreCarouselItem";
import RecommendedShowcase from "../components/home/RecommendedShowcase";

// Layout
import MainLayout from "../layouts/MainLayout";

// Hooks
import useGenreMap from "../hooks/useGenreMap";
import useTopBooks from "../hooks/useTopBooks";
import useLazyLoadGenres from "../hooks/useLazyLoadGenres";
import useRecommendedBooks from "../hooks/useRecommendedBooks";

// Constants
import {
  MAIN_GENRE_CONFIG,
  SIDE_GENRE_CONFIG,
  TOP_BOOKS_SIZE,
} from "../constants/homeGenres";

const Home = () => {
  const navigate = useNavigate();
  // Get genres with O(1) lookup map
  const { genreMap } = useGenreMap();
  
  // Load top books
  const {
    topBooks,
    loading: topBooksLoading,
    error,
  } = useTopBooks(TOP_BOOKS_SIZE);

  // Load recommended books
  const {
    recommendedBooks,
    loading: recommendationsLoading,
    error: recommendationsError
  } = useRecommendedBooks(15);

  // Lazy load genre books with Intersection Observer
  const { genreBooks, setGenreRef } = useLazyLoadGenres();

  const handleSearchSubmit = useCallback(
    (keyword) => {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword) {
        navigate(`/search?keyword=${encodeURIComponent(trimmedKeyword)}`);
      }
    },
    [navigate],
  );

  return (
    <MainLayout
      showHero={true}
      heroContent={<Hero />}
      onSearchSubmit={handleSearchSubmit}
    >
      <main className="mt-8 px-4 sm:px-6 lg:px-8 space-y-8 min-h-[calc(100vh-400px)]">
        {/* Genre Showcase - User Interests */}
        <GenreShowcase />

        {/* Recommended Books Section */}
        {!recommendationsError && !recommendationsLoading && recommendedBooks.length > 0 && (
          <RecommendedShowcase books={recommendedBooks} />
        )}

        {!error && topBooksLoading && <TopBooksSkeleton />}

        {!error && !topBooksLoading && topBooks.length > 0 && (
          <TopBooksShowcase
            books={topBooks}
            title="Top sách được đọc nhiều nhất"
          />
        )}

        {/* Side Title Genres Categories */}
        <div className="bg-gradient-to-b from-white to-background dark:bg-gradient-to-b dark:from-[#282B39] dark:to-gray-900 rounded-xl flex flex-col gap-2">
          {SIDE_GENRE_CONFIG.map((genre) => (
            <SideGenreItem
              key={genre.id}
              genre={genre}
              books={genreBooks[genre.id]}
              genreData={genreMap.get(genre.id)}
              setGenreRef={setGenreRef}
            />
          ))}
        </div>

        {/* Genre Carousels - Lazy Loaded */}
        {MAIN_GENRE_CONFIG.map((genre) => (
          <GenreCarouselItem
            key={genre.id}
            genre={genre}
            books={genreBooks[genre.id]}
            setGenreRef={setGenreRef}
          />
        ))}
      </main>
    </MainLayout>
  );
};

export default React.memo(Home);
