import { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import GreenCheckmark from './GreenCheckmark'
import ModuleEditor from './ModuleEditor'

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
}: {
  moduleName: string
  setModuleName: (title: string) => void
  addModule: () => void
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div id="wd-modules-controls" className="text-nowrap mb-3">
      {currentUser?.role === 'FACULTY' && (
        <Button
          variant="danger"
          size="lg"
          className="me-1 float-start"
          id="wd-add-module-btn"
          onClick={handleShow}
        >
          <FaPlus
            className="me-2"
            style={{ position: 'relative', bottom: 1 }}
          />
          Module
        </Button>
      )}
      <Dropdown className="float-start me-2">
        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item id="wd-publish-all">
            <GreenCheckmark /> Publish All
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </Dropdown.Item>
          {currentUser?.role === 'FACULTY' && (
            <>
              <Dropdown.Item id="wd-unpublish-all-modules-and-items">
                Unpublish all modules and items
              </Dropdown.Item>
              <Dropdown.Item id="wd-unpublish-modules-only">
                Unpublish modules only
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
      <Button
        variant="secondary"
        size="lg"
        className="float-start me-2"
        id="wd-view-progress"
      >
        View Progress
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="float-start me-2"
        id="wd-collapse-all"
      >
        Collapse All
      </Button>

      {currentUser?.role === 'FACULTY' && (
        <ModuleEditor
          show={show}
          handleClose={handleClose}
          dialogTitle="Add Module"
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={addModule}
        />
      )}
    </div>
  )
}
