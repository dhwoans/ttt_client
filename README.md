# Tic Tac Toe (틱택토) 게임 클라이언트

실시간 멀티플레이 틱택토 게임의 클라이언트 애플리케이션입니다. React와 TypeScript로 구현되었으며, Socket.io를 통한 실시간 통신을 지원합니다.

## 📋 목차

- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [주요 기능](#주요-기능)
- [테스트](#테스트)
- [명령어](#명령어)

## 🏗️ 프로젝트 구조

```
src/
├── features/                    # 주요 기능별 모듈
│   ├── auth/                   # 인증 시스템
│   │   ├── AuthPage.tsx
│   │   ├── script.tsx
│   │   ├── components/
│   │   │   └── CharacterBoard.tsx
│   │   └── __tests__/          # 인증 테스트
│   │
│   ├── game/                   # 게임 로직
│   │   ├── GamePage.tsx
│   │   ├── GameManager.tsx
│   │   ├── useGameSocket.tsx   # 게임 소켓 훅
│   │   ├── components/
│   │   │   ├── Board.tsx       # 게임판
│   │   │   ├── Chat.tsx        # 채팅
│   │   │   ├── Player.tsx      # 플레이어 정보
│   │   │   ├── Ready.tsx       # 준비 상태
│   │   │   └── SpeechBalloon.tsx
│   │   └── __tests__/          # 게임 테스트
│   │
│   └── lobby/                  # 로비 (방 목록)
│       ├── LobbyPage.tsx
│       ├── RoomList.tsx
│       ├── useLobbySocket.tsx  # 로비 소켓 훅
│       ├── components/
│       │   ├── EmptyLobby.tsx
│       │   ├── LobbyPage.tsx
│       │   ├── Nav.tsx
│       │   ├── RoomItems.tsx
│       │   └── RoomList.tsx
│       └── __tests__/          # 로비 테스트
│
├── shared/                     # 공유 모듈
│   ├── components/            # 공용 컴포넌트
│   │   ├── Avatar.tsx         # 사용자 아바타
│   │   ├── modals/
│   │   │   ├── AvatorSelectModal.tsx
│   │   │   ├── ExitModal.tsx
│   │   │   └── GameOverModal.tsx
│   │   └── __tests__/         # 컴포넌트 테스트
│   │
│   └── utils/                 # 유틸리티 함수
│       ├── ApiManager.ts      # API 관리
│       ├── AudioManager.ts    # 사운드 관리
│       ├── EffectManager.ts   # 효과 관리
│       ├── EventManager.ts    # 이벤트 관리
│       ├── eventList.ts       # 이벤트 목록
│       └── randomAvatar.ts    # 랜덤 아바타
│
├── mock/                      # Mock Service Worker (MSW)
│   ├── browser.ts
│   └── handlers.ts
│
├── test/                      # 테스트 설정
│   ├── setup.ts               # Vitest 설정
│   ├── test-utils.tsx         # 테스트 유틸리티
│   └── utils.test.ts          # 유틸리티 함수 테스트
│
├── App.tsx                    # 메인 앱 컴포넌트
├── main.tsx                   # 진입점
├── index.css                  # 전역 스타일
└── vite-env.d.ts             # Vite 환경 변수

assets/
└── sound/                     # 게임 사운드 파일

public/
└── mockServiceWorker.js      # MSW 워커

```

## 🛠️ 기술 스택

### 핵심 라이브러리

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 빌드 도구
- **Socket.io** - 실시간 통신
- **React Router DOM** - 라우팅

### 스타일링

- **Tailwind CSS 4** - 유틸리티 CSS
- **Animate.css** - 애니메이션

### 개발/테스트

- **Vitest** - 단위 테스트
- **@testing-library/react** - React 컴포넌트 테스트
- **@testing-library/user-event** - 사용자 이벤트 시뮬레이션
- **Mock Service Worker** - API 모킹

### 기타

- **ESLint** - 코드 린팅
- **Babel Plugin React Compiler** - React 최적화
- **Motion** - 애니메이션 라이브러리

## 📦 설치 및 실행

### 전제 조건

- Node.js 16+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 시작됩니다.

### 빌드

```bash
npm run build
```

프로덕션 빌드가 `dist/` 디렉토리에 생성됩니다.

## ✨ 주요 기능

### 1. 인증 (Auth)

- 사용자 로그인/회원가입
- 캐릭터 선택 시스템
- 아바타 커스터마이징

### 2. 로비 (Lobby)

- 게임 방 목록 조회
- 실시간 방 상태 업데이트
- 방 생성 및 입장

### 3. 게임 (Game)

- 실시간 틱택토 게임 플레이
- 실시간 채팅
- 플레이어 준비 상태 표시
- 게임 결과 및 통계

### 4. 사운드 및 효과

- 게임 이벤트별 사운드
- 시각 효과 (Confetti 등)
- 배경음악

## 🧪 테스트

### 테스트 구조

프로젝트는 각 기능 모듈별로 `__tests__` 디렉토리를 포함하고 있습니다:

```
features/
├── auth/__tests__/          # 인증 테스트
├── game/__tests__/          # 게임 로직 테스트
└── lobby/__tests__/         # 로비 테스트

shared/components/__tests__/  # 공용 컴포넌트 테스트
```

### 테스트 파일 예제

#### 1. 컴포넌트 테스트 (Avatar.test.tsx)

```typescript
- 컴포넌트 렌더링 확인
- 클릭 이벤트 처리
- 커스텀 클래스 적용
```

#### 2. 사용자 이벤트 테스트 (UserEvents.test.tsx)

```typescript
- 폼 입력 및 제출
- 유효성 검사
- 사용자 상호작용 시뮬레이션
```

#### 3. 비동기 테스트 (AsyncComponent.test.tsx)

```typescript
- 데이터 로딩 상태
- waitFor를 이용한 대기
- API 호출 처리
```

#### 4. 게임 컴포넌트 테스트 (GameBoard.test.tsx)

```typescript
- 게임판 렌더링
- 셀 클릭 이벤트
- 게임 상태 변경
```

#### 5. 스냅샷 테스트 (Snapshot.test.tsx)

```typescript
- 컴포넌트 구조 변경 추적
- UI 일관성 검증
```

#### 6. 유틸리티 함수 테스트 (utils.test.ts)

```typescript
- 이메일 유효성 검사
- 점수 계산 로직
- 순수 함수 테스트
```

### 테스트 도구

**test-utils.tsx**

- 커스텀 `render` 함수로 Provider 자동 적용
- React Router 래퍼 포함

**setup.ts**

- Vitest 전역 설정
- DOM 정리 (`afterEach`)
- `window.matchMedia` 모킹

## 📝 명령어

### 개발

```bash
npm run dev          # 개발 서버 시작
```

### 빌드

```bash
npm run build        # 프로덕션 빌드
```

### 테스트

```bash
npm test             # 테스트 실행 (감시 모드)
npm run test:ui      # Vitest UI 대시보드 열기
npm run test:coverage # 커버리지 리포트 생성
```

## 🔧 설정 파일

### vitest.config.ts

- Vitest 환경 설정
- jsdom으로 DOM 환경 시뮬레이션
- 커버리지 설정
- 모듈 경로 설정

### tsconfig.json

- TypeScript 컴파일 옵션
- JSX 설정 (react-jsx)
- Strict 모드 설정

### vite.config.ts

- Vite 빌드 설정
- React 플러그인
- 경로 별칭 설정

## 🚀 시작하기

1. **저장소 클론 및 설치**

   ```bash
   npm install
   ```

2. **개발 서버 실행**

   ```bash
   npm run dev
   ```

3. **테스트 작성 (예시)**
   - `src/features/auth/__tests__/` 디렉토리에 테스트 파일 추가
   - 기존 예제 파일을 참고하여 작성

4. **테스트 실행**
   ```bash
   npm test
   ```

## 📚 학습 자료

### Vitest 공식 문서

- https://vitest.dev/

### Testing Library 공식 문서

- https://testing-library.com/react

### Socket.io 공식 문서

- https://socket.io/docs/


## 📄 라이선스

ISC
