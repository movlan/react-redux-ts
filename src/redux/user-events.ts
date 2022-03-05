import { RootState } from './store';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { selectDateStart } from './recorder';

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

const CREATE_REQUEST = 'userEvents/create_request';
interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {}

const CREATE_FAILURE = 'userEvents/create_failure';
interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {}

const CREATE_SUCCESS = 'userEvents/create_success';
interface CreateSuccesstAction extends Action<typeof CREATE_SUCCESS> {
  payload: { event: UserEvent };
}

export const createUserEvent =
  (): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    CreateRequestAction | CreateSuccesstAction | CreateFailureAction
  > =>
  async (dispatch, getState) => {
    dispatch({ type: CREATE_REQUEST });
    try {
      const dateStart = selectDateStart(getState());
      const event: Omit<UserEvent, 'id'> = {
        title: 'No Name',
        dateStart,
        dateEnd: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const createdEvent: UserEvent = await response.json();

      dispatch({ type: CREATE_SUCCESS, payload: { event: createdEvent } });
    } catch (error) {
      dispatch({ type: CREATE_FAILURE });
    }
  };

const DELETE_REQUEST = 'userEvents/delete_request';
interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}

const DELETE_SUCCESS = 'userEvents/delete_success';
interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: { id: UserEvent['id'] };
}

const DLETE_FAILURE = 'userEvents/delete_faliure';
interface DeleteFailureAction extends Action<typeof DLETE_FAILURE> {}

export const deleteUserEvent =
  (
    id: UserEvent['id']
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
  > =>
  async (dispatch) => {
    dispatch({ type: DELETE_REQUEST });

    try {
      const response = await fetch(`http://localhost:3001/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch({ type: DELETE_SUCCESS, payload: { id } });
      }
    } catch (error) {
      dispatch({ type: DLETE_FAILURE });
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
  action: LoadSuccessAction | CreateSuccesstAction | DeleteSuccessAction
) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventState['byIds']>((byIds, events) => {
          byIds[events.id] = events;
          return byIds;
        }, {}),
      };

    case CREATE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };

    case DELETE_SUCCESS:
      const { id } = action.payload;
      const newState = {
        ...state,
        byIds: { ...state.byIds },
        allIds: state.allIds.filter((storedId) => storedId !== id),
      };
      delete newState.byIds[id];
      return newState;

    default:
      return state;
  }
};

export default userEventsReducer;
