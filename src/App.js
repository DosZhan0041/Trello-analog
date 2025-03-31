import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardsProvider from "./context/BoardsProvider";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashPage";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import BoardPage from "./pages/BoardPage/BoardPage";

function App() {
  return (
    <Router> 
        <BoardsProvider>
          <Header/>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <DashboardPage />
              }
            />
            <Route
              path="/board/:id"
              element={ 
                <BoardPage />
              }
            />
          </Routes>
          <Footer/>
        </BoardsProvider>
    </Router>
  );
}

export default App;
