import { render, screen } from '@testing-library/react'
import { SPINNER_TYPE } from '../../types/loader-type'
import Loader from './loader'

jest.mock('../spinner/spinner', () => {
  return ({ size }) => <div data-testid="spinner" data-size={size}></div>
})

describe('Loader component', () => {
  it('renders the Spinner when type equals SPINNER_TYPE', () => {
    render(<Loader type={SPINNER_TYPE} size="small" />)
    const spinnerElement = screen.getByTestId('spinner')
    expect(spinnerElement).toBeInTheDocument()
    // Assert that the Spinner received the correct size prop
    expect(spinnerElement).toHaveAttribute('data-size', 'small')
  })

  it('renders the default fallback when type is not SPINNER_TYPE', () => {
    render(<Loader type="OTHER_TYPE" />)
    expect(screen.getByText('Loader not found.')).toBeInTheDocument()
  })
})
