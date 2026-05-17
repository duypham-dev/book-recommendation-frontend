import React from "react";
import ListItem from "./ListItem";
import { Star, Heart } from "lucide-react";
import Loading from "../common/Loading";

const formatNumber = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0";
  }
  return value.toLocaleString("en-US");
};

const ListCard = ({
  title,
  subtitle,
  items = [],
  variant = "rating",
  isLoading = false,
}) => (
  <div className="rounded-3xl p-4 md:p-5 bg-white/60 dark:bg-admin-stat-card-bg-dark border border-white/70 dark:border-admin-stat-card-border-dark shadow-sm">
    <h3 className="text-xl font-semibold text-slate-800 dark:text-admin-stat-card-text-dark text-center md:text-left">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
      {subtitle}
    </p>

    <div className="mt-3 divide-y divide-slate-200/70 dark:divide-admin-stat-card-border-dark">
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loading />
        </div>
      ) : items?.length ? (
        items.map((it) => (
          <ListItem
            key={it.id}
            cover={it.cover}
            title={it.title}
            subtitle={it.subtitle}
            right={
              variant === "rating"
                ? it.score.toFixed(1)
                : formatNumber(it.score)
            }
            rightIcon={
              variant === "rating" ? (
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              ) : (
                <Heart className="h-5 w-5 text-rose-500" />
              )
            }
          />
        ))
      ) : (
        <h2 className="text-center text-slate-500 dark:text-gray-400 py-12">
          Không có dữ liệu
        </h2>
      )}
    </div>
  </div>
);

export default ListCard;