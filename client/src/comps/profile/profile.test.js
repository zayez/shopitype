import { render, screen } from '@testing-library/react'
import { useAuthStore } from '../../stores/auth-store'
import { useUsersStore } from '../../stores/users-store'
import Profile from './profile'
import userEvent from '@testing-library/user-event'
const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const renderComponent = () => {
  const user = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    roles: ['customer'],
  }
  const state = {
    user,
    loading: false,
    error: '',
    success: true,
  }

  useAuthStore.setState(state)
  useUsersStore.setState({
    updateUser: jest.fn(),
  })

  render(<Profile {...user} />)
  return { user }
}

describe('user is signed in', () => {
  test('it renders first name, last name and email', () => {
    const { user } = renderComponent()

    const firstNameEl = screen.getByRole('textbox', { name: /first name/i })
    const lastNameEl = screen.getByRole('textbox', { name: /last name/i })
    const emailEl = screen.getByRole('textbox', { name: /e-mail/i })

    expect(firstNameEl).toBeInTheDocument()
    expect(firstNameEl).toHaveValue(user.firstName)
    expect(lastNameEl).toBeInTheDocument()
    expect(lastNameEl).toHaveValue(user.lastName)
    expect(emailEl).toBeInTheDocument()
    expect(emailEl).toHaveValue(user.email)
  })

  test('it updates the user', async () => {
    const { user } = renderComponent()

    const firstNameEl = screen.getByRole('textbox', { name: /first name/i })
    await userEvent.clear(firstNameEl)
    await userEvent.click(firstNameEl)
    await userEvent.keyboard('Anthony')

    const button = screen.getByRole('button')
    await userEvent.click(button)

    const { updateUser } = useUsersStore.getState()
    expect(updateUser).toHaveBeenCalled()
    expect(updateUser).toHaveBeenCalledWith({
      id: user.id,
      firstName: 'Anthony',
      lastName: user.lastName,
      email: user.email,
    })
  })
})
