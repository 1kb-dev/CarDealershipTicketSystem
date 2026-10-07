import { useState } from "react";
import "./App.css";
import IntroPage from "./components/IntroPage";
import LoginFormPage from "./components/LoginFormPage";
import RegisterFormPage from "./components/RegisterFormPage";
import CreateTicketFormPage from "./components/CreateTicketFormPage";
import TicketTablePage from "./components/TicketTablePage";
import ServiceLevelAgreement from "./components/ServiceLevelAgreement";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckSession from "./services/SessionService";

export interface User {
  userId: number;
  email: string;
  role: string;
}

const sessionUser = await CheckSession().catch(() => null);

function App() {
  const [user, setUser] = useState<User | null>(
    sessionUser
      ? {
          userId: sessionUser.userId,
          email: sessionUser.email,
          role: sessionUser.role,
        }
      : null,
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/sla" element={<ServiceLevelAgreement />} />
        <Route path="/login" element={<LoginFormPage setUser={setUser} />} />

        {user ? (
          <>
            {user.role === "admin" ? (
              <Route path="/register" element={<RegisterFormPage />} />
            ) : (
              <Route
                path="/register"
                element={<LoginFormPage setUser={setUser} />}
              />
            )}

            <Route
              path="/create-ticket"
              element={<CreateTicketFormPage user_id={user.userId} />}
            />
            <Route path="/tickets" element={<TicketTablePage user={user} />} />
            <Route
              path="/ticket-details"
              element={
                <TicketDetailsPage go_back={() => window.history.back()} />
              }
            />
          </>
        ) : (
          <>
            <Route
              path="/register"
              element={<LoginFormPage setUser={setUser} />}
            />
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
