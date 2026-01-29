export const botList: [string, string, string][] = [
  ["👾", "외계인", "/assets/bots/Alien Monster.png"],
  ["👽", "에일리언", "/assets/bots/Alien.png"],
  ["🤡", "광대", "/assets/bots/Clown Face.png"],
  ["👻", "유령", "/assets/bots/Ghost.png"],
  ["👹", "고블린", "/assets/bots/Ogre.png"],
  ["👺", "코주부", "/assets/bots/Goblin.png"],
  ["🤖", "로봇", "/assets/bots/Robot.png"],
  ["💀", "해골", "/assets/bots/Skull.png"],
  ["😈", "악마", "/assets/bots/Smiling_Face_with_Horns.png"],
];

export const randomBot = () =>{
  const result = Math.floor(Math.random()*botList.length)
  return botList[result]
}