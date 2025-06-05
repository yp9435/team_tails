
import React, { useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { makeServer } from '../services/mirage';

const Index = () => {
  useEffect(() => {
    // Initialize MirageJS server in development
    if (process.env.NODE_ENV === 'development') {
      makeServer();
    }
  }, []);

  return <MainLayout />;
};

export default Index;