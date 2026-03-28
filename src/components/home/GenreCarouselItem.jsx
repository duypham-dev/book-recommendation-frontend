import React from "react";
import BookCarousel from "../common/BookCarousel";

const GenreCarouselItem = React.memo(({ genre, books, setGenreRef }) => (
  <div
    ref={setGenreRef(genre.id)}
    data-genre-id={genre.id}
    className="min-h-[350px]"
  >
    {books !== undefined ? (
      books.length > 0 ? (
        <BookCarousel
          books={books}
          title={genre.title}
          genreId={genre.id}
          genreName={genre.name}
          subtitle={true}
        />
      ) : (
        <div className="py-8 text-center h-[350px] flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">
            Không có sách thể loại {genre.name}
          </p>
        </div>
      )
    ) : (
      <CarouselSkeleton hasSubtitle={true} />
    )}
  </div>
));


// Skeleton Components for Lazy Loading (Tối ưu CLS)
const CarouselSkeleton = ({ hasSubtitle = true }) => (
  <div className="mb-12 animate-pulse w-full">
    {/* Header Skeleton */}
    <div className="flex justify-between items-end mb-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        {hasSubtitle && <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>}
      </div>
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded hidden sm:block"></div>
    </div>
    {/* Cards Skeleton */}
    <div className="flex gap-6 overflow-hidden p-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="min-w-[180px] w-[180px] flex-shrink-0 space-y-3">
          <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GenreCarouselItem;