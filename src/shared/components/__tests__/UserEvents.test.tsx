import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";

// 예제용 간단한 컴포넌트
const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => void;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(
          formData.get("email") as string,
          formData.get("password") as string,
        );
      }}
    >
      <input name="email" type="email" placeholder="이메일" />
      <input name="password" type="password" placeholder="비밀번호" />
      <button type="submit">로그인</button>
    </form>
  );
};

describe("User Events 테스트", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("폼 입력 및 제출", async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByPlaceholderText("이메일");
    const passwordInput = screen.getByPlaceholderText("비밀번호");
    const submitButton = screen.getByRole("button", { name: "로그인" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
    );
  });

  it("유효성 검사 - 빈 입력", async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole("button", { name: "로그인" });
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith("", "");
  });
});
