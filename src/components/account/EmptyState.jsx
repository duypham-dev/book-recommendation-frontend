import React from 'react';

const EmptyState = React.memo(({ icon: Icon, message }) => {
  return (
    <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
      {Icon && <Icon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300 dark:text-gray-600" />}
      <p className="text-sm sm:text-base">{message}</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
export default EmptyState;