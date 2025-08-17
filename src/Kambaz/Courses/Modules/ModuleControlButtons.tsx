import { BsPlus } from 'react-icons/bs'
import { IoEllipsisVertical } from 'react-icons/io5'
import { FaTrash, FaPen } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import GreenCheckmark from './GereenCheckmark'
import type { RootState } from '@/store'

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string
  deleteModule: (moduleId: string) => void
  editModule: (moduleId: string) => void
}) {
  const { currentUser } = useSelector((state: RootState) => state.auth)

  return (
    <span className="float-end">
      {currentUser?.role === 'FACULTY' && (
        <>
          <FaPen
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
