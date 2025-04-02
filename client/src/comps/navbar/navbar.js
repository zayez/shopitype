import Link from 'next/link'
import { useAuthStore } from '../../stores/auth-store'
import { useShallow } from 'zustand/shallow'

const Navbar = () => {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )

  return (
    <nav className="navbar nav nav-left">
      <ul>
        <li>
          <Link href="/">
            <a className="navbar-item" title="Home">
              Home
            </a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a className="navbar-item" title="About">
              About
            </a>
          </Link>
        </li>
        {isManager(user) ? (
          <li>
            <Link href="/admin">
              <a className="navbar-item" title="Admin">
                Admin
              </a>
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}

const isManager = (user) => {
  if (!user) return false
  const userRoles = user.roles
  return ['admin', 'editor'].some((role) => userRoles.includes(role))
}

export default Navbar
