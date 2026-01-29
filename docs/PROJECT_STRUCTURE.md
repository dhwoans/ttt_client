# 프로젝트 구조 (Project Structure)

## 📦 전체 구조

```
client/
├── docs/                          # 📚 문서
│   ├── FEATURES.md               # 주요 기능 개요
│   ├── TURN_TIMER.md            # 턴 타이머 명세
│   └── PROJECT_STRUCTURE.md      # 프로젝트 구조 (현재 파일)
│
├── src/
│   ├── App.tsx                   # 라우팅 진입점
│   ├── main.tsx                  # React DOM 마운트
│   ├── index.css                 # 전역 스타일
│   │
│   ├── features/                 # 🎮 주요 기능 모듈
│   │   ├── auth/                 # 인증
│   │   │   ├── AuthPage.tsx
│   │   │   ├── script.tsx
│   │   │   └── components/
│   │   │
│   │   ├── lobby/                # 로비 & 게임 모드 선택
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── useLobbySocket.tsx
│   │   │   └── components/
│   │   │       ├── GameModeGrid.tsx   # 싱글/멀티/로컬 선택
│   │   │       ├── LobbyPage.tsx
│   │   │       ├── Nav.tsx
│   │   │       ├── RoomItems.tsx
│   │   │       └── RoomList.tsx
│   │   │
│   │   └── game/                 # 🎯 게임 기능 (모드별 분리)
│   │       ├── single/           # ⭐ 싱글 모드 (AI 대전)
│   │       │   ├── SingleGameApp.tsx
│   │       │   ├── SoloGamePage.tsx
│   │       │   ├── useSoloGame.tsx
│   │       │   └── components/
│   │       │       ├── Board.tsx (복사본)
│   │       │       └── Players.tsx
│   │       │
│   │       ├── multi/            # 🌐 멀티 모드 (온라인)
│   │       │   ├── App.tsx
│   │       │   ├── GameManager.tsx
│   │       │   ├── GamePage.tsx
│   │       │   ├── main.tsx
│   │       │   ├── useGameSocket.tsx
│   │       │   └── components/
│   │       │       ├── Chat.tsx
│   │       │       ├── DifficultySelector.tsx
│   │       │       ├── Players.tsx
│   │       │       ├── Ready.tsx
│   │       │       └── SpeechBalloon.tsx
│   │       │
│   │       ├── local/            # 👥 로컬 모드 (파티 게임)
│   │       │   ├── LocalHostView.tsx    # 호스트 (큰 화면)
│   │       │   ├── LocalGuestView.tsx   # 게스트 (컨트롤러)
│   │       │   └── useLocalGame.tsx     # 로컬 로직
│   │       │
│   │       ├── shared/           # 📦 모드 공유 컴포넌트
│   │       │   └── components/
│   │       │       └── Board.tsx        # ✨ 모든 모드에서 사용
│   │       │
│   │       ├── hooks/            # 기존 Hooks (마이그레이션 대상)
│   │       ├── util/             # 기존 유틸
│   │       └── __tests__/        # 테스트
│   │
│   ├── shared/                   # 🔧 전역 공유 리소스
│   │   ├── components/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Countdown.tsx    # ⏱️ 턴 타이머 컴포넌트
│   │   │   └── modals/
│   │   │       ├── AvatorSelectModal.tsx
│   │   │       ├── ExitModal.tsx
│   │   │       ├── GameOverModal.tsx
│   │   │       └── SettingsModal.tsx
│   │   │
│   │   ├── utils/
│   │   │   ├── AIPlayer.ts       # AI 로직
│   │   │   ├── ApiManager.ts     # API 통신
│   │   │   ├── AudioManager.ts   # 음성 관리
│   │   │   ├── EffectManager.ts
│   │   │   ├── EventManager.ts   # 🔌 Socket 이벤트
│   │   │   ├── eventList.ts
│   │   │   ├── randomAvatar.ts
│   │   │   ├── randomBot.ts
│   │   │   └── winning-combinations.ts
│   │   │
│   │   ├── stores/
│   │   │   └── audioStore.ts    # 🎵 음성 상태 (Zustand)
│   │   │
│   │   ├── test/
│   │   │   ├── setup.ts
│   │   │   ├── test-utils.tsx
│   │   │   └── utils.test.ts
│   │   │
│   │   └── __tests__/
│   │       ├── AsyncComponent.test.tsx
│   │       ├── Avatar.test.tsx
│   │       ├── Snapshot.test.tsx
│   │       └── UserEvents.test.tsx
│   │
│   └── mock/
│       ├── browser.ts           # MSW 설정
│       └── handlers.ts          # Mock API
│
├── assets/                       # 🖼️ 정적 리소스
│   ├── animals/
│   ├── animations/
│   ├── backgrounds/
│   ├── bots/
│   ├── icons/
│   └── sound/
│
├── public/
│   └── mockServiceWorker.js
│
├── 📄 설정 파일
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── index.html
│
└── 📖 문서
    ├── README.md
    └── DEVELOPMENT_STRATEGY.md
```

