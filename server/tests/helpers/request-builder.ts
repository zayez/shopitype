import request, { Response } from 'supertest'
import server from '../../src/server'
import { StatusCodeType } from '../../src/types/status-code'
import TestAgent from 'supertest/lib/agent'
import { debugStatus, setHeaders } from './request-helpers'

export interface RequestParams {
  token?: string
  status: StatusCodeType
}

export interface RequestBuilder<T> {
  server: typeof server
  agent: TestAgent
  create: (entity: T, opts: RequestParams) => Promise<Response>
  createAll(entities: T[], opts: RequestParams): Promise<Response>
  update: (id: number, entity: object, opts: RequestParams) => Promise<Response>
  destroy: (id: number, opts: RequestParams) => Promise<Response>
  getOne: (id: number | string, opts: RequestParams) => Promise<Response>
  get: (query: string, opts: RequestParams) => Promise<Response>
  getAll: (opts: RequestParams) => Promise<Response>
}

const agent = request.agent(server)

const requestBuilder = <T extends object>(
  endpoint: string,
): RequestBuilder<T> => {
  const url = `${endpoint}`

  const create = async (
    entity: T,
    { token, status }: RequestParams,
  ): Promise<Response> => {
    const headers = setHeaders(token)
    return await agent
      .post(`${url}`)
      .send(entity)
      .set(headers)
      .expect('Content-Type', /json/)
      .expect((res: Response) => debugStatus(res, status))
      .expect(status)
      .then((res) => res)
  }

  const createAll = async <T>(
    entities: T[],
    { token, status }: RequestParams,
  ): Promise<Response> => {
    const headers = setHeaders(token)
    return await agent
      .post(`${url}/collections`)
      .send(entities)
      .set(headers)
      .expect('Content-Type', /json/)
      .expect((res: Response) => debugStatus(res, status))
      .expect(status)
      .then((res) => res)
  }

  const update = async (
    id: number,
    entity: object,
    { token, status }: RequestParams,
  ): Promise<Response> => {
    const headers = setHeaders(token)
    return await agent
      .patch(`${url}/${id}`)
      .send(entity)
      .set(headers)
      .set('Authorization', token ?? '')
      .expect('Content-Type', /json/)
      .expect((res: Response) => debugStatus(res, status))
      .expect(status)
      .then((res) => res)
  }

  const destroy = async (
    id: number,
    { token, status }: RequestParams,
  ): Promise<Response> => {
    const headers = setHeaders(token)
    return await agent
      .delete(`${url}/${id}`)
      .set(headers)
      .expect('Content-Type', /json/)
      .expect((res: Response) => debugStatus(res, status))
      .expect(status)
      .then((res) => res)
  }

  const getOne = async (
    id: number | string,
    { token, status }: RequestParams,
  ): Promise<Response> => {
    const headers = setHeaders(token)
    return await agent
      .get(`${url}/${id}`)
      .set(headers)
      .expect('Content-Type', /json/)
      .expect((res: Response) => debugStatus(res, status))
      .expect(status)
      .then((res) => res)
  }

  const get = async (
    query = '',
    { token, status }: RequestParams,
  ): Promise<Response> => {
    const headers = setHeaders(token)
    return await agent
      .get(`${url}${query}`)
      .set(headers)
      .expect('Content-Type', /json/)
      .expect((res: Response) => debugStatus(res, status))
      .expect(status)
      .then((res) => res)
  }

  const getAll = async (opts: RequestParams): Promise<Response> => {
    return await get('', opts)
  }

  return {
    server,
    agent,
    create,
    createAll,
    update,
    destroy,
    getOne,
    get,
    getAll,
  }
}

export default requestBuilder
