import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CategoryForm from '../../../comps/admin/category-form'
import { CalloutError } from '../../../comps/callout/callout'
import { adminLayout } from '../../../comps/layout/admin-layout/admin-layout'
import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'
import { useCategoriesStore } from '../../../stores/categories-store'
import { useShallow } from 'zustand/shallow'

const CategoryEdit = () => {
  const router = useRouter()
  const { category, loading, error, errors, fetchCategory } =
    useCategoriesStore(
      useShallow((state) => ({
        category: state.category,
        loading: state.loading,
        error: state.error,
        errors: state.errors,
        fetchCategory: state.fetchCategory,
      })),
    )
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchCategory(id)
    }
  }, [])

  if (loading) {
    return <Loader type={SPINNER_TYPE} size="small" />
  }

  return (
    <>
      <Head>
        <title>Shopitype dashboard | Category </title>
      </Head>
      <div className="category-edit">
        {error && <CalloutError error={error} errors={errors} />}
        {category && <CategoryForm id={id} category={category} />}
      </div>
    </>
  )
}

CategoryEdit.getLayout = adminLayout

export default CategoryEdit
