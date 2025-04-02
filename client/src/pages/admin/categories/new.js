import Head from 'next/head'
import { adminLayout } from '../../../comps/layout/layout'
import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'
import CategoryForm from '../../../comps/admin/category-form'
import { CalloutError } from '../../../comps/callout/callout'
import { useCategoriesStore } from '../../../stores/categories-store'
import { useShallow } from 'zustand/shallow'

const CategoryNew = () => {
  const { loading, error, errors } = useCategoriesStore(
    useShallow((state) => ({
      loading: state.loading,
      error: state.error,
      errors: state.errors,
    })),
  )

  if (loading) {
    return <Loader type={SPINNER_TYPE} size="small" />
  }

  return (
    <>
      <Head>
        <title>Shopitype dashboard | Category </title>
      </Head>
      <div className="category-new">
        {error && <CalloutError error={error} errors={errors} />}
        <CategoryForm />
      </div>
    </>
  )
}

CategoryNew.getLayout = adminLayout

export default CategoryNew
