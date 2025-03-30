import { render, screen } from '@testing-library/react'
import Modal from './modal'

describe('Modal testing', () => {
  it('should display a title and a message', () => {
    const title = 'A Modal title'
    const message = 'a modal message'
    render(<Modal title={title} message={message} />)
    const titleEl = screen.getByRole('heading', { name: /title/i })
    const messageEl = screen.getByText(/message/i)

    expect(titleEl).toBeInTheDocument()
    expect(messageEl).toBeInTheDocument()
  })
})
