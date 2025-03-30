import { useState } from 'react'
import { X as IClose } from 'react-feather'

const getType = (type) => {
  switch (type) {
    case 'danger':
      return 'btn-danger'
    default:
      return 'btn-primary'
  }
}

const Modal = ({
  title,
  message,
  type,
  show,
  actionName,
  onConfirm,
  onExit,
}) => {
  const modalVisibility = show === null ? '' : show ? 'show' : 'hide'
  const [confirmLabel, setConfirmLabel] = useState(actionName)
  const btnStyle = getType(type)
  const handleClose = (e) => {
    e.preventDefault()
    onExit()
  }

  const handleOverlayClick = (e) => {
    e.preventDefault()
    if (e.target.id !== 'modal') return

    onExit()
  }

  const handleConfirm = async () => {
    setConfirmLabel('Loading...')
    await onConfirm()
    setConfirmLabel('Delete')
    onExit()
  }
  return (
    <div
      id="modal"
      className={`modal ${modalVisibility}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="btn-close" onClick={handleClose}>
              <IClose />
            </button>
          </div>
          <div className="modal-body">
            <p className="modal-message">{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button className={`btn ${btnStyle}`} onClick={handleConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
