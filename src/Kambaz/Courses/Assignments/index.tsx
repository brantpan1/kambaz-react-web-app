import { useParams } from 'react-router-dom'
import { Row, Col, Form, InputGroup, Button, ListGroup } from 'react-bootstrap'
import {
  BsGripVertical,
  BsThreeDotsVertical,
  BsThreeDots,
} from 'react-icons/bs'
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai'
import { FiFileText } from 'react-icons/fi'
import { FaRegCheckCircle } from 'react-icons/fa'

export default function Assignments() {
  const { cid } = useParams<string>()

  const data: Record<
    string,
    {
      header: string
      pct: string
      items: { id: string; title: string; meta: string }[]
    }
  > = {
    '1234': {
      header: 'ASSIGNMENTS',
      pct: '40% of Total',
      items: [
        {
          id: '123',
          title: 'A1 — ENV + HTML',
          meta: 'Multiple Modules | Not available until May 6 at 12:00 am | Due May 13 at 11:59 pm | 100 pts',
        },
        {
          id: '124',
          title: 'A2 — CSS + BOOTSTRAP',
          meta: 'Multiple Modules | Not available until May 13 at 12:00 am | Due May 20 at 11:59 pm | 100 pts',
        },
        {
          id: '125',
          title: 'A3 — JAVASCRIPT + REACT',
          meta: 'Multiple Modules | Not available until May 20 at 12:00 am | Due May 27 at 11:59 pm | 100 pts',
        },
      ],
    },
  }

  const { header, pct, items } = data[cid ?? '1234'] ?? data['1234']

  return (
    <div id="wd-assignments" className="d-flex flex-column">
      <Row className="mb-3">
        <Col lg={4} md={6}>
          <InputGroup size="sm">
            <InputGroup.Text id="wd-search-icon">
              <AiOutlineSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search Assignments"
              aria-describedby="wd-search-icon"
              id="wd-search-assignment"
            />
          </InputGroup>
        </Col>
        <Col className="d-flex justify-content-end gap-2">
          <Button
            variant="light"
            size="sm"
            className="d-flex align-items-center"
          >
            <AiOutlinePlus className="me-1" /> Group
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="d-flex align-items-center"
          >
            <AiOutlinePlus className="me-1" /> Assignment
          </Button>
        </Col>
      </Row>

      <ListGroup className="rounded-0">
        <ListGroup.Item className="p-0 mb-4">
          <div className="d-flex align-items-center bg-light px-3 py-2 border-bottom">
            <BsGripVertical className="me-2 text-muted" />
            <span className="fw-bold">{header}</span>
            <span className="ms-auto d-flex align-items-center">
              <Button
                variant="light"
                size="sm"
                className="py-0 px-2 me-2 border"
              >
                {pct}
              </Button>
              <BsThreeDotsVertical className="text-muted" />
            </span>
          </div>

          <ListGroup className="rounded-0 border-start border-4 border-success">
            {items.map(({ id, title, meta }) => (
              <ListGroup.Item
                key={id}
                className="py-3 ps-2 pe-0 border-0 border-bottom"
              >
                <Row className="g-0 align-items-start">
                  <Col xs="auto" className="d-flex align-items-center pe-2">
                    <BsGripVertical className="text-muted me-2" />
                    <FiFileText className="text-success" />
                  </Col>

                  <Col>
                    <a
                      href={`#/Kambaz/Courses/${cid}/Assignments/${id}`}
                      className="fw-bold text-danger text-decoration-none"
                    >
                      {title}
                    </a>
                    <div className="small text-muted">{meta}</div>
                  </Col>

                  <Col
                    xs="auto"
                    className="d-flex align-items-center justify-content-end pe-3"
                  >
                    <FaRegCheckCircle className="text-success me-3" />
                    <BsThreeDots className="text-muted" />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  )
}
