import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const createServer = (handlerConfig) => {
  const handlers = handlerConfig.map((cfg) => {
    const method = cfg.method || 'get'
    if (cfg.networkError) {
      return http[method](cfg.path, () => HttpResponse.error())
    }
    return http[method](cfg.path, (req, params) => {
      const body = cfg.res(req, params)
      return HttpResponse.json(body, { status: cfg.status ?? 200 })
    })
  })

  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })
}
