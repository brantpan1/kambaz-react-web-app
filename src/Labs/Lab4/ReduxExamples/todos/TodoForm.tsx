import { useSelector, useDispatch } from 'react-redux'
import { addTodo, updateTodo, setTodo } from './todosReducer'
import { Button, FormControl, ListGroup } from 'react-bootstrap'

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer)
  const dispatch = useDispatch()
  return (
    <ListGroup.Item>
      <Button
        onClick={() => dispatch(addTodo(todo))}
        id="wd-add-todo-click"
        className="btn btn-success me-2"
      >
        Add
      </Button>
      <Button
        onClick={() => dispatch(updateTodo(todo))}
        id="wd-update-todo-click"
        className="btn btn-warning me-2"
      >
        Update
      </Button>
      <FormControl
        defaultValue={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        className="d-inline-block w-50"
      />
    </ListGroup.Item>
  )
}
