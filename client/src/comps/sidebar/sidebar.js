import Link from 'next/link'
import {
  Home as IHome,
  Users as IUsers,
  Grid as ICategories,
  Package as IProducts,
  Layers as IOrders,
} from 'react-feather'

const Sidebar = ({}) => {
  return (
    <nav className="sidebar">
      <ul className="sidebar-nav">
        <li className="sidebar-nav-item">
          <Link href="/admin">
            <a className="nav-link" aria-label="dashboard">
              <IHome role="img" />
              <span className="link-text">Dashboard</span>
            </a>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link href="/admin/categories">
            <a className="nav-link" aria-label="categories">
              <ICategories role="img" />
              <span className="link-text">Categories</span>
            </a>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link href="/admin/customers">
            <a className="nav-link" aria-label="customers">
              <IUsers role="img" />
              <span className="link-text">Customers</span>
            </a>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link href="/admin/products">
            <a className="nav-link" aria-label="products">
              <IProducts role="img" />
              <span className="link-text">Products</span>
            </a>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link href="/admin/orders">
            <a className="nav-link" aria-label="orders">
              <IOrders role="img" />
              <span className="link-text">Orders</span>
            </a>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link href="/admin/users">
            <a className="nav-link" aria-label="users">
              <IUsers role="img" />
              <span className="link-text">Users</span>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar
