import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import SectionHeader from './SectionHeader';

const BookCarousel = ({ books, title, genreId, genreName, subtitle, extraHeader, showHeader = true, className = "mb-6 sm:mb-12" }) => {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={className}>
        {showHeader && (
          <SectionHeader 
            title={title} 
            subtitle={subtitle} 
            genreId={genreId}
            genreName={genreName || title}
            extra={extraHeader}
          />
        )}
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth p-2 py-4 items-start"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book, index) => (
            <div key={index} className="min-w-[130px] w-[130px] sm:min-w-[180px] sm:w-[180px] flex-shrink-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BookCarousel;
