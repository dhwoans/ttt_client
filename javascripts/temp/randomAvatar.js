export function getRandomAnimalEmoji() {
  const animalEmojis = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🦝",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🦉",
    "🐢",
    "🐬",
  ];
  
  const arrayLength = animalEmojis.length;
  const randomIndex = Math.floor(Math.random() * arrayLength); 
  return animalEmojis[randomIndex];
}
