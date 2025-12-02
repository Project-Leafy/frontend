# Nginx 기반으로 정적 파일 서빙
FROM nginx:alpine

# 기존 nginx 설정 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 우리 nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/

# 빌드된 정적 파일 복사 (index.html, assets 등 전부)
COPY . /usr/share/nginx/html

# 포트 오픈
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]