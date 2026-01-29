# CharacterBoard 컴포넌트 설계 문서

## 📍 Overview

**컴포넌트명**: `CharacterBoard` (인증 → 게임 진입 전 캐릭터 선택)  
**위치**: `src/features/auth/components/CharacterBoard.tsx`  
**책임**: 사용자 프로필 생성 및 저장 (닉네임 + 아바타 선택)

---

## ❓ Why (왜 이 기능이 필요한가)

### 1. 사용자 정체성 확립

- **문제**: 게임 시작 전 사용자가 다른 플레이어들과 구분되어야 함
- **해결책**: 캐릭터(아바타) + 닉네임으로 고유한 정체성 부여
- **결과**: 게임 내 상호작용 시 플레이어 식별 가능

### 2. 게임 경험의 개인화

- **문제**: 같은 인터페이스로는 사용자가 소속감을 느끼기 어려움
- **해결책**: 직접 선택한 아바타 → 심리적 책임감 & 몰입감 증대
- **결과**: 사용자 재방문율 증가, 게임 진행 속도 가속화

### 3. 멀티플레이 통신의 기초 데이터

- **문제**: 소켓 통신에서 플레이어 정보 필요
- **해결책**: CharacterBoard에서 수집한 데이터(userId, nickname, avatar)를 sessionStorage에 저장
- **결과**: 이후 모든 게임 모드에서 "나는 누구인가"를 즉시 파악 가능

---

## 🎯 What (정확히 무엇인가)

### 기능 명세

| 기능                 | 설명                                     | UI 요소                        |
| -------------------- | ---------------------------------------- | ------------------------------ |
| **아바타 선택**      | 12개의 동물 아바타 중 하나 선택          | 좌/우 화살표 버튼              |
| **아바타 랜덤화**    | 아바타 클릭 시 자동 회전 후 랜덤 선택    | Avatar 컴포넌트 (animate-spin) |
| **닉네임 입력**      | 자동 생성된 닉네임 또는 직접 입력        | Text Input                     |
| **자동 닉네임 생성** | 형용사 + 동물명 조합 (예: "Brave Tiger") | useEffect 기반                 |
| **유저 생성**        | API 호출 → userId 수령 → 로비로 이동     | "입장" 버튼                    |
| **에러 처리**        | 닉네임 빈 값 → Shake 애니메이션          | 시각적 피드백                  |

---

## 🏗️ Architecture & Key Decisions

### 1. 상태 관리 전략 (왜 이렇게 나눴나)

**인터페이스 기반 설계** (계약 명확화)

```typescript
interface CharacterBoardState {
  index: number; // ✅ 아바타 선택 상태
  isRandomizing: boolean; // ✅ 랜덤 선택 중 (클릭 중복 방지)
  fullNickname: string; // ✅ 사용자 입력값
  isCreating: boolean; // ✅ API 로딩 중복 방지
  shakeMotion: boolean; // ✅ 에러 시각화
  currentAvatar: [string, string, string]; // [emoji, name, imageSrc]
}

interface CharacterBoardActions {
  handleAvatarClick: () => void;
  handleNavigateAvatar: (direction: "prev" | "next") => void;
  handleNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateUser: () => Promise<void>;
  handleAnimationEnd: () => void;
  playBeep: () => void;
}

interface CharacterBoardInterface {
  state: CharacterBoardState; // 읽기 전용 데이터
  actions: CharacterBoardActions; // 실행 가능한 함수
}
```

**왜 이렇게 분리했나?**

- **명확한 계약**: 사용자는 인터페이스만 보면 훅의 모든 기능 파악 가능
- **관심사 분리**: state(데이터) vs actions(동작)
- **타입 안정성**: 각 속성의 타입이 명확히 정의됨
- **테스트 용이성**: 각 상태와 액션을 독립적으로 검증 가능
- **IDE 지원**: 자동완성 및 타입 체크 강화

