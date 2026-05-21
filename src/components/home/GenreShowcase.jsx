import React, { useState, useRef, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGenres from "../../hooks/useGenres";

const COLORS = [
  { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", hover: "hover:border-blue-500/30 dark:hover:border-blue-500/30" },
  { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", hover: "hover:border-emerald-500/30 dark:hover:border-emerald-500/30" },
  { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", hover: "hover:border-violet-500/30 dark:hover:border-violet-500/30" },
  { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", hover: "hover:border-orange-500/30 dark:hover:border-orange-500/30" },
  { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", hover: "hover:border-rose-500/30 dark:hover:border-rose-500/30" },
  { bg: "bg-cyan-50 dark:bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", hover: "hover:border-cyan-500/30 dark:hover:border-cyan-500/30" },
];

const NavButton = ({ direction, show, onClick }) => {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  
  return (
    <button
      onClick={() => onClick(direction)}
      className={`absolute ${isLeft ? "-left-4" : "-right-4"} top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:scale-110 hidden sm:block ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-label={`Scroll ${direction}`}
    >
      <Icon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
    </button>
  );
};

const GenreCard = ({ title, colorConfig, onClick }) => (
  <div
    onClick={onClick}
    className={`flex-shrink-0 snap-start w-36 sm:w-56 bg-white dark:bg-[#282B39] border border-gray-100 dark:border-gray-800 rounded-2xl cursor-pointer px-3.5 py-3 sm:px-5 sm:py-4 flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group ${colorConfig.hover}`}
  >
    <h3 className={`font-semibold text-sm sm:text-base truncate pr-2 transition-colors duration-300 ${colorConfig.text}`}>
      {title}
    </h3>
    <div className={`p-1 sm:p-1.5 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${colorConfig.bg} ${colorConfig.text}`}>
      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
    const cardWidth = 240; // 224px (w-56) + 16px (gap-4)
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  const featuredGenres = useMemo(() => genres?.slice(-5) || [], [genres]);
  const remainingCount = Math.max(0, (genres?.length || 0) - 5);

  if (loading) {
    return (
      <section className="mb-6 sm:mb-12">
        <h2 className="mb-3 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Bạn đang quan tâm gì?</h2>
        <div className="flex gap-3 sm:gap-4 overflow-x-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36 sm:w-56 h-12 sm:h-14 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!genres?.length) return null;

  return (
    <section className="mb-6 sm:mb-12">
      <h2 className="mb-3 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
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
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 -mx-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredGenres.map((genre, index) => (
            <GenreCard
              key={genre.genreId}
              title={genre.genreName || genre.name}
              colorConfig={COLORS[index % COLORS.length]}
              onClick={() => navigate(`/category/${genre.genreId}?name=${encodeURIComponent(genre.genreName || genre.name)}`)}
            />
          ))}
          
          {remainingCount > 0 && (
            <GenreCard
              title={`+ ${remainingCount} chủ đề khác`}
              colorConfig={COLORS[featuredGenres.length % COLORS.length]}
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