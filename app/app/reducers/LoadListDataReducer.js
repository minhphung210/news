import * as types from '../actions/types';
const INITIAL_STATE = {list:[], selectedPost:1};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_LIST_DATA:
      return {
        ...state,
        list: action.payload
      }
      break;
    case types.SELECTED_POST0:
      return {
        ...state,
        selectedPost0: action.payload
      }
      break;
    case types.SELECTED_POST1:
      return {
        ...state,
        selectedPost1: action.payload
      }
      break;
    case types.SELECTED_POST2:
      return {
        ...state,
        selectedPost2: action.payload
      }
      break;
    default:
      return state
  }
}
