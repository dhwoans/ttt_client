# 싱글게임 상태 복구 메커니즘 (Countdown/State Persistence)

## 1. 기본 동작 원리

- **상태 저장**: 게임의 모든 상태(turns, turnStart, isTimeOver 등)는 하나의 객체(gameState)로 관리함. 이 객체는 React의 useState로 관리되고 동시에 localStorage에 동기화함.
- **상태 복원**: 페이지가 새로고침되거나 재진입할 때, localStorage에 저장된 gameState를 불러와 초기 상태로 사용함. turnStart(턴 시작 시간)도 함께 복원되어 카운트다운이 이어짐.
- **카운트다운 유지**: turnStart를 기준으로 남은 시간을 계산하므로, 새로고침해도 카운트다운이 10초로 초기화되지 않고 실제 남은 시간이 유지됨.
- **다시하기/게임종료**: handleRestart 등에서 turnStart를 Date.now()로 갱신하고, 즉시 localStorage에 저장하여 첫 턴에도 복구가 정상적으로 동작함.

## 2. 주요 버그 및 문제점

### (1) 첫 턴 새로고침 시 카운트다운 초기화

- **현상**: 게임을 시작(Ready)하고 첫 턴에 새로고침하면 카운트다운이 10초로 다시 시작됨.
- **원인**: turnStart가 바뀌지 않거나 gameState에 변화가 없으면 useEffect가 실행되지 않아 localStorage에 저장이 안 되고, 이 때문에 첫 턴에 새로고침하면 카운트다운이 초기화되는 문제가 발생.
- **해결**: 레디 버튼을 누를 때 turnStart를 Date.now()로 설정하고, localStorage에 즉시 저장하도록 수정함. 추가로 useEffect에서도 항상 turnStart를 저장하여 일관성을 유지함.

### (2) 다시하기 후 첫 턴 새로고침 시 카운트다운 초기화

- **현상**: 게임 종료 후 다시하기를 누르고 첫 턴에 새로고침하면 카운트다운이 초기화됨.
- **원인**: handleRestart에서 turnStart를 갱신하지만, turns가 0개일 때 turnStart가 저장되지 않는 문제와 동일함.
- **해결**: handleRestart에서 turnStart를 Date.now()로 갱신하고, useEffect에서 항상 turnStart를 저장하도록 하여 해결.

## 3. 최종 해결 방법

- useEffect에서 gameState가 바뀔 때마다 turnStart를 포함한 전체 상태를 localStorage에 항상 저장하도록 변경.
- getInitialState에서 localStorage의 gameState를 항상 복원하도록 구현.
- handleRestart 등 상태를 초기화하는 함수에서도 turnStart를 Date.now()로 갱신하고, 즉시 localStorage에 반영.

## 4. 결론

이 구조로 인해 게임 도중, 첫 턴, 다시하기 후 등 모든 상황에서 새로고침해도 카운트다운과 게임 상태가 완벽하게 복구됨. turnStart를 항상 저장하는 것이 핵심임.

---

### 참고: 관련 파일

- src/features/game/hooks/useSoloGame.ts
- src/shared/utils/CountdownManager.ts
- src/features/game/util/ticTacToeUtils.ts
