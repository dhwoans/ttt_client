# UI Component Architecture Guide

관련 세부 문서

- [File Structure Improvement Guide](./file-structure-improvement.md)
- [Shared View, Different Logic Guide](./shared-view-different-logic.md)

이 문서는 현재 프로젝트의 UI 구조를 아래 3계층으로 관리하기 위한 기준입니다.

- Atoms/Modules: 최소 단위의 재사용 UI
- Layouts: 공통 화면 틀과 배치
- Pages: 라우트 진입점과 화면 흐름 조립

## 1) 계층 정의

### Atoms/Modules

예시

- `Avatar`
- `Badge`
- `Countdown`
- `Board`

역할

- 자체적으로 렌더 가능한 최소 UI 단위
- 외부 props에 따라 표시와 상호작용 수행
- 도메인 흐름이나 라우팅 정책을 직접 알지 않음

권장 규칙

- 가능한 순수 컴포넌트로 유지
- 스타일 변형은 props로 제어
- API 호출, 라우트 이동, 전역 상태 조작은 지양

### Layouts

예시

- `HeaderLayout`
- `FooterLayout`
- `LeftSideLayout`
- `RightSideLayout`

역할

- 공통 화면 크롬 담당
- 헤더, 마퀴, 고정 배치, 컨테이너 같은 틀 제공
- `children` 배치와 공통 시각 구조 관리

권장 규칙

- 비즈니스 로직 최소화
- 상태가 필요하면 표시 목적 props 중심으로 제한
- 두 페이지 이상에서 반복되는 화면 틀을 흡수

### Pages

예시

- `LoginPage`
- `LobbyPage`
- `SingleGameRoomPage`
- `MultiGameRoomPage`

역할

- 라우트 진입점 역할 수행
- feature hook과 UI를 조립하여 완성 화면 구성
- redirect, phase 전환, 페이지 전용 흐름 제어 담당

권장 규칙

- 페이지가 비대해지면 커스텀 훅으로 로직 분리
- 페이지는 조립과 흐름 제어에 집중
- 같은 화면을 공유하더라도 전용 흐름이 다르면 페이지를 분리

## 2) 현재 권장 폴더 구조

```text
src/
  pages/
    LoginPage.tsx
    LobbyPage.tsx
    SingleGameRoomPage.tsx
    MultiGameRoomPage.tsx
    LocalHostPage.tsx
    LocalGuestPage.tsx
    TicTacToe.tsx
    Ready.tsx
    layouts/
      HeaderLayout.tsx
      FooterLayout.tsx
      LeftSideLayout.tsx
      RightSideLayout.tsx

  features/
    game/
      components/
        GameRoomView.tsx
      hooks/
      types/

  shared/
    components/
    modals/
```

## 3) 현재 프로젝트에 적용된 방식

라우트 진입점은 [src/App.tsx](../src/App.tsx) 에서 직접 page로 연결됩니다.

- `/login` -> `LoginPage`
- `/lobby` -> `LobbyPage`
- `/game/single` -> `SingleGameRoomPage`
- `/game/:roomId` -> `MultiGameRoomPage`
- `/game/local-host/:roomId` -> `LocalHostPage`
- `/game/local-guest/:roomId` -> `LocalGuestPage`

적용 원칙

- route entry는 `pages/*`가 직접 담당
- feature 내부 로직은 `features/*/hooks`, `features/*/components`로 분리
- 공통 화면 크롬은 `pages/layouts`에 유지
- 범용 UI는 `shared/components`, 도메인 전용 UI는 `features/*/components`에 유지

## 4) Game Room 구조 기준

게임방 화면은 UI는 공유하지만 실행 흐름은 분리합니다.

현재 구조

- `SingleGameRoomPage`: 싱글 전용 조립
- `MultiGameRoomPage`: 멀티 전용 조립
- `GameRoomView`: 공통 ready/bridge/playing 렌더링 틀
- `SingleTicTacToe`: 싱글 playing 전용 조립
- `MultiTicTacToe`: 멀티 playing 전용 조립

핵심 원칙

- route 단계에서 single/multi를 분리한다
- 하위 뷰와 훅에서는 `mode` prop 분기를 두지 않는다
- single/multi마다 필요한 훅만 호출한다
- 공통 UI는 `GameRoomView` 같은 공유 뷰에서만 재사용한다

즉, 같은 화면을 재사용하더라도 실행되는 side effect가 다르면 page와 hook은 분리합니다.

## 5) 책임 경계

Do

