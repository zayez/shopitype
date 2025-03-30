import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import Toolbar from './toolbar'
import { store } from '../../store'

jest.mock('../../store/slices/authSlice', () => {
  const originalModule = jest.requireActual('../../store/slices/authSlice')
  return {
    __esModule: true,
    ...originalModule,
    signOut: jest.fn(() => ({ type: 'auth/signOut' })),
  }
})

const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const renderComponent = (isSignedIn = false) => {
  const defaultState = {
    auth: {},
    cart: {},
  }
  const signedInState = {
    auth: {
      user: { id: 1, name: 'John Doe', email: 'john@example.com' },
      loading: false,
      error: '',
      success: true,
    },
    cart: {
      items: [{ id: 'item1', quantity: 2 }],
    },
  }
  const storeState = isSignedIn ? store(signedInState) : store(defaultState)
  storeState.dispatch = jest.fn(storeState.dispatch)

  render(
    <Provider store={storeState}>
      <Toolbar />
    </Provider>,
  )
  return { storeState }
}

describe('when the user is not signed in', () => {
  test('should not display a Profile and Logout, and display a Sign in, Sign up and Cart', () => {
    renderComponent()
    const signInLink = screen.getByRole('link', { name: /sign in/i })
    const signInIcon = within(signInLink).getByRole('img', {
      name: /sign in/i,
    })
    const signUpLink = screen.getByRole('link', { name: /sign up/i })
    const signUpIcon = within(signUpLink).getByRole('img', { name: /sign up/i })
    const cartLink = screen.getByRole('link', { name: /cart/i })
    const cartIcon = within(cartLink).getByRole('img', { name: /cart icon/i })

    expect(screen.queryByTitle(/profile/i)).not.toBeInTheDocument()
    expect(screen.queryByTitle(/logout/i)).not.toBeInTheDocument()
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveTextContent(/sign in/i)
    expect(signInIcon).toBeInTheDocument()
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink).toHaveTextContent(/sign up/i)
    expect(signUpIcon).toBeInTheDocument()
    expect(cartLink).toBeInTheDocument()
    expect(cartLink).toHaveTextContent(/cart/i)
    expect(cartIcon).toBeInTheDocument()
  })
})

describe('when user is signed in', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  test('displays Profile and Logout, but not display Sign in or Sign up', () => {
    renderComponent(true)
    const profileLink = screen.getByRole('link', { name: /profile/i })
    const profileIcon = within(profileLink).getByRole('img', {
      name: /profile/i,
    })
    const logoutLink = screen.getByTitle(/logout/i)
    const logoutIcon = within(logoutLink).getByRole('img', {
      name: /sign out/i,
    })
    const cartLink = screen.getByRole('link', { name: /cart/i })
    const cartIcon = within(cartLink).getByRole('img', { name: /cart/i })

    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveTextContent(/profile/i)
    expect(profileIcon).toBeInTheDocument()

    expect(logoutLink).toBeInTheDocument()
    expect(logoutLink).toHaveTextContent(/sign out/i)
    expect(logoutIcon).toBeInTheDocument()

    expect(screen.queryByTitle(/sign in/i)).not.toBeInTheDocument()
    expect(screen.queryByTitle(/sign up/i)).not.toBeInTheDocument()
    expect(cartLink).toBeInTheDocument()
    expect(cartLink).toHaveTextContent(/cart/i)
    expect(cartIcon).toBeInTheDocument()
  })

  test('and sign out, sign out and redirects to /signin', async () => {
    const { storeState } = renderComponent(true)

    const logoutLink = screen.getByTestId('logout-link')
    await userEvent.click(logoutLink)
    expect(mockPush).toHaveBeenCalledWith('/signin')
    expect(storeState.dispatch).toHaveBeenCalled()
    expect(storeState.dispatch).toHaveBeenCalledWith({ type: 'auth/signOut' })
  })
})
