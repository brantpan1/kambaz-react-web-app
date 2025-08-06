import { useState } from 'react'
import { Form } from 'react-bootstrap'

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: 'NodeJS Assignment',
    description: 'Create a NodeJS server with ExpressJS',
    due: '2021-10-10',
    completed: false,
    score: 0,
  })

  const [module, setModule] = useState({
    id: 'M101',
    name: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    course: 'CS5610',
  })

  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      <h4>Assignment</h4>
      <h5>Retrieving Objects</h5>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />

      <h5>Retrieving Properties</h5>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>
      <hr />

      <h5>Modifying Properties</h5>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title
      </a>
      <Form.Control
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <br />

      <a
        id="wd-update-assignment-score"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
      >
        Update Score
      </a>
      <Form.Control
        className="w-75"
        id="wd-assignment-score"
        type="number"
        defaultValue={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: parseInt(e.target.value) })
        }
      />
      <br />

      <a
        id="wd-update-assignment-completed"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
      >
        Update Completed
      </a>
      <Form.Check
        type="checkbox"
        id="wd-assignment-completed"
        label="Completed"
        defaultChecked={assignment.completed}
        onChange={(e) =>
          setAssignment({ ...assignment, completed: e.target.checked })
        }
      />
      <hr />

      <h4>Module</h4>
      <h5>Retrieving Module</h5>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary me-2"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>
      <a
        id="wd-retrieve-module-name"
        className="btn btn-primary"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>
      <hr />

      <h5>Modifying Module Properties</h5>
      <a
        id="wd-update-module-name"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/name/${module.name}`}
      >
        Update Name
      </a>
      <Form.Control
        className="w-75"
        id="wd-module-name"
        defaultValue={module.name}
        onChange={(e) => setModule({ ...module, name: e.target.value })}
      />
      <br />

      <a
        id="wd-update-module-description"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/description/${module.description}`}
      >
        Update Description
      </a>
      <Form.Control
        as="textarea"
        rows={3}
        className="w-75"
        id="wd-module-description"
        defaultValue={module.description}
        onChange={(e) => setModule({ ...module, description: e.target.value })}
      />
      <hr />
    </div>
  )
}
