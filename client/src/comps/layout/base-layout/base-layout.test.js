import { render, screen } from '@testing-library/react'
import BaseLayout from './base-layout'

jest.mock('../../vendor/toast/toast', () => () => <div data-testid="toast" />)

describe('BaseLayout component', () => {
  test('renders Toast and children', () => {
    render(
      <BaseLayout>
        <div>inner</div>
      </BaseLayout>,
    )
    expect(screen.getByText(/inner/i)).toBeInTheDocument()
    expect(screen.getByTestId('toast')).toBeInTheDocument()
  })
})
