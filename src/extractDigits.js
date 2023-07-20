import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const ExtractLastDigits = ({onDigitsChange}) => {
  const [userInput, setUserInput] = useState('');

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    const extractedDigits = e.target.value.slice(-7); // Extract last 7 digits
    onDigitsChange(extractedDigits);
  };

  return (
    <div>
      <TextField
        label="User Input"
        value={userInput}
        onChange={handleInputChange}
        id="outlined-basic"
        size="small"
      />
      
    </div>
  );
};

export default ExtractLastDigits;
