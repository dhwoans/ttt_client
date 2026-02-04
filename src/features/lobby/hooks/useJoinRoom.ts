import { useState } from "react";
import { apiManager } from "../../../shared/utils/ApiManager";

interface JoinRoomResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useJoinRoom() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JoinRoomResult | null>(null);

  const joinRoom = async (...args: any[]) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await apiManager.joinRoom(...args);
      const resultObj = { success: true, data: response };
      setResult(resultObj);
      return resultObj;
    } catch (error: any) {
      const errorObj = {
        success: false,
        error: error?.message || "Unknown error",
      };
      setResult(errorObj);
      return errorObj;
    } finally {
      setLoading(false);
    }
  };

  return { joinRoom, loading, result };
}
