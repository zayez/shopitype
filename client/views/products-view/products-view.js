import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductList from '../../comps/product/product-list'
import {
  fetchProducts,
  selectProduct,
  selectProducts,
} from '../../store/slices/productsSlice'
const ProductsView = ({}) => {
  const products = useSelector(selectProducts)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProducts())
  }, [])
  return (
    <>
      <h2>Products</h2>
      {products.loading && <div>Loading...</div>}
      {!products.loading && products.error ? (
        <div>Error: {products.error}</div>
      ) : null}
      {!products.loading && products.products.length ? (
        <ProductList products={products.products} />
      ) : null}
    </>
  )
}

export default ProductsView
