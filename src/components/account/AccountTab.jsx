import React from "react"

const AccountTabs = React.memo(({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-2 px-1 transition-colors whitespace-nowrap text-sm sm:text-base ${
            activeTab === tab.id
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
})

AccountTabs.displayName = "AccountTabs"
export default AccountTabs
