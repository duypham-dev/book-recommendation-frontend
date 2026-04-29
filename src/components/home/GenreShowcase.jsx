import React, { useState, useRef, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGenres from "../../hooks/useGenres";

const GRADIENTS = [
  "from-indigo-500 to-black-500", "from-teal-500 to-black-500",
  "from-purple-500 to-black-500", "from-orange-500 to-black-500",
  "from-blue-500 to-black-500", "from-yellow-600 to-black-500",
  "from-pink-500 to-black-500", "from-emerald-500 to-black-500",
  "from-black to-white",
];

const NavButton = ({ direction, show, onClick }) => {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  
  return (
    <button
      onClick={() => onClick(direction)}
      className={`absolute ${isLeft ? "-left-4" : "-right-4"} top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg transition-opacity duration-200 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-label={`Scroll ${direction}`}
    >
      <Icon className="w-5 h-5 text-gray-800 dark:text-white" />
    </button>
  );
};

const GenreCard = ({ title, gradient, onClick }) => (
  <div
    onClick={onClick}
    className={`flex-shrink-0 snap-start w-40 h-40 sm:w-48 sm:h-48 rounded-xl cursor-pointer bg-gradient-to-br ${gradient} p-4 flex flex-col justify-center hover:scale-102 transition-transform duration-300 dark:shadow-md dark:hover:shadow-xl relative overflow-hidden group`}
  >
    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
    <h3 className="text-white  font-bold text-lg sm:text-xl mb-3 relative z-10 break-words line-clamp-2">
      {title}
    </h3>
    <div className="flex items-center text-white/90 text-sm font-medium relative z-10 group-hover:text-white transition-colors duration-300">
      Xem chủ đề <ChevronRight className="w-4 h-4 ml-1" />
    </div>
  </div>
);

const GenreShowcase = () => {
  const [showNav, setShowNav] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { genres, loading } = useGenres();

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 176; // 160px (w-40) + 16px (gap-4)
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  const featuredGenres = useMemo(() => genres?.slice(-5) || [], [genres]);
  const remainingCount = Math.max(0, (genres?.length || 0) - 5);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Bạn đang quan tâm gì?</h2>
        <div className="flex gap-4 overflow-x-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 h-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!genres?.length) return null;

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
        <NavButton direction="left" show={showNav} onClick={scroll} />

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredGenres.map((genre, index) => (
            <GenreCard
              key={genre.genreId}
              title={genre.genreName || genre.name}
              gradient={GRADIENTS[index % GRADIENTS.length]}
              onClick={() => navigate(`/category/${genre.genreId}?name=${encodeURIComponent(genre.genreName || genre.name)}`)}
            />
          ))}
          
          {remainingCount > 0 && (
            <GenreCard
              title={`+ ${remainingCount} chủ đề khác`}
              gradient={GRADIENTS[GRADIENTS.length - 1]}
              onClick={() => navigate(`/books`)}
            />
          )}
        </div>

        <NavButton direction="right" show={showNav} onClick={scroll} />
      </div>
    </section>
  );
};

export default React.memo(GenreShowcase);