- Page: 라우팅, 비즈니스 이벤트 연결, 화면 흐름 제어
- Layout: 공통 배치와 화면 틀 제공
- Feature Hook: 도메인 상태와 effect 조립
- Component: 표현과 입력 처리

Don't

- Atom/Module에서 라우트 이동 직접 처리
- Layout에 API 호출이나 소켓 이벤트 처리 넣기
- Page에서 반복되는 화면 크롬을 계속 복붙하기
- single/multi 차이를 하위 컴포넌트의 `mode` 분기로 처리하기

## 6) 리뷰 체크리스트

- 새 컴포넌트가 UI 최소 단위인지, 공통 틀인지, 페이지인지 명확한가?
- 공통 요소가 두 페이지 이상에서 반복되면 Layout 또는 공통 View로 올렸는가?
- 페이지가 길어졌다면 로직을 hook으로 분리했는가?
- single/multi 전용 흐름을 하위 `mode` 분기 대신 page/hook 분리로 처리했는가?
- shared/components와 features/components 경계를 지켰는가?

## 7) 최근 구조 변경 요약

### 7-1. 라우팅 구조 단순화

- route entry를 feature 내부 래퍼가 아니라 `pages/*`로 직접 연결했다.
- 현재는 [src/App.tsx](../src/App.tsx) 에서 `SingleGameRoomPage`, `MultiGameRoomPage`를 직접 라우팅한다.

### 7-2. 공통 화면 크롬 분리

- 헤더, 푸터, 좌우 고정 배치 같은 화면 틀은 `pages/layouts`로 분리했다.
- 페이지는 배치 규칙을 조립하고, 공통 틀 자체는 layout이 담당한다.

### 7-3. Game Room 흐름 분리

- 싱글과 멀티는 UI는 유사하지만 상태와 effect 흐름이 달라 page container를 분리했다.
- `SingleGameRoomPage`는 `useSinglePlay`와 `SingleTicTacToe`를 조립한다.
- `MultiGameRoomPage`는 `useMultiPlay`와 `MultiTicTacToe`를 조립한다.

### 7-4. 하위 mode 분기 제거

- 기존에는 shared view와 hook에서 `mode` prop으로 분기하던 흔적이 있었다.
- 현재는 route와 page에서 single/multi가 갈리며, 하위 훅과 뷰는 전용 흐름만 처리한다.
- 예를 들어 `useSingleNextTurn`, `useMultiNextTurn`처럼 흐름을 분리하고 `GameRoomView`는 공통 렌더링만 담당한다.

## 8) 한 줄 원칙

페이지는 라우트와 흐름을 조립하고, layout은 공통 틀을 제공하며, 공통 뷰는 재사용하되 실행 흐름이 다르면 page와 hook을 분리한다.

문제

- `react-fast-marquee`를 추가한 뒤 `pnpm-lock.yaml`이 갱신되지 않아 Docker/CI 환경에서 `ERR_PNPM_OUTDATED_LOCKFILE`가 발생했다.

어려움

- 로컬에서는 설치가 되어도 CI에서는 `--frozen-lockfile` 때문에 즉시 실패했다.

대응

- `pnpm install`로 lockfile을 갱신하고, `pnpm install --frozen-lockfile`로 다시 검증했다.

결과

- `package.json`과 `pnpm-lock.yaml`이 동기화되었고, frozen lockfile 검증도 통과했다.

## 8) 현재 구조 요약

현재 기준 핵심 구조는 다음과 같다.

- `GameRoomPage`: mode만 판단하는 route entry
- `SingleGameRoomPage`: 싱글 전용 page container
- `MultiGameRoomPage`: 멀티 전용 page container
- `GameRoomView`: 공통 화면 렌더링
- `useSinglePlay`: 싱글 플레이 흐름 제어
- `useMultiPlay`: 멀티 플레이 흐름 제어
- `HeaderLayout`, `FooterLayout`, `LeftSideLayout`, `RightSideLayout`: 공통 화면 틀

## 9) 다음 확장 포인트

현재 구조는 이후 `local` 플레이를 다음 방식으로 추가할 수 있도록 정리되어 있다.

- `useLocalPlay` 추가
- `LocalGameRoomPage` 추가
- `GameRoomPage`의 mode 분기에 `local` 케이스 추가
- 공통 UI는 계속 `GameRoomView` 재사용

즉, 앞으로는 "새 모드 추가 = 전용 컨테이너/훅 추가 + 공통 뷰 재사용"이라는 패턴으로 확장하는 것이 가장 안전하다.
