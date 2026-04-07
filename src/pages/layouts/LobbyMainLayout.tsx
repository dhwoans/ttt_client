import PlayerInfo from "../../features/lobby/components/PlayerInfo";
import SingleMode from "../../features/lobby/components/SingleMode";
import LocalMode from "../../features/lobby/components/LocalMode";
import MultiMode from "../../features/lobby/components/MultiMode";
import SettingsAndLogout from "../../features/lobby/components/SettingsAndLogout";

export default function LobbyMainLayout() {
  return (
    <div className="flex flex-row gap-6 w-full h-[75vh]">
      <SingleMode />
      <MultiMode />
      <LocalMode />
      <div className="flex flex-col gap-6 flex-1">
        <PlayerInfo />
        <SettingsAndLogout />
      </div>
    </div>
  );
}
