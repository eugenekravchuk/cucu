import React, { useState } from 'react';
import DatePicker from 'react-native-modern-datepicker';

const BasicUsage = () => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <DatePicker
      onSelectedChange={date => setSelectedDate(date)}
    />
  );
};