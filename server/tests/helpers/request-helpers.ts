import { StatusCodeType } from '../../src/types/status-code'
import { Response } from 'supertest'

const setHeaders = (token?: string, headers?: Record<string, string>) => {
  const newHeaders = headers ? headers : {}
  if (!headers) newHeaders['Accept'] = 'application/json'
  if (token) newHeaders['Authorization'] = token
  return newHeaders
}

const debugStatus = async (res: Response, expectedStatus: StatusCodeType) => {
  if (res.status !== expectedStatus) {
    console.log(JSON.stringify(res.body, null, 2))
  }
}

export { setHeaders, debugStatus }
