import { useRouter } from 'next/router'
import { XCircle as IDelete } from 'react-feather'

const ProductItem = ({ product, id, onDelete }) => {
  const router = useRouter()
  const handleClick = (e) => {
    router.push(`/admin/products/${id}`)
  }
  return (
    <tr>
      <td onClick={handleClick}>{product.id}</td>
      <td>
        {product.image ? (
          <div className="image-wrapper">
            <img src={`http://localhost:2222/${product.image}`} />{' '}
          </div>
        ) : null}
      </td>
      <td onClick={handleClick}>{product.title}</td>
      <td>{product.inventory}</td>
      <td className="delete-wrapper" onClick={() => onDelete(id)}>
        <div className="col-delete">
          <button className="btn-svg">
            <IDelete />
          </button>
        </div>
      </td>
    </tr>
  )
}

const ProductList = ({ products, onDelete }) => {
  return (
    <div className="product-list">
      <table className="table-basic">
        <thead>
          <tr>
            <th>#</th>
            <th className="table-image">Image</th>
            <th>Title</th>
            <th className="col-center">Inventory</th>
            <th className="delete-item">Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductItem
              product={product}
              key={product.id}
              id={product.id}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductList
