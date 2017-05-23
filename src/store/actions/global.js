import ApiCaller from '../../utils/ApiCaller'
import Api from '../../constants/Api'

const receiveNews = (response) => ({
    type: 'RECEIVE_NEWS',
    data: response.data
})

export const getNewsList = (type, pageIndex) => async (dispatch, getState) => {
    try {
        let response = await ApiCaller.call(Api.public.getNewsList, {type: type, pageIndex: pageIndex})
        await dispatch(receiveNews(response))
        return response
    } catch (error) {
        console.log('error: ', error)
    }
}
