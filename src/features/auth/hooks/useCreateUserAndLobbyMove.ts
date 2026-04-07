import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendCreateUser } from "./useSendCreateUser";

interface HandleCreateUserOptions {
  nickname: string;
  avatarName: string;
  avatarIndex: number;
  onError: () => void;
}

function useCreateUserState() {
  const [isCreating, setIsCreating] = useState(false);

  return {
    isCreating,
    startCreating: () => setIsCreating(true),
    stopCreating: () => setIsCreating(false),
  };
}

function useCreateUserActions() {
  const { createUser } = useSendCreateUser();

  const createAndStoreUser = async ({
    nickname,
    avatarName,
    avatarIndex,
  }: {
    nickname: string;
    avatarName: string;
    avatarIndex: number;
  }) => {
    const result = await createUser({
      nickname,
      avatar: avatarName,
    });

    if (result && result.success) {
      sessionStorage.setItem("avator", String(avatarIndex));
      sessionStorage.setItem("nickname", nickname);
      sessionStorage.setItem("userId", result.message ?? "");
      return true;
    }

    return false;
  };

  return { createAndStoreUser };
}

function useCreateUserFlow() {
  const navigate = useNavigate();
  const state = useCreateUserState();
  const actions = useCreateUserActions();

  const handleCreateUser = async ({
    nickname,
    avatarName,
    avatarIndex,
    onError,
  }: HandleCreateUserOptions) => {
    if (!nickname.trim()) {
      onError();
      return;
    }

    if (state.isCreating) return;
    state.startCreating();
    let shouldResetCreating = true;

    try {
      const success = await actions.createAndStoreUser({
        nickname,
        avatarName,
        avatarIndex,
      });

      if (success) {
        shouldResetCreating = false;
        setTimeout(() => {
          navigate("/lobby", { replace: true });
        }, 1000);
      } else {
        onError();
      }
    } catch (error) {
      console.error("유저 생성 오류:", error);
      onError();
    } finally {
      if (shouldResetCreating) {
        state.stopCreating();
      }
    }
  };

  return { isCreating: state.isCreating, handleCreateUser };
}

export function useCreateUserAndLobbyMove() {
  return useCreateUserFlow();
}
