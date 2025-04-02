import { screen, render } from '@testing-library/react'
import { useRouter } from 'next/router'
import { useAuthStore } from '../../../stores/auth-store'
import AdminLayout from './admin-layout'

const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('../../../stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}))

const renderComponent = () => {
  render(
    <AdminLayout>
      <div>Admin Content</div>
    </AdminLayout>,
  )
}

describe('AdminLayout component', () => {
  test('AdminLayout redirects non-manager user to /signin', async () => {
    useAuthStore.mockReturnValue({
      user: { roles: ['user'] },
    })

    renderComponent()

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
    expect(mockPush).toHaveBeenCalledWith('/signin')
  })

  test('AdminLayout renders children for admin user', async () => {
    useAuthStore.mockReturnValue({
      user: { roles: ['admin'] },
    })

    renderComponent()

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })

  test('AdminLayout renders children for editor user', async () => {
    useAuthStore.mockReturnValue({
      user: { roles: ['editor'] },
    })

    renderComponent()

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
