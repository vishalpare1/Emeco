import SInfo from 'react-native-sensitive-info'
import Api from '../Api'

export default class AuthenticationManager {
  _isRefreshing = false
  _isRestored = false
  _refreshPromiseResolvers = []

  _restoreToken = async () => {
    try {
      this._token = await SInfo.getItem('userToken', {})
      this._refreshToken = await SInfo.getItem('refreshToken', {})
      let expirationDate = await SInfo.getItem('expirationDate', {})
      this._expirationDate = new Date(parseFloat(expirationDate) * 1000)
    } catch (error) {
      console.warn(error)
    }
  }

  _refresh = () => {
    if (this._isRefreshing) {
      return new Promise((resolve, reject) => {
        this._refreshPromiseResolvers.push({resolve, reject})
      })
    }
    this._isRefreshing = true
    return new Promise((resolve, reject) => {
      Api.post(`/users/refresh`, null, {
        Authorization: `Token token=${this._refreshToken}`,
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }, {skipAuthorization: true}).then(response => {
        return this.setTokenResponse(response)
      }).then(() => {
        this._isRefreshing = false
        resolve()
        this._refreshPromiseResolvers.forEach(p => {
          p.resolve()
        })
        this._refreshPromiseResolvers = []
      }).catch(error => {
        this._isRefreshing = false
        reject(error)
        this._refreshPromiseResolvers.forEach(p => {
          // p.reject(response)
          p.reject()
        })
        this._refreshPromiseResolvers = []
      })
    })
  }

  isAuthorized = () => {
    let v = (this._token && this.refresh_token)
    return v !== undefined && v !== null
  }

  getToken = async () => {
    if (!this._isRestored) {
      await this._restoreToken()
      this._isRestored = true
    }
    if (this._token && this._expirationDate && this._expirationDate > new Date()) {
      return this._token
    } else if (this._refreshToken) {
      try {
        await this._refresh()
        return this._token
      } catch (error) {
        console.warn('refresh failure', error.message)
        return null
      }
    } else {
      return null
    }
  }

  setTokenResponse = async (tokenResponse) => {
    let now = new Date().getTime() / 1000
    let expirationDate = now + tokenResponse.expires_in
    await SInfo.setItem('userToken', tokenResponse.token, {})
    await SInfo.setItem('refreshToken', tokenResponse.refresh_token, {})
    await SInfo.setItem('expirationDate', `${expirationDate}`, {})
    this._token = tokenResponse.token
    this._refreshToken = tokenResponse.refresh_token
    this._expirationDate = new Date(expirationDate * 1000)
  }

  addAuthorization = async (params, headers) => {
    let token = await this.getToken()
    let authorizationHeaders = {}
    if (token) {
      authorizationHeaders['Authorization'] = `Token token=${token}`
    }
    return [
      params,
      {
        ...authorizationHeaders,
        ...headers
      }
    ]
  }

  revokeToken = async() => {
    this._token = null
    this._refreshToken = null
    this._expirationDate = null
    try {
      await SInfo.deleteItem('userToken', {})
      await SInfo.deleteItem('refreshToken', {})
      await SInfo.deleteItem('expirationDate', {})
    } catch (error) {
      console.warn(error)
    }
  }
}
