import { useRouter } from 'next/router'

const CustomerForm = ({ id, firstName, lastName, email }) => {
  const router = useRouter()
  const handleBackClick = (e) => {
    e.preventDefault()
    router.push(`/admin/customers`)
  }
  const handleSubmit = () => {}

  return (
    <>
      <form className="form">
        <div className="row">
          <div className="field">
            <div className="field-label">
              <label htmlFor="id">ID</label>
            </div>
            <div className="field-control">
              <input
                type="text"
                defaultValue={id ? id : ''}
                disabled={true}
                readOnly={true}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <div className="field-label">
              <label htmlFor="firstName">First name</label>
            </div>
            <div className="field-control">
              <input
                type="text"
                defaultValue={firstName}
                disabled={true}
                readOnly={true}
              />
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <label htmlFor="lastName">Last name</label>
            </div>
            <div className="field-control">
              <input
                type="text"
                defaultValue={lastName}
                disabled={true}
                readOnly={true}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="field">
            <div className="field-label">
              <label htmlFor="email">E-mail</label>
            </div>
            <div className="field-control">
              <input
                type="text"
                defaultValue={email}
                disabled={true}
                readOnly={true}
              />
            </div>
          </div>
        </div>
        <div className="buttons">
          <button type="button" className="btn" onClick={handleBackClick}>
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            type="submit"
            disabled={true}
          >
            Save
          </button>
        </div>
      </form>
      <h3>Orders</h3>
    </>
  )
}

export default CustomerForm
