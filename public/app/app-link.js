(function() {
  'use strict';

  // 앱 설정
  const APP_SCHEME = 'phoenixdarts://';
  const APP_PACKAGE = 'com.phoenixdarts.app';
  const IOS_APP_ID = '123456789'; // 실제 App ID로 변경 필요

  /**
   * URL 파라미터 파싱
   * @returns {Object} pathname과 params 객체
   */
  function parseURL() {
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const params = {};

    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return { pathname, params };
  }

  /**
   * 플랫폼 감지
   * @returns {string} 'ios', 'android', 'other'
   */
  function detectPlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // iOS 감지
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      return 'ios';
    }

    // Android 감지
    if (/android/i.test(ua)) {
      return 'android';
    }

    // 기타 (데스크톱 등)
    return 'other';
  }

  /**
   * 딥링크 생성
   * @param {string} pathname - URL pathname
   * @param {Object} params - Query parameters
   * @param {string} platform - 플랫폼 ('ios' or 'android')
   * @returns {string} 생성된 딥링크
   */
  function generateDeepLink(pathname, params, platform) {
    // pathname에서 /app/ 제거하여 앱 경로 생성
    const appPath = pathname.replace('/app/', '').replace('/app', '');

    // query string 생성
    const queryString = new URLSearchParams(params).toString();

    if (platform === 'ios') {
      // iOS Custom URL Scheme
      return `${APP_SCHEME}${appPath}${queryString ? '?' + queryString : ''}`;
    } else if (platform === 'android') {
      // Android Intent URL with fallback
      const base = `intent://${appPath}${queryString ? '?' + queryString : ''}#Intent;`;
      const scheme = `scheme=${APP_SCHEME.replace('://', '')};`;
      const pkg = `package=${APP_PACKAGE};`;
      const fallback = `S.browser_fallback_url=https://play.google.com/store/apps/details?id=${APP_PACKAGE};`;
      const end = 'end';

      return `${base}${scheme}${pkg}${fallback}${end}`;
    }

    return null;
  }

  /**
   * 스토어 URL 생성
   * @param {string} platform - 플랫폼 ('ios' or 'android')
   * @returns {string} 스토어 URL
   */
  function getStoreURL(platform) {
    if (platform === 'ios') {
      return `https://apps.apple.com/app/id${IOS_APP_ID}`;
    } else if (platform === 'android') {
      return `https://play.google.com/store/apps/details?id=${APP_PACKAGE}`;
    }
    return null;
  }

  /**
   * 인앱 브라우저 감지
   * @returns {boolean} 인앱 브라우저 여부
   */
  function isInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // 카카오톡 인앱 브라우저
    if (ua.match(/KAKAOTALK/i)) {
      return true;
    }

    // 네이버 인앱 브라우저
    if (ua.match(/NAVER/i)) {
      return true;
    }

    // 페이스북 인앱 브라우저
    if (ua.match(/FBAN|FBAV/i)) {
      return true;
    }

    // 인스타그램 인앱 브라우저
    if (ua.match(/Instagram/i)) {
      return true;
    }

    return false;
  }

  /**
   * 외부 브라우저 안내 메시지 표시
   */
  function showExternalBrowserGuide() {
    const messageEl = document.getElementById('external-browser-message');
    if (messageEl) {
      messageEl.style.display = 'block';
    }
  }

  /**
   * 데스크톱 안내 메시지 표시
   */
  function showDesktopMessage() {
    const container = document.querySelector('.app-link-container');
    if (container) {
      container.innerHTML = `
        <div class="message-box">
          <h2>모바일에서 접속해주세요</h2>
          <p>이 페이지는 모바일 기기에서 사용할 수 있습니다.</p>
        </div>
      `;
    }
  }

  /**
   * 앱 실행 또는 스토어 이동
   */
  function openAppOrStore() {
    const platform = detectPlatform();

    // 데스크톱 처리
    if (platform === 'other') {
      showDesktopMessage();
      return;
    }

    // 인앱 브라우저 감지
    if (isInAppBrowser()) {
      showExternalBrowserGuide();
      // 인앱 브라우저에서도 시도는 함
    }

    const { pathname, params } = parseURL();
    const deepLink = generateDeepLink(pathname, params, platform);
    const storeURL = getStoreURL(platform);

    if (platform === 'ios') {
      // iOS: 딥링크 시도 → fallback to store
      window.location.href = deepLink;

      // 1.5초 후에도 페이지가 활성 상태면 스토어로 이동
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = storeURL;
        }
      }, 1500);
    } else if (platform === 'android') {
      // Android: Intent URL (자동 fallback 포함)
      window.location.href = deepLink;
    }
  }

  /**
   * 페이지 로드 시 초기화
   */
  function init() {
    // 데스크톱인 경우 즉시 메시지 표시
    const platform = detectPlatform();
    if (platform === 'other') {
      showDesktopMessage();
      return;
    }

    // 버튼 클릭 이벤트
    const button = document.getElementById('app-link-button');
    if (button) {
      button.addEventListener('click', openAppOrStore);
    }
  }

  // DOM 로드 완료 시 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
