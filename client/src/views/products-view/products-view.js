import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import ProductList from '../../comps/product/product-list'
import { useProductsStore } from '../../stores/products-store'

const ProductsView = () => {
  const { products, loading, error, fetchProducts } = useProductsStore(
    useShallow((state) => ({
      products: state.products,
      fetchProducts: state.fetchProducts,
      loading: state.loading,
      error: state.error,
    })),
  )

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <h2>Products</h2>
      {!!products.length && <ProductList products={products} />}
    </>
  )
}

export default ProductsView
