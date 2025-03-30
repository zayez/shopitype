import Head from 'next/head'
import ProductView from '../../views/product-view/product-view'
import { useRouter } from 'next/router'
// export const getStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }
// export const getStaticProps = async (context) => {
//   const id = context.params.id
//   const url = `http://localhost:2222/products/${id}`

//   const res = await fetch(url)
//   const data = await res.json()
//   return {
//     props: { product: data },
//   }
// }

const ProductDetails = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Storefly | Home </title>
      </Head>
      <div>
        <ProductView id={id} />
      </div>
    </>
  )
}

export default ProductDetails
