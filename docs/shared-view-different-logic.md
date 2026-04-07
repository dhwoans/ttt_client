# Shared View, Different Logic Guide

이 문서는 "같은 화면을 재사용하지만 mode별 로직은 다를 때" 어떤 구조로 나누는 것이 안전한지, 이번 `GameRoom` 리팩토링에서 어떤 문제가 있었고 어떻게 풀었는지를 정리합니다.

## 1) 문제 정의

`GameRoom`은 싱글과 멀티가 화면상으로는 거의 비슷합니다.

- `Ready`
- `Bridge`
- `Playing`
- 헤더, 토스트, 배경 요소

하지만 실제 로직은 크게 다릅니다.

- 싱글: bot 초기화, 로컬 phase 전환, 타이머 흐름
- 멀티: socket 이벤트, ready 동기화, 방 상태 반영, leave 처리

즉, 뷰는 비슷하지만 side effect와 상태 흐름은 다릅니다.

## 2) 기존 방식의 문제

초기에는 같은 페이지 안에서 싱글/멀티 분기를 처리하려는 방향이 있었습니다.

이 방식은 다음 문제를 만들었습니다.

- 조건 분기 코드가 계속 늘어남
- mode별 훅 호출 위치가 복잡해짐
- React Hook 규칙 때문에 조건부 훅 호출이 위험해짐
- 서로 다른 side effect가 같은 페이지 안에 공존하면서 누수 가능성이 생김

실제로 멀티플레이에서 bot이 함께 끼어드는 현상은 이런 구조적 문제를 보여주는 사례였습니다.

## 3) 왜 어려웠는가

표면적으로 보면 "if문으로 mode만 나누면 되지 않나"처럼 보일 수 있습니다.

하지만 실제로는 아래 이유 때문에 단순 분기만으로는 안전하지 않았습니다.

- mode마다 필요한 effect 집합이 다름
- mode마다 필요한 핸들러가 다름
- 호출되면 안 되는 초기화 로직이 존재함
- 같은 파일에서 모든 흐름을 관리하면 책임이 빠르게 뒤엉킴

즉, 문제는 렌더 분기가 아니라 effect 분리였습니다.

## 4) 선택한 해법

이번에는 아래 구조를 선택했습니다.

- `GameRoomPage`: mode router
- `SingleGameRoomPage`: 싱글 전용 page container
- `MultiGameRoomPage`: 멀티 전용 page container
- `GameRoomView`: 공통 렌더링 전용 뷰
- `useSinglePlay`: 싱글 전용 로직
- `useMultiPlay`: 멀티 전용 로직

이 방식의 핵심은 "같은 뷰를 공유하더라도 로직 실행 주체는 mode별로 분리한다"는 점입니다.

## 5) 변경 전/후 비교 표

| 항목                    | 변경 전                           | 변경 후                                |
| ----------------------- | --------------------------------- | -------------------------------------- |
| mode 처리 위치          | 하나의 큰 페이지 내부 분기        | mode router + mode별 page container    |
| 공통 UI 처리            | 같은 파일 내부에 함께 존재        | `GameRoomView`로 추출                  |
| 훅 실행 구조            | 싱글/멀티 로직이 한 페이지에 공존 | 각 page container에서 필요한 훅만 실행 |
| side effect 안전성      | 다른 mode 로직이 섞일 위험 존재   | mode별로 effect 범위 분리              |
| bot 주입 같은 누수 문제 | 구조적으로 다시 발생 가능         | 멀티에서 싱글 훅이 아예 호출되지 않음  |
| local mode 확장         | 기존 페이지 분기 증가             | 새 page + 새 hook 추가로 확장          |

## 6) 현재 권장 구조

```text
src/
  pages/
    GameRoomPage.tsx
    SingleGameRoomPage.tsx
    MultiGameRoomPage.tsx
    components/
      GameRoomView.tsx

  features/
    game/
      hooks/
        useSinglePlay.ts
        useSingleInitialBotSetup.ts
        useMultiPlay.ts
        useGamePhaseEvents.ts
```

역할은 아래처럼 나뉩니다.

- `GameRoomPage.tsx`: mode 판단만 수행
- `SingleGameRoomPage.tsx`: 싱글 로직 조립
- `MultiGameRoomPage.tsx`: 멀티 로직 조립
- `GameRoomView.tsx`: 공통 UI 렌더링
- `useSinglePlay.ts`: 싱글 전용 흐름
- `useMultiPlay.ts`: 멀티 전용 흐름

## 7) 왜 이 방식이 안전한가

이 구조에서는 mode별로 실행되는 훅 집합이 아예 달라집니다.

예를 들어 멀티 페이지는 멀티 관련 훅만 호출합니다.
그러면 다음 문제가 자연스럽게 줄어듭니다.

- 싱글 bot 초기화가 멀티에 섞이는 문제
- 사용하지 않는 handler를 억지로 맞추는 문제
- page 내부 if 분기가 계속 증가하는 문제
- 테스트 시 어떤 mode 로직이 활성화되는지 추적하기 어려운 문제

즉, 조건 분기를 줄인 것이 아니라, side effect 경계를 분리한 것이 핵심입니다.

## 8) mode 추가 가이드

다음 mode로 `local`을 추가한다고 가정하면, 현재 구조에서는 아래 순서로 확장하면 됩니다.

### 1. 전용 hook 추가

- `src/features/game/hooks/useLocalPlay.ts`

local 전용 상태 전환, 플레이어 구성, 재시작 규칙을 이 훅에 둡니다.

### 2. 전용 page container 추가

- `src/pages/LocalGameRoomPage.tsx`

이 페이지는 `useLocalPlay`를 호출하고, 결과를 `GameRoomView`에 전달합니다.

### 3. mode router 확장

- `src/pages/GameRoomPage.tsx`

여기에 `local` 분기를 추가해 `LocalGameRoomPage`를 반환합니다.

### 4. 공통 뷰 재사용

- `src/pages/components/GameRoomView.tsx`

UI 자체가 동일하거나 유사하다면 기존 뷰를 그대로 재사용합니다.

## 9) local mode 추가 예시 흐름

```text
GameRoomPage
  -> LocalGameRoomPage
    -> useLocalPlay
    -> GameRoomView
```

이 패턴이 유지되면 기존 single/multi 코드를 크게 흔들지 않고도 새 mode를 붙일 수 있습니다.

## 10) 언제 이 패턴을 써야 하는가

아래 조건이면 같은 뷰 + 다른 로직 패턴으로 보는 것이 맞습니다.

- 화면은 거의 같은데 이벤트 흐름이 다르다
- mode별 side effect가 다르다
- API/소켓/스토리지 처리 방식이 다르다
- 훅을 한 페이지에 계속 추가하면 책임이 흐려진다

이 경우에는 뷰 재사용을 유지하되, 로직 컨테이너를 분리하는 방식이 가장 안정적입니다.

## 11) 한 줄 기준

같은 화면이라도 실행되는 side effect가 다르면, 뷰는 공유하고 page container와 hook은 분리한다.
