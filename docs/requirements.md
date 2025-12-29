# 앱링크 수신 페이지 개발 요구사항

## 프로젝트 개요

이 프로젝트는 앱링크 수신을 위한 테스트 개발용 페이지입니다. 웹 페이지를 통해 사용자를 모바일 앱으로 연결하는 것이 주요 목적입니다.

## 프로젝트 목적

- 앱링크 수신 페이지를 서빙하기 위한 테스트 환경 제공
- 다양한 웹사이트에 이식 가능한 독립적인 앱 연결 페이지 제공

## 기술 요구사항

### 제약사항
- 순수 JavaScript, HTML, CSS로만 구현
- React, Vue 등 별도 프레임워크 사용 금지
- 다른 웹사이트에 이식 가능해야 함

### 이유
이 페이지는 다른 웹사이트에 쉽게 통합될 수 있어야 하므로, 외부 의존성 없이 독립적으로 동작해야 합니다.

## 링크 전략

이 프로젝트는 동호회 중심의 공유 기능을 제공합니다. OG 태그가 달라지는 각 공유 타입별로 별도의 path를 사용합니다.

### 링크 타입

#### 1. 동호회 자체 공유
동호회를 소개하고 공유하는 링크

**URL 구조:**
```
https://bowonlee.github.io/webviewTest/app/club?id={clubId}
```

**Path:** `/app/club`

**Query 파라미터:**
- `id`: 동호회 ID

**OG 태그 내용:**
- 제목: "Phoenix Darts 동호회에 참여하세요"
- 설명: "함께 다트를 즐기는 동호회에 가입하세요"
- 이미지: 동호회 대표 이미지

**딥링크:**
- `phoenixdarts://club?id={clubId}`

#### 2. 동호회 초대
특정 사용자를 동호회로 초대하는 링크

**URL 구조:**
```
https://bowonlee.github.io/webviewTest/app/club/invite?id={clubId}&inviteCode={code}
```

**Path:** `/app/club/invite`

**Query 파라미터:**
- `id`: 동호회 ID
- `inviteCode`: 초대 코드

**OG 태그 내용:**

- 제목: "Phoenix Darts 동호회 초대"
- 설명: "동호회 초대를 받았습니다. 지금 바로 참여하세요"
- 이미지: 초대 전용 이미지

**딥링크:**
- `phoenixdarts://club/invite?id={clubId}&inviteCode={code}`

#### 3. 동호회 게시글 공유
동호회 내 게시글을 공유하는 링크

**URL 구조:**
```
https://bowonlee.github.io/webviewTest/app/club/post?clubId={clubId}&postId={postId}
```

**Path:** `/app/club/post`

**Query 파라미터:**
- `clubId`: 동호회 ID
- `postId`: 게시글 ID

**OG 태그 내용:**

- 제목: "Phoenix Darts 게시글"
- 설명: "동호회 게시글을 확인하세요"
- 이미지: 게시글 썸네일 이미지

**딥링크:**
- `phoenixdarts://club/post?clubId={clubId}&postId={postId}`

#### 4. Default (기본)
특정 타입이 지정되지 않거나 알 수 없는 경로로 진입한 경우

**URL 구조:**
```
https://bowonlee.github.io/webviewTest/app
```

**Path:** `/app`

**OG 태그 내용:**
- 제목: "Phoenix Darts"
- 설명: "다트 게임을 즐기는 최고의 방법"
- 이미지: 앱 기본 이미지

**딥링크:**
- `phoenixdarts://`

### 디렉토리 구조

```
public/
  app/
    index.html              ← Default (기본)
    club/
      index.html            ← 동호회 자체 공유
      invite/
        index.html          ← 동호회 초대
      post/
        index.html          ← 동호회 게시글 공유
    app-link.js             ← 공통 JavaScript 로직
    app-link.css            ← 공통 스타일
```

## 기능 요구사항

### 1. 페이지 레이아웃
- 페이지 중앙에 "앱으로 이동" 버튼 배치
- 사용자 진입 즉시 명확하게 보이는 UI

### 2. URL 파라미터 처리
진입 URL은 path와 query 파라미터가 혼합된 형태로 제공됩니다.

