# Sử dụng hình ảnh node.js làm hình ảnh cơ sở
FROM node:20

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép tất cả các tệp package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép tất cả các tệp và thư mục dự án vào thư mục làm việc
COPY . .

# Mở cổng mạng cho ứng dụng
EXPOSE 3007

# Khởi động ứng dụng khi container được chạy
CMD ["npm", "start"]
