import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { create, resetProduct, update } from '../../store/slices/products-slice'
import {
  fetchCategories,
  selectCategories,
} from '../../store/slices/categories-slice'
import {
  fetchProductStatuses,
  selectProductStatuses,
} from '../../store/slices/product-statuses-slice'
import { useRef } from 'react'
import { IMaskInput } from 'react-imask'
import { toast } from 'react-toastify'
import Upload from '../upload/upload'
const capitalize = require('upper-case-first').upperCaseFirst

const ProductForm = ({
  id,
  title,
  setTitle,
  description,
  setDescription,
  inventory,
  setInventory,
  price,
  setPrice,
  categoryId,
  setCategory,
  statusId,
  setStatus,
  image,
  setImage,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const categories = useSelector(selectCategories)
  const productStatuses = useSelector(selectProductStatuses)
  const [imageSource, setImageSource] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [imageRemove, setImageRemove] = useState(false)

  const headingText = id ? 'Edit' : 'New'
  const submitText = id ? 'Save' : 'Create'

  const priceRef = useRef(null)
  const priceInputRef = useRef(null)
  const inventoryRef = useRef(null)
  const inventoryInputRef = useRef(null)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProductStatuses())

    if (!id) {
      dispatch(resetProduct())
    }
  }, [])

  const handleSubmit = (e) => {
    const formData = new FormData()
    if (title) formData.append('title', title)
    if (description) formData.append('description', description)
    if (inventory) formData.append('inventory', inventory)
    if (price) formData.append('price', price)
    if (categoryId) formData.append('categoryId', categoryId)
    if (statusId) formData.append('statusId', statusId)
    if (imageRemove) {
      formData.append('imageRemove', true)
    }
    if (imageData) formData.append('image', imageData)

    e.preventDefault()
    if (id) {
      dispatch(update({ id, formData })).then((res) => {
        if (!res.error) {
          router.push('/admin/products')
          toast.success('Product successfully updated!', {})
        }
      })
    } else {
      dispatch(create(formData)).then((res) => {
        if (!res.error) {
          router.push('/admin/products')
          toast.success('Product successfully created!', {})
        }
      })
    }
  }

  const handleRemoveImage = (e) => {
    e.preventDefault()
    setImageSource(null)
    setImageData(null)
    setImageRemove(true)
  }

  const handleBackClick = (e) => {
    e.preventDefault()
    router.push('/admin/products')
    setTimeout(() => {
      dispatch(resetProduct())
    }, 1000)
  }

  const handlePriceChange = (value, mask) => {
    setPrice(value)
  }

  return (
    <>
      <h1>Product – {headingText}</h1>
      <div className="container">
        <div className="product-details">
          <form onSubmit={handleSubmit} className="form">
            <div className="row row-one">
              <div className="field">
                <div className="field-label">
                  <label htmlFor="id">ID</label>
                </div>
                <div className="field-control">
                  <input
                    type="text"
                    defaultValue={id ? id : ''}
                    disabled={true}
                    readOnly={true}
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  <label htmlFor="title">Title</label>
                </div>
                <div className="field-body">
                  <input
                    type="text"
                    value={title}
                    onChange={({ target }) => setTitle(target?.value)}
                  />
                </div>
              </div>
            </div>

            <div className="field">
              <div className="field-label">
                <label htmlFor="description">Description</label>
              </div>
              <div className="field-body">
                <textarea
                  rows={6}
                  value={description}
                  onChange={({ target }) => setDescription(target?.value)}
                ></textarea>
              </div>
            </div>

            <div className="row row-three">
              <div className="field">
                <div className="field-label">
                  <label htmlFor="price">Price</label>
                </div>
                <div className="field-body">
                  <IMaskInput
                    value={`${price}`}
                    scale={2}
                    normalizeZeros={true}
                    padFractionalZeros={true}
                    mask={Number}
                    unmask={true}
                    radix=","
                    mapToRadix={['.']}
                    thousandsSeparator="."
                    ref={priceRef}
                    inputRef={priceInputRef}
                    onAccept={handlePriceChange}
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  <label htmlFor='="inventory'>Inventory</label>
                </div>
                <div className="field-body">
                  <IMaskInput
                    value={`${inventory}`}
                    mask={Number}
                    scale={0}
                    thousandsSeparator="."
                    ref={inventoryRef}
                    inputRef={inventoryInputRef}
                    onAccept={(value, mask) => setInventory(value)}
                  />
                </div>
              </div>
            </div>

            <div className="row row-four">
              <div className="field">
                <div className="field-label">
                  <label htmlFor="categoryId">Category</label>
                </div>
                <div className="field-body">
                  <select
                    value={categoryId}
                    onChange={({ target }) => setCategory(target?.value)}
                  >
                    <option key="0" value=""></option>
                    {categories && categories.categories.length > 0
                      ? categories.categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.title}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  <label htmlFor="statusId">Status</label>
                </div>
                <div className="field-body">
                  <select
                    value={statusId}
                    onChange={({ target }) => setStatus(target?.value)}
                  >
                    <option key="0" value=""></option>
                    {productStatuses &&
                    productStatuses.productStatuses.length > 0
                      ? productStatuses.productStatuses.map((status) => (
                          <option value={status.id} key={status.id}>
                            {capitalize(status.name)}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
              </div>
            </div>
            {image ? (
              <div className="line">
                <div className="row">
                  <div className="field">
                    <img
                      className="product-image-form"
                      src={`http://localhost:2222/${image}`}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <button type="button" onClick={handleRemoveImage}>
                      Remove image
                    </button>
                  </div>
                </div>
              </div>
            ) : imageSource ? (
              <div className="line">
                <div className="row">
                  <div className="image-source">
                    <img src={imageSource} />
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <button type="button" onClick={handleRemoveImage}>
                      Remove image
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dropzone-container">
                <div className="row">
                  <Upload
                    setImageSource={setImageSource}
                    setImageData={setImageData}
                  />
                </div>
              </div>
            )}

            <div className="buttons">
              <button className="btn" onClick={handleBackClick}>
                Back
              </button>
              <button className="btn btn-primary">{submitText}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ProductForm
