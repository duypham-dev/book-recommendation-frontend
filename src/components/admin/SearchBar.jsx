import { Search } from "lucide-react"

const SearchBar = ({ value, onChange, placeholder = "Tìm kiếm..." }) => {
  return (
    <div className="relative max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-[#2E2E2E] rounded-full bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-[#E5E5E5] placeholder-gray-400 dark:placeholder-[#898989] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#4A4B50] transition-shadow"
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#898989] dark:hover:text-[#E5E5E5] transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  )
}

export default SearchBar;