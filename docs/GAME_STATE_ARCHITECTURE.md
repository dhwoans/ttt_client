# 게임 상태 아키텍처 가이드

이 문서는 싱글/멀티플레이 모드별 상태 관리와 훅 사용 패턴을 명확히 정리한 문서입니다.

---

## 현재 구조 (As-Is)

### Playing 컴포넌트의 상태/훅

```typescript
// 공통
const { board, turns, winner, isDraw, isGameOver, currentPlayer, isPlayerTurn } = useGameState(playersInfos);
const { handleRestart } = useGameRestart();

// 싱글 전용
const { handleSquare: handleSquareSingle } = usePlayerMove(...);
useAIMove(isGameOver, isPlayerTurn, board, playersInfos, mode);
const { handleTimeout } = useGameTimeout(currentPlayer.nickname);

// 멀티 전용
const { sendMove } = useSendPlayerMove();
const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(...);
const [isWaitingForServer, setIsWaitingForServer] = useState(false);
// + 소켓 이벤트 핸들러 (useEffect 내부)
```

**문제점:**

- 모든 훅이 모드와 무관하게 호출됨
- 멀티 전용 로직이 useEffect 안에 흩어져 있음
- 어떤 상태가 어느 모드에 필요한지 한눈에 안 보임

---

## 개선 구조 (To-Be)

### 1단계: 모드별 복합 훅 생성

```typescript
// src/features/game/hooks/useSingleGameLogic.ts
export function useSingleGameLogic(playersInfos, onTimeout) {
  const {
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    currentPlayer,
    isPlayerTurn,
    turnStart,
    timeoutBy,
  } = useGameState(playersInfos);
  const { handleSquare } = usePlayerMove(
    isGameOver,
    isPlayerTurn,
    playersInfos,
    turns,
  );
  const { handleRestart } = useGameRestart();
  const { handleTimeout } = useGameTimeout(currentPlayer.nickname);

  useAIMove(isGameOver, isPlayerTurn, board, playersInfos, "single");

  return {
    // 상태
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    currentPlayer,
    turnNickname: currentPlayer.nickname,
    canSelectSquare: !isGameOver && isPlayerTurn,
    turnStart,
    timeoutBy,

    // 액션
    handleSquare,
    handleRestart,
    handleTimeout,
  };
}
```

```typescript
// src/features/game/hooks/useMultiGameLogic.ts
export function useMultiGameLogic(playersInfos, mode, addTurn) {
  const {
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    currentPlayer,
    isPlayerTurn,
    turnStart,
    timeoutBy,
  } = useGameState(playersInfos);
  const { handleRestart } = useGameRestart();
  const { sendMove } = useSendPlayerMove();

  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(() =>
    sessionStorage.getItem("currentTurnPlayerId"),
  );
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);

  // 소켓 이벤트 핸들러 통합
  useMultiplayerEvents(
    mode,
    playersInfos,
    addTurn,
    setCurrentTurnPlayerId,
    setIsWaitingForServer,
  );

  // 턴 계산
  const sessionUserId = sessionStorage.getItem("userId");
  const socketConnId =
    sessionStorage.getItem("socketId") ??
    gameSocketManager.getSocket()?.id ??
    null;
  const isCurrentUserTurnByServer =
    !!currentTurnPlayerId &&
    (currentTurnPlayerId === sessionUserId ||
      currentTurnPlayerId === socketConnId);

  const currentTurnNicknameByServer = isCurrentUserTurnByServer
    ? (playersInfos[0]?.nickname ?? "")
    : (playersInfos.find((p) => p.userId === currentTurnPlayerId)?.nickname ??
      "");

  const handleSquare = useCallback(
    (row: number, col: number) => {
      if (isGameOver || !isCurrentUserTurnByServer || isWaitingForServer) {
        return;
      }
      setIsWaitingForServer(true);
      sendMove(row, col);
    },
    [isGameOver, isCurrentUserTurnByServer, isWaitingForServer, sendMove],
  );

  return {
    // 상태
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    turnNickname: currentTurnNicknameByServer,
    canSelectSquare:
      !isGameOver && isCurrentUserTurnByServer && !isWaitingForServer,
    turnStart,
    timeoutBy,

    // 액션
    handleSquare,
    handleRestart,
  };
}
```

### 2단계: Playing 컴포넌트 단순화

```typescript
export default function Playing({ playersInfos, mode, onExit, onRestart }) {
  const [showExitModal, setShowExitModal] = useState(false);
  const addTurn = useSingleGameStore((state) => state.addTurn);

  // 🎯 모드별 분기 명확화
  const singleGame = mode === "single"
    ? useSingleGameLogic(playersInfos, handleTimeout)
    : null;

  const multiGame = mode === "multi"
    ? useMultiGameLogic(playersInfos, mode, addTurn)
    : null;

  const game = mode === "single" ? singleGame : multiGame;

  return (
    <main>
      <Players playerInfos={playersInfos} isTurn={!game.isGameOver && game.turnNickname} />
      <Board list={game.board} selectSquare={game.canSelectSquare ? game.handleSquare : false} />
      {/* ... */}
    </main>
  );
}
```

**개선 효과:**

- 호출부에서 `useSingleGameLogic` vs `useMultiGameLogic` 명확히 구분
- 각 훅이 자신의 모드에 필요한 것만 관리
- 테스트/유지보수 용이 (모드별 독립적 테스트 가능)

---

## 구현 우선순위

1. `useMultiplayerEvents` 훅 추출 (소켓 이벤트 핸들러 통합)
2. `useSingleGameLogic` 복합 훅 생성
3. `useMultiGameLogic` 복합 훅 생성
4. `Playing` 컴포넌트 리팩토링
5. 기존 단위 훅들 재사용 검증

---

## 참고 원칙

- 복합 훅 내부에서 기존 단위 훅을 최대한 재사용
- 공통 로직(useGameState, useGameRestart)은 여전히 공유
- 모드별로 다른 인터페이스를 리턴해도 무방 (각자 최적화)

---
