import ticTacToe from "@assets/ticTacToe.png";

interface BridgeProps {
  imageSrc?: string;
}

export default function Bridge({ imageSrc }: BridgeProps) {
  return (
    <section className="flex min-h-screen items-center justify-center p-8">
      <img
        src={imageSrc ?? ticTacToe}
        alt="게임 시작 준비중"
        className="w-full max-w-xl"
      />
    </section>
  );
}
