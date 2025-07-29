import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom'

export default function TOC() {
  return (
    <Nav variant="pills">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/Labs" end>
          Labs
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/Labs/Lab1" end>
          Lab1
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/Labs/Lab2">
          Lab2
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/Labs/Lab3">
          Lab3
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/Labs/Lab4">
          Lab4
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/Kambaz">
          Kambaz
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link
          id="wd-github"
          href="https://github.com/brantpan1/kambaz-react-web-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          My GitHub :3
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}
