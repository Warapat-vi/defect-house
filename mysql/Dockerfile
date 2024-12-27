# ใช้ base image จาก MySQL official image
FROM mysql:latest

# กำหนด environment variables สำหรับการกำหนดค่า MySQL
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=log_service_db
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=myuserpassword
ENV TZ=Asia/Bangkok

# คัดลอกไฟล์ SQL ไปยัง /docker-entrypoint-initdb.d/
# ไฟล์เหล่านี้จะถูกรันเมื่อ container เริ่มต้น
COPY init.sql /docker-entrypoint-initdb.d/

# เปิดพอร์ต 3306 ให้ container ใช้งาน
EXPOSE 3306


# docker build -t log-service-mysql .
# docker run -d --name log-service-mysql-container -p 3306:3306 log-service-mysql
