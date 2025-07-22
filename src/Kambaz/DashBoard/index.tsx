import CourseCard from './CourseCard'
import { courses } from '../Database'
import './DashBoard.css'

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="row row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-0"
      >
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            courseId={course.id}
            courseName={course.name}
            courseTitle={course.title}
            courseDescription={course.description}
            courseImage={course.image}
          />
        ))}
      </div>
    </div>
  )
}
