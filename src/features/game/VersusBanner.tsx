import { Avatar } from "../../shared/components/Avatar";
const loadingImgSrc = "/assets/icons/Hourglass_Not_Done.png";
const verse = "/assets/icons/verse.png"
interface SideProps {
  name: string;
  imageSrc?: string;
  emoji?: string;
}

interface VersusBannerProps {
  // 기존 left/right/sides 호환 + playersInfos 지원
  left?: SideProps;
  right?: SideProps;
  sides?: SideProps[];
  playersInfos?: { nickname: string; imageSrc: string }[];
  dividerText?: string;
  className?: string;
}

// 공용 VS 배너: 싱글/로컬/멀티 모두 사용 가능, 최대 4명까지 확장 가능
export function VersusBanner({
  left,
  right,
  sides,
  playersInfos,
  className = "",
}: VersusBannerProps) {
  // playersInfos가 있으면 우선 사용, 아니면 기존 방식
  let participants: SideProps[] = [];
  if (playersInfos && playersInfos.length > 0) {
    participants = playersInfos.map((p) => ({
      name: p.nickname,
      imageSrc: p.imageSrc,
    }));
  } else if (sides && sides.length > 0) {
    participants = sides;
  } else {
    participants = [left, right].filter(Boolean) as SideProps[];
  }

  if (!participants) {
    return <div>플레이어 정보를 불러오는 중...</div>;
  }

  const isTwoPlayers = participants.length === 2;
  const useGrid = participants.length > 2;

  const base = useGrid
    ? "grid grid-cols-2 gap-6 md:gap-8 px-4 py-6 rounded-xl"
    : "flex items-center justify-center gap-6 md:gap-10 px-4 py-6 rounded-xl";

  // 첫번째 플레이어(나)가 아닌 경우 effectOnce로 등장 애니메이션 적용
  const renderSide = ({ name, imageSrc, emoji }: SideProps, idx: number) => (
    <div className="flex flex-col items-center gap-2">
      <Avatar size="large" effectOnce={idx !== 0}>
          <img className="w-30 h-30" src={imageSrc} alt={name} />
      </Avatar>
      {/* <div className="text-white font-bold text-lg md:text-xl">{name}</div> */}
    </div>
  );

  return (
    <section className={`${base} ${className}`}>
      {participants.length === 1 ? (
        <>
          {renderSide(participants[0], 0)}
          <div className="text-white font-extrabold text-2xl md:text-3xl">
            <img className="h-30 w-50" src={verse}></img>
          </div>
          <img src={loadingImgSrc} />
        </>
      ) : isTwoPlayers ? (
        <>
          {renderSide(participants[0], 0)}
          <div className="text-white font-extrabold text-2xl md:text-3xl">
            <img className="h-30 w-50" src={verse}></img>
          </div>
          {renderSide(participants[1], 1)}
        </>
      ) : (
        // 3~4명일 때는 단순 그리드로 나열
        participants.map((p, idx) => <div key={idx}>{renderSide(p, idx)}</div>)
      )}
    </section>
  );
}
