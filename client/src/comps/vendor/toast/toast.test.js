import { render, screen } from '@testing-library/react'
import Toast from './toast'

jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
}))

describe('Toast component', () => {
  it('should render toast-contaner', () => {
    render(<Toast />)
    expect(screen.getByTestId('toast-container')).toBeInTheDocument()
  })
})
