# UI Component Architecture Guide

관련 세부 문서

- [File Structure Improvement Guide](./file-structure-improvement.md)
- [Shared View, Different Logic Guide](./shared-view-different-logic.md)

이 문서는 현재 프로젝트의 UI 구조를 아래 3계층으로 일관되게 관리하기 위한 기준입니다.

- Atoms/Modules(UI 컴포넌트): 최소 단위의 재사용 컴포넌트
- Layouts(레이아웃 컴포넌트): children을 받아 공통 틀(Frame) 제공
- Pages(페이지 컴포넌트): 화면 단위 조립과 비즈니스 로직 오케스트레이션

## 1) 계층 정의

### Atoms/Modules

예시: `Button`, `Input`, `BoardCell`

역할

- 자체적으로 렌더 가능한 최소 UI 단위
- 외부에서 받은 props에 따라 표시/상호작용 수행
- 도메인 상태나 라우팅을 직접 알지 않음

권장 규칙

- 가능한 순수 컴포넌트로 유지
- 스타일 변형은 props(variant, size 등)로 제어
- 서버 호출, 라우트 이동, 전역 상태 조작은 지양

### Layouts

예시: `MainLayout`, `GameModalLayout`

역할

- 페이지 공통 레이아웃 틀 제공
- 헤더/마퀴/토스트/컨테이너/배경 등 화면 크롬 담당
- `children` 배치와 공통 시각 구조 관리

권장 규칙

- 비즈니스 로직 최소화
- 상태가 필요하면 "표시 목적" props 중심으로 제한
- 페이지별 중복되는 화면 공통 요소를 흡수

### Pages

예시: `TicTacToePage`

역할

- Atoms/Modules + Layouts를 조립하여 완성 화면 구성
- 라우트 단위 상태 관리, API 호출, 이벤트 처리 수행
- 화면 흐름(redirect, mode/phase 분기) 담당

권장 규칙

- 페이지가 비대해지면 커스텀 훅/유스케이스로 로직 분리
- 페이지는 조립과 흐름 제어에 집중

## 2) 권장 폴더 구조

```text
src/
  pages/
    layouts/
      MainLayout.tsx
      GameModalLayout.tsx
    TicTacToePage.tsx

  features/
    game/
      components/
      hooks/

  shared/
    components/
      Button.tsx
      Input.tsx
      BoardCell.tsx
```

## 3) 현재 프로젝트에 매핑하는 방법

현재 페이지 컴포넌트

- `src/pages/LoginPage.tsx`
- `src/pages/LobbyPage.tsx`
- `src/pages/GameRoomPage.tsx`

적용 방향

- 페이지마다 반복되는 공통 UI(예: 마퀴, 토스트, 공통 컨테이너)는 `pages/layouts`로 이동
- 각 페이지는 "페이지 전용 흐름"과 "도메인 조립"만 담당
- 기능 컴포넌트는 `features/*/components`에 유지
- 진짜 범용 UI는 `shared/components`에 유지

## 4) 책임 경계(Do / Don't)

Do

- Page: 라우팅, 비즈니스 이벤트 연결, 데이터 흐름 제어
- Layout: 공통 화면 구조 제공
- Atom/Module: 재사용 가능한 표현/입력 단위 유지

Don't

- Atom에서 라우트 이동 직접 처리
- Layout에 API 호출/소켓 이벤트 처리 넣기
- Page에 반복되는 공통 화면 크롬을 계속 복붙하기

## 5) 리뷰 체크리스트

- 새 컴포넌트가 "UI 최소 단위"인지, "틀"인지, "페이지"인지 명확한가?
- 공통 요소가 2개 이상 페이지에서 반복되면 Layout으로 올렸는가?
- Page가 너무 길어졌다면 로직을 hook/usecase로 분리했는가?
- shared/components와 features/components의 경계를 지켰는가?

## 6) 한 줄 원칙

"페이지는 조립과 흐름, 레이아웃은 틀, 원자 컴포넌트는 표현과 입력만 담당한다."

## 7) 최근 변경 기록

이 섹션은 실제 리팩토링 과정에서 어떤 문제가 있었고, 왜 구조 변경이 필요했는지, 그리고 어떤 방식으로 정리했는지를 기록합니다.

### 7-1. 라우팅 구조 문제

문제

- `features/auth/App.tsx`, `features/game/App.tsx` 같은 중간 래퍼가 라우트와 실제 화면 사이에 존재했다.
- route entry가 `pages`가 아니라 feature 내부 `App`에 연결되어 있어 페이지 책임이 불분명했다.

어려움

- 페이지 단위 흐름 제어와 feature 조립 책임이 섞였다.
- 나중에 layout을 추가하거나 route 단위로 책임을 재배치할 때 구조를 읽기 어려웠다.

대응

- 라우트는 직접 `pages/*` 컴포넌트로 연결하도록 정리했다.
- `LoginPage.tsx`, `LobbyPage.tsx`, `GameRoomPage.tsx`가 route entry 역할을 직접 담당하도록 바꿨다.

결과

- route entry가 명확해졌고, page가 화면 단위의 조립과 흐름 제어를 맡는 구조가 되었다.
- 이후 layout, page container, mode 분리 작업을 진행하기 쉬워졌다.

### 7-2. 레이아웃 부재와 공통 화면 크롬 중복

문제

- 헤더 마퀴, footer 장식, 좌우 고정 배치 같은 화면 크롬이 페이지 안에 직접 흩어져 있었다.
- 공통 구조가 page 내부 JSX에 묻혀 있어서 재사용성과 책임 경계가 약했다.

