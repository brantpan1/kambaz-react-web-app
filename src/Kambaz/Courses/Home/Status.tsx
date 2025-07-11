import { Button } from 'react-bootstrap'
import { MdDoNotDisturbAlt } from 'react-icons/md'
import { FaCheckCircle } from 'react-icons/fa'
import { BiImport } from 'react-icons/bi'
import { LiaFileImportSolid } from 'react-icons/lia'
import { BsFillHouseDoorFill, BsGraphUp, BsBell } from 'react-icons/bs'

export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: 350 }}>
      <h2>Course Status</h2>

      <div className="d-flex">
        <div className="w-50 pe-1">
          <Button variant="secondary" size="lg" className="w-100">
            <MdDoNotDisturbAlt className="me-2" /> Unpublish
          </Button>
        </div>
        <div className="w-50">
          <Button variant="success" size="lg" className="w-100">
            <FaCheckCircle className="me-2" /> Publish
          </Button>
        </div>
      </div>

      <Button variant="secondary" size="lg" className="w-100 mt-2 text-start">
        <BiImport className="me-2" /> Import Existing Content
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-2 text-start">
        <LiaFileImportSolid className="me-2" /> Import from Commons
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-2 text-start">
        <BsFillHouseDoorFill className="me-2" /> Choose Home Page
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-2 text-start">
        <BsGraphUp className="me-2" /> View Course Analytics
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-2 text-start">
        <BsBell className="me-2" /> View Course Notifications
      </Button>
    </div>
  )
}
