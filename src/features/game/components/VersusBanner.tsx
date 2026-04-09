import { Avatar } from "../../../shared/components/Avatar";
import loadingImgSrc from "@assets/icons/Hourglass_Not_Done.webm";
import verse from "@assets/icons/verse.webp";

interface SideProps {
  name: string;
  imageSrc?: string;
  emoji?: string;
  userId?: string;
  isReady?: boolean;
}

interface VersusBannerProps {
  // 기존 left/right/sides 호환 + playersInfos 지원
  left?: SideProps;
  right?: SideProps;
  sides?: SideProps[];
  playersInfos?: { nickname: string; imageSrc: string; userId?: string }[];
  playersReadyStatus?: Record<string, boolean>;
  dividerText?: string;
  className?: string;
}
 // 첫번째 플레이어(나)가 아닌 경우 effectOnce로 등장 애니메이션 적용
const renderSide = (
  { name, imageSrc, emoji, isReady }: SideProps,
  idx: number,
) => {
  // imageSrc가 없으면 로딩 이미지 표시
  const displaySrc = imageSrc || loadingImgSrc;
  // 준비 상태에 따라 opacity 적용 (준비 안 함 = 반투명)
  const opacity = isReady !== false ? "opacity-100" : "opacity-50";

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar size="large" effectOnce={idx !== 0}>
        <video
          className={`w-30 h-30 transition-opacity duration-300 ${opacity}`}
          src={displaySrc}
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            (e.target as HTMLVideoElement).src = loadingImgSrc;
          }}
        />
      </Avatar>
    </div>
  );
};

// 공용 VS 배너: 싱글/로컬/멀티 모두 사용 가능, 최대 4명까지 확장 가능
export function VersusBanner({
  left,
  right,
  sides, // 여러명 버전
  playersInfos,
  playersReadyStatus = {},
  className = "",
}: VersusBannerProps) {
  // playersInfos가 있으면 우선 사용, 아니면 기존 방식
  let participants: SideProps[] = [];
  if (playersInfos && playersInfos.length > 0) {
    participants = playersInfos.map((p) => ({
      name: p.nickname,
      imageSrc: p.imageSrc,
      userId: p.userId,
      isReady: p.userId ? (playersReadyStatus[p.userId] ?? false) : true,
    }));
  } else if (sides && sides.length > 0) {
    participants = sides;
  } else {
    participants = [left, right].filter(Boolean) as SideProps[];
  }

  const isTwoPlayers = participants.length === 2;

  const base =
    participants.length > 2
      ? "grid grid-cols-2 gap-6 md:gap-8 px-4 py-6 rounded-xl"
      : "flex items-center justify-center gap-6 md:gap-10 px-4 py-6 rounded-xl";

 
  return (
    <section className={`${base} ${className}`}>
      {participants.length === 1 ? (
        <>
          {renderSide(participants[0], 0)}
          <div className="text-white font-extrabold text-2xl md:text-3xl">
            <img className="h-30 w-50" src={verse}></img>
          </div>
          <video className="w-30 h-30" src={loadingImgSrc} />
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
