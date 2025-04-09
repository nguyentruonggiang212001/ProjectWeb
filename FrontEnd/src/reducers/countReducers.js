import { DECREMENT, INCREMENT } from "../action/countAction";

const inititalState = {
  count: 0,
};
export const countReducer = (state = inititalState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      };

    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return state;
  }
};
