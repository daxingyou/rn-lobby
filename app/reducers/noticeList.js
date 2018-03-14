import Immutable from 'immutable'

const noticeList = (state = [], action) => {

  switch (action.type) {
    case 'SET_NOTICE_LIST':
      return Immutable.fromJS(action.data).toJS()
    default:
      return state
  }
}

export default noticeList
