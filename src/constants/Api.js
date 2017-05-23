const API_ROOT = '/api/v1'
const API_PUBLIC = API_ROOT + '/public'

const TYPES = {
  POST: 'post',
  GET: 'get'
}

module.exports = {
  public: {
    getNewsList: {
      url: API_PUBLIC + '/getNewsList',
      type: TYPES.GET
    }
  }
}
