import Head from 'next/head'
import { Grid as ICategories } from 'react-feather'
import { adminLayout } from '../../../comps/layout/layout'
import CategoryList from '../../../comps/admin/category-list'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Modal from '../../../comps/modal/modal'
import { useCategoriesStore } from '../../../stores/categories-store'
import { useShallow } from 'zustand/shallow'

const Categories = () => {
  const router = useRouter()
  const { categories, loading, fetchCategories, destroyCategory } =
    useCategoriesStore(
      useShallow((state) => ({
        categories: state.categories,
        loading: state.loading,
        fetchCategories: state.fetchCategories,
        destroyCategory: state.destroyCategory,
      })),
    )

  const [showModal, setShowModal] = useState(null)
  const [selectedId, setSelectedId] = useState(0)

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = (e) => {
    e.preventDefault()
    router.push('/admin/categories/new')
  }

  const handleDelete = async () => {
    destroyCategory(selectedId)
  }

  const handleModalEnter = (id) => {
    setSelectedId(id)
    setShowModal(true)
  }

  const handleModalExit = () => {
    setShowModal(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Shopitype dashboard | Categories </title>
      </Head>
      <div className="container">
        <div className="heading-spaced">
          <div className="heading">
            <ICategories /> <h1>Categories</h1>
          </div>
          <button className="btn btn-primary" onClick={handleAddCategory}>
            Add category
          </button>
        </div>
        <hr />
        {categories.length && (
          <CategoryList categories={categories} onDelete={handleModalEnter} />
        )}
        <Modal
          title={`Delete category`}
          message={`This can't be undone.`}
          type="danger"
          actionName={`Delete`}
          onExit={handleModalExit}
          onConfirm={handleDelete}
          show={showModal}
        />
      </div>
    </>
  )
}

Categories.getLayout = adminLayout

export default Categories
