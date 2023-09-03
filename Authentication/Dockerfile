# Sử dụng image node:14 (hoặc phiên bản bạn muốn)
FROM node:20

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép tệp package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Biên dịch mã nguồn TypeScript
RUN npm run build

# Mở cổng 3000 để ứng dụng lắng nghe
EXPOSE 3000

# Chạy ứng dụng khi container khởi động
CMD ["node", "dist/index.js"]
