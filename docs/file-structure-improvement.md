# File Structure Improvement Guide

이 문서는 이번 리팩토링에서 파일 구조를 왜 바꿨는지, 무엇이 문제였는지, 어떻게 정리했는지, 그리고 현재 구조를 어떻게 확장해야 하는지를 파일 구조 관점에서 설명합니다.

## 1) 왜 구조를 바꿨는가

기존에는 route entry, 화면 조립, feature 전용 래퍼, 공통 레이아웃 성격의 코드가 서로 섞여 있었습니다.

대표적으로 다음 문제가 있었습니다.

- `features/*/App.tsx`가 route entry처럼 동작하면서 `pages` 계층의 책임이 흐려짐
- 페이지 안에서 공통 화면 크롬까지 직접 조립하면서 레이아웃 재사용성이 낮아짐
- `GameRoomPage.tsx` 같은 큰 화면이 단일 파일로 비대해지기 쉬움
- 이후 `single`, `multi`, `local` 같은 mode 확장을 고려할 때 어디에 무엇을 추가해야 할지 기준이 약함

결국 구조 문제는 단순한 폴더 정리 문제가 아니라, 책임 경계가 불분명해서 유지보수 비용이 커지는 문제였습니다.

## 2) 변경 전 구조의 어려움

변경 전에는 다음과 같은 해석 비용이 있었습니다.

- 라우트가 실제로 어떤 페이지를 가리키는지 한 번에 읽기 어려움
- page와 feature wrapper의 경계가 모호함
- 공통 UI를 재사용하려고 해도 어디에 둬야 하는지 기준이 약함
- 큰 화면의 JSX와 흐름 제어가 한곳에 몰리기 쉬움

특히 `GameRoomPage` 계열 화면은 이후 mode가 늘어날수록 구조가 더 빠르게 무거워질 가능성이 컸습니다.

## 3) 변경 원칙

이번 구조 정리는 아래 원칙을 기준으로 진행했습니다.

- route entry는 `pages`가 담당한다
- 공통 화면 틀은 `pages/layouts`에서 관리한다
- feature 전용 UI와 로직은 `features/*` 아래에 둔다
- 범용 UI는 `shared/*`에 둔다
- 같은 화면을 공유하더라도 mode별 흐름이 다르면 page container를 분리한다

## 4) 변경 전/후 구조 비교

| 항목           | 변경 전                                                | 변경 후                                          |
| -------------- | ------------------------------------------------------ | ------------------------------------------------ |
| 라우트 진입점  | `features/*/App.tsx` 같은 중간 래퍼가 끼어들 수 있음   | `src/pages/*Page.tsx`가 직접 route entry 담당    |
| 페이지 책임    | 페이지와 feature wrapper 책임이 혼재                   | 페이지가 화면 단위 흐름과 조립 담당              |
| 공통 화면 틀   | 각 페이지 JSX 내부에 직접 배치                         | `src/pages/layouts/*`로 분리                     |
| 대형 화면 관리 | 한 페이지 파일이 계속 비대해지기 쉬움                  | page container + shared view + hooks로 분리 가능 |
| mode 확장성    | single/multi/local 확장 지점이 불명확                  | mode별 page 추가 위치가 명확                     |
| 파일 탐색성    | 어디가 entry이고 어디가 재사용 단위인지 판단 비용이 큼 | 폴더만 봐도 역할을 예측하기 쉬움                 |

## 5) 폴더 트리 예시

아래는 현재 방향을 기준으로 한 권장 예시입니다.

```text
src/
  pages/
    components/
      GameRoomView.tsx
    layouts/
      HeaderLayout.tsx
      FooterLayout.tsx
      LeftSideLayout.tsx
      RightSideLayout.tsx
    LoginPage.tsx
    LobbyPage.tsx
    GameRoomPage.tsx
    SingleGameRoomPage.tsx
    MultiGameRoomPage.tsx

  features/
    auth/
      components/
      hooks/
      types/
    game/
      components/
      hooks/
      util/
      types.ts
    lobby/
      components/
      hooks/

  shared/
    components/
    constants/
    hooks/
    managers/
    modals/
    utils/
```

이 구조에서 핵심은 다음입니다.

- `pages`: 라우트 기준 진입점과 화면 조립 단위
- `pages/layouts`: 여러 페이지에서 공유되는 화면 프레임
- `pages/components`: 페이지 조립에 가까운 공통 뷰
- `features`: 도메인별 기능 묶음
- `shared`: 전역 공통 자산

## 6) 현재 구조에서 각 폴더의 의미

### `pages`

- 라우트 진입 컴포넌트가 위치합니다.
- 화면 흐름, mode 분기, 조립 책임을 가집니다.

### `pages/layouts`

- 헤더, 푸터, 좌우 장식 영역처럼 공통 화면 크롬을 담당합니다.
- 비즈니스 로직은 넣지 않고, 배치와 프레임만 담당합니다.

### `pages/components`

- 특정 페이지군에서 재사용하는 화면 뷰를 둡니다.
- 이번 구조에서는 `GameRoomView`처럼 공통 렌더링 조각을 두는 위치입니다.

### `features`

- 도메인 전용 컴포넌트, 훅, 유틸을 둡니다.
- 예: 게임 이벤트 처리, 멀티플레이 동기화, 인증 관련 UI.

### `shared`

- 앱 전반에서 재사용 가능한 컴포넌트, 유틸, 상수, 매니저를 둡니다.

## 7) 파일 구조 관점에서 얻은 결과

이번 정리 이후 얻은 효과는 다음과 같습니다.

- route entry가 명확해짐
- 페이지와 레이아웃 책임이 구분됨
- 대형 페이지를 분리할 기준이 생김
- 공통 UI를 중복 없이 관리하기 쉬워짐
- 새 mode를 추가할 때 수정 지점을 예측하기 쉬워짐

즉, 구조가 예뻐진 것이 아니라, 이후 변경 비용을 줄이는 방향으로 정리된 것입니다.

## 8) 새 mode 추가 시 파일 구조 가이드

예를 들어 `local` mode를 추가한다고 하면 파일 구조 기준 절차는 아래와 같습니다.

1. `src/pages/LocalGameRoomPage.tsx`를 추가한다.
2. `src/features/game/hooks/useLocalPlay.ts`를 추가한다.
3. `src/pages/GameRoomPage.tsx`에서 `mode === "local"` 분기를 추가한다.
4. 공통 화면은 기존 `GameRoomView.tsx`를 재사용한다.
5. local 전용 상태/이벤트 처리는 `useLocalPlay.ts` 안에 둔다.

핵심은 mode가 늘어나도 기존 single/multi 파일을 크게 흔들지 않고, 새 page와 새 hook을 추가하는 방향으로 확장하는 것입니다.

## 9) 간단한 추가 예시

```text
src/
  pages/
    LocalGameRoomPage.tsx
  features/
    game/
      hooks/
        useLocalPlay.ts
```

이 정도만 추가되어도 구조적으로는 현재 패턴을 그대로 확장할 수 있습니다.
