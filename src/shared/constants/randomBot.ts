// Vite가 자동으로 처리하는 봇 리소스 import
const botImages = import.meta.glob<{ default: string }>(
  "@assets/bots/*.{png,webm}",
  {
    eager: true,
  },
);

// 이미지 경로 매핑
const botImageMap = Object.entries(botImages).reduce(
  (acc, [path, module]) => {
    const fileName = path.split("/").pop();
    acc[fileName] = module.default;
    return acc;
  },
  {} as Record<string, string>,
);

export const botList: [string, string, string][] = [
  ["👾", "외계인", botImageMap["AlienMonster.webm"]],
  ["👽", "에일리언", botImageMap["Alien.webm"]],
  ["🤡", "광대", botImageMap["ClownFace.webm"]],
  ["👻", "유령", botImageMap["Ghost.webm"]],
  ["👹", "고블린", botImageMap["Ogre.webm"]],
  ["👺", "코주부", botImageMap["Goblin.webm"]],
  ["🤖", "로봇", botImageMap["Robot.webm"]],
  ["💀", "해골", botImageMap["Skull.webm"]],
  ["😈", "악마", botImageMap["SmilingFacewithHorns.webm"]],
];

export const randomBot = () => {
  const result = Math.floor(Math.random() * botList.length);
  return botList[result];
};
