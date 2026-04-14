# Shared View, Different Logic Guide

이 문서는 같은 화면을 재사용하되 실행 흐름이 다른 경우, 현재 프로젝트에서 어떤 기준으로 분리하는지 정리합니다.

핵심 결론은 간단합니다.

- 뷰는 공유할 수 있다.
- 하지만 실행되는 side effect가 다르면 page와 hook은 분리해야 한다.
- route 또는 page 단계에서 갈라졌다면 하위 계층에서는 `mode` 분기를 남기지 않는다.

## 1) 문제 정의

`GameRoom` 계열 화면은 싱글과 멀티가 UI 상으로는 거의 비슷합니다.

- `Ready`
- `Bridge`
- `Playing`
- 헤더, 토스트, 배경 요소

하지만 실제 흐름은 다릅니다.

- 싱글: bot 초기화, 로컬 phase 전환, 로컬 턴 처리, 로컬 AI 이동
- 멀티: socket 이벤트 수신, ready 동기화, 서버 턴 기준 처리, 서버 authoritative move 반영

즉, 화면은 비슷하지만 상태와 effect 집합은 다릅니다.

## 2) 피해야 하는 구조

아래 구조는 현재 기준으로 권장하지 않습니다.

- 하나의 큰 페이지 안에서 single/multi를 `if`로 분기
- shared view 내부에서 `mode` prop으로 로직 차이를 처리
- 공용 hook 내부에서 `mode === "multi"` 같은 분기를 두는 구조

이 방식의 문제

- 조건 분기 코드가 계속 늘어남
- 훅 호출 책임이 흐려짐
- 호출되면 안 되는 초기화 로직이 섞일 수 있음
- side effect 경계가 불분명해짐

실제로 멀티 화면에 싱글 bot 로직이 섞여 들어간 문제는 이런 구조적 위험을 보여주는 사례였습니다.

## 3) 현재 선택한 구조

현재는 route와 page 단계에서 흐름을 먼저 분리하고, 하위에는 공통 UI만 남기는 방식을 사용합니다.

```text
App routes
  -> SingleGameRoomPage
    -> useSinglePlay
    -> GameRoomView
    -> SingleTicTacToe

  -> MultiGameRoomPage
    -> useMultiPlay
    -> GameRoomView
    -> MultiTicTacToe
```

핵심 구성 요소

- `SingleGameRoomPage`: 싱글 전용 조립
- `MultiGameRoomPage`: 멀티 전용 조립
- `GameRoomView`: 공통 ready/bridge/playing 프레임
- `SingleTicTacToe`: 싱글 playing 전용 조립
- `MultiTicTacToe`: 멀티 playing 전용 조립

## 4) 현재 코드 기준 책임 분리

### Page

- route 진입점 역할 수행
- 전용 hook을 호출해 데이터와 handler 조립
- 공통 뷰에 필요한 값만 전달

예시

- [src/pages/SingleGameRoomPage.tsx](../src/pages/SingleGameRoomPage.tsx)
- [src/pages/MultiGameRoomPage.tsx](../src/pages/MultiGameRoomPage.tsx)

### Shared View

- 공통 ready/bridge/playing 렌더링 프레임만 제공
- 실행 흐름은 모르고 props만 받음

예시

- [src/features/game/components/GameRoomView.tsx](../src/features/game/components/GameRoomView.tsx)

### Playing View

- playing 화면 조립은 single/multi 전용 컴포넌트로 분리
- 공통 `mode` prop 없이 각자 필요한 훅만 호출

예시

- [src/pages/TicTacToe.tsx](../src/pages/TicTacToe.tsx)

### Hook

- single/multi별로 필요한 훅만 호출
- 공용 훅이라도 흐름이 갈리면 전용 훅으로 분리

예시

- `useSinglePlay`, `useMultiPlay`
- `useSingleNextTurn`, `useMultiNextTurn`

## 5) 중요한 기준: route에서 갈랐으면 하위에서는 다시 섞지 않는다

이 기준이 이번 리팩토링의 핵심입니다.

좋은 예

- `SingleGameRoomPage`에서 `SingleTicTacToe`만 렌더
- `MultiGameRoomPage`에서 `MultiTicTacToe`만 렌더
- 멀티 전용 이벤트 수신 훅은 멀티 흐름에서만 호출

나쁜 예

- `GameRoomView`가 `mode`를 받아 ready/playing 로직을 갈라 처리
- `useNextTurn` 하나 안에서 single/multi 클릭 로직을 모두 처리
- `useReceiveMoveMade` 안에서 `if (mode !== "multi") return` 같은 형태로 방어

현재 구조는 이 나쁜 예를 제거한 상태를 목표로 유지합니다.

## 6) 왜 이 방식이 안전한가

이 구조에서는 실행되는 훅 집합이 page 단계에서 이미 확정됩니다.

그래서 다음 위험이 줄어듭니다.

- 싱글 bot 초기화가 멀티에 섞이는 문제
- 사용하지 않는 멀티 수신 훅이 싱글에서 호출되는 문제
- 하위 컴포넌트가 도메인 분기 책임까지 떠안는 문제
- 테스트할 때 어떤 흐름이 활성화되는지 추적하기 어려운 문제

즉, 핵심은 UI 재사용이 아니라 effect 경계 분리입니다.

## 7) local 흐름을 추가할 때의 기준

추가 흐름이 필요하면 기존 single/multi에 분기를 더하지 말고 새 조립 단위를 만듭니다.

권장 순서

1. 전용 page 추가
2. 전용 hook 추가
3. 필요하면 공통 view 재사용
4. route에서 직접 연결

예시

- `LocalHostPage`
- `LocalGuestPage`

중요한 점은 `mode`를 다시 공통 하위 계층으로 흘려보내지 않는 것입니다.

## 8) 한 줄 기준

같은 화면을 공유하더라도 실행 흐름이 다르면, route와 page에서 먼저 분리하고 하위 뷰와 훅에서는 공통 `mode` 분기를 두지 않는다.
