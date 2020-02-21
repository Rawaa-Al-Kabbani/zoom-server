import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState('');
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const categoriesResponse = await fetch('/getCategories');
    const categoriesResponseJson = await categoriesResponse.json();
    setCategories(categoriesResponseJson);
  };
  return (
    <div className="App">
      <p>Hello Zoom</p>
    </div>
  );
}

export default App;
