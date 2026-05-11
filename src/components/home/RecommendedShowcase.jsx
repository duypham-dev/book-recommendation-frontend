import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSlug } from '../../utils/generateSlug';
import { applyPreset, isCloudinaryUrl } from '../../utils/cloudinaryUtils';
import useFavorite from '../../hooks/useFavorite';

// Subcomponent for the favorite button to use the hook correctly
const FavoriteButton = ({ bookId, initialIsFav, onFavChange }) => {
  const { isFavorited, handleFavorite, loadingFavorite } = useFavorite(bookId, initialIsFav);
  
  // Notify parent of favorite state changes
  useEffect(() => {
    onFavChange(bookId, isFavorited);
  }, [isFavorited, bookId]); // Intentionally not including onFavChange to avoid infinite loops if it's not memoized

  return (
    <button 
      onClick={handleFavorite}
      disabled={loadingFavorite}
      className={`p-3.5 rounded-full border transition-colors ${
        isFavorited 
          ? 'bg-red-500/20 border-red-500/50 text-red-500' 
          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
      }`}
    >
      <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
    </button>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <section className="mb-12 relative rounded-2xl overflow-hidden bg-[#1B1E21] shadow-2xl animate-pulse">
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Info Panel Skeleton */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:pr-4 flex flex-col justify-center">
          <div className="h-8 w-48 bg-white/10 rounded mb-10"></div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
            <div className="h-10 w-[80%] bg-white/10 rounded mb-2"></div>
            <div className="h-10 w-[60%] bg-white/10 rounded mb-6"></div>
            
            <div className="space-y-3 mb-8">
              <div className="h-4 w-full bg-white/10 rounded"></div>
              <div className="h-4 w-full bg-white/10 rounded"></div>
              <div className="h-4 w-[75%] bg-white/10 rounded"></div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-36 bg-white/10 rounded-full"></div>
              <div className="h-12 w-12 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Cover Flow Skeleton */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 overflow-hidden min-h-[400px] lg:min-h-auto">
           {/* Center card skeleton */}
           <div className="w-[200px] sm:w-[240px] aspect-[2/3] rounded-xl bg-white/10 shadow-2xl z-10"></div>
           {/* Side cards skeletons */}
           <div className="absolute w-[200px] sm:w-[240px] aspect-[2/3] rounded-xl bg-white/5 shadow-xl -translate-x-[160px] scale-75 z-0"></div>
           <div className="absolute w-[200px] sm:w-[240px] aspect-[2/3] rounded-xl bg-white/5 shadow-xl translate-x-[160px] scale-75 z-0"></div>
        </div>
      </div>
    </section>
  );
};

const RecommendedShowcase = ({ books }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [localFavs, setLocalFavs] = useState({});

  // Reset index if books array changes
  useEffect(() => {
    setActiveIndex(0);
  }, [books]);

  if (!books || books.length === 0) return null;

  const activeBook = books[activeIndex];
  const url = `/books/${generateSlug(activeBook.title)}-${activeBook.bookId}`;

  const getCover = (url) => (url && isCloudinaryUrl(url)) ? applyPreset(url, "bookCard") : url || "/placeholder.svg";

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  return (
    <section className="mb-12 relative rounded-2xl overflow-hidden bg-[#1B1E21] text-white select-none shadow-2xl">
      {/* Background blurred cover */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center blur-3xl scale-110"
            style={{ backgroundImage: `url(${getCover(activeBook.coverImageUrl)})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B1E21] via-[#1B1E21]/90 to-[#1B1E21]/60"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Info Panel */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:pr-4 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-white/90 tracking-wide">
            Dành riêng cho bạn
          </h2>
          
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
              >
                <div className="inline-block px-2.5 py-1 bg-white/10 text-gray-300 rounded text-[10px] font-bold tracking-widest uppercase mb-4 w-max">
                  Hệ thống đề xuất
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4 line-clamp-2 leading-tight text-white min-h-[75px] sm:min-h-[90px]">
                  {activeBook.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base line-clamp-4 lg:line-clamp-5 mb-8 leading-relaxed min-h-[91px] sm:min-h-[104px] lg:min-h-[130px]">
                  {activeBook.description || "Cuốn sách thú vị này đang chờ bạn khám phá. Hãy nhấp để đọc ngay và đắm chìm vào thế giới tri thức vô tận."}
                </p>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate(url)}
                    className="flex items-center gap-2 bg-[#44b97d] hover:bg-[#3ca46d] text-white font-medium py-3.5 px-8 rounded-full transition-colors shadow-lg"
                  >
                    <BookOpen size={20} />
                    <span>Đọc sách</span>
                  </button>
                  
                  <FavoriteButton 
                    bookId={activeBook.bookId} 
                    initialIsFav={localFavs[activeBook.bookId] ?? activeBook.isFav}
                    onFavChange={(id, status) => setLocalFavs(prev => ({ ...prev, [id]: status }))}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Cover Flow */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 overflow-hidden min-h-[400px] lg:min-h-auto">
          {/* Nav arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md text-white/70 hover:text-white border border-white/5"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 lg:right-8 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md text-white/70 hover:text-white border border-white/5"
          >
            <ChevronRight size={24} />
          </button>

          {/* Cards Container */}
          <div 
            className="relative w-full h-[350px] flex items-center justify-center"
            style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
          >
            {books.map((book, idx) => {
              // Determine relative position with wrap-around
              const len = books.length;
              let offset = (idx - activeIndex) % len;
              if (offset > len / 2) offset -= len;
              if (offset < -len / 2) offset += len;
              
              // Do not return null to avoid unmounting and breaking animations.
              // We just push them far away and make them invisible.
              const isVisible = Math.abs(offset) <= 2;
              const isCenter = offset === 0;
              // Adjust sizing and positioning based on distance from center
              const scale = isCenter ? 1 : 0.75;
              const xTranslate = offset * 160; // 160px spread
              const zTranslate = isCenter ? 50 : -150 - (Math.abs(offset) * 50);
              const rotateY = offset === 0 ? 0 : offset > 0 ? -15 : 15;
              
              // Smooth fade out for edge cards
              const opacity = isVisible ? (isCenter ? 1 : Math.abs(offset) === 1 ? 0.6 : 0) : 0;
              const zIndex = isVisible ? 20 - Math.abs(offset) : -1;

              return (
                <motion.div
                  key={book.bookId}
                  animate={{
                    x: xTranslate,
                    z: zTranslate,
                    rotateY: rotateY,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  className="absolute w-[200px] sm:w-[240px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-gray-900"
                  style={{
                    boxShadow: isCenter ? '0 25px 50px -12px rgba(0,0,0,0.8)' : '0 10px 15px -3px rgba(0,0,0,0.5)',
                  }}
                  onClick={() => {
                    if (isCenter) navigate(`/books/${generateSlug(book.title)}-${book.bookId}`);
                    else setActiveIndex(idx);
                  }}
                >
                  <img 
                    src={getCover(book.coverImageUrl)} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                    draggable="false"
                  />
                  {!isCenter && (
                    <div className="absolute inset-0 bg-black/40 transition-opacity"></div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Dots Pagination */}
          <div className="absolute bottom-6 left-0 right-0 lg:left-auto lg:right-12 flex justify-center gap-1.5 z-20">
            {books.slice(0, 10).map((_, idx) => ( // limit dots to 10 max
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex % 10 
                    ? 'w-4 bg-white' 
                    : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedShowcase;
