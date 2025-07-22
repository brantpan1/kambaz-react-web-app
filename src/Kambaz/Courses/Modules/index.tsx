import { ListGroup } from 'react-bootstrap'
import { BsGripVertical } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import ModulesControls from './ModulesControls'
import ModuleControlButtons from './ModuleControlButtons'
import LessonControlButtons from './LessonControlButtons'
import { modules } from '../../Database'

export default function Modules() {
  const { cid } = useParams()

  const courseModules = modules.filter((module) => module.course === cid)

  return (
    <div id="wd-modules" className="d-flex flex-column">
      <div className="mb-3">
        <ModulesControls />
      </div>
      <ListGroup className="rounded-0">
        {courseModules.map((module) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" /> {module.name}
              <ModuleControlButtons />
            </div>

            {module.lessons && module.lessons.length > 0 && (
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
            )}

            {(!module.lessons || module.lessons.length === 0) && (
              <ListGroup className="wd-lessons rounded-0">
                <ListGroup.Item className="wd-lesson p-3 ps-1">
                  <BsGripVertical className="me-2 fs-3" /> {module.description}
                  <LessonControlButtons />
                </ListGroup.Item>
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}

        {courseModules.length === 0 && (
          <ListGroup.Item className="p-3 text-center text-muted">
            No modules available for this course.
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}
