const SERVER_URL = 'http://localhost:3000'

const request = (path = '', body = null) => (method) => 
  fetch(`${SERVER_URL}${path}`, { method, body }).then((resp) => resp.json())

const httpVerbs = {
  get: (path, body) => request(path, body)('GET')
}

export default httpVerbs
