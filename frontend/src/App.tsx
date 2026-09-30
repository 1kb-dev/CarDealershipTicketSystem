import { useState } from "react";
import "./App.css";
import LoginFormPage from "./components/LoginFormPage";
import CreateTicketFormPage from "./components/CreateTicketFormPage";
import TicketTablePage from "./components/TicketTablePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroPage from "./components/IntroPage";

export interface User {
  userId: number;
  username: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginFormPage setUser={setUser} />} />

        {user ? (
          <>
            <Route
              path="/create-ticket"
              element={<CreateTicketFormPage user_id={user.userId} />}
            />
            <Route
              path="/tickets"
              element={
                <TicketTablePage
                  user_id={user.userId}
                  username={user.username}
                />
              }
            />
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
