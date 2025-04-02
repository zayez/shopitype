import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  ShoppingCart as ICart,
  User as IUser,
  LogOut as ILogOut,
  LogIn as ILogIn,
  Search as ISearch,
  UserPlus as ISignUp,
} from 'react-feather'
import { useAuthStore } from '../../stores/auth-store'
import { useShallow } from 'zustand/shallow'
import { useCartStore } from '../../stores/cart-store'

const Profile = () => {
  return (
    <Link href="/profile">
      <a className="toolbar-item" title="Profile">
        <IUser role="img" aria-label="profile" />
        Profile
      </a>
    </Link>
  )
}

const SignIn = () => {
  return (
    <Link href="/signin">
      <a className="toolbar-item" title="Login">
        <ILogIn role="img" aria-label="sign in" />
        Sign in
      </a>
    </Link>
  )
}

const SignUp = () => {
  return (
    <Link href="/signup">
      <a className="toolbar-item" title="Sign Up">
        <ISignUp role="img" aria-label="sign up" />
        Sign up
      </a>
    </Link>
  )
}

const Account = ({ user }) => {
  if (user) {
    return <Profile />
  }
  return <SignIn />
}

const SignOut = () => {
  const router = useRouter()
  const { signOut } = useAuthStore(
    useShallow((state) => ({ signOut: state.signOut })),
  )

  const handleSignOut = (event) => {
    event.preventDefault()
    signOut()
    router.push('/signin')
  }

  return (
    <li>
      <a
        href="#"
        data-testid="logout-link"
        className="toolbar-item"
        title="Logout"
        onClick={handleSignOut}
      >
        <ILogOut role="img" aria-label="sign out" />
        Sign out
      </a>
    </li>
  )
}

const Toolbar = () => {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )

  const { items } = useCartStore(
    useShallow((state) => ({
      items: state.items,
    })),
  )
  const totalItems = items?.reduce((acc, cur) => acc + cur.quantity, 0)

  return (
    <nav className="navbar toolbar">
      <ul>
        <li>
          <Link href="/search">
            <a className="toolbar-item" title="Search">
              <ISearch role="img" aria-label="search" />
              Search
            </a>
          </Link>
        </li>
        <li>
          <Account user={user} />
        </li>
        {!user && (
          <li>
            <SignUp />
          </li>
        )}
        {user && <SignOut />}
        <li className="toolbar-cart-container">
          <Link href="/cart">
            <a className="toolbar-item" title="Cart">
              <ICart role="img" aria-label="cart icon" />
              Cart
            </a>
          </Link>
          <div className="cart-total-container">
            <span className="cart-total-items">{totalItems}</span>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Toolbar
