# Book Recommendation System - Frontend

Frontend cho **Website Đọc Sách Online** tích hợp **Hệ thống Gợi ý Sách bằng Machine Learning** với khả năng học trực tuyến (Online Learning).

## Giới thiệu

Dự án cung cấp trải nghiệm đọc sách online với các tính năng:
-  Đọc sách EPUB/PDF trực tiếp trên trình duyệt
-  Gợi ý sách thông minh dựa trên AI/ML (ALS + SBERT)
-  Học và cải thiện gợi ý theo hành vi người dùng
-  Đánh giá, yêu thích, lưu lịch sử đọc
-  Dark/Light mode, responsive design

---

##  Công nghệ sử dụng

### Core
- **Vite** - Build tool
- **React 19** - UI Library (with React Compiler)
- **React Router Dom v7** - Routing
- **Tailwind CSS v4** - Styling
- **Ant Design v5** - UI Components

### Libraries
- **EPUBjs** - EPUB reader
- **PDF.js** - PDF reader
- **Axios** - HTTP client
- **Recharts** - Charts/Analytics
- **Motion** (Framer Motion) - Animations
- **Lucide React** + **React Icons** - Icons

---

##  Yêu cầu hệ thống

- **Node.js**: >= 18.x (khuyến nghị 20.x)
- **npm**: >= 9.x hoặc **yarn**: >= 1.22.x
- **Backend API**: Đang chạy ở `http://localhost:8080`
- **Recommendation System API**: Đang chạy ở `http://localhost:8001`

### Kiểm tra phiên bản:
```bash
node --version
npm --version
```

---

##  Cài đặt và chạy dự án

### 1. Clone repository
```bash
git clone https://github.com/book-recommendation-team6/book-recommendation-system-frontend.git
cd book-recommendation-system-frontend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Backend APIs

Đảm bảo các backend services đang chạy:

**Main Backend** (Spring Boot):
- URL: `http://localhost:8080/api/v1`
- Cung cấp: Authentication, Books, Users, Genres, Ratings, Favorites

**Recommendation System** (FastAPI):
- URL: `http://localhost:8001/api/v1`
- Cung cấp: ML-based recommendations, Similar books, Online Learning

>  **Lưu ý**: Nếu backend chạy ở port khác, cập nhật trong `src/config/ApiConfig.js`

### 4. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

### 5. Build production
```bash
npm run build
```

Build output sẽ nằm trong thư mục `dist/`

### 6. Preview production build
```bash
npm run preview
```
---

##  Tính năng chính

###  User Features
-  Đăng ký/Đăng nhập (JWT + OAuth2 Google)
-  Đọc sách EPUB/PDF với bookmark, TOC
-  Gợi ý sách cá nhân hóa (Personalized Recommendations)
-  Sách tương tự (Similar Books)
-  Đa dạng hóa gợi ý (Diversity Mode)
-  Đánh giá sách (1-5 sao) + viết review
-  Thêm vào yêu thích
-  Lịch sử đọc
-  Tìm kiếm sách

### Admin Features
-  Quản lý Users (CRUD)
-  Quản lý Books (CRUD, Upload EPUB/PDF)
-  Quản lý Genres/Thể loại
-  **Recommendation System Management**:
  - Chọn model (ALS/NCF/SBERT)
  - Health check & Model info
  - Retrain model
  - Bật/tắt Online Learning
  - Monitor buffer status

---

## Online Learning System

Hệ thống tự động học từ hành vi người dùng:

### Các sự kiện được track:
1. **View** (Đọc sách) - Strength: 1.0
2. **Favorite** (Yêu thích) - Strength: 5.0
3. **Rating** (Đánh giá) - Strength: 1.0-5.0

### Workflow:
```
User Action → Frontend feedback → RS API → Buffer
                                          ↓
                    Buffer đầy → Auto update SBERT profiles
```

## Cấu hình

### API Endpoints
Cấu hình trong `src/config/ApiConfig.js`:
```javascript
export const API_BASE_URL = 'http://localhost:8080/api/v1';
```

Recommendation System API tự động load từ backend:
- Default: `http://localhost:8001/api/v1`
- Có thể thay đổi trong Admin Dashboard

### Environment Variables (nếu cần)
Tạo file `.env` (nếu cần tùy chỉnh):
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_RS_API_BASE_URL=http://localhost:8001/api/v1
```

---

## Troubleshooting

### Backend không kết nối được?
- Kiểm tra backend đang chạy: `http://localhost:8080`
- Kiểm tra RS API: `http://localhost:8001`
- Xem console browser để biết lỗi cụ thể

### Không load được sách?
- Đảm bảo đã đăng nhập (nếu cần authentication)
- Kiểm tra database backend có dữ liệu sách chưa

### Gợi ý sách không hoạt động?
- Kiểm tra RS API health: `http://localhost:8001/api/v1/health`
- Vào Admin → Recommendation để xem model status
- Retrain model nếu cần

### Build lỗi?
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

---

## Vai trò người dùng

### User (Người dùng thông thường)
- Đọc sách, đánh giá, yêu thích
- Nhận gợi ý sách cá nhân hóa
- Quản lý tài khoản cá nhân

### Admin (Quản trị viên)
- Tất cả quyền của User
- Quản lý users, books, genres
- Quản lý Recommendation System
- Xem analytics/dashboard
---
