import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/reactjs.jpg" width={200} />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/5610/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/webdev.jpg" width={200} />
            <div>
              <h5>CS5610 Web Development</h5>
              <p className="wd-dashboard-course-title">
                Full Stack software development</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/5200/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/database.jpg" width={200} />
            <div>
              <h5>CS5200 Database Management</h5>
              <p className="wd-dashboard-course-title">
                Relational and NoSQL databases</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/5500/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/algorithms.jpg" width={200} />
            <div>
              <h5>CS5500 Algorithms</h5>
              <p className="wd-dashboard-course-title">
                Algorithm design and analysis</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/5800/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/datastructures.jpg" width={200} />
            <div>
              <h5>CS5800 Data Structures</h5>
              <p className="wd-dashboard-course-title">
                Advanced data structures</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/5340/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/hci.jpg" width={200} />
            <div>
              <h5>CS5340 Human Computer Interaction</h5>
              <p className="wd-dashboard-course-title">
                User interface design</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/5100/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/ai.jpg" width={200} />
            <div>
              <h5>CS5100 Artificial Intelligence</h5>
              <p className="wd-dashboard-course-title">
                Introduction to AI concepts</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