**URL 예시:**
```
https://bowonlee.github.io/webviewTest/app/club?id=1059
https://bowonlee.github.io/webviewTest/app/club/post?clubId=1059&postId=1093
```

**파라미터 구조:**
- Path: 링크 타입 식별
- Query: 각 타입별 필요한 ID 값

### 3. 플랫폼 감지
사용자의 디바이스 플랫폼을 자동으로 감지합니다.
- iOS 디바이스 감지
- Android 디바이스 감지

### 4. 앱 설치 여부 확인
사용자 디바이스에 앱이 설치되어 있는지 확인합니다.
- 앱 설치됨: 앱 실행 링크
- 앱 미설치: 앱 스토어 링크

### 5. 딥링크 실행
"앱으로 이동" 버튼 클릭 시 다음 조건에 따라 적절한 링크를 실행합니다.

**조건별 동작:**
- iOS + 앱 설치됨 → 앱 딥링크 실행
- iOS + 앱 미설치 → App Store 링크
- Android + 앱 설치됨 → 앱 딥링크 실행
- Android + 앱 미설치 → Google Play Store 링크

**딥링크 구조:**
진입 시 받은 path와 query 파라미터를 그대로 유지하여 앱에 전달합니다.

## 구현 범위

### 포함 항목
1. 앱 연결 페이지 (순수 JS/HTML/CSS)
   - 플랫폼 감지 로직
   - 앱 설치 확인 로직
   - URL 파라미터 파싱
   - 딥링크 생성 및 실행

### 제외 항목
1. `.well-known` 관련 설정
   - Apple App Site Association
   - Android Asset Links
   - 이 프로젝트에서는 필요하지 않음

## 현재 구현 상태

- `src/pages/AppPage.tsx`에 React 컴포넌트로 기본 구조 구현
- iOS/Android 버튼 UI만 존재
- 실제 플랫폼 감지 및 딥링크 로직 미구현

## 구현 계획

### 1. 페이지 구조
순수 HTML로 페이지 마크업 작성
- 버튼 요소
- 로딩 인디케이터 (옵션)

### 2. 스타일링
순수 CSS로 반응형 디자인 구현
- 중앙 정렬 레이아웃
- 모바일 최적화

### 3. JavaScript 로직

#### 3.1 URL 파라미터 파싱

**목적:**
진입 URL에서 path와 query 파라미터를 추출하여 딥링크 생성에 사용

**처리 방식:**
```javascript
입력: https://bowonlee.github.io/webviewTest/app/club/post?clubId=1059&postId=1093
출력:
- pathname: /app/club/post
- params: { clubId: 1059, postId: 1093 }
```

**구현 방법:**
- `window.location` 객체 활용
- `URLSearchParams` API로 query 파싱
- path에서 `/app/` 제거하여 딥링크 경로 생성

#### 3.2 플랫폼 감지

**목적:**
사용자 디바이스 플랫폼을 식별하여 플랫폼별 처리 로직 적용

**감지 방법:**
User Agent 문자열 분석
- iOS: `/iPad|iPhone|iPod/` 패턴 매칭
- Android: `/android/i` 패턴 매칭
- 기타: 데스크톱 등

**플랫폼별 특성:**
- iOS: Custom URL Scheme, Universal Links 지원
- Android: Intent URL, App Links 지원
- 기타: 웹 버전 안내 또는 QR 코드 표시

#### 3.3 앱 설치 확인

**목적:**
앱 설치 여부에 따라 앱 실행 또는 스토어 이동 결정

**iOS 확인 방법:**
1. **Custom URL Scheme + 타임아웃 방식**
   - 딥링크 실행 시도
   - `visibilitychange` 이벤트로 앱 실행 감지
   - 2초 타임아웃 내 페이지가 백그라운드로 이동하면 앱 설치됨
   - 그렇지 않으면 앱 미설치로 판단

2. **Universal Links 방식 (권장)**
   - 앱 설치됨: 자동으로 앱 실행
   - 앱 미설치: 웹 페이지 유지 → 스토어 링크 제공

**Android 확인 방법:**
1. **Intent URL + Fallback 방식 (권장)**
   - Intent URL에 `browser_fallback_url` 포함
   - 앱 설치됨: 앱 실행
   - 앱 미설치: 자동으로 Play Store 이동

