# 네이밍 규칙 (Naming Conventions)

이 문서는 프로젝트 내에서 일관된 네이밍을 유지하기 위한 규칙을 정의합니다. 모든 코드 작성자는 아래 규칙을 준수해야 합니다.

## 접두사/형식별 의미 정리

| 접두사/형식             | 예시                                           | 의미/용도                                           |
| :---------------------- | :--------------------------------------------- | :-------------------------------------------------- |
| is, has, can, should    | isActive, hasPermission, canPlay, shouldUpdate | Boolean 값, 상태/권한/가능 여부 등                  |
| get, set, fetch, update | getUserInfo, setName, fetchData, updateScore   | 데이터 조회/설정/갱신 함수                          |
| use                     | useGameSocket, useCountdown                    | React 커스텀 훅                                     |
| on                      | onClick, onChange                              | 이벤트 핸들러 함수                                  |
| handle                  | handleSubmit, handleError                      | 이벤트/로직 처리 함수                               |
| MAX, MIN, DEFAULT       | MAX_PLAYER_COUNT, MIN_SCORE, DEFAULT_TIMEOUT   | 상수 값 (대문자 스네이크 케이스)                    |
| I (지양)                | IUser                                          | (지양) 타입/인터페이스 접두사, 사용하지 않음        |
| T                       | TUser, TGameResult                             | 타입 별칭에 사용 가능 (권장 아님, 명확한 이름 선호) |
| \_ (언더스코어)         | \_temp, \_internal                             | 내부 변수, 임시 변수 (외부 노출 X)                  |
| $                       | $el, $container                                | DOM 요소 참조 (JS/TS에서 제한적으로 사용)           |

> **참고:**
>
> - Boolean 변수는 `is`, `has`, `can`, `should` 등으로 시작
> - 이벤트 핸들러는 `on` 또는 `handle`로 시작
> - 커스텀 훅은 반드시 `use`로 시작
> - 상수는 대문자 스네이크 케이스와 의미 있는 접두사 사용

## 1. 파일 및 폴더명

- **케밥 케이스(kebab-case)** 사용: `my-component.tsx`, `user-profile/`
- 테스트 파일: `*.test.ts(x)` 또는 `__tests__/` 폴더 내에 위치

## 2. 변수명, 함수명

- **카멜 케이스(camelCase)** 사용: `userName`, `getUserInfo()`
- boolean 변수: `is`, `has`, `can` 등으로 시작 (`isActive`, `hasPermission`)

## 3. 클래스, 컴포넌트명

- **파스칼 케이스(PascalCase)** 사용: `UserProfile`, `GameManager`

## 4. 상수

- **대문자 스네이크 케이스(UPPER_SNAKE_CASE)** 사용: `MAX_PLAYER_COUNT`, `API_URL`

## 5. 타입, 인터페이스

- **파스칼 케이스(PascalCase)** 사용: `User`, `GameResult`
- 인터페이스는 `I` 접두사 사용하지 않음

## 6. 커스텀 훅

- `use`로 시작하는 **카멜 케이스**: `useGameSocket`, `useCountdown`

## 7. 기타

- 약어는 대문자로 표기: `APIManager`, `URLParser`
- 파일 내 export default는 파일명과 동일하게 네이밍

---

> 네이밍 규칙을 위반하는 경우 코드 리뷰에서 수정 요청될 수 있습니다.
