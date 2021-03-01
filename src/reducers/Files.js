import { ACTIONS } from '../Constants';

const initialState = {
  byId: {},
};

const filesReducer = (state = initialState, action) => {
  let newById;
  let reduced;
  let file;

  switch (action.type) {
    case ACTIONS.GET_MANY_FILES: {
      const { files = [] } = action.payload;
      reduced = files.reduce((prev, file) => {
        prev[file._id] = file;
        return prev;
      }, {});
      newById = {
        ...state.byId,
        ...reduced,
      };
      return {
        ...state,
        byId: newById,
      };
    }
    case ACTIONS.GET_FILE:
    case ACTIONS.PUT_FILE:
    case ACTIONS.POST_FILE: {
      ({ file } = action.payload);
      newById = {
        ...state.byId,
        [file._id]: file,
      };
      return {
        ...state,
        byId: newById,
      };
    }

    default:
      return state;
  }
};

export default filesReducer;
