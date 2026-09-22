# 백엔드로 넘길 때 원래 요청 정보를 전달한다.
# 백엔드 액세스 로그의 source_ip 는 X-Forwarded-For 의 첫 번째 값을 쓴다.
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
