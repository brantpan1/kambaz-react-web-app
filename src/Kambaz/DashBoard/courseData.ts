export interface Course {
  id: string
  name: string
  title: string
  description: string
  image: string
}

export const courses: Course[] = [
  {
    id: '1234',
    name: 'CS1234 React JS',
    title: 'React JS',
    description: 'Full Stack software developer',
    image: '/images/reactjs.jpg',
  },
  {
    id: '5610',
    name: 'CS5610 Web Development',
    title: 'Web Development',
    description: 'Full Stack software development',
    image: '/images/webdev.jpg',
  },
  {
    id: '5200',
    name: 'CS5200 Database Management',
    title: 'Database Management',
    description: 'Relational and NoSQL databases',
    image: '/images/database.jpg',
  },
  {
    id: '5500',
    name: 'CS5500 Algorithms',
    title: 'Algorithms',
    description: 'Algorithm design and analysis',
    image: '/images/algorithms.jpg',
  },
  {
    id: '5800',
    name: 'CS5800 Data Structures',
    title: 'Data Structures',
    description: 'Advanced data structures',
    image: '/images/datastructures.jpg',
  },
  {
    id: '5340',
    name: 'CS5340 Human Computer Interaction',
    title: 'Human Computer Interaction',
    description: 'User interface design',
    image: '/images/hci.jpg',
  },
  {
    id: '5100',
    name: 'CS5100 Artificial Intelligence',
    title: 'Artificial Intelligence',
    description: 'Introduction to AI concepts',
    image: '/images/ai.jpg',
  },
]
