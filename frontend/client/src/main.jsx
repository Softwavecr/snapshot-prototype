import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SnapshotDetail from './components/SnapshotDetail';
import Home from './pages/Home';
import About from './pages/About';
import Snap from './components/Snap';
import SnapshotList from './components/SnapshotList';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />                   
          <Route path="/snapshot/:id" element={<SnapshotDetail />} />
          <Route path="snapshots" element={<SnapshotList />} />
          <Route path="/snap/" element={<Snap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
// client/src/main.jsx