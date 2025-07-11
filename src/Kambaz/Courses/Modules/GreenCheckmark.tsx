import { FaCheckCircle, FaCircle } from 'react-icons/fa'

export default function GreenCheckmark() {
  return (
    <span className="me-1 position-relative">
      <FaCheckCircle
        className="text-success position-absolute"
        style={{ top: 2 }}
      />
      <FaCircle className="text-white fs-6" />
    </span>
  )
}
