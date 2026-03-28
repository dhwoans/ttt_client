import { motion } from "motion/react";
import { Avatar } from "@/shared/components/Avatar";
import { animalList } from "@/shared/constants/randomAvatar";
import Subtitle from "./Subtitle";

const PlayerInfo = () => {
  const index = sessionStorage.getItem("avator") || 3;
  const nickname = sessionStorage.getItem("nickname");
  return (
    <motion.div className="flex-1 bg-pink-300 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col items-center justify-center min-h-120">
      <Avatar size="large">{animalList[Number(index)][0]}</Avatar>
      <small className="text-white mt-6">플레이어</small>
      <Subtitle text={nickname} className="text-yellow-300"></Subtitle>
    </motion.div>
  );
};
export default PlayerInfo;
