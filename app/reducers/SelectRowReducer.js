import * as types from '../actions/types';
const INITIAL_STATE = {selectedId: ''};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SELECT_ROW:
      return {
        selectedId: action.payload
      }
      break;
    default:
      return state
  }
}
