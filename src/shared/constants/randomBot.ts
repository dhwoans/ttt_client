// Vite가 자동으로 처리하는 이미지 import
const botImages = import.meta.glob<{ default: string }>("@assets/bots/*.png", {
  eager: true,
});

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
  ["👾", "외계인", botImageMap["Alien Monster.png"]],
  ["👽", "에일리언", botImageMap["Alien.png"]],
  ["🤡", "광대", botImageMap["Clown Face.png"]],
  ["👻", "유령", botImageMap["Ghost.png"]],
  ["👹", "고블린", botImageMap["Ogre.png"]],
  ["👺", "코주부", botImageMap["Goblin.png"]],
  ["🤖", "로봇", botImageMap["Robot.png"]],
  ["💀", "해골", botImageMap["Skull.png"]],
  ["😈", "악마", botImageMap["Smiling_Face_with_Horns.png"]],
];

export const randomBot = () => {
  const result = Math.floor(Math.random() * botList.length);
  return botList[result];
};
