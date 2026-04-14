import { useNavigate } from "react-router-dom";
import { ImageManager } from "@/shared/utils/ImageManger";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <img src={ImageManager.notFound404} className="w-[50%] h-[50%]" />
      <p className="text-xl">페이지를 찾을 수 없습니다.</p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 border-4 bg-accent border-black font-bold rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        홈으로
      </button>
    </div>
  );
}
