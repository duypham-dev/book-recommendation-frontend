import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, BookOpen } from 'lucide-react';
import { generateSlug } from '../../utils/generateSlug';
import { applyPreset, isCloudinaryUrl } from '../../utils/cloudinaryUtils';

const RecommendedShowcase = ({ books }) => {
  const navigate = useNavigate();
  if (!books || books.length === 0) return null;

  const spotlightBook = books[0];
  const otherBooks = books.slice(1, 5); // Take next 4 books

  const spotlightUrl = `/books/${generateSlug(spotlightBook.title)}-${spotlightBook.bookId}`;
  
  const getCover = (url) => (url && isCloudinaryUrl(url)) ? applyPreset(url, "bookCard") : url || "/placeholder.svg";

  return (
    <section className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white shadow-2xl overflow-hidden relative group/section">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl mix-blend-screen pointer-events-none transition-transform duration-1000 group-hover/section:scale-110"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl mix-blend-screen pointer-events-none transition-transform duration-1000 group-hover/section:scale-110"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <Sparkles className="text-yellow-400 animate-pulse" size={24} />
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
            Dành riêng cho bạn
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Spotlight Book */}
          <div 
            className="flex-1 flex flex-col sm:flex-row gap-6 bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => navigate(spotlightUrl)}
          >
            <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/3 shrink-0 overflow-hidden rounded-lg shadow-xl relative">
              <img 
                src={getCover(spotlightBook.coverImageUrl)} 
                alt={spotlightBook.title}
                className="w-full h-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-full text-xs font-semibold mb-3 w-max">
                Lựa Chọn Hàng Đầu
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2 text-white group-hover:text-blue-300 transition-colors">
                {spotlightBook.title}
              </h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-1">
                {spotlightBook.authors?.map(a => a.authorName).join(", ") || "Không rõ tác giả"}
              </p>
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                {spotlightBook.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={16} className="fill-current" />
                    <span className="font-medium">{spotlightBook.averageRating.toFixed(1)}</span>
                  </div>
                )}
                {spotlightBook.genres?.length > 0 && (
                  <div className="flex items-center gap-1 text-blue-300">
                    <BookOpen size={16} />
                    <span className="line-clamp-1">{spotlightBook.genres.map(g => g.genreName).join(", ")}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-3 mb-6 hidden sm:block leading-relaxed">
                {spotlightBook.description || "Cuốn sách này đang chờ bạn khám phá..."}
              </p>
              
              <div className="mt-auto">
                <button 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(spotlightUrl);
                  }}
                >
                  Đọc Ngay
                </button>
              </div>
            </div>
          </div>

          {/* Other Recommendations Grid */}
          {otherBooks.length > 0 && (
            <div className="lg:w-2/5 flex flex-col gap-3 justify-between">
              {otherBooks.map((book) => {
                const url = `/books/${generateSlug(book.title)}-${book.bookId}`;
                return (
                  <div 
                    key={book.bookId}
                    className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 cursor-pointer transition-all hover:translate-x-1 group/item"
                    onClick={() => navigate(url)}
                  >
                    <div className="w-14 h-20 shrink-0 overflow-hidden rounded shadow-md relative">
                      <img 
                        src={getCover(book.coverImageUrl)} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium line-clamp-1 text-sm mb-1 group-hover/item:text-blue-300 transition-colors">{book.title}</h4>
                      <p className="text-gray-400 text-xs line-clamp-1 mb-1.5">
                        {book.authors?.map(a => a.authorName).join(", ") || "Không rõ tác giả"}
                      </p>
                      {book.averageRating > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star size={12} className="fill-current" />
                          <span>{book.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendedShowcase;
