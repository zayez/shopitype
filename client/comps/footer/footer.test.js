import { screen, render } from '@testing-library/react'
import Footer from './footer'

test('it should display copyright info', () => {
  render(<Footer />)
  const footerText = screen.getByRole('paragraph')

  expect(footerText).toBeInTheDocument()
  expect(footerText).toHaveTextContent(/copyright/i)
})
