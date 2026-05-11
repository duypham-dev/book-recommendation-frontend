import React from "react";
import { Pen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { applyPreset, isCloudinaryUrl } from "../../utils/cloudinaryUtils";
import { generateSlug } from "../../utils/generateSlug";

/**
 * Horizontal list-view card for a single book.
 * Used as an alternative to the vertical BookCard in list mode.
 */
const BookListItem = ({ book }) => {
  const navigate = useNavigate();

  const bookUrl = `/books/${generateSlug(book.title)}-${book.bookId}`;

  const optimizedCoverUrl =
    book.coverImageUrl && isCloudinaryUrl(book.coverImageUrl)
      ? applyPreset(book.coverImageUrl, "bookThumbnail")
      : book.coverImageUrl;

  const handleClick = () => navigate(bookUrl);

  return (
    <div
      onClick={handleClick}
      className="flex gap-4 p-3 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700/50 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
    >
      {/* Cover thumbnail */}
      <img
        src={optimizedCoverUrl || "/placeholder.svg"}
        alt={book.title}
        className="w-16 h-22 sm:w-20 sm:h-28 object-cover rounded-lg shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        decoding="async"
      />

      {/* Book info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Pen size={12} className="flex-shrink-0" />
          <span className="truncate">
            {book.authors?.map((a) => a.authorName).join(", ") || "-"}
          </span>
        </p>

        {book.publicationYear && (
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <Calendar size={12} className="flex-shrink-0" />
            {book.publicationYear}
          </p>
        )}

        {book.description && (
          <div className="hidden sm:block mt-0.5">
            <p
              className="text-xs text-gray-400 dark:text-gray-500"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {book.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListItem;
