import Head from 'next/head'
import { adminLayout } from '../../comps/layout/admin-layout/admin-layout'
import { Home as IHome } from 'react-feather'

const Index = () => {
  return (
    <>
      <Head>
        <title>Shopitype dashboard </title>
      </Head>
      <div>
        <h1 className="heading">
          <IHome /> <span>Dashboard</span>
        </h1>
        <hr />
        <div className="dashboard"></div>
      </div>
    </>
  )
}

Index.getLayout = adminLayout

export default Index
