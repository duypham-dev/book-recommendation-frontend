import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllGenres } from "../../services/genreService";

const gradients = [
  "from-indigo-500 to-purple-500",
  "from-teal-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-blue-500 to-indigo-500",
  "from-yellow-600 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500"
];

const GenreShowcase = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        // Assuming data is an array of genres
        if (Array.isArray(data)) {
          setGenres(data);
        } else if (data && data.content) {
          setGenres(data.content);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreClick = (genre) => {
    navigate(`/category/${genre.genreId}?name=${encodeURIComponent(genre.genreName || genre.name)}`);
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = 160 + 16; // w-40 + gap-4
    container.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Bạn đang quan tâm gì?
        </h2>
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-40 h-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!genres || genres.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        Bạn đang quan tâm gì?
      </h2>
      <div 
        className="relative"
        onMouseEnter={() => setShowNav(true)}
        onMouseLeave={() => setShowNav(false)}
        onTouchStart={() => setShowNav(false)}
      >
        {/* Left nav */}
        <button
          onClick={() => scroll("left")}
          className={`
            absolute -left-4 top-1/2 -translate-y-1/2 z-20
            bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg
            transition-opacity duration-200
            ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {genres.map((genre, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <div
                key={genre.genreId}
                onClick={() => handleGenreClick(genre)}
                className={`
                  flex-shrink-0 snap-start w-40 h-40 sm:w-48 sm:h-48 rounded-xl cursor-pointer
                  bg-gradient-to-br ${gradient} p-4 flex flex-col justify-end
                  hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl
                  relative overflow-hidden group
                `}
              >
                {/* Subtle overlay for styling */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                
                <h3 className="text-white font-bold text-lg sm:text-xl mb-1 relative z-10 break-words line-clamp-2">
                  {genre.genreName || genre.name}
                </h3>
                <div className="flex items-center text-white/90 text-sm font-medium relative z-10 group-hover:text-white transition-colors duration-300">
                  Xem chủ đề <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right nav */}
        <button
          onClick={() => scroll("right")}
          className={`
            absolute -right-4 top-1/2 -translate-y-1/2 z-20
            bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg
            transition-opacity duration-200
            ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
      </div>
    </section>
  );
};

export default GenreShowcase;
