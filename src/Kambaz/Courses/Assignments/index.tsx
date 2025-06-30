import { useParams } from 'react-router-dom'

export default function Assignments() {
  const { cid } = useParams()

  const renderAssignments = () => {
    switch (cid) {
      case '1234': // React
        return (
          <>
            <h3 id="wd-assignments-title">
              ASSIGNMENTS 40% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/123`}
                  className="wd-assignment-link"
                >
                  A1 - ENV + HTML
                </a>
                <br />
                Multiple Modules | <b>Not available until</b> May 6 at 12:00am |
                <br />
                <b>Due</b> May 13 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/124`}
                  className="wd-assignment-link"
                >
                  A2 - CSS + BOOTSTRAP
                </a>
                <br />
                Multiple Modules | <b>Not available until</b> May 13 at 12:00am
                |
                <br />
                <b>Due</b> May 20 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/125`}
                  className="wd-assignment-link"
                >
                  A3 - JAVASCRIPT + REACT
                </a>
                <br />
                Multiple Modules | <b>Not available until</b> May 20 at 12:00am
                |
                <br />
                <b>Due</b> May 27 at 11:59pm | 100 pts
              </li>
            </ul>
          </>
        )

      case '5610': // Webdev
        return (
          <>
            <h3 id="wd-assignments-title">
              ASSIGNMENTS 45% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/201`}
                  className="wd-assignment-link"
                >
                  A1 - Setting Up Development Environment
                </a>
                <br />
                Individual | <b>Due</b> Sep 10 at 11:59pm | 50 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/202`}
                  className="wd-assignment-link"
                >
                  A2 - HTML & CSS Fundamentals
                </a>
                <br />
                Individual | <b>Due</b> Sep 17 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/203`}
                  className="wd-assignment-link"
                >
                  A3 - Responsive Web Design
                </a>
                <br />
                Individual | <b>Due</b> Sep 24 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/204`}
                  className="wd-assignment-link"
                >
                  A4 - JavaScript & DOM Manipulation
                </a>
                <br />
                Individual | <b>Due</b> Oct 1 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/205`}
                  className="wd-assignment-link"
                >
                  A5 - MERN Stack Application
                </a>
                <br />
                Individual | <b>Due</b> Oct 15 at 11:59pm | 150 pts
              </li>
            </ul>
          </>
        )

      case '5200': // Database Management
        return (
          <>
            <h3 id="wd-assignments-title">
              ASSIGNMENTS 35% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/301`}
                  className="wd-assignment-link"
                >
                  A1 - Entity Relationship Diagrams
                </a>
                <br />
                Individual | <b>Due</b> Sep 12 at 11:59pm | 75 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/302`}
                  className="wd-assignment-link"
                >
                  A2 - Normalization Exercise
                </a>
                <br />
                Individual | <b>Due</b> Sep 19 at 11:59pm | 75 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/303`}
                  className="wd-assignment-link"
                >
                  A3 - SQL Queries and Joins
                </a>
                <br />
                Individual | <b>Due</b> Sep 26 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/304`}
                  className="wd-assignment-link"
                >
                  A4 - Stored Procedures & Triggers
                </a>
                <br />
                Individual | <b>Due</b> Oct 3 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/305`}
                  className="wd-assignment-link"
                >
                  A5 - NoSQL with MongoDB
                </a>
                <br />
                Individual | <b>Due</b> Oct 10 at 11:59pm | 100 pts
              </li>
            </ul>
          </>
        )

      case '5500': // Algo
        return (
          <>
            <h3 id="wd-assignments-title">
              PROBLEM SETS 50% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/401`}
                  className="wd-assignment-link"
                >
                  PS1 - Asymptotic Analysis & Recursion
                </a>
                <br />
                Individual | <b>Due</b> Sep 11 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/402`}
                  className="wd-assignment-link"
                >
                  PS2 - Divide and Conquer Algorithms
                </a>
                <br />
                Individual | <b>Due</b> Sep 18 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/403`}
                  className="wd-assignment-link"
                >
                  PS3 - Dynamic Programming
                </a>
                <br />
                Individual | <b>Due</b> Sep 25 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/404`}
                  className="wd-assignment-link"
                >
                  PS4 - Graph Algorithms
                </a>
                <br />
                Individual | <b>Due</b> Oct 2 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/405`}
                  className="wd-assignment-link"
                >
                  PS5 - NP-Completeness
                </a>
                <br />
                Individual | <b>Due</b> Oct 9 at 11:59pm | 100 pts
              </li>
            </ul>
          </>
        )

      case '5800': // DS
        return (
          <>
            <h3 id="wd-assignments-title">
              PROGRAMMING ASSIGNMENTS 40% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/501`}
                  className="wd-assignment-link"
                >
                  PA1 - Linked Lists Implementation
                </a>
                <br />
                Individual | <b>Due</b> Sep 13 at 11:59pm | 80 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/502`}
                  className="wd-assignment-link"
                >
                  PA2 - Binary Search Trees
                </a>
                <br />
                Individual | <b>Due</b> Sep 20 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/503`}
                  className="wd-assignment-link"
                >
                  PA3 - Hash Tables & Collision Resolution
                </a>
                <br />
                Individual | <b>Due</b> Sep 27 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/504`}
                  className="wd-assignment-link"
                >
                  PA4 - Heaps & Priority Queues
                </a>
                <br />
                Individual | <b>Due</b> Oct 4 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/505`}
                  className="wd-assignment-link"
                >
                  PA5 - Graph Implementations
                </a>
                <br />
                Individual | <b>Due</b> Oct 11 at 11:59pm | 120 pts
              </li>
            </ul>
          </>
        )

      case '5340': // HCI
        return (
          <>
            <h3 id="wd-assignments-title">
              DESIGN PROJECTS 45% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/601`}
                  className="wd-assignment-link"
                >
                  DP1 - User Research & Personas
                </a>
                <br />
                Team Project | <b>Due</b> Sep 14 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/602`}
                  className="wd-assignment-link"
                >
                  DP2 - Low-Fidelity Prototypes
                </a>
                <br />
                Team Project | <b>Due</b> Sep 21 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/603`}
                  className="wd-assignment-link"
                >
                  DP3 - Heuristic Evaluation
                </a>
                <br />
                Individual | <b>Due</b> Sep 28 at 11:59pm | 75 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/604`}
                  className="wd-assignment-link"
                >
                  DP4 - High-Fidelity Interactive Prototype
                </a>
                <br />
                Team Project | <b>Due</b> Oct 5 at 11:59pm | 150 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/605`}
                  className="wd-assignment-link"
                >
                  DP5 - Usability Testing & Report
                </a>
                <br />
                Team Project | <b>Due</b> Oct 12 at 11:59pm | 125 pts
              </li>
            </ul>
          </>
        )

      case '5100': // AI
        return (
          <>
            <h3 id="wd-assignments-title">
              ASSIGNMENTS 35% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/701`}
                  className="wd-assignment-link"
                >
                  A1 - Search Algorithms (BFS, DFS, A*)
                </a>
                <br />
                Individual | <b>Due</b> Sep 15 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/702`}
                  className="wd-assignment-link"
                >
                  A2 - Constraint Satisfaction Problems
                </a>
                <br />
                Individual | <b>Due</b> Sep 22 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/703`}
                  className="wd-assignment-link"
                >
                  A3 - Machine Learning: Decision Trees
                </a>
                <br />
                Individual | <b>Due</b> Sep 29 at 11:59pm | 100 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/704`}
                  className="wd-assignment-link"
                >
                  A4 - Neural Networks Implementation
                </a>
                <br />
                Individual | <b>Due</b> Oct 6 at 11:59pm | 125 pts
              </li>
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/705`}
                  className="wd-assignment-link"
                >
                  A5 - Reinforcement Learning Project
                </a>
                <br />
                Individual/Team | <b>Due</b> Oct 13 at 11:59pm | 150 pts
              </li>
            </ul>
          </>
        )

      default:
        return (
          <>
            <h3 id="wd-assignments-title">
              ASSIGNMENTS 40% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
              <li className="wd-assignment-list-item">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/123`}
                  className="wd-assignment-link"
                >
                  A1 - Assignment 1
                </a>
                <br />
                Multiple Modules | <b>Due</b> TBD | 100 pts
              </li>
            </ul>
          </>
        )
    }
  }

  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments" id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>

      {renderAssignments()}
    </div>
  )
}
