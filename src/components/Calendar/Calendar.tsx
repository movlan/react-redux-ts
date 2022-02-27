import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  loadUserEvents,
  selectUserEventArray,
  UserEvent,
} from '../../redux/user-events';
import './Calendar.css';

const mapState = (state: RootState) => ({
  events: selectUserEventArray(state),
});

const mapDispatch = {
  loadUserEvents,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}
const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};
  events.forEach((event) => {
    const sateStart = new Date(event.dateStart);
    const sateEnd = new Date(event.dateEnd);
  });
};

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
  useEffect(() => {
    loadUserEvents();
  }, []);
  return (
    <div className="calendar">
      <div className="calendar-day">
        <div className="calendar-day-label">
          <span>1 February</span>
        </div>
        <div className="calendar-events">
          <div className="calendar-event">
            <div className="calendar-event-info">
              <div className="calendar-event-time">10:00 - 12:00</div>
              <div className="calendar-event-title">Learning Typescript</div>
            </div>
            <button className="calendar-event-delete-button">&times;</button>
          </div>
        </div>
      </div>
      <div className="calendar-day">
        <div className="calendar-day-label">
          <span>1 February</span>
        </div>
        <div className="calendar-events">
          <div className="calendar-event">
            <div className="calendar-event-info">
              <div className="calendar-event-time">10:00 - 12:00</div>
              <div className="calendar-event-title">Learning Typescript</div>
            </div>
            <button className="calendar-event-delete-button">&times;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(Calendar);
