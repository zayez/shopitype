import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuth, signUser } from '../store/slices/authSlice'
import ProductsView from '../views/products-view/products-view'

const Index = () => {
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  const user = auth.user
  useEffect(() => {
    dispatch(signUser())
  }, [])

  useEffect(() => {
    console.log('user: ', user)
  })

  return (
    <>
      <Head>
        <title>Storefly | Home </title>
      </Head>
      <div>
        <h1>Home</h1>
        <ProductsView />
      </div>
    </>
  )
}

export default Index
