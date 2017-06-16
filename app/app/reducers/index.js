import { combineReducers } from 'redux';
import LoadListDataReducer from './LoadListDataReducer';
import ReaderModalReducer from './ReaderModalReducer';
import ListCateReducer from './ListCateReducer';

export default combineReducers({
  loadListDataReducer: LoadListDataReducer,
  readerModalReducer: ReaderModalReducer,
  listCateReducer: ListCateReducer,
})
