import { animalList } from "@/shared/constants/avatarCandidates";

export function AvatorSelectModal() {
  const list = animalList;
  return (
    <dialog>
      {list.map((item, idx) => (
        <button key={idx}>{item[0]}</button>
      ))}
    </dialog>
  );
}
