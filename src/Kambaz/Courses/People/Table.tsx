import { Table } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'

interface Person {
  first: string
  last: string
  id: string
  section: string
  role: string
  lastActivity: string
  total: string
}
const people: Person[] = [
  {
    first: 'Tony',
    last: 'Stark',
    id: '001234561S',
    section: 'S101',
    role: 'STUDENT',
    lastActivity: '2020-10-01',
    total: '10:21:32',
  },
  {
    first: 'Bruce',
    last: 'Wayne',
    id: '001234562S',
    section: 'S101',
    role: 'TA',
    lastActivity: '2020-10-03',
    total: '02:14:10',
  },
  {
    first: 'Steve',
    last: 'Rogers',
    id: '001234563S',
    section: 'S101',
    role: 'STUDENT',
    lastActivity: '2020-10-02',
    total: '08:05:11',
  },
  {
    first: 'Natasha',
    last: 'Romanoff',
    id: '001234564S',
    section: 'S101',
    role: 'STUDENT',
    lastActivity: '2020-10-04',
    total: '11:48:05',
  },
]

export default function PeopleTable() {
  return (
    <Table striped id="wd-people-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Login ID</th>
          <th>Section</th>
          <th>Role</th>
          <th>Last Activity</th>
          <th>Total Activity</th>
        </tr>
      </thead>
      <tbody>
        {people.map((p) => (
          <tr key={p.id}>
            <td className="text-nowrap">
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              {p.first} {p.last}
            </td>
            <td>{p.id}</td>
            <td>{p.section}</td>
            <td>{p.role}</td>
            <td>{p.lastActivity}</td>
            <td>{p.total}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
