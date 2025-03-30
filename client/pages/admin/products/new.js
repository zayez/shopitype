import Head from 'next/head'
import { useSelector } from 'react-redux'
import ProductForm from '../../../comps/admin/ProductForm'
import { adminLayout } from '../../../comps/layout/layout'
import Loader from '../../../comps/loader'
import { selectProducts } from '../../../store/slices/productsSlice'
import { SPINNER_TYPE } from '../../../types/loader-type'
import { CalloutError } from '../../../comps/callout/callout'
import { useState } from 'react'

const ProductNew = ({}) => {
  const products = useSelector(selectProducts)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [inventory, setInventory] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategory] = useState('')
  const [statusId, setStatus] = useState('')

  return (
    <>
      <Head>
        <title>Storefly dashboard | Product new </title>
      </Head>
      <div className="product-new">
        {products.loading && <Loader type={SPINNER_TYPE} size="small" />}
        {!products.loading && products.error ? (
          <CalloutError error={products.error} errors={products.errors} />
        ) : null}
        {!products.loading ? (
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
        ) : null}
      </div>
    </>
  )
}

ProductNew.getLayout = adminLayout

export default ProductNew