어려움

- sticky/fixed/z-index 문제를 페이지마다 개별적으로 조정해야 했다.
- 레이아웃이 아닌 페이지에서 시각 배치 규칙까지 모두 떠안으면서 코드가 점점 비대해졌다.

대응

- `HeaderLayout`, `FooterLayout`, `LeftSideLayout`, `RightSideLayout`을 `pages/layouts` 아래에 분리했다.
- `className`을 통해 페이지별 위치/레이어 제어가 가능하도록 만들어 공통 레이아웃은 유지하고, 페이지별 조정만 외부에서 하도록 설계했다.

결과

- 공통 화면 틀은 layout이 담당하고, 페이지는 필요한 배치 규칙만 전달하는 구조가 되었다.
- 재사용성과 페이지별 유연성을 동시에 확보했다.

### 7-3. GameRoomPage의 복잡도 증가

문제

- `GameRoomPage` 안에서 싱글/멀티 모드 로직, phase 전환, ready 처리, exit 처리, restart 처리, socket 이벤트 연결이 함께 섞여 있었다.
- 동일한 뷰를 공유하지만 로직은 서로 다른데 한 파일 안에서 모두 처리하려고 하면서 분기 코드가 늘어났다.

어려움

- 싱글은 로컬 bot 초기화와 타이머 기반 phase 전환을 사용하고, 멀티는 socket 이벤트 기반 phase 전환을 사용한다.
- React Hook 규칙 때문에 mode에 따라 훅을 조건부 호출하는 방식은 안전하지 않았다.
- 둘 다 한 페이지에서 호출하면 side effect가 서로 섞일 위험이 있었다.

대응

- 싱글 전용 로직은 `useSinglePlay`로, 멀티 전용 로직은 `useMultiPlay`로 분리했다.
- 싱글 초기 bot 세팅은 `useSingleInitialBotSetup`으로 추가 분리했다.
- 멀티 phase 이벤트는 `useGamePhaseEvents`를 `useMultiPlay` 내부로 이동해 멀티 흐름과 함께 묶었다.
- 이후 페이지 자체도 `GameRoomPage`는 mode만 판단하고, 실제 로직은 `SingleGameRoomPage`, `MultiGameRoomPage`에서 담당하도록 분리했다.

결과

- `GameRoomPage`는 route entry + mode router 역할만 담당하게 되었다.
- 싱글/멀티 로직은 각각의 전용 page container에서만 실행된다.
- 훅의 책임이 명확해지고, 이후 `local` 모드 추가 시 `LocalGameRoomPage`만 새로 추가하면 되는 구조가 되었다.

### 7-4. 같은 뷰를 재사용하면서 다른 로직을 적용해야 했던 문제

문제

- `Ready`, `Playing`, `Bridge`, 헤더, 토스트 등 UI는 싱글/멀티가 거의 동일했다.
- 하지만 비즈니스 로직은 서로 완전히 다르기 때문에 뷰와 로직을 같이 두면 결합도가 높아졌다.

어려움

- 뷰를 중복 생성하면 유지보수 비용이 커지고, 하나의 페이지에 로직을 모두 모으면 side effect가 섞인다.

대응

- 공통 렌더링을 `GameRoomView`로 추출했다.
- 싱글/멀티 전용 페이지는 각자 훅을 호출하고, 결과값만 `GameRoomView`에 props로 전달하도록 구성했다.

결과

- 뷰는 하나를 재사용하고, 로직은 모드별로 독립적으로 유지할 수 있게 되었다.
- local 플레이 추가 시에도 동일한 뷰를 재사용하면서 새로운 로직 컨테이너만 추가할 수 있다.

### 7-5. 멀티플레이에서 bot이 잘못 끼어드는 문제

문제

- 멀티플레이를 눌렀는데 `sessionStorage 플레이어 업데이트 완료` 로그에 bot(`에일리언`)이 함께 들어가는 현상이 발생했다.

어려움

- 원인은 `useSinglePlay` 또는 싱글 초기화 훅이 멀티에서도 같이 실행되고 있었기 때문이다.
- 같은 페이지에서 싱글/멀티 훅을 동시에 호출하던 구조에서는 이런 side effect 누수가 다시 발생하기 쉬웠다.

대응

- 싱글/멀티 페이지를 분리해 멀티 페이지에서는 싱글 훅이 호출되지 않도록 구조 자체를 변경했다.

결과

- 멀티플레이는 멀티 관련 이벤트와 상태만 다루게 되었고, bot 주입 문제를 구조적으로 방지할 수 있게 되었다.

### 7-6. 네이밍과 책임 분리 문제

문제

- `useMultiplayerPlayers`, `Bridge`, layout 컴포넌트 이름 등 일부 이름이 역할을 충분히 드러내지 못하거나 오타가 있었다.
- 이름이 모호하면 구조를 읽는 속도가 떨어지고, 책임이 불분명해진다.

어려움

- 이름이 모호하면 같은 파일 안에서 어떤 로직이 들어 있어야 하는지 판단 기준도 흐려진다.

대응

- `Brige.tsx`를 `Bridge.tsx`로 정리했다.
- page/layout/hook 이름을 역할 기준으로 정리하는 방향을 유지했다.
- 공통 뷰는 `GameRoomView`, 전용 진입점은 `SingleGameRoomPage`, `MultiGameRoomPage`로 분리했다.

결과

- 이름만 보고도 컴포넌트 성격과 책임을 예측하기 쉬워졌다.

### 7-7. 의존성/락파일 문제

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
