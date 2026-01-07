import { animalList } from "../../util/randomAvatar";

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
