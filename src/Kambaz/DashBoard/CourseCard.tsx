import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

interface CourseCardProps {
  courseId: string
  courseName: string
  courseTitle: string
  courseDescription: string
  courseImage: string
}

export default function CourseCard({
  courseId,
  courseName,
  courseTitle,
  courseDescription,
  courseImage,
}: CourseCardProps) {
  return (
    <div className="col p-2" style={{ width: '700px' }}>
      <Link
        to={`/Kambaz/Courses/${courseId}/Home`}
        className="text-decoration-none text-dark"
        style={{ display: 'block' }}
      >
        <Card
          className="h-100 rounded-0 border wd-dashboard-course-card"
          style={{ cursor: 'pointer' }}
        >
          <Card.Img
            variant="top"
            src={courseImage}
            alt={courseTitle}
            style={{ height: '160px', objectFit: 'cover' }}
            className="rounded-0"
          />

          <Card.Body>
            <Card.Title className="wd-dashboard-course-title">
              {courseName}
            </Card.Title>
            <Card.Text className="wd-dashboard-course-description text-muted small">
              {courseDescription}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </div>
  )
}
