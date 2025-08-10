import React from 'react';
import { format, addMonths, subMonths } from 'date-fns';

const CalendarHeader = ({ currentDate, setCurrentDate }) => {
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <button onClick={handlePrevMonth}>←</button>
      <h2>{format(currentDate, 'MMMM yyyy')}</h2>
      <button onClick={handleNextMonth}>→</button>
    </div>
  );
};

export default CalendarHeader;
