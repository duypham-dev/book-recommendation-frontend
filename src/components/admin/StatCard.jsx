import React from "react";

const formatNumber = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0";
  }
  return value.toLocaleString("en-US");
};

// ====== UI components ngắn gọn ======
const StatCard = (props) => {
  const { icon: IconComponent, label, value, isLoading = false } = props;

  return (
    <div className="h-full flex items-center gap-4 bg-white dark:bg-admin-stat-card-bg-dark p-6 rounded-lg dark:border dark:border-admin-stat-card-border-dark shadow-sm">
      <div className="h-12 w-12 rounded-full grid place-items-center bg-[#EEF5FF] dark:bg-admin-stat-card-bg-dark dark:border dark:border-admin-stat-card-border-dark">
        <IconComponent className="h-6 w-6 dark:text-admin-stat-card-text-dark" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-admin-stat-card-text-dark">{label}</p>
        <p className="text-xl font-bold text-slate-900 dark:text-admin-stat-card-text-dark mt-1">
          {isLoading ? "..." : formatNumber(value)}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
