import React from 'react';
import { BookOpen, Users, Zap, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">TekBook</h1>
          <p className="text-xl text-blue-100">
            Tiệm sách eBook trực tuyến miễn phí - Tri thức không giới hạn cho mọi người
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Sứ mệnh của TekBook
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                TekBook được thành lập với một mục tiêu rõ ràng: cung cấp quyền truy cập miễn phí
                vào kho sách điện tử khổng lồ cho tất cả mọi người, bất kể họ ở đâu hoặc tài chính
                của họ như thế nào.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Chúng tôi tin rằng giáo dục và sự học hỏi không nên bị hạn chế. Mỗi người đều xứng
                đáng có cơ hội khám phá thế giới thông qua sách.
              </p>
            </div>
            <div className="bg-blue-600 h-80 rounded-lg flex items-center justify-center">
              <BookOpen className="w-32 h-32 text-white opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Tầm nhìn và Giá trị
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tri thức Miễn phí</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Truy cập hàng nghìn cuốn sách mà không cần chi trả, hoàn toàn miễn phí.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cộng đồng</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tham gia cộng đồng độc giả, chia sẻ đánh giá và khám phá những cuốn sách yêu thích.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Nhanh & Dễ dàng</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Giao diện thân thiện, tìm kiếm nhanh chóng, đọc ở bất cứ thiết bị nào.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Globe className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Toàn cầu</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Các cuốn sách từ khắp nơi trên thế giới, dành cho bạn đọc quốc tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Các tính năng chính
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thư viện Khổng lồ</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Hơn hàng chục ngàn tiêu đề sách bao gồm nhiều thể loại khác nhau.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gợi ý Cá nhân hóa</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Nhận đề xuất sách dựa trên sở thích và lịch sử đọc của bạn.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đọc Không gián đoạn</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Đọc trực tuyến với công cụ đọc tiên tiến, đánh dấu và ghi chú.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <Globe className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đa nền tảng</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Truy cập từ máy tính, điện thoại, hoặc tablet ở bất cứ đâu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Liên hệ với chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Điện thoại</h3>
              <p className="text-gray-600 dark:text-gray-400">📞 0877736289</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">📧 Support@Tekbook.vn</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Website</h3>
              <p className="text-gray-600 dark:text-gray-400">🌐 www.tekbook.vn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-2xl font-semibold italic">
            "Một cuốn sách là chiếc cửa thần kỳ bất tận dẫn ta tới những vương quốc xa xăm."
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
