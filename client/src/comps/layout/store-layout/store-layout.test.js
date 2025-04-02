import { render, screen } from '@testing-library/react'
import StoreLayout, { storeLayout } from './store-layout'

jest.mock('../../header/header', () => () => <div data-testid="header" />)
jest.mock('../../footer/footer', () => () => <div data-testid="footer" />)

describe('StoreLayout component', () => {
  test('renders Header, Footer, and children', () => {
    render(
      <StoreLayout>
        <div>Store Content</div>
      </StoreLayout>,
    )
    expect(screen.getByText('Store Content')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})

describe('storeLayout helper', () => {
  test('storeLayout wraps content in StoreLayout', () => {
    const TestComponent = () => <div>Store Page</div>
    const Wrapped = storeLayout(<TestComponent />)
    render(Wrapped)
    expect(screen.getByText('Store Page')).toBeInTheDocument()
  })
})
