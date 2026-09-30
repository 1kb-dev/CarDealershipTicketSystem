import { useState } from "react";
import "./App.css";
import LoginFormPage from "./components/LoginFormPage";
import CreateTicketFormPage from "./components/CreateTicketFormPage";
import TicketTablePage from "./components/TicketTablePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroPage from "./components/IntroPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginFormPage />} />
        <Route path="/home" element={<IntroPage />} />
        <Route
          path="/create-ticket"
          element={<CreateTicketFormPage user_id={2} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
