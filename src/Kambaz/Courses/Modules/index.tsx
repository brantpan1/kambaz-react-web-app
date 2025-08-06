import { useState, useEffect } from 'react'
import { ListGroup, FormControl, Spinner, Placeholder } from 'react-bootstrap'
import { BsGripVertical } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ModulesControls from './ModulesControls'
import ModuleControlButtons from './ModuleControlButtons'
import LessonControlButtons from './LessonControlButtons'
import { setModules, setModuleEditing, updateModuleLocal } from './reducer'
import * as client from './client'

export default function Modules() {
  const { cid } = useParams()
  const [moduleName, setModuleName] = useState('')
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const { modules } = useSelector((state: any) => state.modulesReducer)
  const dispatch = useDispatch()

  const fetchModules = async () => {
    if (!cid) return
    setLoading(true)
    try {
      const fetchedModules = await client.findModulesForCourse(cid)
      dispatch(setModules(fetchedModules))
    } catch (error) {
      console.error('Error fetching modules:', error)
      dispatch(setModules([]))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [cid])

  const handleAddModule = async () => {
    if (!cid || !moduleName.trim()) return
    try {
      setAdding(true)
      const newModule = await client.createModule(cid, { name: moduleName })
      dispatch(setModules([...modules, newModule]))
      setModuleName('')
    } catch (error) {
      console.error('Error adding module:', error)
    } finally {
      setAdding(false)
    }
  }

  const handleUpdateModule = async (module: any) => {
    try {
      const updatedModule = await client.updateModule(module)
      dispatch(updateModuleLocal({ ...updatedModule, editing: false }))
    } catch (error) {
      console.error('Error updating module:', error)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await client.deleteModule(moduleId)
      dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)))
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const handleEditModule = (moduleId: string) => {
    dispatch(setModuleEditing(moduleId))
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Loading modules...</h4>
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
        {modules.map((module: any) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(
                      updateModuleLocal({ ...module, name: e.target.value }),
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateModule({ ...module, editing: false })
                    }
                  }}
                  onBlur={() =>
                    handleUpdateModule({ ...module, editing: false })
                  }
                  defaultValue={module.name}
                  autoFocus
                />
              )}
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={handleDeleteModule}
                editModule={handleEditModule}
              />
            </div>

            {module.lessons && module.lessons.length > 0 ? (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
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

        {adding && (
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

        {modules.length === 0 && !adding && (
          <ListGroup.Item className="p-3 text-center text-muted">
            No modules available for this course.
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}
