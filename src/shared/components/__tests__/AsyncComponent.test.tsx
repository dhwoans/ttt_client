import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";

// 예제용 비동기 컴포넌트
const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = React.useState<{ name: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      // 모의 API 호출
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUser({ name: "John Doe" });
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>사용자를 찾을 수 없습니다</div>;

  return <div>{user.name}</div>;
};

describe("비동기 테스트", () => {
  it("데이터 로딩 및 표시", async () => {
    render(<UserProfile userId="1" />);

    // 로딩 상태 확인
    expect(screen.getByText("로딩 중...")).toBeInTheDocument();

    // 데이터 로드 완료 후 표시 확인
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("로딩 상태에서 벗어남", async () => {
    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
    });
  });
});

import React from "react";
