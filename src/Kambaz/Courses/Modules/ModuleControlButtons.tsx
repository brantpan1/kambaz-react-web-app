import { BsPlus } from 'react-icons/bs'
import { IoEllipsisVertical } from 'react-icons/io5'
import { FaTrash, FaPencil } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import GreenCheckmark from './GreenCheckmark'

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string
  deleteModule: (moduleId: string) => void
  editModule: (moduleId: string) => void
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer)

  return (
    <span className="float-end">
      {currentUser?.role === 'FACULTY' && (
        <>
          <FaPencil
            onClick={() => editModule(moduleId)}
            className="text-primary me-3"
            style={{ cursor: 'pointer' }}
          />
          <FaTrash
            className="text-danger me-2 mb-1"
            onClick={() => deleteModule(moduleId)}
            style={{ cursor: 'pointer' }}
          />
        </>
      )}
      <GreenCheckmark />
      <BsPlus className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </span>
  )
}
