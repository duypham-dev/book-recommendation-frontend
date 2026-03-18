import React from "react";

const VARIANT_STYLES = {
  default: "bg-transparent",
  accent:
    "bg-gradient-to-br from-red-50/60 via-amber-50/40 to-orange-50/60 dark:from-gray-800/50 dark:via-gray-850/30 dark:to-gray-800/50",
  gradient:
    "bg-gradient-to-r from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10",
  dark: "bg-gray-900 dark:bg-gray-950",
};

const SectionWrapper = ({
  children,
  variant = "default",
  className = "",
  fullWidth = false,
  id,
}) => {
  const baseClasses = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 lg:py-20 ${baseClasses} ${
        fullWidth ? "" : "px-4 sm:px-6 lg:px-8"
      } ${className}`}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="max-w-7xl mx-auto">{children}</div>
      )}
    </section>
  );
};

export default React.memo(SectionWrapper);
