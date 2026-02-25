# ☁️ Next.js 13 + Cloudflare R2 Image Upload

Dự án này là boilerplate hướng dẫn cách tích hợp **Cloudflare R2** làm dịch vụ lưu trữ hình ảnh (Object Storage) cho ứng dụng **Next.js 13 (App Router)**. Việc sử dụng R2 giúp tối ưu chi phí lưu trữ nhờ chính sách Miễn phí băng thông tải ra (Zero Egress Fees).

## 🚀 Tính năng nổi bật

- **Upload API:** Giao tiếp với Cloudflare R2 thông qua S3 API chuẩn (`@aws-sdk/client-s3`).
- **URL-Safe Filename:** Tự động xử lý tên file trước khi upload (chuyển tiếng Việt có dấu thành không dấu, loại bỏ ký tự đặc biệt, chuyển thành dạng slug chuẩn) để tránh lỗi URL khi render ảnh.
- **Client UI (Form):** Giao diện upload ảnh trực quan xây dựng bằng Tailwind CSS, hỗ trợ preview ảnh trước khi tải lên.
- **Tối ưu hiển thị:** Tích hợp sẵn cấu hình để hoạt động mượt mà với component `<Image />` của Next.js.

## 🛠️ Công nghệ sử dụng

- [Next.js 13](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- AWS SDK for JavaScript v3 (`@aws-sdk/client-s3`)

## ⚙️ Hướng dẫn cài đặt

### 1. Lấy thông tin từ Cloudflare R2

1. Tạo một Bucket trên Cloudflare R2.
2. Thiết lập Public Access (Custom Domain hoặc Public Dev URL) cho bucket.
3. Tạo API Token (chọn Account API Token với quyền _Object Read & Write_).

### 2. Thiết lập biến môi trường

Tạo file `.env.local` ở thư mục gốc của dự án và điền các thông tin đã lấy ở bước trên:

```env
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your_custom_domain_or_pub_url
```
