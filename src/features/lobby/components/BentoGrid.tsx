import PlayerInfo from "./PlayerInfo";
import SingleMode from "./SingleMode";
import LocalMode from "./LocalMode";
import MultiMode from "./MultiMode";
import SettingsAndLogout from "./SettingsAndLogout";

export default function GameModeLayout() {
  return (
    <div className="flex flex-row w-full gap-8">
      <PlayerInfo />
      <div className="flex flex-col flex-1 gap-6 h-full">
        <div className="flex flex-row gap-6 flex-1">
          <SingleMode />
          <LocalMode />
        </div>
        <div className="flex-1 flex items-stretch">
          <MultiMode />
        </div>
        <SettingsAndLogout />
      </div>
    </div>
  );
}
