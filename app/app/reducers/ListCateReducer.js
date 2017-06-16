import * as types from '../actions/types';
const INITIAL_STATE = {list:[], reload:false};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_CATE:
      let oldList = state.list
      return {
        ...state,
        list: [...oldList, action.payload]
      }
      break;
    case types.REPLACE_LIST_CATE:
      return {
        ...state,
        list: action.payload
      }
      break;
    case types.RELOAD:
      return {
        ...state,
        reload: action.payload
      }
      break;
    default:
      return state
  }
}
