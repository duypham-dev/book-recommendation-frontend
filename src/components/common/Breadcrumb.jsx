import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 whitespace-nowrap overflow-x-auto no-scrollbar">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <Home className="w-4 h-4 mr-1 sm:mr-2" />
            Trang chủ
          </Link>
        </li>
        {items && items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-1" />
              {isLast || !item.link ? (
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200 line-clamp-1 max-w-[150px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.link}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors line-clamp-1 max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
