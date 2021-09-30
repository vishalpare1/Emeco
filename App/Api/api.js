import Http from 'react-native-http-module'

export default class Api {
  authenticationManager = null

  constructor (baseURL, authenticationManager) {
    this.baseURL = baseURL
    if (authenticationManager) {
      this.authenticationManager = authenticationManager
    }
  }

  call = async (path, method, params = {}, headers = {}, options = {}) => {
    if (!options.skipAuthorization && this.authenticationManager) {
      let [authorizedParams, authorizedHeaders] = await this.authenticationManager.addAuthorization(params, headers)
      return Http.call(`${this.baseURL}/${path}`, method, authorizedParams, authorizedHeaders)
    } else {
      return Http.call(`${this.baseURL}/${path}`, method, params, headers)
    }
  }

  get = (path, params, headers, options) => {
    return this.call(path, 'GET', params, headers, options)
  }

  post = (path, params, headers = {'Content-Type': 'application/json'}, options) => {
    return this.call(path, 'POST', params, headers, options)
  }

  postJson = (path, params, headers, options) => {
    return this.call(path, 'POST', params, {...headers, 'Content-Type': 'application/json'}, options)
  }

  put = (path, params, headers = {'Content-Type': 'application/json'}, options) => {
    return this.call(path, 'PUT', params, headers, options)
  }

  patch = (path, params, headers, options) => {
    return this.call(path, 'PATCH', params, headers, options)
  }

  delete = (path, params, headers, options) => {
    return this.call(path, 'DELETE', params, headers, options)
  }

  signIn = () => {

  }

  signUp = () => {

  }
}
