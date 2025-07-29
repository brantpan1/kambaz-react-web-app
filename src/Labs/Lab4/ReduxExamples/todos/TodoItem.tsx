import { useDispatch } from 'react-redux'
import { deleteTodo, setTodo } from './todosReducer'
import { Button, ListGroup } from 'react-bootstrap'

export default function TodoItem({
  todo,
}: {
  todo: { id: string; title: string }
}) {
  const dispatch = useDispatch()
  return (
    <ListGroup.Item key={todo.id}>
      <Button
        onClick={() => dispatch(deleteTodo(todo.id))}
        id="wd-delete-todo-click"
        className="btn btn-danger me-2"
      >
        Delete
      </Button>
      <Button
        onClick={() => dispatch(setTodo(todo))}
        id="wd-set-todo-click"
        className="btn btn-info me-2"
      >
        Edit
      </Button>
      {todo.title}
    </ListGroup.Item>
  )
}
