import React from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "motion/react";
import { BookOpen, Heart, Sparkles, Users } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import { PATHS } from "../constants/routePaths";

const FADE_UP = {
	initial: { opacity: 0, y: 16 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.25 },
	transition: { duration: 0.55, ease: "easeOut" },
};

const About = () => {
	const navigate = useNavigate();

	const values = [
		{
			Icon: Users,
			title: "Cộng đồng trước tiên",
			description:
				"Chúng tôi đặt độc giả ở trung tâm: lắng nghe, đồng hành và cùng nhau xây dựng trải nghiệm tốt hơn mỗi ngày.",
		},
		{
			Icon: Sparkles,
			title: "Đổi mới",
			description:
				"Liên tục cải tiến để việc khám phá và đọc sách trở nên nhanh hơn, mượt hơn và cá nhân hoá hơn.",
		},
		{
			Icon: Heart,
			title: "Đam mê đọc sách",
			description:
				"Tình yêu với sách là động lực để chúng tôi tuyển chọn nội dung và tạo ra những công cụ hỗ trợ hành trình đọc.",
		},
	];

	const stats = [
		{ value: "500K+", label: "Sách" },
		{ value: "5M+", label: "Độc giả" },
		{ value: "150+", label: "Quốc gia" },
		{ value: "24/7", label: "Hỗ trợ" },
	];

	const heroContent = (
		<section className="w-full bg-primary dark:bg-primary/80">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
				<Motion.h1
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, ease: "easeOut" }}
					className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
				>
					Về TekBook
				</Motion.h1>
				<Motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
					className="mt-3 sm:mt-4 text-sm sm:text-base text-white/90 max-w-2xl mx-auto"
				>
					Biến việc khám phá và tận hưởng sách điện tử trở nên đơn giản, cá nhân hoá và thú vị hơn.
				</Motion.p>
			</div>
		</section>
	);

	return (
		<MainLayout showHero={true} heroContent={heroContent}>
			<div className="px-4 sm:px-6 lg:px-8 pt-20 pb-14 space-y-16 sm:space-y-20">
				{/* Our Story */}
				<section className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
					<Motion.div {...FADE_UP}>
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
							Câu chuyện của chúng tôi
						</h2>
						<div className="mt-4 space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
							<p>
								TekBook được xây dựng với một niềm tin đơn giản: ai cũng xứng đáng có quyền tiếp cận tri thức và những
								câu chuyện hay, ngay trong tầm tay.
							</p>
							<p>
								Chúng tôi kết hợp công nghệ với sự tôn trọng dành cho nội dung, tạo nên trải nghiệm đọc mượt mà,
								tiện lợi và phù hợp với từng người dùng.
							</p>
							<p>
								Mục tiêu của TekBook là giúp việc đọc trở nên dễ tiếp cận hơn, thú vị hơn và bền vững hơn cho mọi
								người.
							</p>
						</div>
					</Motion.div>

					<Motion.div
						initial={{ opacity: 0, x: 18 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.25 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="w-full"
					>
						<div className="w-full aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
							<div className="flex flex-col items-center justify-center text-center px-6">
								<div className="h-16 w-16 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
									<BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-500" />
								</div>
								<p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
									Không gian đọc của bạn — gọn gàng, tập trung và dễ chịu.
								</p>
							</div>
						</div>
					</Motion.div>
				</section>

				{/* Values */}
				<section>
					<Motion.div {...FADE_UP} className="text-center">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Giá trị cốt lõi</h2>
					</Motion.div>
					<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{values.map((item, index) => (
							<Motion.div
								key={item.title}
								initial={{ opacity: 0, y: 18 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.25 }}
								transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.06 }}
								whileHover={{ y: -4 }}
								className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm"
							>
								<div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
									<item.Icon className="h-6 w-6" />
								</div>
								<h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{item.title}</h3>
								<p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
							</Motion.div>
						))}
					</div>
				</section>

				{/* Stats */}
				<section>
					<Motion.div {...FADE_UP} className="text-center">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Con số nổi bật</h2>
					</Motion.div>
					<div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((s, index) => (
							<Motion.div
								key={s.label}
								initial={{ opacity: 0, scale: 0.96 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true, amount: 0.25 }}
								transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
								className="text-center"
							>
								<div className="text-3xl sm:text-4xl font-bold text-primary">{s.value}</div>
								<div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{s.label}</div>
							</Motion.div>
						))}
					</div>
				</section>

				{/* CTA (full width breakout) */}
				<section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-primary dark:bg-primary/80">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
						<Motion.h2
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.55, ease: "easeOut" }}
							className="text-2xl sm:text-3xl font-bold text-white"
						>
							Tham gia cộng đồng đọc sách
						</Motion.h2>
						<Motion.p
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
							className="mt-3 text-sm sm:text-base text-white/90 max-w-2xl mx-auto"
						>
							Bắt đầu hành trình với hàng ngàn cuốn sách. Khám phá ngay để tìm cuốn phù hợp với bạn.
						</Motion.p>

						<Motion.button
							type="button"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => navigate(PATHS.ALL_BOOKS)}
							className="mt-8 inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white text-primary font-semibold text-sm shadow-sm hover:bg-gray-100 transition-colors"
						>
							Bắt đầu
						</Motion.button>
					</div>
				</section>
			</div>
		</MainLayout>
	);
};

export default About;
