import Head from 'next/head'
import { adminLayout } from '../../../comps/layout/layout'
import { selectCategories } from '../../../store/slices/categoriesSlice'
import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'
import CategoryForm from '../../../comps/admin/CategoryForm'
import { useSelector } from 'react-redux'
import { CalloutError } from '../../../comps/callout/callout'

const CategoryNew = () => {
  const categories = useSelector(selectCategories)
  return (
    <>
      <Head>
        <title>Storefly dashboard | Category </title>
      </Head>
      <div className="category-new">
        {categories.loading && <Loader type={SPINNER_TYPE} size="small" />}
        {!categories.loading && categories.error ? (
          <CalloutError error={categories.error} errors={categories.errors} />
        ) : null}
        {!categories.loading ? <CategoryForm /> : null}
      </div>
    </>
  )
}

CategoryNew.getLayout = adminLayout

export default CategoryNew
