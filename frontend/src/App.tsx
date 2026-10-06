import { useEffect, useState } from "react";
import "./App.css";
import IntroPage from "./components/IntroPage";
import LoginFormPage from "./components/LoginFormPage";
import RegisterFormPage from "./components/RegisterFormPage";
import CreateTicketFormPage from "./components/CreateTicketFormPage";
import TicketTablePage from "./components/TicketTablePage";
import TicketDetailsPage from "./components/TicketDetailsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckSession from "./services/SessionService";

export interface User {
  userId: number;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void CheckSession().then((sessionUser) => {
      if (sessionUser) setUser({ ...sessionUser, email: "" });
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginFormPage setUser={setUser} />} />
        <Route
          path="/register"
          element={<RegisterFormPage setUser={setUser} />}
        />

        {user ? (
          <>
            <Route
              path="/create-ticket"
              element={<CreateTicketFormPage user_id={user.userId} />}
            />
            <Route
              path="/tickets"
              element={
                <TicketTablePage email={user.email} />
              }
            />
            <Route path="/ticket-details" element={<TicketDetailsPage />} />
            {/* to be "/ticket-{ticket_id}-details" */}
          </>
        ) : (
          <>
            <Route
              path="/create-ticket"
              element={<LoginFormPage setUser={setUser} />}
            />
            <Route
              path="/tickets"
              element={<LoginFormPage setUser={setUser} />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
