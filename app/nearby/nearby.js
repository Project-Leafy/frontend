document.addEventListener('DOMContentLoaded', () => {
    // kakao.maps.load를 사용하여 SDK 로드 후 지도 관련 코드 실행
    if (window.kakao && window.kakao.maps) {
        kakao.maps.load(initMapFeature);
    } else {
        // SDK 스크립트 태그에 문제가 있을 경우를 대비한 폴백
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services&autoload=false`;
        document.head.appendChild(script);
        script.onload = () => kakao.maps.load(initMapFeature);
        script.onerror = () => {
            const loadingOverlay = document.getElementById('loading-overlay');
            loadingOverlay.innerHTML = '<p style="color: red;">지도 SDK를 불러오는 데 실패했습니다.<br>API 키를 확인해주세요.</p>';
        };
    }
});

function initMapFeature() {
    lucide.createIcons();

    const mapContainer = document.getElementById('map');
    const backBtn = document.getElementById('back-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const resultsPanel = document.getElementById('results-panel');
    const placesList = document.getElementById('places-list');
    const placeCountEl = document.getElementById('place-count');

    let map;
    let userMarker;
    let placeMarkers = [];
    let ps; // Places service
    let infowindow;
    let currentUserPosition;

    // 뒤로가기 버튼
    backBtn.addEventListener('click', () => {
        window.history.back();
    });

    // 1. Geolocation API로 사용자 현재 위치 가져오기
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    } else {
        // 위치 정보를 지원하지 않는 브라우저
        alert('이 브라우저에서는 위치 정보를 지원하지 않습니다. 지도 중앙을 기준으로 검색합니다.');
        const defaultPosition = new kakao.maps.LatLng(37.566826, 126.9786567); // 서울 시청
        initMap(defaultPosition);
    }

    // 위치 정보 가져오기 성공
    function onSuccessGeolocation(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        currentUserPosition = new kakao.maps.LatLng(lat, lon);
        
        initMap(currentUserPosition);
    }

    // 위치 정보 가져오기 실패
    function onErrorGeolocation() {
        alert('위치 정보를 가져오는 데 실패했습니다. 기본 위치에서 검색합니다.');
        const defaultPosition = new kakao.maps.LatLng(37.566826, 126.9786567);
        initMap(defaultPosition);
    }

    // 2. 지도 초기화
    function initMap(position) {
        const options = {
            center: position,
            level: 5 // 확대 레벨
        };
        map = new kakao.maps.Map(mapContainer, options);
        ps = new kakao.maps.services.Places(map);
        infowindow = new kakao.maps.InfoWindow({ zIndex: 1, removable: true });

        // 사용자 위치 마커 표시
        // 이미지 경로를 /assets/images/user_location_pin.png로 수정해야 합니다.
        // 해당 이미지가 없다면, 기본 마커가 사용됩니다.
        const userMarkerImageSrc = '/assets/images/user_location_pin.png';
        const imageSize = new kakao.maps.Size(28, 28);
        const imageOption = { offset: new kakao.maps.Point(14, 14) };

        const markerImage = new kakao.maps.MarkerImage(userMarkerImageSrc, imageSize, imageOption);
        
        userMarker = new kakao.maps.Marker({
            position: position,
            image: markerImage
        });
        userMarker.setMap(map);

        // 지도 초기화 후 장소 검색
        searchPlaces();
    }

    // 3. 키워드로 장소 검색
    function searchPlaces() {
        loadingOverlay.style.display = 'flex';

        const keywords = ['화원', '꽃집', '식물가게'];
        let searchPromises = keywords.map(keyword => 
            new Promise((resolve) => {
                const options = {
                    location: map.getCenter(),
                    radius: 5000, // 5km 반경
                    sort: kakao.maps.services.SortBy.DISTANCE
                };
                ps.keywordSearch(keyword, (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        resolve(data);
                    } else {
                        resolve([]); // 오류 발생 시 빈 배열 반환
                    }
                }, options);
            })
        );
        
        Promise.all(searchPromises).then(results => {
            // 중복 제거
            const uniquePlaces = new Map();
            results.flat().forEach(place => {
                if (!uniquePlaces.has(place.id)) {
                    uniquePlaces.set(place.id, place);
                }
            });
            displayPlaces(Array.from(uniquePlaces.values()));
        });
    }

    // 4. 검색 결과 표시
    function displayPlaces(places) {
        placesList.innerHTML = '';
        removeMarkers();

        if (places.length === 0) {
            placeCountEl.textContent = '0개';
            placesList.innerHTML = '<li class="no-results" style="padding: 20px; text-align: center; color: #666;">주변에 등록된 화원이 없습니다.</li>';
            loadingOverlay.style.display = 'none';
            resultsPanel.classList.add('visible');
            return;
        }

        placeCountEl.textContent = `${places.length}개`;
        
        places.forEach((place, index) => {
            // 마커 생성 및 표시
            const placePosition = new kakao.maps.LatLng(place.y, place.x);
            const marker = new kakao.maps.Marker({
                position: placePosition
            });
            marker.setMap(map);
            placeMarkers.push(marker);

            // 목록 아이템 생성
            const listItem = createListItem(place, index);
            placesList.appendChild(listItem);

            // 마커와 목록 아이템에 이벤트 바인딩
            const eventHandler = () => {
                panTo(placePosition);
                infowindow.setContent(generateInfoWindowContent(place));
                infowindow.open(map, marker);
                highlightListItem(index);
            };
            
            kakao.maps.event.addListener(marker, 'click', eventHandler);
            listItem.addEventListener('click', eventHandler);
        });

        loadingOverlay.style.display = 'none';
        resultsPanel.classList.add('visible');
        map.setBounds(getBounds(places));
    }

    // 목록 아이템 HTML 생성
    function createListItem(place, index) {
        const li = document.createElement('li');
        li.className = 'place-item';
        li.dataset.index = index;

        const distance = currentUserPosition ? 
            `<span class="place-dist">${Math.round(place.distance)}m</span>` : '';

        // 경로 URL 생성
        let routeUrl;
        if (currentUserPosition) {
            routeUrl = `https://map.kakao.com/link/route/${place.place_name},${place.y},${place.x}/내 위치,${currentUserPosition.getLat()},${currentUserPosition.getLng()}`;
        } else {
            routeUrl = `https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`;
        }

        li.innerHTML = `
            <div class="item-header">
                <h3 class="place-name">${place.place_name}</h3>
                ${distance}
            </div>
            <p class="place-category">${place.category_name.split(' > ').pop()}</p>
            <p class="place-address">${place.road_address_name || place.address_name}</p>
            <div class="place-actions">
                <a href="${routeUrl}" target="_blank" class="action-btn route">
                   <i data-lucide="map"></i> 경로 보기
                </a>
                <a href="https://map.kakao.com/link/share/${place.id}" target="_blank" class="action-btn share">
                   <i data-lucide="share-2"></i> 공유
                </a>
            </div>
        `;
        // Lucide 아이콘 다시 생성
        setTimeout(() => lucide.createIcons({
            nodes: [li]
        }), 0);
        return li;
    }

    // 인포윈도우 콘텐츠 생성
    function generateInfoWindowContent(place) {
        // 경로 URL 생성
        let routeUrl;
        if (currentUserPosition) {
            routeUrl = `https://map.kakao.com/link/route/${place.place_name},${place.y},${place.x}/내 위치,${currentUserPosition.getLat()},${currentUserPosition.getLng()}`;
        } else {
            routeUrl = `https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`;
        }

        return `
            <div class="infowindow-content" style="padding:10px; min-width:150px;">
                <div class="place-name" style="font-weight:bold; margin-bottom:5px;">${place.place_name}</div>
                <a href="${routeUrl}" target="_blank" style="color:#007BFF; text-decoration:none;">길찾기</a>
            </div>
        `;
    }

    // 지도에 설정된 마커 모두 제거
    function removeMarkers() {
        for (let i = 0; i < placeMarkers.length; i++) {
            placeMarkers[i].setMap(null);
        }
        placeMarkers = [];
    }

    // 검색 결과가 모두 보이도록 지도 범위 재설정
    function getBounds(places) {
        const bounds = new kakao.maps.LatLngBounds();
        places.forEach(place => {
            bounds.extend(new kakao.maps.LatLng(place.y, place.x));
        });
        if(currentUserPosition) bounds.extend(currentUserPosition);
        return bounds;
    }

    // 선택된 위치로 부드럽게 이동
    function panTo(position) {
        map.panTo(position);
    }
    
    // 목록 아이템 하이라이트
    function highlightListItem(index) {
        document.querySelectorAll('.place-item').forEach(item => {
            item.classList.remove('selected');
        });
        const targetItem = document.querySelector(`.place-item[data-index="${index}"]`);
        if (targetItem) {
            targetItem.classList.add('selected');
            targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

