import { render, screen } from '@testing-library/react'
import { Callout, CalloutError } from './callout'

describe('Callout', () => {
  it('should display a message', () => {
    const message = 'A simple message'
    render(<Callout message={message} />)

    expect(screen.getByText(message)).toBeInTheDocument()
  })
})

describe('Callout error', () => {
  it('should display a list of errors', () => {
    const error = 'error on the form'
    const errors = ['error 1', 'error 2', 'error 3']
    render(<CalloutError error={error} errors={errors} />)

    expect(screen.getByText(error)).toBeInTheDocument()

    for (const e of errors) {
      expect(screen.getByText(new RegExp(e, 'i'))).toBeInTheDocument()
    }
  })
})
