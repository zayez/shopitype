import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const createServer = (handlerConfig) => {
  const handlers = handlerConfig.map((config) => {
    return http[config.method || 'get'](config.path, ({ request, params }) => {
      return HttpResponse.json(config.res(request, params))
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
