import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { adminLayout } from '../../../comps/layout/layout'
import { Package as IProducts } from 'react-feather'
import {
  destroy,
  fetchProducts,
  selectProducts,
} from '../../../store/slices/productsSlice'

import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/LoaderType'
import ProductList from '../../../comps/admin/ProductList'
import Modal from '../../../comps/modal/modal'

const Products = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(null)
  const [selectedId, setSelectedId] = useState(0)
  const products = useSelector(selectProducts)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [])

  useEffect(() => {}, [products.message])

  const handleAddProduct = (e) => {
    router.push('/admin/products/new')
  }

  const handleDelete = async () => {
    dispatch(destroy(selectedId))
  }

  const handleModalEnter = (id) => {
    setSelectedId(id)
    setShowModal(true)
  }

  const handleModalExit = () => {
    setShowModal(false)
  }

  return (
    <>
      <Head>
        <title>Storefly dashboard | Products</title>
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
        {products.loading ? <Loader type={SPINNER_TYPE} /> : null}
        {!products.loading && products.error ? (
          <div>Error: {products.error}</div>
        ) : null}
        {!products.loading && products.products?.length ? (
          <ProductList
            products={products.products}
            onDelete={handleModalEnter}
          />
        ) : null}
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
