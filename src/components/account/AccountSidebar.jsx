import React from "react"
import { User, Book, History, X } from "lucide-react"
import UserAvatar from "./UserAvatar"

const AccountSidebar = React.memo(({ user, activeTab, onTabChange, onClose }) => {
  const menuItems = [
    { id: "profile", label: "Quản lí tài khoản", icon: User },
    { id: "favorite-books", label: "Sách yêu thích", icon: Book },
    { id: "history-reading", label: "Lịch sử đọc sách", icon: History },
  ]
  const shortLabels = {
    "profile": "Tài khoản",
    "favorite-books": "Yêu thích",
    "history-reading": "Lịch sử đọc",
  }
  const avatarSrc = user?.avatarUrl || user?.avatar || ""
  const displayName = user?.fullName || user?.username || user?.email || "Người dùng"

  return (
    <>
      {/* Mobile horizontal navigation bar */}
      <div className="block md:hidden bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 p-3.5 rounded-2xl mb-2 text-center shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Quản lý tài khoản</h3>
        <div className="grid grid-cols-3 gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const label = shortLabels[item.id] || item.label;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? "text-yellow-400 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-yellow-400" : ""}`} />
                <span className="text-[11px]  font-semibold tracking-tight">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop sidebar navigation */}
      <div className="hidden md:block md:col-span-1 h-full">
        <div className="p-4 sm:p-6 md:border-r h-full border-gray-200 dark:border-gray-700">
          <div className="text-center mb-4 sm:mb-6">
            <UserAvatar src={avatarSrc} alt={displayName} size="md" className="mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{displayName}</h3>
          </div>

          <nav className="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                    isActive ? "bg-gray-sidebar/80 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-semibold">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
})

AccountSidebar.displayName = "AccountSidebar"
export default AccountSidebar
