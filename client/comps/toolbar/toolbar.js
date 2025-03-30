import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuth, signOut } from '../../store/slices/authSlice'
import { selectCart } from '../../store/slices/cartSlice'
import {
  ShoppingCart as ICart,
  User as IUser,
  LogOut as ILogOut,
  LogIn as ILogIn,
  Search as ISearch,
  UserPlus as ISignUp,
} from 'react-feather'

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
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  useEffect(() => {}, [auth])

  const handleSignOut = (event) => {
    event.preventDefault()
    dispatch(signOut())
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
  const auth = useSelector(selectAuth)
  const cart = useSelector(selectCart)
  const totalItems = cart?.items?.reduce((acc, cur) => acc + cur.quantity, 0)

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
          <Account user={auth.user} />
        </li>
        {!auth.user && (
          <li>
            <SignUp />
          </li>
        )}
        {auth.user && <SignOut />}
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
