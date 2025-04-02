import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductForm from '../../../comps/admin/product-form'
import { CalloutError } from '../../../comps/callout/callout'
import { adminLayout } from '../../../comps/layout/layout'
import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'
import { useProductsStore } from '../../../stores/products-store'
import { useShallow } from 'zustand/shallow'

const ProductEdit = () => {
  const router = useRouter()

  const { currentProduct, loading, error, errors, fetchProduct } =
    useProductsStore(
      useShallow((state) => ({
        currentProduct: state.currentProduct,
        loading: state.loading,
        error: state.error,
        errors: state.errors,
        fetchProduct: state.fetchProduct,
      })),
    )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [inventory, setInventory] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategory] = useState('')
  const [statusId, setStatus] = useState('')
  const [image, setImage] = useState('')
  const { id } = router.query
  const product = currentProduct

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [])

  useEffect(() => {
    if (currentProduct) {
      setTitle(product.title)
      setDescription(product.description)
      setInventory(product.inventory)
      setPrice(product.price)
      setCategory(product.categoryId)
      setStatus(product.statusId)
      setImage(product.image)
    }
  }, [currentProduct])

  if (loading) {
    return <Loader type={SPINNER_TYPE} size="small" />
  }

  return (
    <>
      <Head>
        <title>Shopitype dashboard | Product edit </title>
      </Head>
      <div className="product-edit">
        {error && <CalloutError error={error} errors={errors} />}
        {currentProduct && (
          <ProductForm
            id={id}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            inventory={inventory}
            setInventory={setInventory}
            price={price}
            setPrice={setPrice}
            categoryId={categoryId}
            setCategory={setCategory}
            statusId={statusId}
            setStatus={setStatus}
            image={image}
            setImage={setImage}
          />
        )}
      </div>
    </>
  )
}

ProductEdit.getLayout = adminLayout

export default ProductEdit
