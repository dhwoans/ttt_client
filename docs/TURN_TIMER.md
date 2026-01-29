# 턴 타이머 기능 명세

## 1️⃣ 개요 (Overview)

### 목적

플레이어 간의 빠른 게임 진행을 유도하고 긴장감을 조성함.

### 핵심 가치

사용자에게 명확한 시간 압박을 인지시키고, 지연 시 공정한 패널티를 부여함.

---

## 2️⃣ 요구사항 (Requirements)

### 2.1 기능적 요구사항 (Functional)

- [ ] 각 플레이어는 자신의 턴에 **10초의 제한 시간**을 가짐
- [ ] 사용자가 **착수(Click)**하면 타이머는 즉시 초기화되고 상대방 턴으로 전환됨
- [ ] **시간이 0초**에 도달하면 현재 플레이어는 **강제 패배 처리**됨 (또는 랜덤 착수)
- [ ] **게임이 종료**(승리/무승부)되면 타이머는 정지해야 함

### 2.2 비기능적 요구사항 (Non-functional)

| 요구사항   | 목표                                                             |
| ---------- | ---------------------------------------------------------------- |
| **정확성** | 브라우저 메인 스레드 부하에 관계없이 최대한 정확한 1초 간격 유지 |
| **반응성** | 3초 이하일 때 UI 피드백(색상 변경 등)이 즉각적이어야 함          |
| **성능**   | 타이머로 인한 리렌더링 최소화                                    |

---

## 3️⃣ 유저 플로우 (User Flow)

```
턴 시작
  ↓
타이머 10초 세팅 → 카운트다운 시작
  ↓
[매 초마다 화면에 남은 시간 표시]
  ↓
  ├─ 사용자 액션 (시간 내 착수)
  │   → 타이머 중지
  │   → 턴 전환
  │   → 다음 플레이어 턴으로 회귀
  │
  └─ 시간 초과
      → 타이머 중지
      → 게임 종료 처리 (강제 패배)
```

---

## 4️⃣ 기술 사양 (Technical Specs)

### 4.1 핵심 상태 (States)

| 상태 변수명      | 타입     | 설명                                   |
| ---------------- | -------- | -------------------------------------- |
| `remainingTime`  | `number` | 남은 초 (10 ~ 0)                       |
| `timerStatus`    | `string` | `IDLE`, `RUNNING`, `PAUSED`, `EXPIRED` |
| `lastUpdateTime` | `number` | 마지막 업데이트 시간 (Date.now())      |

### 4.2 주요 로직

```typescript
// 타이머 시작
setInterval(() => {
  const elapsed = Date.now() - lastUpdateTime;
  remainingTime = Math.max(0, 10 - elapsed / 1000);

  if (remainingTime === 0) {
    // 게임 종료 처리
  }
}, 100); // 100ms 간격으로 확인 (정확성 향상)
```

**Key Points:**

- `setInterval`을 활용하되, React 컴포넌트 라이프사이클에 맞춰 **Cleanup**을 확실히 처리
- `Date.now()`를 활용해 실제 흐른 시간을 계산하여 `setInterval`의 오차 보정
- 탭 변경 시 `visibilitychange` 이벤트로 시간 보정

---

## 5️⃣ UI/UX 디자인 (UI/UX)

### 위치

- 보드판 상단 또는 현재 턴 플레이어 이름 옆

### 시각 효과

| 시간         | 스타일           | 설명                                |
| ------------ | ---------------- | ----------------------------------- |
| **10s ~ 4s** | 검은색/흰색 기본 | 일반 상태                           |
| **3s ~ 1s**  | 🔴 빨강색 강조   | 경고 상태 (색상 변경 + 텍스트 확대) |
| **0s**       | ⚠️ "Time Out!"   | 시간 초과 메시지                    |

### 샘플 UI

```tsx
<div
  className={`
  text-center text-2xl font-bold
  ${remainingTime <= 3 ? "text-red-600 scale-110" : "text-black"}
  transition-all duration-100
`}
>
  {remainingTime > 0 ? remainingTime : "⏱️ Time Out!"}
</div>
```

---

## 6️⃣ 예외 케이스 (Edge Cases)

### 6.1 레이스 컨디션 (Race Condition)

**상황**: 사용자가 클릭하는 동시에 시간이 0이 되는 경우

**해결책**:

- 서버/엔진 로직 우선순위 명확히 설정
- 클라이언트에서는 먼저 도착한 이벤트 우선 처리
- 뮤텍스 로직으로 동시 처리 방지

### 6.2 탭 전환 (Tab Switching)

**상황**: 브라우저 탭을 나갔다 들어오는 경우

**해결책**:

```typescript
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // 숨김 상태: 타이머 일시 중지
  } else {
    // 복귀: 실제 경과 시간 기반으로 업데이트
    const actualElapsed = Date.now() - startTime;
    remainingTime = Math.max(0, 10 - actualElapsed / 1000);
  }
});
```

### 6.3 느린 네트워크

**상황**: 멀티모드에서 서버 응답 지연

**해결책**:

- 로컬 타이머는 독립적으로 진행
- 서버 응답 시 로컬 상태와 동기화
- 클라이언트-서버 시간 차이 허용값 설정 (±1s)

---

## 7️⃣ 구현 체크리스트

- [ ] Countdown 컴포넌트 구현 (src/shared/components/Countdown.tsx)
- [ ] 싱글 모드에서 타이머 통합 (src/features/game/single/SingleGameApp.tsx)
- [ ] 멀티 모드에서 타이머 통합 (src/features/game/multi/GamePage.tsx)
- [ ] 로컬 호스트 모드에서 타이머 표시 (src/features/game/local/LocalHostView.tsx)
- [ ] 타이머 정확도 테스트 (**tests**/Countdown.test.tsx)
- [ ] Edge Case 테스트 작성

---

## 📚 참고 링크

- [Countdown 컴포넌트](../src/shared/components/Countdown.tsx)
- [React useEffect & Cleanup](https://react.dev/reference/react/useEffect)
- [MDN: setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
