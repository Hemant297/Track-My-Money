import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const loading = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <Spinner className="white" size="large">
        <span className="white">Good things take time ! 😉</span>
      </Spinner>
    </div>
  );
};

export default loading;
