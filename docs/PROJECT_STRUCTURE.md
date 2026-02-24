# 프로젝트 구조 (Project Structure)

## 📦 전체 구조

```
client/
├── docs/                          # 📚 문서
│   ├── FEATURES.md
│   ├── TURN_TIMER_v2.md
│   ├── PROJECT_STRUCTURE.md
│   ├── CHARACTER_BOARD.md
│   ├── GAMEMANAGER.md
│   ├── RECOVERY_MECHANISM.md
│   ├── NAMING_CONVENTIONS.md
│   └── DEVELOPMENT_STRATEGY.md
│
├── src/
│   ├── App.tsx                   # 라우팅 진입점
│   ├── main.tsx                  # React DOM 마운트
│   ├── index.css                 # 전역 스타일
│   ├── vite-env.d.ts             # 타입 환경
│   │
│   ├── features/                 # 🎮 주요 기능 모듈
│   │   ├── auth/
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   │   └── CharacterBoard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useCharacterBoard.tsx
│   │   │   └── __tests__/
│   │   │       └── useCharacterBoard.test.tsx
│   │   │
│   │   ├── lobby/
│   │   │   ├── App.tsx
│   │   │   ├── useLobbySocket.tsx
│   │   │   └── components/
│   │   │       ├── GameModeGrid.tsx
│   │   │       ├── LobbyPage.tsx
│   │   │       ├── RoomItems.tsx
│   │   │       └── RoomList.tsx
│   │   │   └── __tests__/
│   │   │
│   │   └── game/
│   │       ├── Board.tsx
│   │       ├── GameManager.tsx
│   │       ├── GameStartBlocksTransition.tsx
│   │       ├── Players.tsx
│   │       ├── Ready.tsx
│   │       ├── VersusBanner.tsx
│   │       ├── types.ts
│   │       ├── hooks/
│   │       │   ├── useGameSocket.ts (deprecated ⚠️)
│   │       │   ├── useGameSocketConnection.ts
│   │       │   ├── useSendReady.ts
│   │       │   ├── useSendMove.ts
│   │       │   ├── useSendChat.ts
│   │       │   ├── useSendLeave.ts
│   │       │   ├── useSoloGame.ts (deprecated ⚠️)
│   │       │   ├── useGameState.ts
│   │       │   ├── usePlayerMove.ts
│   │       │   ├── useAIMove.ts
│   │       │   ├── useGameTimeout.ts
│   │       │   └── useGameRestart.ts
│   │       ├── local/
│   │       ├── multi/
│   │       │   ├── App.tsx
│   │       │   ├── GameManager.tsx
│   │       │   ├── GamePage.tsx
│   │       │   └── components/
│   │       │       ├── Chat.tsx
│   │       │       ├── DifficultySelector.tsx
│   │       │       ├── Players.tsx
│   │       │       ├── Ready.tsx
│   │       │       └── SpeechBalloon.tsx
│   │       ├── single/
│   │       │   ├── App.tsx
│   │       │   ├── SoloGamePage.tsx
│   │       │   └── components/
│   │       ├── util/
│   │       │   └── ticTacToeUtils.ts
│   │       ├── __tests__/
│   │       │   ├── GameBoard.test.tsx
│   │       │   └── SoloGame.test.tsx
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Countdown.tsx
│   │   │   ├── Nav.tsx
│   │   │   └── __tests__/
│   │   │       ├── AIPlayer.test.ts
│   │   │       ├── AsyncComponent.test.tsx
│   │   │       ├── Avatar.test.tsx
│   │   │       ├── Countdown.test.tsx
│   │   │       ├── Snapshot.test.tsx
│   │   │       ├── UserEvents.test.tsx
│   │   │       └── __snapshots__/
│   │   ├── hooks/
│   │   │   ├── useAudioEffect.tsx
│   │   │   ├── useBackExitModal.ts
│   │   │   ├── useCountdown.ts
│   │   │   ├── useGameResult.ts
│   │   │   ├── usePlayerInfo.ts
│   │   │   └── useSingleGameStorageManager.ts
│   │   ├── modals/
│   │   │   ├── AvatorSelectModal.tsx
│   │   │   ├── ExitModal.tsx
│   │   │   ├── GameOverModal.tsx
│   │   │   └── SettingsModal.tsx
│   │   ├── utils/
│   │   │   ├── AIPlayer.ts
│   │   │   ├── ApiManager.ts
│   │   │   ├── AudioManager.ts
│   │   │   ├── CountdownManager.ts
│   │   │   ├── EffectManager.ts
│   │   │   ├── eventList.ts
│   │   │   ├── EventManager.ts
│   │   │   ├── playerStorage.ts
│   │   │   ├── randomAvatar.ts
│   │   │   ├── randomBot.ts
│   │   │   └── winning-combinations.ts
│   │   ├── stores/
│   │   │   └── audioStore.ts
│   │   ├── __test__/
│   │   │   └── aiEngine.test.ts
│   │   └── test/
│   │       ├── setup.ts
│   │       ├── test-utils.tsx
│   │       └── utils.test.ts
│   │
│   └── mock/
│       ├── browser.ts
│       └── handlers.ts
│
├── assets/
│   ├── animals/
│   ├── animations/
│   ├── backgrounds/
│   ├── bots/
│   ├── icons/
│   ├── sound/
│   ├── Chequered Flag.png
│   ├── favicon.ico
│   ├── Hand with Fingers Splayed.png
│   ├── Index Pointing Up.png
│
├── public/
│   └── mockServiceWorker.js
│
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── index.html
└── README.md
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

- [x] useSoloGame 분리
  - [x] useGameState (상태 관리 및 스토리지)
  - [x] usePlayerMove (플레이어 이동)
  - [x] useAIMove (AI 자동 이동)
  - [x] useGameTimeout (타임아웃 처리)
  - [x] useGameRestart (게임 재시작)
- [ ] useGameSocket 분리 (멀티 모드)
- [ ] 로컬 모드 게임 로직 Hook 작성

### Phase 3: 전역 상태 관리

- [ ] Redux 또는 Zustand 도입 검토
- [ ] Props Drilling 제거

### Phase 4: 테스트 강화

- [ ] 테스트 커버리지 70% 목표

---

## ☁️ 배포 및 동시접속자(동접) 설계

본 프로젝트는 AWS Lightsail, DigitalOcean 등 소규모 클라우드 인스턴스 환경에서의 배포를 염두에 두고 설계되었습니다.

### Nginx 리버스 프록시 및 인스턴스 확장 시 동접 처리

- 백엔드 인스턴스를 확장하여, 더많은 동시접속자까지도 처리할 수 있도록 설계했습니다.(이론적으로 2배까지 접속가능)
  이를 위해 다음 조건이 충족시켰습니다.
  - Nginx가 트래픽을 로드밸런싱할 것
  - Redis를 사용하여 인스턴스 간 일관성 유지
  - 실제 서비스와 유사한 환경에서 추가적인 부하 테스트로 검증

- **예상 동시접속자(동접) 수**: 20~50명 수준의 소규모 트래픽을 기준으로 개발되었습니다.
  - 단일 인스턴스(1vCPU, 1~2GB RAM)에서 무리 없이 동작하도록 최적화
  - 실시간 멀티플레이(웹소켓) 기능은 50명 내외의 동접까지 안정적으로 처리 가능하도록 설계
- 대규모 트래픽 발생 시에는 인스턴스 스펙 업그레이드 또는 로드밸런싱 구조로 확장 필요

> **참고:**
>
> - 개발 및 테스트 환경 기준이며, 실제 서비스 환경에서는 네트워크/서버 성능에 따라 차이가 있을 수 있습니다.
> - 서버 부하 테스트 및 모니터링을 통해 적정 동접 수를 지속적으로 검증할 것을 권장합니다.

---

## 🔗 관련 문서

- [주요 기능 (FEATURES.md)](./FEATURES.md)
- [턴 타이머 명세 (TURN_TIMER.md)](./TURN_TIMER.md)
- [개발 전략 (DEVELOPMENT_STRATEGY.md)](../DEVELOPMENT_STRATEGY.md)
