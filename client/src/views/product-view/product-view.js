import { useEffect } from 'react'
import Product from '../../comps/product/product'
import { useProductsStore } from '../../stores/products-store'
import { useShallow } from 'zustand/shallow'

const ProductView = ({ id }) => {
  const { currentProduct, loading, error } = useProductsStore(
    useShallow((state) => ({
      currentProduct: state.currentProduct,
      loading: state.loading,
      error: state.error,
    })),
  )

  useEffect(() => {
    if (!id) {
      return
    }

    dispatch(fetchProduct(id))
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>Product</h2>
      {error && <div>Error: {products.error}</div>}
      {currentProduct && <Product product={currentProduct} />}
    </>
  )
}

export default ProductView
