import React from "react";

// Components
import Hero from "../components/home/Hero";
import RecentlyUploadedShowcase from "../components/home/RecentlyUploadedShowcase";

import TopBooksShowcase, {
  TopBooksSkeleton,
} from "../components/home/TopBooksShowcase";
import GenreShowcase from "../components/home/GenreShowcase";
import SideGenreItem from "../components/home/SideGenreItem";
import GenreCarouselItem from "../components/home/GenreCarouselItem";
import RecommendedShowcase, { RecommendedSkeleton } from "../components/home/RecommendedShowcase";

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
  } = useRecommendedBooks(10);

  // Lazy load genre books with Intersection Observer
  const { genreBooks, setGenreRef } = useLazyLoadGenres();

  return (
    <MainLayout
      showHero={true}
      heroContent={<Hero />}
    >
      <main className="mt-8 px-4 sm:px-6 lg:px-8 space-y-8 min-h-[calc(100vh-400px)]">


        {/* Genre Showcase - User Interests */}
        <GenreShowcase />

        {!error && topBooksLoading && <TopBooksSkeleton />}

        {!error && !topBooksLoading && topBooks.length > 0 && (
          <TopBooksShowcase
            books={topBooks}
            title="Top sách được đọc nhiều nhất"
          />
        )}
        {/* Recommended Books Section */}
        {!error && recommendationsLoading && <RecommendedSkeleton />}
        {!recommendationsError && !recommendationsLoading && recommendedBooks.length > 0 && (
          <RecommendedShowcase books={recommendedBooks} />
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
        {/* Recently Uploaded Books Section */}
        <RecentlyUploadedShowcase />
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
