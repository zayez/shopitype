import { screen, render } from '@testing-library/react'
import { createAppStore, store } from '../../store'
import { Provider } from 'react-redux'
import Navbar from './navbar'

const userData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
}

const stateMap = {
  default: { auth: {} },
  client: { auth: { user: { ...userData, roles: ['client'] } } },
  admin: { auth: { user: { ...userData, roles: ['admin'] } } },
  editor: { auth: { user: { ...userData, roles: ['editor'] } } },
}

const renderComponent = (role) => {
  const key =
    role && ['admin', 'editor'].includes(role)
      ? role
      : role === 'client'
      ? 'client'
      : 'default'
  const { store } = createAppStore(stateMap[key])
  store.dispatch = jest.fn(store.dispatch)

  render(
    <Provider store={store}>
      <Navbar />
    </Provider>,
  )
  return { store }
}

const checkHomeAndAboutLinksAreShown = () => {
  const homeLink = screen.getByRole('link', { name: /home/i })
  const aboutLink = screen.getByRole('link', { name: /about/i })
  expect(homeLink).toBeInTheDocument()
  expect(homeLink).toHaveTextContent(/home/i)
  expect(aboutLink).toBeInTheDocument()
  expect(aboutLink).toHaveTextContent(/about/i)
}

checkAdminLinkIsNotShown = () => {
  expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument()
}

const checkAdminLinkIsShown = () => {
  const adminLink = screen.getByRole('link', { name: /admin/i })
  expect(adminLink).toBeInTheDocument()
  expect(adminLink).toHaveTextContent(/admin/i)
}

describe('when the user has not signed in', () => {
  test('it should display home and about links, but not admin', () => {
    renderComponent()
    checkHomeAndAboutLinksAreShown()
    checkAdminLinkIsNotShown()
  })
})

describe('when the user has signed in as client', () => {
  test('it should display home, about and admin links, but not admin', () => {
    renderComponent('client')
    checkHomeAndAboutLinksAreShown()
    checkAdminLinkIsNotShown()
  })
})

describe('when the user has signed in as admin or editor', () => {
  test('as admin, it should display home, about and admin links', () => {
    renderComponent('admin')
    checkHomeAndAboutLinksAreShown()
    checkAdminLinkIsShown()
  })

  test('as editor, it should display home, about and admin links', () => {
    renderComponent('editor')
    checkHomeAndAboutLinksAreShown()
    checkAdminLinkIsShown()
  })
})
