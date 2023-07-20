import React, { useCallback, useState } from 'react';
import ExtractLastDigits from './extractDigits';
import LayoutFlow from './flow';

import 'reactflow/dist/style.css';

const App = () => {
  // Last Digits
  const [lastDigits, setLastDigits] = useState('');

  return (
    <div style={{ height: 800 }}>
      <ExtractLastDigits onDigitsChange={(digits) => setLastDigits(digits)}></ExtractLastDigits>
      <LayoutFlow doi={lastDigits}></LayoutFlow>
    </div>

  );
};

export default App;
