import {SET_ZIP_CODE} from "../actionTypes";

const initialState = {
  userid: null,
  email: null,
  isLoggedIn: false,
  zipCode: null
};

export default (state = initialState, action) => {
  let { zipCode, type } = action;
  switch (type) {
    case SET_ZIP_CODE:
      return {
        ...state,
        zipCode: zipCode
      };
    default:
      return state;
  }
};
