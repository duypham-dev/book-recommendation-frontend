/**
 * Cloudinary Image Optimization Utilities
 */

const CLOUDINARY_PATTERN = /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.*)/;

/**
 * Check if the URL is a Cloudinary URL
 * @param {string} url
 * @returns {boolean}
 */
export const isCloudinaryUrl = (url) => {
  return url && CLOUDINARY_PATTERN.test(url);
};

/**
 * Transform Cloudinary URL with optimizations
 * @param {string} url - Original URL from Cloudinary
 * @param {Object} options - Transformation options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.quality - Quality (auto, auto:low, auto:eco, auto:good, auto:best)
 * @param {string} options.format - Format (auto, webp, avif, jpg, png)
 * @param {string} options.crop - Crop mode (limit, fill, fit, scale, thumb)
 * @param {boolean} options.blur - Add blur effect (for placeholder)
 * @param {number} options.blurAmount - Blur amount =
 * @returns {string} Transformed URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !isCloudinaryUrl(url)) {
    return url;
  }

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "limit",
    blur = false,
    blurAmount = 1000,
  } = options;

  // Build transformation string
  const transforms = [];

  // Format and quality
  transforms.push(`f_${format}`);
  transforms.push(`q_${quality}`);

  // Crop mode
  transforms.push(`c_${crop}`);

  // Dimensions
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);

  // Blur for placeholder
  if (blur) transforms.push(`e_blur:${blurAmount}`);

  const transformString = transforms.join(",");

  // Insert transforms into URL
  return url.replace(
    CLOUDINARY_PATTERN,
    `https://res.cloudinary.com/$1/image/upload/${transformString}/$2`
  );
};

/**
 * Generate srcset for responsive images
 * @param {string} url - Original URL from Cloudinary
 * @param {number[]} widths - Array of widths
 * @param {Object} options - Other options
 * @returns {string} srcset string
 */
export const generateSrcSet = (url, widths = [320, 480, 640, 800, 1024], options = {}) => {
  if (!url || !isCloudinaryUrl(url)) {
    return "";
  }

  return widths
    .map((w) => {
      const optimizedUrl = optimizeCloudinaryUrl(url, { ...options, width: w });
      return `${optimizedUrl} ${w}w`;
    })
    .join(", ");
};

/**
 * Create placeholder URL with blur effect and small size
 * @param {string} url - Original URL
 * @param {number} width - Width of placeholder (default 20px)
 * @returns {string} Placeholder URL
 */
export const getPlaceholderUrl = (url, width = 20) => {
  return optimizeCloudinaryUrl(url, {
    width,
    quality: "auto:low",
    blur: true,
    blurAmount: 1000,
  });
};

/**
 * Preset configurations for common use cases
 */
export const CLOUDINARY_PRESETS = {
  // Book cover - detail
  bookCover: {
    width: 400,
    quality: "auto:good",
    format: "auto",
    crop: "limit",
  },
  // Book thumbnail
  bookThumbnail: {
    width: 200,
    quality: "auto",
    format: "auto",
    crop: "limit",
  },
  // Book card small
  bookCard: {
    width: 280,
    quality: "auto",
    format: "auto",
    crop: "limit",
  },
  bookCardLarge: {
    width: 400,
    quality: "auto:good",
    format: "auto",
    crop: "limit",
  },
  // Background blur (desktop)
  backgroundBlur: {
    width: 100,
    quality: "auto:low",
    format: "auto",
    blur: true,
    blurAmount: 2000,
  },
  // Background mobile (no blur, low quality)
  backgroundMobile: {
    width: 1100,
    quality: "auto",
    format: "auto",
    crop: "fill",
  },
  // Avatar
  avatar: {
    width: 100,
    height: 100,
    quality: "auto",
    format: "auto",
    crop: "fill",
  },
  // Avatar lớn
  avatarLarge: {
    width: 200,
    height: 200,
    quality: "auto:good",
    format: "auto",
    crop: "fill",
  },
};

/**
 * Helper function để apply preset
 * @param {string} url
 * @param {string} presetName
 * @returns {string}
 */
export const applyPreset = (url, presetName) => {
  const preset = CLOUDINARY_PRESETS[presetName];
  if (!preset) {
    console.warn(`Cloudinary preset "${presetName}" not found`);
    return url;
  }
  return optimizeCloudinaryUrl(url, preset);
};
