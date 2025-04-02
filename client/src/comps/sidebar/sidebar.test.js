import { render, screen, within } from '@testing-library/react'
import Sidebar from './sidebar'

describe('Sidebar component', () => {
  test('it should render link, text and image for each of the links in the sidebar', () => {
    render(<Sidebar />)

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    const dashboardImage = within(dashboardLink).getByRole('img')
    const categoriesLink = screen.getByRole('link', { name: /categories/i })
    const categoriesImage = within(categoriesLink).getByRole('img')
    const customersLink = screen.getByRole('link', { name: /customers/i })
    const customersImage = within(customersLink).getByRole('img')
    const productsLink = screen.getByRole('link', { name: /products/i })
    const productsImage = within(productsLink).getByRole('img')
    const ordersLink = screen.getByRole('link', { name: /orders/i })
    const ordersImage = within(ordersLink).getByRole('img')
    const usersLink = screen.getByRole('link', { name: /users/i })
    const usersImage = within(usersLink).getByRole('img')

    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink).toHaveTextContent(/dashboard/i)
    expect(dashboardImage).toBeInTheDocument()

    expect(categoriesLink).toBeInTheDocument()
    expect(categoriesLink).toHaveTextContent(/categories/i)
    expect(categoriesImage).toBeInTheDocument()
    expect(customersImage).toBeInTheDocument()
    expect(productsImage).toBeInTheDocument()
    expect(ordersImage).toBeInTheDocument()
    expect(usersImage).toBeInTheDocument()
  })
})
