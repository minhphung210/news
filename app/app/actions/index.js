import {
  LOAD_LIST_DATA,
  REPLACE_FAVOR_VIDEO,
  CHANGE_MODAL_STATE,
  SELECTED_POST0,
  SELECTED_POST1,
  SELECTED_POST2,
  FONTSIZE_DEC,
  CHANGE_FONTSIZE,
  CHANGE_BACKGROUND_COLOR,
  CHANGE_TEXT_COLOR,
  ADD_CATE,
  REPLACE_LIST_CATE,
  RELOAD,
  DISABLE_SCROLL,
  CHANGE_CURRENT_PAGE,
  CHANGE_NIGHT_MODE
} from './types';


export const loadListData = (data) => {
  return {
    type: LOAD_LIST_DATA,
    payload: data
  }
}
export const replaceFavorVideo = (item) => {
  return {
    type: REPLACE_FAVOR_VIDEO ,
    payload: item
  }
}
export const changeModalState = (item) => {
  return {
    type: CHANGE_MODAL_STATE ,
    payload: item
  }
}
export const selectedPost0 = (item) => {
  return {
    type: SELECTED_POST0 ,
    payload: item
  }
}
export const selectedPost1 = (item) => {
  return {
    type: SELECTED_POST1 ,
    payload: item
  }
}
export const selectedPost2 = (item) => {
  return {
    type: SELECTED_POST2 ,
    payload: item
  }
}
export const changeBackgroundColor = (item) => {
  return {
    type: CHANGE_BACKGROUND_COLOR ,
    payload: item
  }
}
export const changeTextColor = (item) => {
  return {
    type: CHANGE_TEXT_COLOR ,
    payload: item
  }
}
export const changeFontSize = (item) => {
  return {
    type: CHANGE_FONTSIZE ,
    payload: item
  }
}
export const addCate = (item) => {
  return {
    type: ADD_CATE ,
    payload: item
  }
}
export const replaceListCate = (item) => {
  return {
    type: REPLACE_LIST_CATE ,
    payload: item
  }
}
export const reload = (data) => {
  return {
    type: RELOAD,
    payload: data
  }
}
export const disableScrollWebview = (data) => {
  return {
    type: DISABLE_SCROLL,
    payload: data
  }
}
export const changeCurrentPage = (data) => {
  return {
    type: CHANGE_CURRENT_PAGE,
    payload: data
  }
}
export const changeNightMode = (data) => {
  return {
    type: CHANGE_NIGHT_MODE,
    payload: data
  }
}
// export const goToPlay = (number) => {
//   return (dispatch) => {
//     Actions.PlayScene({ numberOfPlayer: number })
//   }
// }
