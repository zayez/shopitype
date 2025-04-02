import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useCategoriesStore } from '../../stores/categories-store'
import { useShallow } from 'zustand/shallow'

const CategoryForm = ({ id, category }) => {
  const router = useRouter()
  const {
    category: internalCategory,
    error,
    updateCategory,
    createCategory,
    resetCategory,
  } = useCategoriesStore(
    useShallow((state) => ({
      category: state.category,
      loading: state.loading,
      error: state.error,
      updateCategory: state.updateCategory,
      createCategory: state.createCategory,
      resetCategory: state.resetCategory,
    })),
  )

  const [title, setTitle] = useState('')
  const submitText = id ? 'Save' : 'Create'

  useEffect(() => {
    if (category) {
      if (!error) {
        setTitle(category.title)
      }
    } else {
      resetCategory()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (id) {
      updateCategory({ id, title }).then((res) => {
        if (!res.error) {
          router.push('/admin/categories')
          toast.success('Category successfully updated!')
        }
      })
      return
    }
    createCategory({ title }).then((res) => {
      console.log('res: ', res)
      if (!res.error) {
        router.push('/admin/categories')
        toast.success('Category successfully created!')
      }
    })
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
