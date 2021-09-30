import { apiURL } from './config'
import Api from './api'
import AuthenticationManager from './authenticationManager'

export default new Api(apiURL, new AuthenticationManager())
