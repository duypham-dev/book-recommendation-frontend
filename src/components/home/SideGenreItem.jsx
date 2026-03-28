import React from "react";
import SideTitleBookCarousel from "../common/SideTitleBookCarousel";

const SideGenreItem = React.memo(({ genre, books, genreData, setGenreRef }) => (
  <div
    ref={setGenreRef(genre.id)}
    data-genre-id={genre.id}
    className="min-h-[350px]"
  >
    {books !== undefined ? (
      books.length > 0 ? (
        <SideTitleBookCarousel
          books={books}
          title={genreData?.genreName || genre.title}
          genreId={genre.id}
          className={genre.color}
        />
      ) : null
    ) : (
      <SideTitleCarouselSkeleton />
    )}
  </div>
));

const SideTitleCarouselSkeleton = () => (
  <div className="relative flex flex-col md:flex-row rounded-xl overflow-hidden mb-5 animate-pulse w-full">
    {/* Sidebar Title */}
    <div className="md:w-[22%] p-6 md:p-8 md:pr-4 flex flex-col justify-center shrink-0">
      <div className="h-8 md:h-10 bg-[#3a3f58] dark:bg-gray-700 rounded w-3/4 mb-8"></div>
      <div className="h-4 bg-[#3a3f58] dark:bg-gray-700 rounded w-1/2"></div>
    </div>
    {/* Carousel */}
    <div className="flex-1 p-4 md:p-6 md:pl-0 flex gap-4 overflow-hidden items-center pb-4 md:pb-0">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="min-w-[200px] w-[200px] flex-shrink-0 space-y-3">
          <div className="w-full aspect-[2/3] bg-[#3a3f58] dark:bg-gray-700 rounded-lg shadow-sm"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[#3a3f58] dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-[#3a3f58] dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SideGenreItem;