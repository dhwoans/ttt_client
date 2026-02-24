# React 테스트 코드 작성 수칙

## 🎬 컴포넌트 테스트 중심 가이드

**이 문서의 모든 예제는 "컴포넌트 테스트"(Component Testing)입니다.**

- ❌ `calculatePrice()` 같은 순수 함수 단위 테스트
- ❌ `useState` 같은 Hook의 내부 동작 테스트
- ✅ **사용자가 보는 화면(UI 컴포넌트)을 중심으로 테스트**
- ✅ **여러 자식 컴포넌트를 포함한 전체 동작 검증**

---

## 핵심 철학

**"사용자가 앱을 사용하는 방식과 최대한 유사하게 테스트하라"**

구현 세부 사항(어떤 함수를 호출했는지, 내부 상태가 무엇인지)보다는 **결과물(화면에 무엇이 보이는지, 버튼을 눌렀을 때 어떤 변화가 있는지)**에 집중합니다.

---

## 📦 유닛 테스트 vs 컴포넌트 테스트

### ❌ 유닛 테스트 (이 가이드에서 다루지 않음)

```typescript
// 순수 함수 단위 테스트
import { sum } from "./math.ts";
import { it, expect } from "vitest";

it("두 숫자를 더하면 합을 반환한다", () => {
  expect(sum(1, 2)).toBe(3);
});
```

### ✅ 컴포넌트 테스트 (이 가이드의 전부)

```typescript
// UI 컴포넌트의 동작 검증
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect } from 'vitest';
import Counter from './Counter';

it('버튼을 클릭하면 화면의 카운트가 증가한다', async () => {
  const user = userEvent.setup();
  render(<Counter />);  // ← 컴포넌트를 렌더링

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /증가/i }));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();  // ← 화면 검증
});
```

**왜 컴포넌트 테스트에 집중하는가?**

1. 사용자가 실제로 경험하는 부분을 테스트
2. 내부 구현 변경에 강력함
3. 접근성도 함께 검증
4. 여러 기능이 함께 동작하는지 확인

---

## 1. 🎯 구현(Implementation)이 아닌 '행위(Behavior)'를 테스트하세요

### ❌ 나쁜 예: 구현 세부사항을 테스트

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Counter from './Counter';

it('버튼 클릭 시 setState 호출', () => {
  const setCount = vi.fn();
  render(<Counter setCount={setCount} />);

  fireEvent.click(screen.getByRole('button'));
  expect(setCount).toHaveBeenCalled(); // 구현 세부사항
});
```

**문제점:**

- 내부 구현을 변경하면 바로 깨짐
- 사용자 입장에서는 상태가 어떻게 변했는지 중요하지 않음
- 리팩토링할 때마다 테스트도 수정해야 함

### ✅ 좋은 예: 행위와 결과를 테스트

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect } from 'vitest';
import Counter from './Counter';

it('버튼 클릭 후 카운트가 증가해서 화면에 표시됨', () => {
  render(<Counter initialCount={0} />);

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /증가/i }));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**장점:**

- 사용자가 실제로 경험하는 것을 테스트
- 내부 구현을 바꿔도 테스트는 깨지지 않음
- 리팩토링에 즉시 반응하지 않아 유지보수가 쉬움

---

## 2. ♿ 접근성(Accessibility) 기반 쿼리 사용

### 쿼리 우선순위

Testing Library는 사용자 경험에 가까운 순서대로 쿼리를 선택하길 권장합니다:

1. **`getByRole`** (가장 권장)
2. **`getByLabelText`**
3. **`getByPlaceholderText`**
4. **`getByText`**
5. **`getByTestId`** (마지막 수단)

### ❌ 피해야 할 쿼리

```typescript
// ID나 class로 선택하지 마세요
screen.getByTestId("login-button"); // (X)
container.querySelector(".submit-btn"); // (X)
screen.getByRole("button").id === "btn-123"; // (X)
```

### ✅ 권장 쿼리

#### 1️⃣ **getByRole** - 가장 강력한 선택

```typescript
// 버튼을 역할(role)로 찾기
screen.getByRole("button", { name: /로그인/i });
screen.getByRole("checkbox");
screen.getByRole("textbox", { name: /비밀번호/i });
screen.getByRole("link", { name: /홈페이지/i });
```

**왜 좋은가?**

- 사용자가 스크린 리더로 인식하는 방식과 동일
- 자동으로 웹 접근성 검증
- 여러 요소가 있어도 명확한 목적으로 식별

#### 2️⃣ **getByLabelText** - 폼 입력 요소에 최적

```typescript
// label이 있는 input 찾기
screen.getByLabelText("사용자명");
screen.getByLabelText(/비밀번호/i);
```

**HTML 예시:**

```html
<label htmlFor="username">사용자명</label> <input id="username" type="text" />
```

#### 3️⃣ **getByPlaceholderText** - placeholder로 찾기

```typescript
screen.getByPlaceholderText("이메일을 입력하세요");
```

#### 4️⃣ **getByText** - 버튼 텍스트나 라벨로 찾기

```typescript
// 정확히 일치
screen.getByText("제출");

