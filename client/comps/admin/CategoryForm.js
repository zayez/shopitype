import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  create,
  resetCategory,
  selectCategories,
  update,
} from '../../store/slices/categories-slice'

const CategoryForm = ({ id, category }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const categories = useSelector(selectCategories)
  const submitText = id ? 'Save' : 'Create'

  useEffect(() => {
    if (category) {
      if (!categories.error) {
        setTitle(category.title)
      }
    } else {
      dispatch(resetCategory())
    }
  }, [])

  useEffect(() => {}, [categories.category])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (id) {
      dispatch(update({ id, title })).then((res) => {
        if (!res.error) {
          router.push('/admin/categories')
          toast.success('Category successfully updated!')
        }
      })
    } else {
      dispatch(create({ title })).then((res) => {
        if (!res.error) {
          router.push('/admin/categories')
          toast.success('Category successfully created!')
        }
      })
    }
  }

  const handleBackClick = (e) => {
    e.preventDefault()
    router.push('/admin/categories')
  }

  return (
    <>
      <div className="container category">
        <div className="category-card-details">
          <form onSubmit={handleSubmit} className="form">
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
            <div className="field">
              <div className="field-label">
                <label htmlFor="title">Title</label>
              </div>
              <div className="field-body">
                <input
                  type="text"
                  value={title}
                  onChange={({ target }) => setTitle(target?.value)}
                />
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
              >
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CategoryForm
