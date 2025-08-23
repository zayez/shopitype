const routes = [
  { source: '/', destination: '/storefront/home' },
  { source: '/404', destination: '/storefront/404' },
  { source: '/success', destination: '/storefront/success' },
  { source: '/about', destination: '/storefront/about' },
  { source: '/signin', destination: '/user/signin' },
  { source: '/signup', destination: '/user/signup' },
  { source: '/profile', destination: '/user/profile' },
  { source: '/cart', destination: '/cart/cart' },
  { source: '/products/:id', destination: '/products/product?id=:id' },
  { source: '/admin', destination: '/admin/admin' },
  {
    source: '/admin/categories',
    destination: '/admin/categories/category-list',
  },
  {
    source: '/admin/categories/new',
    destination: '/admin/categories/category-create',
  },
  {
    source: '/admin/categories/:id',
    destination: '/admin/categories/category-edit?id=:id',
  },
  {
    source: '/admin/customers',
    destination: '/admin/customers/customer-list',
  },
  {
    source: '/admin/customers/:id',
    destination: '/admin/customers/customer-edit?id=:id',
  },
  {
    source: '/admin/orders',
    destination: '/admin/orders/order-list',
  },
  {
    source: '/admin/orders/:id',
    destination: '/admin/orders/order-edit?id=:id',
  },
  {
    source: '/admin/products',
    destination: '/admin/products/product-list',
  },
  {
    source: '/admin/products/new',
    destination: '/admin/products/product-create',
  },
  {
    source: '/admin/products/:id',
    destination: '/admin/products/product-edit?id=:id',
  },
  {
    source: '/admin/users',
    destination: '/admin/users/user-list',
  },
  {
    source: '/admin/users/:id',
    destination: '/admin/users/user-edit?id=:id',
  },
]

module.exports = { routes }
