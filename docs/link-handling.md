# 링크 수신 처리 방식

## 개요

사용자가 공유된 링크를 클릭하여 앱링크 수신 페이지에 진입했을 때, 적절한 목적지(앱 또는 스토어)로 연결하는 전체 프로세스를 설명합니다.

## 전체 플로우

```
사용자 링크 클릭
    ↓
웹 페이지 로드
    ↓
URL 파라미터 파싱
    ↓
플랫폼 감지 (iOS/Android/기타)
    ↓
앱 설치 여부 확인
    ↓
딥링크 생성
    ↓
링크 실행
    ↓
앱 실행 또는 스토어 이동
```

## 1. URL 파라미터 파싱

### 목적
진입 URL에서 path와 query 파라미터를 추출하여 적절한 딥링크를 생성하는 데 사용합니다.

### 처리 방식

**입력 URL:**
```
https://bowonlee.github.io/webviewTest/app/club/post?clubId=1059&postId=1093
```

**파싱 결과:**
```javascript
{
  pathname: '/app/club/post',
  params: {
    clubId: '1059',
    postId: '1093'
  }
}
```

### 구현 예시
```javascript
function parseURL() {
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const params = {};

  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return { pathname, params };
}
```

## 2. 플랫폼 감지

### 목적
사용자의 디바이스 플랫폼을 식별하여 플랫폼별로 다른 처리 로직을 적용합니다.

### 감지 방법
User Agent 문자열을 분석하여 플랫폼을 판별합니다.

### 구현 예시
```javascript
function detectPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // iOS 감지
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  // Android 감지
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  // 기타 (데스크톱 등)
  return 'other';
}
```

### 플랫폼별 특성

**iOS:**
- Custom URL Scheme 지원
- Universal Links 지원
- App Store 리다이렉션 가능

**Android:**
- Intent URL 지원
- App Links 지원
- Play Store 리다이렉션 가능

**기타 (데스크톱):**
- 앱 설치 불가
- 웹 버전 안내 또는 QR 코드 표시

## 3. 앱 설치 여부 확인

### 목적
사용자 디바이스에 앱이 설치되어 있는지 확인하여 앱 실행 또는 스토어 이동을 결정합니다.

### iOS 확인 방법

#### 방법 1: Custom URL Scheme 시도 + 타임아웃
```javascript
function checkAppInstalledIOS(callback) {
  const appScheme = 'phoenixdarts://';
  const timeout = 2000; // 2초
  let timer = null;
  let hidden = false;

  // 앱이 실행되면 페이지가 백그라운드로 이동
  const handleVisibilityChange = () => {
    if (document.hidden) {
      hidden = true;
      clearTimeout(timer);
      callback(true); // 앱 설치됨
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 타임아웃 설정
  timer = setTimeout(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (!hidden) {
      callback(false); // 앱 미설치
    }
  }, timeout);

  // 앱 실행 시도
  window.location.href = appScheme;
}
```

#### 방법 2: Universal Links 사용 (권장)
Universal Links를 사용하면 앱 설치 여부에 관계없이 자동으로 처리됩니다.
- 앱 설치됨: 앱 실행
- 앱 미설치: 웹 페이지 유지 → 스토어 링크 제공

### Android 확인 방법

#### 방법 1: Intent URL 시도
```javascript
function checkAppInstalledAndroid(callback) {
  const intentURL = 'intent://club/post?clubId=1059&postId=1093#Intent;scheme=phoenixdarts;package=com.phoenixdarts.app;end';
  const timeout = 2000;
  let timer = null;
  let hidden = false;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      hidden = true;
      clearTimeout(timer);
      callback(true); // 앱 설치됨
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  timer = setTimeout(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (!hidden) {
      callback(false); // 앱 미설치
    }
  }, timeout);

  window.location.href = intentURL;
}
```

#### 방법 2: Intent URL with Fallback (권장)
```javascript
const intentURL = 'intent://club/post?clubId=1059&postId=1093#Intent;' +
  'scheme=phoenixdarts;' +
  'package=com.phoenixdarts.app;' +
  'S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.phoenixdarts.app;' +
  'end';

window.location.href = intentURL;
```
이 방법은 앱이 없으면 자동으로 Play Store로 이동합니다.

### 한계점
- 완벽한 앱 설치 확인은 불가능
- 타임아웃 방식은 정확도가 낮을 수 있음
- 브라우저별로 동작이 다를 수 있음

## 4. 딥링크 생성

### 목적
파싱한 URL 정보를 기반으로 플랫폼별 딥링크를 생성합니다.

### 딥링크 구조

#### iOS - Custom URL Scheme
```
phoenixdarts://club/post?clubId=1059&postId=1093
```

#### iOS - Universal Links
```
https://phoenixdarts.app/club/post?clubId=1059&postId=1093
```

#### Android - Custom URL Scheme
```
phoenixdarts://club/post?clubId=1059&postId=1093
```

