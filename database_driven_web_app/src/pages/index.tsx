import React from 'react';
import Tasks from '../app/Tasks';
import '../app/globals.css';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8 text-center">Database Driven Todo App</h1>
      <Tasks />
    </div>
  );
}

export default HomePage;