### 2. 아바타 랜덤 선택 로직 (왜 interval을 썼나)

```typescript
const handleAvatarClick = () => {
  if (isRandomizing) return; // 🔑 클릭 중복 방지 (UX 개선)
  setIsRandomizing(true);

  let count = 0;
  const interval = setInterval(() => {
    setIndex(Math.floor(Math.random() * animalList.length));
    count++;

    if (count >= 15) {
      clearInterval(interval);
      setIndex(Math.floor(Math.random() * animalList.length));
      setIsRandomizing(false);
    }
  }, 50); // 50ms 간격 = 0.75초 동안 회전
};
```

**왜 이 방식인가?**

1. **시각적 피드백**: 50ms마다 아바타가 바뀌므로 사용자가 "뭔가 일어나고 있구나"를 인지
2. **예측 불가능성**: 15번 회전하므로 최종 선택이 예측되지 않음 → 즐거움 증대
3. **중복 클릭 방지**: `isRandomizing` flag로 랜덤 선택 중 재클릭 무시 → 버그 방지

### 3. 닉네임 자동 생성 (왜 useEffect를 썼나)

```typescript
useEffect(() => {
  setFullNickname(`${getRandomAdj()} ${animalList[index][1]}`);
}, [index]); // index가 변할 때마다 닉네임 자동 갱신
```

**왜 이렇게 했나?**

- 아바타를 선택하는 순간 그에 맞는 닉네임이 자동 생성됨
- 사용자가 "입력 귀찮음" → 바로 시작 가능
- 하지만 여전히 수정 가능 (input 입력 활성화)
- 결과: UX 편의성 ↑ + 자율성 ↑

### 4. sessionStorage에 저장하는 이유

```typescript
sessionStorage.setItem("avator", String(index)); // 아바타 인덱스
sessionStorage.setItem("nickname", fullNickname); // 닉네임
sessionStorage.setItem("userId", result.message); // 서버에서 받은 ID
```

**왜 sessionStorage인가?**

- 페이지 새로고침 시에도 값 유지 가능
- localStorage보다 보안적 (탭 닫으면 삭제)
- 다른 게임 모드(single/multi/local)에서 "내 정보"를 즉시 참조 가능
- **왜 props로 전달하지 않나?** → 라우팅을 통해 컴포넌트 완전히 새로 마운트되므로, props 사용 불가

### 5. 컴포넌트 사용 예시 (useCharacterBoard 활용)

```typescript
// CharacterBoard.tsx
export function CharacterBoard() {
  const { state, actions } = useCharacterBoard(); // ✅ 인터페이스 기반 구조 분해

  return (
    <div>
      {/* 아바타 표시 */}
      <Avatar
        emoji={state.currentAvatar[0]}
        name={state.currentAvatar[1]}
        src={state.currentAvatar[2]}
      />

      {/* 랜덤 버튼 */}
      <button onClick={actions.handleAvatarClick}>
        {state.currentAvatar[0]}
      </button>

      {/* 이전/다음 네비게이션 */}
      <button onClick={() => actions.handleNavigateAvatar("prev")}>
        <ChevronLeft />
      </button>
      <button onClick={() => actions.handleNavigateAvatar("next")}>
        <ChevronRight />
      </button>

      {/* 닉네임 입력 */}
      <input
        value={state.fullNickname}
        onChange={actions.handleNicknameChange}
        className={state.shakeMotion ? "shake-animation" : ""}
        onAnimationEnd={actions.handleAnimationEnd}
      />

      {/* 완료 버튼 */}
      <button
        onClick={actions.handleCreateUser}
        disabled={state.isCreating}
      >
        {state.isCreating ? "..." : "완료"}
      </button>
    </div>
  );
}
```

**인터페이스 구조의 이점**

- 컴포넌트는 `state`와 `actions`를 명확히 구분
- 상태는 렌더링에만 사용 (읽기 전용)
- 액션은 이벤트 핸들러에만 연결 (실행 전용)
- Redux DevTools처럼 상태와 행동이 분리되어 디버깅 용이