// 부분 일치 (대소문자 무시)
screen.getByText(/제출/i);
```

#### 5️⃣ **getByTestId** - 마지막 수단 (동적 콘텐츠)

```typescript
// 위 방법들로 불가능할 때만 사용
screen.getByTestId("dynamic-list-item-1");
```

**HTML:**

```html
<div data-testid="dynamic-list-item-1">Item 1</div>
```

---

## 3. 🧪 실전 컴포넌트 테스트 예제

### 예제 1: LoginForm 컴포넌트

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('유효한 자격증명으로 로그인하면 성공 메시지 표시', async () => {
    const user = userEvent.setup();
    // ✅ 컴포넌트 렌더링
    render(<LoginForm onSubmit={vi.fn()} />);

  // 입력 필드를 label로 찾기
  const emailInput = screen.getByLabelText('이메일');
  const passwordInput = screen.getByLabelText('비밀번호');

  // 사용자처럼 입력
  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');

  // 버튼을 역할로 찾기
  const submitButton = screen.getByRole('button', { name: /로그인/i });
  await user.click(submitButton);

    // 화면에 나타나는 결과 확인
    expect(screen.getByText('로그인 성공')).toBeInTheDocument();
  });

  it('비어있는 필드로 제출하면 에러 메시지 표시', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /로그인/i });
    await user.click(submitButton);

    expect(screen.getByText('이메일은 필수입니다')).toBeInTheDocument();
    expect(screen.getByText('비밀번호는 필수입니다')).toBeInTheDocument();
  });
});
```

### 예제 2: TodoApp 컴포넌트

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect } from 'vitest';
import TodoApp from './TodoApp';

it('새로운 할일을 추가하면 리스트에 표시됨', async () => {
  const user = userEvent.setup();
  // ✅ 컴포넌트 렌더링
  render(<TodoApp />);

  // 입력 필드와 버튼을 접근성 쿼리로 찾기
  const input = screen.getByRole('textbox', { name: /새로운 할일/i });
  const addButton = screen.getByRole('button', { name: /추가/i });

  // 사용자처럼 입력 및 클릭
  await user.type(input, '테스트 코드 작성');
  await user.click(addButton);

  // 리스트 아이템이 추가되었는지 확인
  expect(screen.getByText('테스트 코드 작성')).toBeInTheDocument();

  // 입력 필드가 초기화되었는지 확인
  expect(input).toHaveValue('');
});
```

### 예제 3: ModalComponent 컴포넌트

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect } from 'vitest';
import ModalComponent from './ModalComponent';

it('버튼 클릭 시 모달이 열렸다가 닫기 버튼으로 닫혀야 함', async () => {
  const user = userEvent.setup();
  // ✅ 컴포넌트 렌더링
  render(<ModalComponent />);

  // 모달은 처음에 보이지 않음
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  // 열기 버튼 클릭
  const openButton = screen.getByRole('button', { name: /모달 열기/i });
  await user.click(openButton);

  // 모달과 그 안의 요소가 보임
  const modal = screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();
  expect(screen.getByText('모달 제목')).toBeInTheDocument();

  // 닫기 버튼 클릭
  const closeButton = screen.getByRole('button', { name: /닫기/i });
  await user.click(closeButton);

  // 모달 사라짐
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

---

## 4. 🔍 쿼리 선택 가이드

| 사용 상황            | 권장 쿼리              | 예시                                       |
| -------------------- | ---------------------- | ------------------------------------------ |
| 버튼, 링크, 체크박스 | `getByRole`            | `getByRole('button', { name: /로그인/i })` |
| 입력 필드            | `getByLabelText`       | `getByLabelText('사용자명')`               |
| 동적 목록 아이템     | `getByTestId`          | `getByTestId('item-123')`                  |
| 일반 텍스트 콘텐츠   | `getByText`            | `getByText('환영합니다')`                  |
| 플레이스홀더 텍스트  | `getByPlaceholderText` | `getByPlaceholderText('검색...')`          |

---

## 5. ⚠️ 주의사항

### `fireEvent` vs `userEvent`

```typescript
// ❌ fireEvent: 브라우저 이벤트를 직접 발생 (부자연스러움)
fireEvent.click(button);

