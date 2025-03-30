import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProduct,
  selectCurrentProduct,
  selectProducts,
} from '../../store/slices/productsSlice'
import Product from '../../comps/product/product'

const ProductView = ({ id }) => {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const currentProduct = useSelector(selectCurrentProduct)
  useEffect(() => {
    if (id) dispatch(fetchProduct(id))
  }, [id])

  return (
    <>
      <h2>Product</h2>
      {products.loading && <div>Loading...</div>}
      {!products.loading && products.error ? (
        <div>Error: {products.error}</div>
      ) : null}
      {!products.loading && currentProduct ? (
        <Product product={currentProduct} />
      ) : null}
    </>
  )
}

export default ProductView
