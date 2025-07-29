import { useState } from 'react'
import { ListGroup, FormControl } from 'react-bootstrap'
import { BsGripVertical } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ModulesControls from './ModulesControls'
import ModuleControlButtons from './ModuleControlButtons'
import LessonControlButtons from './LessonControlButtons'
import { addModule, editModule, updateModule, deleteModule } from './reducer'

export default function Modules() {
  const { cid } = useParams()
  const [moduleName, setModuleName] = useState('')
  const { modules } = useSelector((state: any) => state.modulesReducer)
  const dispatch = useDispatch()

  return (
    <div id="wd-modules" className="d-flex flex-column">
      <div className="mb-3">
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={() => {
            dispatch(addModule({ name: moduleName, course: cid }))
            setModuleName('')
          }}
        />
      </div>
      <ListGroup className="rounded-0">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
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
                        updateModule({ ...module, name: e.target.value }),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        dispatch(updateModule({ ...module, editing: false }))
                      }
                    }}
                    defaultValue={module.name}
                  />
                )}
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => {
                    dispatch(deleteModule(moduleId))
                  }}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />
              </div>
              {module.lessons && module.lessons.length > 0 && (
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
              )}
              {(!module.lessons || module.lessons.length === 0) && (
                <ListGroup className="wd-lessons rounded-0">
                  <ListGroup.Item className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />{' '}
                    {module.description}
                    <LessonControlButtons />
                  </ListGroup.Item>
                </ListGroup>
              )}
            </ListGroup.Item>
          ))}
        {modules.filter((module: any) => module.course === cid).length ===
          0 && (
          <ListGroup.Item className="p-3 text-center text-muted">
            No modules available for this course.
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}