// ✅ userEvent: 사용자처럼 상호작용 (권장)
const user = userEvent.setup();
await user.click(button);
```

### `queryBy` vs `getBy`

```typescript
// ✅ 요소가 없어야 할 때: queryBy 사용
expect(screen.queryByText("에러")).not.toBeInTheDocument();

// ❌ 요소가 없으면 에러 발생
expect(screen.getByText("에러")).not.toBeInTheDocument(); // 실패!
```

---

## 6. 📋 컴포넌트 테스트 체크리스트

각 테스트마다 확인하세요:

- [ ] **컴포넌트를 render 했는가?** (render(<Component />))
- [ ] 사용자의 행동을 시뮬레이션했는가? (입력, 클릭, 스크롤 등)
- [ ] 화면에 표시되는 결과를 검증했는가? (구현 세부사항 X)
- [ ] 역할(`role`) 기반 쿼리를 사용했는가?
- [ ] ID나 class selector를 사용하지 않았는가?
- [ ] `userEvent`를 사용했는가? (또는 `fireEvent`가 필수인 경우?)
- [ ] 비동기 작업은 `waitFor`나 `screen.findBy~`로 처리했는가?
- [ ] 요소가 없을 때는 `queryBy`를 사용했는가?
- [ ] 여러 자식 컴포넌트의 통합 동작을 검증했는가?

---

## 7. 🚀 AI 에이전트 검증

AI 에이전트에게 테스트 코드를 검증할 때는 다음을 확인시키세요:

1. **컴포넌트 중심**: 테스트가 UI 컴포넌트를 render하고 있는가?
2. **접근성 준수**: 스크린 리더 사용자가 테스트되는 요소를 인식할 수 있는가?
3. **사용자 중심**: 테스트가 사용자의 실제 행동과 일치하는가?
4. **구현 독립**: 테스트가 내부 구현(state, props 전달 등)에 의존하지 않는가?
5. **유지보수성**: 리팩토링 때 테스트가 깨질 가능성이 있는가?

---

## 📌 요약: 이 가이드는 "컴포넌트 테스트"만 다룹니다

| 항목            | 유닛 테스트            | **컴포넌트 테스트** ✅         |
| --------------- | ---------------------- | ------------------------------ |
| 테스트 대상     | 순수 함수 (`utils.ts`) | **React 컴포넌트**             |
| 렌더링          | ❌                     | **✅**                         |
| 사용자 상호작용 | ❌                     | **✅**                         |
| 화면 검증       | ❌                     | **✅**                         |
| 예제            | `sum(1, 2) === 3`      | **"버튼 클릭 후 텍스트 변경"** |

**이 가이드의 원칙을 따르면, 순수 함수 테스트는 필요에 따라 간단하게 작성하고, 대부분의 테스트 리소스는 사용자가 실제로 경험하는 컴포넌트 동작에 집중할 수 있습니다.**
