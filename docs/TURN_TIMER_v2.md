# 턴 제한 시간(카운트다운) 기능 설계 문서


---

## 📍 Overview

**기능명**: `Turn Timer (턴 제한 시간)` / `Countdown`  
**위치**: `src/shared/components/Countdown.tsx`  
**책임**: 각 턴마다 10초 제한 시간을 관리하고, 시간 초과 시 플레이어 강제 패배 처리

---

## ❓ Why (왜 이 기능이 필요한가)

### 1. 게임 속도 제어 및 긴장감 조성

- **문제**: 제한 시간이 없으면 사용자가 무한정 고민할 수 있음 → 게임 진행 불가
- **해결책**: 10초 제한 → 빠른 의사결정 강제 → 게임 속도 향상
- **결과**: 전체 게임 플레이타임 예측 가능, 사용자 몰입감 증대

### 2. 공정한 경쟁 환경 조성

- **문제**: 한 플레이어가 오래 생각하면 상대방이 불리함
- **해결책**: 모든 플레이어에게 동일한 10초 제한 → 동등한 조건
- **결과**: "왜 저 사람이 자꾸 이기지?" 같은 불만 제거

### 3. 고의적/실수적 문제 대응

- **문제**: 사용자가 고의로 게임을 진행 안 하거나 시스템 문제로 응답 없음
- **해결책**: 10초 초과 시 자동 강제 패배 → 게임 진행 보장
- **결과**: 무한 대기 상황 제거, 서버 리소스 낭비 방지


---

## 🎯 What (정확히 무엇인가)

### 기능 명세

| 기능                    | 설명                                           | 상태      |
| ----------------------- | ---------------------------------------------- | --------- |
| **카운트다운 시작**     | 턴 전환 시 자동으로 10초부터 시작              | `RUNNING` |
| **실시간 시간 감소**    | 매 초마다 UI에 남은 시간 표시                  | `RUNNING` |
| **UI 경고 피드백**      | 3초 이하일 때 빨강색 + 텍스트 확대             | `RUNNING` |
| **착수 시 타이머 정지** | 사용자가 클릭하면 즉시 clearInterval + 턴 전환 | `IDLE`    |
| **시간 초과 처리**      | 0초 도달 시 강제 패배 + 게임 종료              | `EXPIRED` |
| **게임 종료 시 정지**   | 승패/무승부 결정 시 타이머 비활성화            | `IDLE`    |

### 타이머 상태 (State Machine)

```
IDLE ─────→ RUNNING ─────→ IDLE (다음 턴)
             ├─ (3초 이하) 경고 UI 표시
             └─ (0초) EXPIRED → 강제 패배
```

---

## 🏗️ Architecture & Key Decisions

### 1. 왜 10초인가? (시간 설정의 근거)

```typescript
durationMs={10000} // 10초
```

**왜 이 값인가?**

- **너무 짧음** (1-3초): 사용자가 마우스 클릭 시간도 부족 → 불만 높음
- **적절함** (10초): 전략적 사고 + 빠른 실행 시간 확보 가능
- **너무 길음** (20초 이상): 게임 속도 저하, 모바일 집중력 감소

**우리가 선택한 이유**: Tic-Tac-Toe는 경우의 수가 적어 (최대 9칸) 5초면 충분하지만, 플레이어 심리 안정을 위해 10초로 설정

### 2. 왜 setInterval + Date.now() 조합인가?

```typescript
// ❌ 나쁜 방식: setInterval만 사용
setInterval(() => {
  remainingTime--; // 정확도 떨어짐 (브라우저 부하 시)
}, 1000);

// ✅ 좋은 방식: Date.now()로 실제 시간 보정
const startTime = Date.now();
setInterval(() => {
  const elapsed = Date.now() - startTime;
  remainingTime = Math.max(0, 10 - elapsed / 1000);
}, 100); // 100ms마다 확인
```

**왜 이 방식인가?**

