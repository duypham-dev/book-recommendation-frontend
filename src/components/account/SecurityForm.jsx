import React, { useState } from "react"
import { message } from "antd"
import { Eye, EyeOff } from "lucide-react"
import { validateChangePassword } from "../../utils/validatorInput"

const SecurityForm = React.memo(({ user, onChangePassword, isSubmitting }) => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Handle input changes for password fields
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Toggle password visibility
  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  // Toggle change password form visibility
  const handleChangePasswordClick = () => {
    setShowChangePassword((prev) => !prev)
    setErrors({})
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    })
  }

  // Handle password change form submission
  const handleSubmitPassword = async (e) => {
    e.preventDefault()

    const validationResult = validateChangePassword(passwordData)
    if (!validationResult.valid) {
      setErrors(validationResult.errors)
      return
    }

    try {
      await onChangePassword?.({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setErrors({})
      setShowChangePassword(false)
    } catch {
      // Errors are handled upstream in the parent component.
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400 cursor-not-allowed text-sm sm:text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mật khẩu</label>
        <input
          type="password"
          value="••••••••••"
          disabled
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400 cursor-not-allowed text-sm sm:text-base"
        />
      </div>

      <button
        type="button"
        onClick={handleChangePasswordClick}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
      >
        {showChangePassword ? "Đóng" : "Đổi mật khẩu"}
      </button>

      {showChangePassword && (
        <form className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4" onSubmit={handleSubmitPassword}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thay đổi mật khẩu</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 sm:px-4 py-2 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base pr-10`}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => toggleVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 sm:px-4 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base pr-10`}
                placeholder="Nhập mật khẩu mới"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => toggleVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 sm:px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base pr-10`}
                placeholder="Nhập lại mật khẩu mới"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => toggleVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-60"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
            <button
              type="button"
              onClick={handleChangePasswordClick}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  )
})

SecurityForm.displayName = "SecurityForm"
export default SecurityForm