#### Android - Intent URL
```
intent://club/post?clubId=1059&postId=1093#Intent;
  scheme=phoenixdarts;
  package=com.phoenixdarts.app;
  S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.phoenixdarts.app;
  end
```

### 구현 예시
```javascript
function generateDeepLink(pathname, params, platform) {
  const baseScheme = 'phoenixdarts://';

  // pathname에서 /app/ 제거
  const appPath = pathname.replace('/app/', '');

  // query string 생성
  const queryString = new URLSearchParams(params).toString();

  if (platform === 'ios') {
    // iOS Custom URL Scheme
    return `${baseScheme}${appPath}${queryString ? '?' + queryString : ''}`;
  } else if (platform === 'android') {
    // Android Intent URL
    const intentBase = `intent://${appPath}${queryString ? '?' + queryString : ''}#Intent;`;
    const scheme = 'scheme=phoenixdarts;';
    const package = 'package=com.phoenixdarts.app;';
    const fallback = 'S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.phoenixdarts.app;';
    const end = 'end';

    return `${intentBase}${scheme}${package}${fallback}${end}`;
  }

  return null;
}
```

## 5. 스토어 링크 생성

### 목적
앱이 설치되지 않은 경우 사용자를 앱 스토어로 안내합니다.

### 스토어 URL

#### App Store (iOS)
```
https://apps.apple.com/app/id{APP_ID}
```

실제 예시:
```
https://apps.apple.com/app/id123456789
```

#### Play Store (Android)
```
https://play.google.com/store/apps/details?id={PACKAGE_NAME}
```

실제 예시:
```
https://play.google.com/store/apps/details?id=com.phoenixdarts.app
```

### 구현 예시
```javascript
function getStoreURL(platform) {
  if (platform === 'ios') {
    return 'https://apps.apple.com/app/id123456789';
  } else if (platform === 'android') {
    return 'https://play.google.com/store/apps/details?id=com.phoenixdarts.app';
  }
  return null;
}
```

## 6. 링크 실행 전략

### 전략 1: 즉시 실행 (권장)
페이지 로드와 동시에 자동으로 딥링크를 실행합니다.

**장점:**
- 사용자 경험이 빠름
- 클릭 한 번으로 앱 실행

**단점:**
- 사용자가 의도하지 않은 리다이렉션으로 느낄 수 있음

```javascript
window.addEventListener('DOMContentLoaded', () => {
  const platform = detectPlatform();
  const { pathname, params } = parseURL();
  const deepLink = generateDeepLink(pathname, params, platform);

  if (deepLink) {
    window.location.href = deepLink;
  }
});
```

### 전략 2: 버튼 클릭 (현재 구현)
사용자가 "앱으로 이동" 버튼을 클릭할 때 딥링크를 실행합니다.

**장점:**
- 사용자가 제어 가능
- 의도가 명확함

**단점:**
- 클릭 액션이 하나 더 필요

```javascript
document.getElementById('app-button').addEventListener('click', () => {
  const platform = detectPlatform();
  const { pathname, params } = parseURL();
  const deepLink = generateDeepLink(pathname, params, platform);

  if (deepLink) {
    window.location.href = deepLink;
  }
});
```

### 전략 3: 하이브리드 (권장)
자동 실행 + 버튼 제공

```javascript
let autoRedirected = false;

// 자동 리다이렉션 (2초 후)
setTimeout(() => {
  if (!autoRedirected) {
    executeDeepLink();
    autoRedirected = true;
  }
}, 2000);

