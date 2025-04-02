import Head from 'next/head'
import { useEffect } from 'react'
import ProductsView from '../views/products-view/products-view'
import { useAuthStore } from '../stores/auth-store'
import { useShallow } from 'zustand/shallow'

const Index = () => {
  const { signUser } = useAuthStore(
    useShallow((state) => ({
      signUser: state.signUser,
    })),
  )
  useEffect(() => {
    signUser()
  }, [])

  return (
    <>
      <Head>
        <title>Shopitype | Home </title>
      </Head>
      <div>
        <h1>Home</h1>
        <ProductsView />
      </div>
    </>
  )
}

export default Index