2. **타임아웃 방식**
   - iOS와 유사한 방식
   - 정확도가 낮을 수 있음

**한계점:**
- 완벽한 앱 설치 확인 불가능 (브라우저 보안 정책)
- 브라우저별로 동작이 다를 수 있음
- 인앱 브라우저에서는 제약이 있을 수 있음

#### 3.4 딥링크 생성

**목적:**
파싱한 URL 정보를 기반으로 플랫폼별 딥링크 생성

**딥링크 구조:**

**iOS - Custom URL Scheme:**
```
phoenixdarts://club/post?clubId=1059&postId=1093
```

**iOS - Universal Links:**
```
https://phoenixdarts.app/club/post?clubId=1059&postId=1093
```

**Android - Custom URL Scheme:**
```
phoenixdarts://club/post?clubId=1059&postId=1093
```

**Android - Intent URL (권장):**
```
intent://club/post?clubId=1059&postId=1093#Intent;
  scheme=phoenixdarts;
  package=com.phoenixdarts.app;
  S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.phoenixdarts.app;
  end
```

**스토어 링크:**
- App Store: `https://apps.apple.com/app/id{APP_ID}`
- Play Store: `https://play.google.com/store/apps/details?id={PACKAGE_NAME}`

#### 3.5 링크 실행 전략

**전략 1: 즉시 실행**
- 페이지 로드와 동시에 자동으로 딥링크 실행
- 장점: 빠른 사용자 경험
- 단점: 의도하지 않은 리다이렉션으로 느낄 수 있음

**전략 2: 버튼 클릭 (현재 채택)**
- "앱으로 이동" 버튼 클릭 시 딥링크 실행
- 장점: 사용자가 제어 가능, 의도가 명확
- 단점: 클릭 액션이 하나 더 필요

**전략 3: 하이브리드**
- 2초 후 자동 실행 + 버튼 제공
- 장점: 빠른 경험 + 사용자 제어 모두 제공

#### 3.6 Fallback 처리

**목적:**
앱 실행 실패 시 스토어로 안내

**iOS Fallback:**
```javascript
// 딥링크 실행
window.location.href = deepLink;

// 1.5초 후에도 페이지가 활성 상태면 스토어로 이동
setTimeout(() => {
  if (!document.hidden) {
    window.location.href = storeURL;
  }
}, 1500);
```

**Android Fallback:**
Intent URL에 fallback URL이 포함되어 있어 자동 처리
```
S.browser_fallback_url=https://play.google.com/store/apps/...
```

### 4. 에러 처리

#### 4.1 URL 파라미터 없음
- Default 페이지로 처리
- 기본 앱 실행 링크 제공
- 앱 홈 화면으로 이동

#### 4.2 지원하지 않는 플랫폼
- 데스크톱 사용자 감지
- "모바일 기기에서 접속하세요" 안내 메시지 표시
- QR 코드 생성하여 모바일 접속 유도 (옵션)

#### 4.3 링크 실행 실패
- 재시도 버튼 제공
- 스토어 링크 명시적으로 표시
- 에러 로그 수집 (옵션)

#### 4.4 인앱 브라우저 제약
- 카카오톡, 네이버 등 인앱 브라우저 감지
- "외부 브라우저로 열기" 안내
- 딥링크가 제대로 작동하지 않을 수 있음을 경고

### 5. 상세 처리 플로우

```
사용자 링크 클릭
    ↓
웹 페이지 로드
    ↓
URL 파라미터 파싱 (pathname, params)
    ↓
플랫폼 감지 (iOS/Android/기타)
    ↓
[데스크톱인 경우]
    → 모바일 접속 안내
    → QR 코드 표시(개발 진행 중)

[모바일인 경우]
    ↓
페이지 렌더링 (버튼 표시)
    ↓
버튼 클릭
    ↓
딥링크 생성 (플랫폼별)
    ↓
[iOS] 딥링크 실행 → 1.5초 대기 → 앱 미실행 시 App Store
[Android] Intent URL 실행 (자동 fallback 포함)
    ↓
앱 실행 또는 스토어 이동
```

## 배포

GitHub Pages를 통해 정적 페이지로 배포
- 빌드 없이 순수 HTML/JS/CSS 파일 직접 서빙
- 또는 기존 React 프로젝트 내 정적 파일로 포함
