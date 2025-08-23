import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { adminLayout } from '../../../comps/layout/admin-layout/admin-layout'
import { Package as IProducts } from 'react-feather'

import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'
import ProductList from '../../../comps/admin/product-list'
import Modal from '../../../comps/modal/modal'
import { useProductsStore } from '../../../stores/products-store'
import { useShallow } from 'zustand/shallow'

const Products = () => {
  const router = useRouter()
  const { products, loading, error, fetchProducts, destroyProduct } =
    useProductsStore(
      useShallow((state) => ({
        products: state.products,
        loading: state.loading,
        error: state.error,
        fetchProducts: state.fetchProducts,
        destroyProduct: state.destroyProduct,
      })),
    )

  const [showModal, setShowModal] = useState(null)
  const [selectedId, setSelectedId] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = (e) => {
    router.push('/admin/products/new')
  }

  const handleDelete = async () => {
    destroyProduct(selectedId)
  }

  const handleModalEnter = (id) => {
    setSelectedId(id)
    setShowModal(true)
  }

  const handleModalExit = () => {
    setShowModal(false)
  }

  if (loading) {
    return <Loader type={SPINNER_TYPE} />
  }

  return (
    <>
      <Head>
        <title>Shopitype dashboard | Products</title>
      </Head>
      <div className="container">
        <div className="heading-spaced">
          <div className="heading">
            <IProducts />
            <h1>Products</h1>
          </div>
          <button className="btn btn-primary" onClick={handleAddProduct}>
            Add product
          </button>
        </div>
        <hr />

        {error && <div>Error: {error}</div>}
        {!!products?.length && (
          <ProductList products={products} onDelete={handleModalEnter} />
        )}
        <Modal
          title={`Delete product`}
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

Products.getLayout = adminLayout

export default Products