// 버튼 클릭
document.getElementById('app-button').addEventListener('click', () => {
  if (!autoRedirected) {
    executeDeepLink();
    autoRedirected = true;
  }
});
```

## 7. Fallback 처리

### iOS Fallback
```javascript
function openAppOrStoreIOS(deepLink, storeURL) {
  let opened = false;

  // 앱 실행 시도
  window.location.href = deepLink;

  // 1.5초 후에도 페이지가 활성 상태면 스토어로 이동
  setTimeout(() => {
    if (!document.hidden && !opened) {
      window.location.href = storeURL;
      opened = true;
    }
  }, 1500);
}
```

### Android Fallback
Intent URL에 fallback URL이 포함되어 있으므로 자동 처리됩니다.

```javascript
function openAppOrStoreAndroid(pathname, params) {
  const intentURL = generateDeepLink(pathname, params, 'android');
  window.location.href = intentURL;
  // fallback은 Intent URL 내부에서 자동 처리
}
```

## 8. 에러 처리

### 처리해야 할 에러 상황

1. **URL 파라미터 없음**
   - Default 페이지로 처리
   - 기본 앱 실행 링크 제공

2. **지원하지 않는 플랫폼**
   - 데스크톱 사용자에게 QR 코드 표시
   - 또는 "모바일에서 접속하세요" 안내

3. **링크 실행 실패**
   - 재시도 버튼 제공
   - 스토어 링크 명시적 표시

### 구현 예시
```javascript
function handleError(error, platform) {
  console.error('Link execution failed:', error);

  if (platform === 'other') {
    // 데스크톱 사용자
    showMessage('모바일 기기에서 접속해주세요');
    showQRCode(); // QR 코드 생성
  } else {
    // 모바일이지만 실패
    showMessage('앱을 열 수 없습니다. 스토어에서 다운로드하세요');
    showStoreButton(platform);
  }
}
```

## 9. 완전한 구현 예시

```javascript
(function() {
  'use strict';

  const APP_SCHEME = 'phoenixdarts://';
  const APP_PACKAGE = 'com.phoenixdarts.app';
  const IOS_APP_ID = '123456789';

  // URL 파싱
  function parseURL() {
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const params = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return { pathname, params };
  }

  // 플랫폼 감지
  function detectPlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
    if (/android/i.test(ua)) return 'android';
    return 'other';
  }

  // 딥링크 생성
  function generateDeepLink(pathname, params, platform) {
    const appPath = pathname.replace('/app/', '');
    const queryString = new URLSearchParams(params).toString();

    if (platform === 'ios') {
      return `${APP_SCHEME}${appPath}${queryString ? '?' + queryString : ''}`;
    } else if (platform === 'android') {
      const base = `intent://${appPath}${queryString ? '?' + queryString : ''}#Intent;`;
      const scheme = `scheme=${APP_SCHEME.replace('://', '')};`;
      const pkg = `package=${APP_PACKAGE};`;
      const fallback = `S.browser_fallback_url=https://play.google.com/store/apps/details?id=${APP_PACKAGE};`;
      return `${base}${scheme}${pkg}${fallback}end`;
    }
    return null;
  }

  // 스토어 URL
  function getStoreURL(platform) {
    if (platform === 'ios') {
      return `https://apps.apple.com/app/id${IOS_APP_ID}`;
    } else if (platform === 'android') {
      return `https://play.google.com/store/apps/details?id=${APP_PACKAGE}`;
    }
    return null;
  }

  // 앱 실행 또는 스토어 이동
  function openAppOrStore() {
    const platform = detectPlatform();

    if (platform === 'other') {
      // 데스크톱 처리
      alert('모바일 기기에서 접속해주세요');
      return;
    }

    const { pathname, params } = parseURL();
    const deepLink = generateDeepLink(pathname, params, platform);
    const storeURL = getStoreURL(platform);

    if (platform === 'ios') {
      // iOS: 딥링크 시도 → fallback to store
      window.location.href = deepLink;
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = storeURL;
        }
      }, 1500);
    } else if (platform === 'android') {
      // Android: Intent URL (자동 fallback)
      window.location.href = deepLink;
    }
  }

  // 버튼 클릭 이벤트
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('app-link-button');
    if (button) {
      button.addEventListener('click', openAppOrStore);
    }
  });

})();
```

## 10. 테스트 시나리오

### 테스트해야 할 케이스

1. **iOS + 앱 설치됨**
   - 딥링크로 앱 실행
   - 올바른 화면으로 이동

2. **iOS + 앱 미설치**
   - App Store로 리다이렉션
   - 올바른 앱 표시

3. **Android + 앱 설치됨**
   - Intent URL로 앱 실행
   - 올바른 화면으로 이동

4. **Android + 앱 미설치**
   - Play Store로 리다이렉션
   - 올바른 앱 표시

5. **데스크톱 접속**
   - 적절한 안내 메시지
   - QR 코드 표시 (옵션)

6. **다양한 브라우저**
   - Safari (iOS)
   - Chrome (iOS, Android)
   - Samsung Internet (Android)
   - 카카오톡 인앱 브라우저
   - 네이버 인앱 브라우저

### 테스트 도구
- 실제 디바이스 테스트 필수
- 시뮬레이터는 제한적
- 각 브라우저별 테스트 권장

## 11. 주의사항

1. **인앱 브라우저 제약**
   - 카카오톡, 네이버 등 인앱 브라우저는 딥링크 실행에 제약이 있을 수 있음
   - "외부 브라우저로 열기" 유도 필요

2. **iOS 제약**
   - Safari가 아닌 브라우저에서는 Universal Links가 제대로 작동하지 않을 수 있음
   - Custom URL Scheme 방식으로 fallback 필요

3. **Android 제약**
   - Chrome 25+ 버전에서 Intent URL 지원
   - 구형 브라우저에서는 작동하지 않을 수 있음

4. **프라이버시**
   - 앱 설치 여부를 정확하게 감지할 수 없음 (브라우저 정책)
   - 사용자 경험을 기반으로 추정만 가능

5. **타이밍**
   - 너무 빠른 리다이렉션은 사용자 혼란 유발
   - 적절한 딜레이 (1-2초) 권장
