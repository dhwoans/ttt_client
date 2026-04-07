import { useEffect } from "react";
import { toast } from "react-toastify";
import { eventManager } from "@/shared/managers/EventManager";
import { animalList } from "@/shared/constants/randomAvatar";
import type { PlayerJoinedEvent, ExistingPlayersEvent } from "@share";
import { GamePlayerInfo } from "./useRoomState";

/**
 * 멀티플레이 플레이어 목록 관리
 * - sessionStorage에서 기존 플레이어 로드
 * - EXISTING_PLAYERS 이벤트 처리
 * - PLAYER_JOINED 이벤트 처리
 */
export function useMultiplayerPlayers(
  setPlayersInfos: React.Dispatch<React.SetStateAction<GamePlayerInfo[]>>,
  setPlayersReadyStatus: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) {
  // sessionStorage에서 기존 플레이어 로드
  useEffect(() => {
    {
      const storedPlayers = sessionStorage.getItem("existingPlayers");
      console.log(
        "[room] sessionStorage에서 existingPlayers 로드:",
        storedPlayers,
      );

      if (storedPlayers) {
        try {
          const players = JSON.parse(storedPlayers);
          console.log("[room] 파싱된 플레이어들:", players);

          setPlayersInfos((prev) => {
            const existingPlayerNicknames = prev.map((p) => p.nickname);

            const newPlayers = players
              .filter(
                (player: any) =>
                  !existingPlayerNicknames.includes(player.nickname),
              )
              .map((player: any) => {
                let imageSrc = "";
                const found = animalList.find(
                  (animal) => animal[0] === player.avatar,
                );
                if (found) {
                  imageSrc = found[2];
                }
                return {
                  nickname: player.nickname,
                  avatar: player.avatar,
                  imageSrc,
                  userId: player.connId,
                };
              });

            const updated = [...prev, ...newPlayers];
            console.log(
              "[room] sessionStorage 플레이어 업데이트 완료:",
              updated,
            );
            return updated;
          });

          const readyStatus: Record<string, boolean> = {};
          players.forEach((player: any) => {
            readyStatus[player.connId] = player.isReady;
          });
          setPlayersReadyStatus(readyStatus);
        } catch (e) {
          console.error("[room] existingPlayers 파싱 실패:", e);
        }
      }
    }
  }, [setPlayersInfos, setPlayersReadyStatus]);

  // PLAYER_JOINED 이벤트 처리
  useEffect(() => {
    const handleExistingPlayers = (data: ExistingPlayersEvent) => {
      console.log("[room] EXISTING_PLAYERS 이벤트 수신:", data.players);

      setPlayersInfos((prev) => {
        const existingPlayerNicknames = prev.map((p) => p.nickname);

        const newPlayers = data.players
          .filter(
            (player) => !existingPlayerNicknames.includes(player.nickname),
          )
          .map((player) => {
            let imageSrc = "";
            const found = animalList.find(
              (animal) => animal[0] === player.avatar,
            );
            if (found) {
              imageSrc = found[2];
            }
            return {
              nickname: player.nickname,
              avatar: player.avatar ?? "",
              imageSrc,
              userId: player.connId,
            };
          });

        if (newPlayers.length === 0) {
          console.log("[room] EXISTING_PLAYERS: 추가할 새 플레이어 없음");
          return prev;
        }

        const updated = [...prev, ...newPlayers];
        console.log(
          "[room] EXISTING_PLAYERS로 playersInfos 업데이트:",
          updated,
        );
        return updated;
      });

      const readyStatus: Record<string, boolean> = {};
      data.players.forEach((player) => {
        readyStatus[player.connId] = player.isReady;
      });
      setPlayersReadyStatus(readyStatus);
    };

    eventManager.on("EXISTING_PLAYERS", handleExistingPlayers);
    return () => {
      console.log("[room] EXISTING_PLAYERS 리스너 제거");
      eventManager.off("EXISTING_PLAYERS", handleExistingPlayers);
    };
  }, [setPlayersInfos, setPlayersReadyStatus]);

  
  useEffect(() => {
    const handlePlayerJoined = (data: PlayerJoinedEvent) => {
      console.log("[room] 새 플레이어 입장:", data.player);
      toast.info(`${data.player.nickname}님이 들어왔습니다!`);

      let imageSrc = "";
      const found = animalList.find(
        (animal) => animal[0] === data.player.avatar,
      );
      if (found) {
        imageSrc = found[2];
      }

      setPlayersInfos((prev) => [
        ...prev,
        {
          nickname: data.player.nickname,
          avatar: data.player.avatar ?? "",
          imageSrc,
          userId: data.player.connId,
        },
      ]);

      setPlayersReadyStatus((prev) => ({
        ...prev,
        [data.player.connId]: data.player.isReady,
      }));
    };

    eventManager.on("PLAYER_JOINED", handlePlayerJoined);
    return () => {
      console.log("[room] PLAYER_JOINED 리스너 제거");
      eventManager.off("PLAYER_JOINED", handlePlayerJoined);
    };
  }, [setPlayersInfos, setPlayersReadyStatus]);
}
