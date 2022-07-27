import React, { Component, useEffect }  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Account from "./pages/Account/Account";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import LoginPage from './pages/LoginPage/LoginPage';
import Board from './pages/BoardPage/Board';
import PostWritePage from "./pages/PostWritePage/PostWritePage";
import HomePage from "./pages/HomePage/HomePage";
import LowBar from "./pages/LowBar/LowBar";
import Header from "./pages/Header/Header";
import PostPage from "./pages/PostPage/PostPage";
import PostModifyPage from "./pages/PostModifyPage/PostModifyPage";
import LecturePage from "./pages/LecturePage/LecturePage";
import CurriculumPage from "./pages/CurriculumPage/CurriculumPage";

function App() {
  useEffect(() => {
    window.addEventListener('unload', () => {
      localStorage.removeItem('userData');
    });
    
    return window.addEventListener('unload', () => {
      localStorage.removeItem('userData');
    });
  });
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/account' element={<Account />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/lectures" element={<LecturePage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/boards/:boardId" element={<Board />} />
          <Route path="/boards/:boardId/:postId" element={<PostPage />} />
          <Route path="/boards/:boardId/:postId/modify" element={<PostModifyPage />} />
          <Route path="/boards/:boardId/postwrite" element={<PostWritePage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
        </Routes>
        <LowBar />
      </BrowserRouter>
    </>
  );
}

export default App;
