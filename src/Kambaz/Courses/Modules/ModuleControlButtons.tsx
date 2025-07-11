import { BsPlus, BsGripVertical } from 'react-icons/bs'
import { IoEllipsisVertical } from 'react-icons/io5'
import GreenCheckmark from './GreenCheckmark'

export default function ModuleControlButtons() {
  return (
    <span className="float-end">
      <BsPlus className="me-3 fs-4" />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </span>
  )
}
