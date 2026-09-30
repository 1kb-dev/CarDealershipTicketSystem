import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import CreateTicketForm from "./components/CreateTicketForm";

function App() {
  return (
    <CreateTicketForm user_id={1} />
  )
}

export default App;