---

## 🎮 게임 모드별 아키텍처

### 싱글 모드 (Single Mode)

```
/game/single
  └── SingleGameApp.tsx
      ├── Board (shared)
      ├── Players (local)
      └── AI Logic (AIPlayer.ts)
```

**특징**:

- 서버 통신 없음
- 로컬 AI 대전
- 간단한 상태 관리 (useState)

---

### 멀티 모드 (Multi Mode)

```
/game/:roomId
  └── GameApp (multi/App.tsx)
      ├── GameManager
      ├── GamePage
      │   ├── Board (shared)
      │   └── Players
      └── useGameSocket (WebSocket)
```

**특징**:

- WebSocket 실시간 통신
- 두 명의 원격 플레이어
- 복잡한 상태 동기화

---

### 로컬 모드 (Local Mode)

```
/game/:roomId?role=host|guest
  ├── LocalHostView (큰 화면)
  │   ├── Board (shared)
  │   └── Players Info
  │
  └── LocalGuestView (컨트롤러)
      └── 조작 UI만
```

**특징**:

- 파티 게임 형식 (Jackbox 스타일)
- 호스트/게스트 역할 분리
- 로컬 네트워크 또는 같은 기기

---

## 📊 상태 관리 전략

### 현재 상태 관리

| 레벨         | 도구             | 사용 사례              |
| ------------ | ---------------- | ---------------------- |
| 로컬         | `useState`       | 게임 보드, 턴 관리     |
| 애플리케이션 | `Zustand`        | 음성 설정 (audioStore) |
| 외부         | `sessionStorage` | 사용자 정보, 룸 ID     |
| 실시간       | `Socket.io`      | 멀티 모드 동기화       |

### Future: 전역 상태 관리 추가 고려

- 대규모 기능 추가 시 Redux/Context API 도입

---

## 🔌 통신 계층

### Socket.io 이벤트

파일: `src/shared/utils/eventList.ts`

**주요 이벤트**:

- `GAME_START` - 게임 시작
- `PLAYER_MOVE` - 플레이어 이동
- `GAME_END` - 게임 종료
- `CHAT_MESSAGE` - 채팅 메시지

### API 관리

파일: `src/shared/utils/ApiManager.ts`

**주요 엔드포인트**:

- `POST /room` - 방 생성
- `GET /room/:id` - 방 조회
- `DELETE /room/:id` - 방 나가기

---

## 🧪 테스트 구조

```
__tests__/
├── features/game/
│   ├── AIPlayer.test.ts
│   ├── GameBoard.test.tsx
│   └── SoloGame.test.tsx
│
└── shared/components/
    ├── AsyncComponent.test.tsx
    ├── Avatar.test.tsx
    ├── Snapshot.test.tsx
    └── UserEvents.test.tsx
```

**테스트 도구**:

- Vitest (단위 테스트)
- React Testing Library (컴포넌트 테스트)

---

## 📈 마이그레이션 로드맵

### Phase 1: 구조 정렬 ✅ (진행 중)

- [x] 게임 폴더를 모드별 분리 (single, multi, local)
- [x] 공유 컴포넌트 분리 (shared/components)
- [ ] 로컬 모드 컴포넌트 작성

### Phase 2: Hook 최적화

- [ ] useSoloGame 분리 (single 모드)
- [ ] useMultiGame 분리 (multi 모드)
- [ ] useLocalGame 분리 (local 모드)

### Phase 3: 전역 상태 관리

- [ ] Redux 또는 Zustand 도입 검토
- [ ] Props Drilling 제거

### Phase 4: 테스트 강화

- [ ] 테스트 커버리지 70% 목표

---

## 🔗 관련 문서

- [주요 기능 (FEATURES.md)](./FEATURES.md)
- [턴 타이머 명세 (TURN_TIMER.md)](./TURN_TIMER.md)
- [개발 전략 (DEVELOPMENT_STRATEGY.md)](../DEVELOPMENT_STRATEGY.md)
