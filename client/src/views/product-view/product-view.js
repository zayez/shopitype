import { useEffect } from 'react'
import Product from '../../comps/product/product'
import { useProductsStore } from '../../stores/products-store'
import { useShallow } from 'zustand/shallow'

const ProductView = ({ id }) => {
  const { currentProduct, loading, error, fetchProduct } = useProductsStore(
    useShallow((state) => ({
      currentProduct: state.currentProduct,
      loading: state.loading,
      error: state.error,
      fetchProduct: state.fetchProduct,
    })),
  )

  useEffect(() => {
    if (!id) {
      return
    }

    fetchProduct(id)
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
