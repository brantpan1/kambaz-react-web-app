import { useState } from 'react'
import { ListGroup, FormControl, Spinner, Placeholder } from 'react-bootstrap'
import { BsGripVertical } from 'react-icons/bs'
import { useParams } from 'react-router-dom'

import ModulesControls from './ModulesControls'
import ModuleControlButtons from './ModuleControlButtons'
import LessonControlButtons from './LessonControlButtons'

import {
  useGetModulesByCourseQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  type Module,
} from '@features/modules/modulesApi'

export default function Modules() {
  const { cid } = useParams<{ cid: string }>()
  const courseId = cid ?? ''

  const [moduleName, setModuleName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const {
    data: modules = [],
    isLoading,
    isFetching,
    isError,
  } = useGetModulesByCourseQuery(courseId, { skip: !courseId })

  const [createModule, { isLoading: creating }] = useCreateModuleMutation()
  const [updateModule] = useUpdateModuleMutation()
  const [deleteModule] = useDeleteModuleMutation()

  const handleAddModule = async () => {
    if (!courseId || !moduleName.trim()) return
    try {
      await createModule({ courseId, body: { name: moduleName } }).unwrap()
      setModuleName('')
    } catch (e) {
      console.error('Error creating module:', e)
    }
  }

  const handleUpdateModule = async (id: string, name: string) => {
    if (!courseId) return
    try {
      await updateModule({ courseId, id, patch: { name } }).unwrap()
    } catch (e) {
      console.error('Error updating module:', e)
    } finally {
      setEditingId(null)
      setEditValue('')
    }
  }

  const handleDeleteModule = async (id: string) => {
    if (!courseId) return
    try {
      await deleteModule({ courseId, id }).unwrap()
    } catch (e) {
      console.error('Error deleting module:', e)
    }
  }

  const startEdit = (m: Module) => {
    setEditingId(m._id)
    setEditValue(m.name ?? '')
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Loading modules...</h4>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-5 text-danger">
        Failed to load modules.
      </div>
    )
  }

  return (
    <div id="wd-modules" className="d-flex flex-column">
      <div className="mb-3">
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={handleAddModule}
        />
      </div>

      <ListGroup className="rounded-0">
        {modules.map((module) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />

              {editingId !== module._id && module.name}

              {editingId === module._id && (
                <FormControl
                  className="w-50 d-inline-block"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      handleUpdateModule(module._id, editValue)
                    if (e.key === 'Escape') {
                      setEditingId(null)
                      setEditValue('')
                    }
                  }}
                  onBlur={() => handleUpdateModule(module._id, editValue)}
                  autoFocus
                />
              )}

              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={handleDeleteModule}
                editModule={() => startEdit(module)}
              />
            </div>

            {module.lessons && module.lessons.length > 0 ? (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson) => (
                  <ListGroup.Item
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                    <LessonControlButtons />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <ListGroup className="wd-lessons rounded-0">
                <ListGroup.Item className="wd-lesson p-3 ps-1">
                  <BsGripVertical className="me-2 fs-3" />{' '}
                  {module.description || 'No lessons yet'}
                  <LessonControlButtons />
                </ListGroup.Item>
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}

        {creating && (
          <ListGroup.Item className="wd-module p-1 mb-5 fs-5 border-gray">
            <div className="wd-title p-4 ps-2 bg-secondary d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-3" />
              Creating module…
            </div>
            <ListGroup className="wd-lessons rounded-1">
              <ListGroup.Item className="wd-lesson p-4 ps-1">
                <div className="placeholder-glow">
                  <Placeholder xs={5} className="me-2" />
                  <Placeholder xs={2} />
                </div>
              </ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>
        )}

        {modules.length === 0 && !creating && (
          <ListGroup.Item className="p-3 text-center text-muted">
            No modules available for this course.
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}
