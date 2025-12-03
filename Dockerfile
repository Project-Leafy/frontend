# 프론트엔드는 빌드 과정 없이 Nginx 웹 서버만 있으면 됩니다.
FROM nginx:alpine

# 1. Nginx의 기본 설정 파일을 삭제 (우리가 만든 설정을 쓰기 위해)
RUN rm /etc/nginx/conf.d/default.conf

# 2. 현재 폴더의 모든 파일(HTML, CSS, JS)을 Nginx의 웹 루트 폴더로 복사
COPY . /usr/share/nginx/html

# 3. Nginx 설정 파일 복사 (아래에서 만들 파일입니다)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 80번 포트 오픈
EXPOSE 80

# Nginx 실행 (기본 명령어 사용)
CMD ["nginx", "-g", "daemon off;"]