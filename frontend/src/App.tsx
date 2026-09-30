import { useState } from "react";
import "./App.css";
import LoginFormPage from "./components/LoginFormPage";
import IntroPage from "./components/IntroPage";
import CreateTicketFormPage from "./components/CreateTicketFormPage";
import TicketTablePage from "./components/TicketTablePage";
import TicketDetailsPage from "./components/TicketDetailsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginFormPage />} />
        <Route path="/create-ticket" element={<CreateTicketFormPage user_id={0} />} />
        <Route path="/tickets" element={<TicketTablePage />}/>
        <Route path="/ticket-details" element={<TicketDetailsPage />} /> {/* to be "/ticket-{ticket_id}-details" */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
