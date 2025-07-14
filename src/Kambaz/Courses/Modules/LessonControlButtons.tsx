import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";

export default function LessonControlButtons() {
  return (
    <span className="float-end">
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </span>
  );
}
