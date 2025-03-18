const setHeaders = (token?: any, headers?: any) => {
  const newHeaders = headers ? headers : {}
  if (!headers) newHeaders['Accept'] = 'application/json'
  if (token) newHeaders['Authorization'] = token
  return newHeaders
}

const debugStatus = async (res, expectedStatus) => {
  if (res.status !== expectedStatus) {
    console.log(JSON.stringify(res.body, null, 2))
  }
}

export { setHeaders, debugStatus }
