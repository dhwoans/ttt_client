// Vite가 자동으로 처리하는 아바타 리소스 import (png/webm)
const animalImages = import.meta.glob<{ default: string }>(
  "@assets/animals/*.{png,webm}",
  { eager: true },
);

// 이미지 경로 매핑
const imageMap = Object.entries(animalImages).reduce(
  (acc, [path, module]) => {
    const fileName = path.split("/").pop();
    acc[fileName] = module.default;
    return acc;
  },
  {} as Record<string, string>,
);

export const animalList: [string, string, string][] = [
  ["🐶", "강아지", imageMap["DogFace.webm"]],
  ["🐱", "고양이", imageMap["CatFace.webm"]],
  ["🐭", "생쥐", imageMap["MouseFace.webm"]],
  ["🐹", "햄스터", imageMap["Hamster.webm"]],
  ["🐰", "토끼", imageMap["RabbitFace.webm"]],
  ["🦊", "여우", imageMap["Fox.webm"]],
  ["🐻", "곰", imageMap["Bear.webm"]],
  ["🦝", "너구리", imageMap["Raccoon.webm"]],
  ["🐨", "코알라", imageMap["Koala.webm"]],
  ["🐯", "호랑이", imageMap["TigerFace.webm"]],
  ["🦁", "사자", imageMap["Lion.webm"]],
  ["🐮", "소", imageMap["CowFace.webm"]],
  ["🐷", "돼지", imageMap["PigFace.webm"]],
  ["🐸", "개구리", imageMap["Frog.webm"]],
  ["🐵", "원숭이", imageMap["MonkeyFace.webm"]],
  ["🦉", "부엉이", imageMap["Owl.webm"]],
  ["🐢", "거북이", imageMap["Turtle.webm"]],
  ["🐬", "돌고래", imageMap["Dolphin.webm"]],
];

export const adjectives: string[] = [
  "침착한",
  "슬픈",
  "화가많은",
  "피곤한",
  "활기찬",
  "시끄러운",
  "따뜻한",
  "차가운",
  "부드러운",
  "강한",
  "약삭빠른",
  "음침한",
  "늙은",
  "밝은",
  "느린",
  "뚱뚱한",
  "용감한",
  "겸손한",
  "이상한",
  "느긋한",
  "엄격한",
  "귀여운",
  "기묘한",
  "졸렬한",
  "공정한",
  "쌀쌀맞은",
  "야릇한",
  "논리적인",
  "객관적인",
  "분석적인",
  "통찰력있는",
  "예리한",
  "진지한",
  "사려깊은",
  "정의로운",
  "합리적인",
  "어중간한",
  "철저한",
];

export function getRandomAdj(): string {
  const randomAdj = Math.floor(Math.random() * adjectives.length);
  return adjectives[randomAdj];
}
