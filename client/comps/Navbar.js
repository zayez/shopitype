import Link from 'next/link'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store/slices/authSlice'

const Navbar = () => {
  const auth = useSelector(selectAuth)

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
        {isManager(auth.user) ? (
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
