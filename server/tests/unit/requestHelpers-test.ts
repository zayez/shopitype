import test from 'tape'
import { setHeaders } from '../helpers/requestHelpers'

test('setup', async (t) => {
  t.end()
})

test('should be able to override headers', (t) => {
  const token = 'tokens'
  const format = 'image/jpg'
  const initHeaders = {}
  initHeaders['Image-Format'] = format
  const newHeaders = setHeaders(token, initHeaders)

  t.equal(newHeaders['Image-Format'], format, 'format is set')
  t.equal(newHeaders['Authorization'], token, 'token is set')
  t.end()
})

test('should not be able to override headers', (t) => {
  const token = 'token'
  const accept = 'application/json'
  const format = 'music/mp3'
  const initHeaders = {}
  initHeaders['Music-Format'] = format
  const newHeaders = setHeaders(token)

  t.notEqual(newHeaders['Music-Format'], format, 'format is not set')
  t.equal(newHeaders['Authorization'], token, 'token is set')
  t.equal(newHeaders['Accept'], accept, 'accept is set')
  t.end()
})

test('teardown', async (t) => {
  t.end()
})
