import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteUserEvent,
  updateUserEvent,
  UserEvent,
} from '../../redux/user-events';

interface Props {
  event: UserEvent;
}

const EventItem: React.FC<Props> = ({ event }) => {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(event.title);
  const dispatch = useDispatch();
  const handleDeleteClick = () => {
    dispatch(deleteUserEvent(event.id));
  };
  const handleTitleClick = () => {
    setEditable(true);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    }
  }, [editable]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleInputBlur = () => {
    if (title !== event.title) {
      dispatch(updateUserEvent({ ...event, title }));
    }
    setEditable(false);
  };
  return (
    <div className="calendar-event">
      <div className="calendar-event-info">
        <div className="calendar-event-time">10:00 - 12:00</div>
        <div className="calendar-event-title">
          {editable ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          ) : (
            <span onClick={handleTitleClick}>{event.title}</span>
          )}
        </div>
      </div>
      <button
        className="calendar-event-delete-button"
        onClick={handleDeleteClick}
      >
        &times;
      </button>
    </div>
  );
};

export default EventItem;
