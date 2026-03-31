import React, { useState, useCallback } from "react";
import {
  BookOpen,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "../constants/routePaths";

const CURRENT_YEAR = new Date().getFullYear();

const ABOUT_LINKS = [
  { label: "Giới thiệu", to: PATHS.ABOUT },
  { label: "Tất cả sách", to: PATHS.ALL_BOOKS },
  { label: "Gói thành viên", to: PATHS.MEMBERSHIP },
];

const ACCOUNT_LINKS = [
  { label: "Tài khoản của tôi", to: PATHS.MANAGE_ACCOUNT_REDIRECT.ROOT },
  { label: "Sách yêu thích", to: PATHS.MANAGE_ACCOUNT_REDIRECT.FAVORITE_BOOKS },
  { label: "Lịch sử đọc", to: PATHS.MANAGE_ACCOUNT_REDIRECT.HISTORY_READING },
];

const LEGAL_LINKS = [
  { label: "Điều khoản sử dụng", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Chính sách Cookie", href: "#" },
];

const FooterLinkList = React.memo(({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
      {title}
    </h3>
    <ul className="space-y-3" role="list">
      {links.map((link) => {
        const className =
          "text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200";
        return (
          <li key={link.label}>
            {link.to ? (
              <Link to={link.to} className={className}>
                {link.label}
              </Link>
            ) : (
              <a href={link.href} className={className}>
                {link.label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </div>
));

FooterLinkList.displayName = "FooterLinkList";

const SocialButton = React.memo(({ href, label, icon, hoverClass }) => (
  <a
    href={href}
    aria-label={label}
    className={`w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-200 hover:scale-110 ${hoverClass}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
));

SocialButton.displayName = "SocialButton";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = useCallback(
    (e) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    },
    [email],
  );

  return (
    <footer className="relative mt-20 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-12 lg:py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Tekbook
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-xs">
              Thư viện eBook trực tuyến miễn phí, nơi tri thức không có giới hạn.
              Đọc mọi lúc, mọi nơi.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>0877 736 289</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a
                  href="mailto:support@tekbook.vn"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  support@tekbook.vn
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <nav className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterLinkList title="Khám phá" links={ABOUT_LINKS} />
            <FooterLinkList title="Tài khoản" links={ACCOUNT_LINKS} />
            <FooterLinkList title="Pháp lý" links={LEGAL_LINKS} />
          </nav>

          {/* Newsletter column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Nhận bản tin
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Cập nhật sách mới và khuyến mãi hàng tuần.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  className="w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 pr-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                  aria-label="Đăng ký nhận bản tin"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Cảm ơn bạn đã đăng ký!
                </p>
              )}
            </form>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2.5">
              <SocialButton
                href="#"
                label="Facebook"
                icon={<Facebook className="w-4 h-4" />}
                hoverClass="hover:bg-blue-600 hover:text-white"
              />
              <SocialButton
                href="#"
                label="Twitter"
                icon={<Twitter className="w-4 h-4" />}
                hoverClass="hover:bg-sky-500 hover:text-white"
              />
              <SocialButton
                href="mailto:support@tekbook.vn"
                label="Email"
                icon={<Mail className="w-4 h-4" />}
                hoverClass="hover:bg-emerald-600 hover:text-white"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 dark:border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {CURRENT_YEAR} TekBook.org. Tiệm sách eBook trực tuyến miễn phí
            dành cho mọi người.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in
            Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
