import { createServer } from '../test/msw-server'
import { useProductStatusesStore } from './product-statuses-store'
import productStatusesJson from '../test/fixtures/product-statuses.json' with { type: 'json' }

beforeEach(() => {
  useProductStatusesStore.setState({
    loading: false,
    productStatuses: [],
    message: '',
    error: '',
  })
})

describe('useProductStatusesStore with successfull response', () => {
  createServer([
    { path: '/api/productStatuses', res: () => productStatusesJson },
  ])

  test('should update state successfully after fetching product statuses', async () => {
    const data = await useProductStatusesStore.getState().fetchProductStatuses()

    expect(data).toEqual(productStatusesJson)
    const { loading, productStatuses, error } =
      useProductStatusesStore.getState()
    expect(loading).toBe(false)
    expect(productStatuses).toEqual(productStatuses)
    expect(error).toBe('')
  })
})

describe('useProductstatusesStore with error response', () => {
  createServer([
    {
      path: '/api/productStatuses',
      res: () => ({ message: 'Custom failure!' }),
      status: 500,
    },
  ])

  test('should update state correctly when fetchProductStatuses fails', async () => {
    await expect(
      useProductStatusesStore.getState().fetchProductStatuses(),
    ).rejects.toThrow()

    const state = useProductStatusesStore.getState()
    expect(state.loading).toBe(false)
    expect(state.productStatuses).toEqual([])
    expect(state.error).toBe('Custom failure!')
  })
})