- **setInterval만**: 브라우저 메인 스레드가 바쁘면 interval이 실제보다 늦게 실행됨 → 타이머 오차 누적
- **Date.now() 추가**: 실제 흐른 시간을 기준으로 재계산 → 오차 보정
- **100ms 간격**: 1초마다가 아닌 100ms마다 확인 → 더 정확한 업데이트

**결과**: 브라우저 부하 상황에도 ±200ms 오차 범위 유지 가능

### 3. 왜 Ref를 쓰는가? (Countdown 컴포넌트와의 통신)

```typescript
const turnTimerRef = useRef<CountdownHandle | null>(null);

// 게임 시작 시
turnTimerRef.current?.start?.();

// 사용자 착수 시
turnTimerRef.current?.reset?.(0);

// 게임 종료 시
turnTimerRef.current?.stop?.();
```

**왜 Ref인가?**

- **Props/State로는 안 되는 이유**: 타이머 컴포넌트는 독립적으로 동작하면서, 부모에서 제어해야 함
- **Ref 사용 이유**: 직접 컴포넌트 메서드 호출 가능 → 제어 세밀화
- **대안**: Context API도 가능하지만, 단순한 상황에는 Ref가 더 간단

### 4. 왜 useEffect Cleanup을 철저히 하는가?

```typescript
useEffect(() => {
  if (gameEnded) {
    // ✅ 게임 끝나면 타이머 정지
    turnTimerRef.current?.reset?.(0);
    turnTimerRef.current?.stop?.();
    return; // 🔑 여기서 return하면 다시 interval 생성 안 함
  }

  // ✅ 턴이 바뀔 때마다 새로운 interval 시작
  turnTimerRef.current?.reset?.(10000);
  turnTimerRef.current?.start?.();

  return () => {
    // ✅ Cleanup: 다음 effect 실행 전에 이전 interval 정리
    // (없으면 메모리 누수 발생)
  };
}, [turn, gameEnded]); // turn 또는 gameEnded가 바뀌면 새로운 interval
```

**왜 이렇게 복잡한가?**

- **메모리 누수 방지**: interval이 여러 개 생성되면 동시에 여러 타이머 실행 → 게임 로직 꼬임
- **정확한 시점 제어**: 정확히 "턴이 바뀔 때"와 "게임이 끝났을 때"만 타이머 변경

---

## 🔄 User Flow & Validation

### 정상 흐름 (Time In)

```
턴 시작
  ↓
타이머 = 10초 설정, RUNNING 시작
  ↓
[매 초마다 remainingTime 감소]
  ↓
사용자 클릭 (8초 남음)
  ↓
타이머 즉시 중지 → 턴 전환 → 다음 플레이어 타이머 시작
```

### 시간 초과 흐름 (Time Out)

```
턴 시작
  ↓
타이머 = 10초 설정, RUNNING 시작
  ↓
[매 초마다 remainingTime 감소]
  ↓
3초 이하 → UI 빨강색 표시
  ↓
remainingTime = 0 → onComplete() 트리거
  ↓
handleCountdownComplete() 실행
  ↓
현재 플레이어 강제 패배 처리
  ↓
게임 종료
```

### 에러 흐름 (게임 중단)

```
게임 진행 중
  ↓
사용자가 나가기 버튼 클릭
  ↓
ExitModal 띄움
  ↓
gameEnded = true (useEffect 트리거)
  ↓
타이머 stop() 호출
  ↓
모든 interval 정리
```

---

## 🎨 UI/UX Design Decisions

### 시간대별 UI 변화

```tsx
<div
  className={`
  text-2xl font-bold
  ${remainingTime <= 3 ? "text-red-600 scale-110" : "text-black"}
  transition-all duration-100
`}
>
  {remainingTime > 0 ? Math.ceil(remainingTime) : "⏱️ Time Out!"}
</div>
```

