import { RootState } from './store';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface UserEventState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
}

const LOAD_REQUEST = 'userEvents/load_request';

interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}

const LOAD_SUCCESS = 'userEvents/load_success';

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}

const LOAD_ERROR = 'userEvents/load_error';

interface LoadErrorAction extends Action<typeof LOAD_ERROR> {
  error: string;
}

export const loadUserEvents =
  (): ThunkAction<
    void,
    RootState,
    undefined,
    LoadRequestAction | LoadSuccessAction | LoadErrorAction
  > =>
  async (dispatch, getState) => {
    dispatch({
      type: LOAD_REQUEST,
    });

    try {
      const response = await fetch('http://localhost:3001/events');

      const events: UserEvent[] = await response.json();

      dispatch({
        type: LOAD_SUCCESS,
        payload: { events },
      });
    } catch (error) {
      dispatch({ type: LOAD_ERROR, error: 'Failed to load events.' });
    }
  };

const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

export const selectUserEventArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id) => state.byIds[id]);
};

const initialState: UserEventState = {
  byIds: {},
  allIds: [],
};

const userEventsReducer = (
  state: UserEventState = initialState,
  acton: LoadSuccessAction
) => {
  switch (acton.type) {
    case LOAD_SUCCESS:
      const { events } = acton.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventState['byIds']>((byIds, events) => {
          byIds[events.id] = events;
          return byIds;
        }, {}),
      };
    default:
      return state;
  }
};

export default userEventsReducer;
