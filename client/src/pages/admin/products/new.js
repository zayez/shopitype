import Head from 'next/head'
import ProductForm from '../../../comps/admin/product-form'
import { adminLayout } from '../../../comps/layout/layout'
import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'
import { CalloutError } from '../../../comps/callout/callout'
import { useState } from 'react'
import { useProductsStore } from '../../../stores/products-store'
import { useShallow } from 'zustand/shallow'

const ProductNew = () => {
  const { loading, error, errors } = useProductsStore(
    useShallow((state) => ({
      loading: state.loading,
      error: state.error,
      errors: state.errors,
    })),
  )
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [inventory, setInventory] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategory] = useState('')
  const [statusId, setStatus] = useState('')

  if (loading) {
    return <Loader type={SPINNER_TYPE} size="small" />
  }

  return (
    <>
      <Head>
        <title>Shopitype dashboard | New product </title>
      </Head>
      <div className="product-new">
        {error && <CalloutError error={error} errors={errors} />}
        <ProductForm
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
        />
      </div>
    </>
  )
}

ProductNew.getLayout = adminLayout

export default ProductNew