---

## 🔄 User Flow & Validation

### 정상 흐름

```
1. 아바타 선택 (좌/우 버튼 또는 클릭)
   ↓
2. 닉네임 자동 생성 (또는 직접 편집)
   ↓
3. "입장" 버튼 클릭
   ↓
4. API: POST /user (nickname + avatar 전송)
   ↓
5. 성공: userId 수령 → sessionStorage 저장 → /lobby로 이동
```

### 에러 흐름

```
❌ 닉네임이 비어있음
   → Shake 애니메이션 (shake class 추가)
   → 0.5초 후 애니메이션 종료

❌ API 실패
   → Shake 애니메이션
   → isCreating = false (버튼 다시 클릭 가능)
   → 콘솔에 에러 출력
```

---

## 🎨 UX/Design Decisions (왜 이렇게 디자인했나)

### Brutal Design System 적용

```tsx
const brutalBox =
  "border-[0.25rem] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px]...`;
```

**왜 이 디자인인가?**

- **명확함**: 굵은 테두리와 그림자로 버튼이 명확하게 인지됨
- **상호작용 피드백**: 호버 시 그림자 제거 + 이동 → 클릭 가능함을 직관적으로 표현
- **게임 느낌**: 클릭 게임 특유의 "누르는 감각" 강조

### Shake 애니메이션

```tsx
const shake = "animate__animated animate__shakeX";
onAnimationEnd={() => setShakeMotion(false)} // 애니메이션 끝 후 상태 초기화
```

**왜 이 피드백인가?**

- 사용자가 "뭔가 잘못됐다"를 즉각 인지 가능
- 에러 메시지 없이도 시각만으로 상황 파악 → 게임 몰입 방해 최소화

---

## 🚨 Edge Cases & Handling

### Case 1: 연속 클릭 방지

```typescript
if (isRandomizing) return; // 아바타 랜덤 선택 중 재클릭 무시
```

**왜?** → interval이 2개 이상 동시 실행되면 예측 불가능한 동작 발생

### Case 2: API 중복 요청 방지

```typescript
if (isCreating) return; // 버튼 이미 누른 상태에서 재클릭 무시
```

**왜?** → 서버에 같은 요청이 2번 들어가면 데이터 중복/오류 발생 가능

### Case 3: 빈 닉네임 처리

```typescript
if (!fullNickname.trim()) {
  setShakeMotion(true);
  return; // API 호출 안 함
}
```

**왜?** → 서버에서도 검증하지만, 클라이언트에서 먼저 방어 → UX 개선

### Case 4: 아바타 인덱스 순환

```typescript
setIndex((index + animalList.length - 1) % animalList.length); // 좌측 화살표
setIndex((index + 1) % animalList.length); // 우측 화살표
```

**왜?** → 마지막 아바타에서 좌측 누르면 처음으로, 처음에서 우측 누르면 마지막으로 → 순환 구조

---

## 📚 Future Improvements & TODOs

- [ ] **아바타 커스터마이징**: 색상 변경, 스타일 추가 등
- [ ] **닉네임 중복 체크**: API 호출 전 실시간 검증
- [ ] **프로필 이미지 업로드**: 기본 동물 외 커스텀 이미지 지원
- [ ] **접근성 개선**: 키보드 네비게이션, 스크린리더 지원
- [ ] **다국어 지원**: 영문/중문/일문 등 자동 감지

---

## 📖 Related Files

- `src/shared/utils/randomAvatar.ts` - 아바타 + 형용사 데이터
- `src/shared/utils/ApiManager.ts` - createUser API 호출
- `src/shared/components/Avatar.tsx` - 아바타 렌더링
- `src/stores/audioStore.ts` - 음성 효과 제어
- `src/features/auth/App.tsx` - CharacterBoard 부모 컴포넌트
