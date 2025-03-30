const baseUrl = `http://localhost:2222`
let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const Product = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card-image">
        <p>
          <img src={`${baseUrl}/${product.image}`} />
        </p>
      </div>

      <div className="product-card-details">
        <h1 aria-label={product.title}>{product.title}</h1>
        <h2>{dollarUS.format(product.price)}</h2>
        <p>{product.description}</p>
        <button>Add to cart</button>
      </div>
    </div>
  )
}

export default Product
