import { AnyAction } from 'redux';

interface UserEvents {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface UserEventState {
  byIds: Record<UserEvents['id'], UserEvents>;
  allIds: UserEvents['id'][];
}

const initialState: UserEventState = {
  byIds: {},
  allIds: [],
};

const userEventsReducer = (
  state: UserEventState = initialState,
  acton: AnyAction
) => {
  switch (acton.type) {
    default:
      return state;
  }
};

export default userEventsReducer;
