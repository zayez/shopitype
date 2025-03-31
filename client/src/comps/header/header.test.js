import { render, screen } from '@testing-library/react'
import Header from './header'

jest.mock('../navbar/navbar', () => () => <div data-testid="navbar" />)
jest.mock('../toolbar/toolbar', () => () => <div data-testid="toolbar" />)

describe('Header component', () => {
  test('render header with correct elements', () => {
    render(<Header />)

    expect(screen.getByText('Shopitype')).toBeInTheDocument()
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar')).toBeInTheDocument()
  })
})
