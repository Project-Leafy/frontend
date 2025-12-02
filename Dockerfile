# Nginx 기반으로 정적 파일 서빙 (가장 안정적)
FROM nginx:alpine

# 기본 nginx 설정 삭제
RUN rm -rf /etc/nginx/conf.d/*

# 우리 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 모든 정적 파일 복사
COPY . /usr/share/nginx/html

# 포트 오픈
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]