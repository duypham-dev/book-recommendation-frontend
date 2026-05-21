import { useMemo, useCallback, useState } from "react"
import { Breadcrumb } from "antd"
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import MainLayout from "../../layouts/MainLayout"
import AccountSidebar from "../../components/account/AccountSidebar"
import { PATHS } from "../../constants/routePaths"
import useAuth from "../../hooks/useAuth"

const TAB_CONFIG = {
  profile: { path: PATHS.MANAGE_ACCOUNT_REDIRECT.PROFILE, label: "Thông tin tài khoản" },
  "favorite-books": { path: PATHS.MANAGE_ACCOUNT_REDIRECT.FAVORITE_BOOKS, label: "Sách yêu thích" },
  "history-reading": { path: PATHS.MANAGE_ACCOUNT_REDIRECT.HISTORY_READING, label: "Lịch sử đọc sách" },
}

const PATH_TO_TAB = {
  [PATHS.MANAGE_ACCOUNT_REDIRECT.ROOT]: "profile",
  [PATHS.MANAGE_ACCOUNT_REDIRECT.PROFILE]: "profile",
  [PATHS.MANAGE_ACCOUNT_REDIRECT.FAVORITE_BOOKS]: "favorite-books",
  [PATHS.MANAGE_ACCOUNT_REDIRECT.HISTORY_READING]: "history-reading",
}

const ManageAccount = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  const activeTab = PATH_TO_TAB[pathname] || "profile"
  const activeLabel = TAB_CONFIG[activeTab]?.label || ""

  const breadcrumbItems = useMemo(
    () => [
      {
          title: <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Trang chủ</Link>,
      },
      {
          title: <span className="text-gray-800 dark:text-gray-200 font-medium">Quản lí tài khoản</span>,
      },
      {
          title: <span className="text-gray-800 dark:text-gray-200 font-medium">{activeLabel}</span>,
      },
    ],
    [activeLabel],
  )

  const handleTabChange = useCallback(
    (tab) => {
      const targetPath = TAB_CONFIG[tab]?.path
      if (targetPath && pathname !== targetPath) {
        navigate(targetPath)
        setIsMobileSidebarOpen(false)
      }
    },
    [pathname, navigate],
  )


  return (
    <MainLayout showHero={false}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm">
          <Breadcrumb separator=">" items={breadcrumbItems} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg relative">
          <div className="flex flex-col md:grid md:grid-cols-4 min-h-[calc(100vh-250px)] md:min-h-[100vh] gap-3 md:gap-0">
            <div className="md:col-span-1">
              <AccountSidebar
                user={user}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>

            <div className="md:col-span-3">
              <div className="px-3 py-4 sm:p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ManageAccount
