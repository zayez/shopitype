const baseUrl = `http://localhost:2222`
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addItem } from '../../store/slices/cartSlice'

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ProductItem = ({ product }) => {
  const dispatch = useDispatch()

  const handleAddItem = (e) => {
    dispatch(addItem(product))
  }

  return (
    <div className="product-item" key={product.id}>
      <div className="product-image">
        <Link href={`/products/${product.id}`}>
          <a aria-label={product.title}>
            <img src={`${baseUrl}/${product.image}`} />
          </a>
        </Link>
      </div>
      <div className="product-description">
        <Link href={`/products/${product.id}`}>
          <a aria-label={product.title}>{product.title} </a>
        </Link>
        <div className="price">{dollarUS.format(product.price)}</div>
        <button onClick={handleAddItem}>Add to cart</button>
      </div>
    </div>
  )
}
const Products = ({ products }) => {
  return (
    <div className="products-list">
      {products.map((product) => (
        <ProductItem product={product} key={product.id} />
      ))}
    </div>
  )
}

export default Products
