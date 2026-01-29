import { Avatar } from "./Avatar";

interface SideProps {
  name: string;
  imageSrc?: string;
  emoji?: string;
}

interface VersusBannerProps {
  // 기존 left/right 사용은 유지하되, sides 배열로 최대 4명까지 지원
  left?: SideProps;
  right?: SideProps;
  sides?: SideProps[]; // 길이 2~4 예상
  dividerText?: string;
  className?: string;
}

// 공용 VS 배너: 싱글/로컬/멀티 모두 사용 가능, 최대 4명까지 확장 가능
export function VersusBanner({
  left,
  right,
  sides,
  dividerText = "VS",
  className = "",
}: VersusBannerProps) {
  // 호환성을 위해 left/right 우선, 없으면 sides 사용
  const participants: SideProps[] =
    sides && sides.length > 0
      ? sides
      : ([left, right].filter(Boolean) as SideProps[]);

  if (participants.length === 0) return null;

  const isTwoPlayers = participants.length === 2;
  const useGrid = participants.length > 2;

  const base = useGrid
    ? "grid grid-cols-2 gap-6 md:gap-8 px-4 py-6 rounded-xl"
    : "flex items-center justify-center gap-6 md:gap-10 px-4 py-6 rounded-xl";

  const renderSide = ({ name, imageSrc, emoji }: SideProps) => (
    <div className="flex flex-col items-center gap-2">
      <Avatar size="large">
        {imageSrc ? (
          <img className="w-30 h-30" src={imageSrc} alt={name} />
        ) : (
          <span className="text-4xl" aria-label={name}>
            {emoji ?? "❓"}
          </span>
        )}
      </Avatar>
      <div className="text-white font-bold text-lg md:text-xl">{name}</div>
    </div>
  );

  return (
    <section className={`${base} ${className}`}>
      {participants.length === 1 ? (
        renderSide(participants[0])
      ) : isTwoPlayers ? (
        <>
          {renderSide(participants[0])}
          <div className="text-white font-extrabold text-2xl md:text-3xl">
            {dividerText}
          </div>
          {renderSide(participants[1])}
        </>
      ) : (
        // 3~4명일 때는 단순 그리드로 나열
        participants.map((p, idx) => <div key={idx}>{renderSide(p)}</div>)
      )}
    </section>
  );
}