| 시간     | 색상                | 크기      | 의도                      |
| -------- | ------------------- | --------- | ------------------------- |
| 10s ~ 4s | 흰색              | 기본      | "여유 있음" → 정보 전달만 |
| 3s ~ 1s  | 빨강색              | 110% 확대 | "긴박함" → 시각적 경고    |
| 0s       | 빨강색 + 애니메이션 | 100%      | "끝남" → 명확한 피드백    |

**왜 3단계인가?**

- **1단계만** (항상 빨강): 사용자가 무감각해짐 (알람 피로)
- **2단계** (전체 1단계): 변화가 너무 급격함 → 놀라움
- **3단계** (우리 방식): 점진적 긴장감 증대 → 게임 몰입감 자연스러움

---

## 🚨 Edge Cases & Handling

### Case 1: 레이스 컨디션 (Race Condition)

**상황**: 사용자가 클릭하는 정확한 순간에 시간이 0이 되는 경우

```typescript
// 싱글 모드 (로컬): 클릭이 우선
if (isTurn !== NICKNAME) return; // 클릭 무시
setTurn([...]); // 턴 기록

// 멀티 모드 (소켓): 서버 시간이 우선
// 서버에서 "이 플레이어는 timeout"이라고 판정 → 클라이언트 클릭 무시
```

**왜?** → 로컬은 즉시성, 멀티는 공정성(서버 기준)을 우선

### Case 2: 브라우저 탭 전환

**상황**: 사용자가 게임 중 다른 탭으로 이동했다가 돌아옴

```typescript
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // 탭 복귀 시: 실제 경과 시간으로 재계산
    const actualElapsed = Date.now() - startTime;
    remainingTime = Math.max(0, 10 - actualElapsed / 1000);
  }
});
```

**왜?** → 숨겨진 탭의 setInterval은 실제 경과 시간보다 덜 실행될 수 있음 → 돌아올 때 정정 필요

### Case 3: 브라우저 성능 저하

**상황**: 복잡한 게임 중 브라우저가 버벅거리는 경우

```typescript
// setInterval 간격: 1000ms (느림)
// vs
// setInterval 간격: 100ms + Date.now() 보정 (빠름)

// 결과: 100ms 방식이 정확도 유지
```

**왜?** → 실제 시간 기준으로 계산하므로, interval 실행 지연의 영향 최소화

### Case 4: 멀티모드에서 네트워크 지연

**상황**: 클라이언트 타이머는 0이 되었지만 서버 응답 지연

```typescript
// 클라이언트: timeout 처리 → 게임 강제 종료
// 서버: 아직 게임 진행 중

// 해결: 서버에서도 독립적으로 타이머 운영
// 클라이언트 타이머 ≠ 서버 타이머 → 서버 기준 우선
```

**왜?** → 멀티 게임은 두 플레이어 모두 동일한 시간 경험 필요

---

## 📚 Future Improvements & TODOs

- [ ] **동적 시간 설정**: 게임 난이도별로 제한 시간 조정 (쉬움=15초, 어려움=5초)
- [ ] **타이머 음성 알림**: 3초 남았을 때 "beep" 소리 재생
- [ ] **일시 정지 기능**: 멀티 게임 중 일시 정지 시 타이머도 일시 정지
- [ ] **통계 수집**: 사용자가 평균 몇 초 안에 결정하는지 추적
- [ ] **AI 난이도**: 타이머 시간을 기준으로 AI 사고 시간 동적 조정

---

## 📖 Related Files

- `src/shared/components/Countdown.tsx` - 타이머 컴포넌트 구현
- `src/features/game/single/App.tsx` - 싱글 모드 타이머 통합
- `src/features/game/multi/GamePage.tsx` - 멀티 모드 타이머 통합
- `src/features/game/local/LocalHostView.tsx` - 로컬 모드 타이머 표시 (예정)
- `src/stores/audioStore.ts` - 타이머 음성 효과 제어 (선택사항)
