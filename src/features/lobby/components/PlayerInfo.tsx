import { motion } from "motion/react";
import { Avatar } from "@/shared/components/Avatar";
import { animalList } from "@/shared/constants/randomAvatar";
import Subtitle from "./Subtitle";
import ticTacToe from "@assets/ticTacToe.png";

const PlayerInfo = () => {
  const index = sessionStorage.getItem("avator") || 3;
  const nickname = sessionStorage.getItem("nickname");
  return (
    <motion.div className="shrink-0 h-52 bg-[#ffc567] rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center justify-center">
      {/* <Avatar size="large">{animalList[Number(index)][0]}</Avatar>
      <small className="text-white mt-6">플레이어</small>
      <Subtitle text={nickname} className="text-yellow-300"></Subtitle> */}
      <img className="w-full max-h-36 object-contain" src={ticTacToe}></img>
    </motion.div>
  );
};
export default PlayerInfo;
