import React from 'react';
import { useLocation } from 'react-router-dom';
import Pretty from '../../../components/Pretty';

function RouterTests() {
  const location = useLocation();
  return (
    <div>
      <h3>useLocation():</h3>
      <Pretty yourData={location as unknown as Record<string, unknown>} />
    </div>
  );
}

export default RouterTests;
