import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.tsx";
import SignInPage from "./components/SignInPage.tsx";
import Account from "./components/Account.tsx";
import SignUpPage from "./components/SignUpPage.tsx";
import SignUpAuthPage from "./components/SignUpAuthPage.tsx";
import UserPage from "./components/UserPage.tsx";
import RestorePage from "./components/RestorePage.tsx";
import RestoreAuthPage from "./components/RestoreAuthPage.tsx";
import Publications from "./components/Publications/Publications.tsx";
import PublicationDetail from "./components/Publications/PublicationDetail.tsx";
import Favorites from "./components/Favorites/Favorites.tsx";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signupauth" element={<SignUpAuthPage />} />
        <Route path="/account" element={<Account />} />

        <Route 
                  path="/user" 
                  element={
                    <ProtectedRoute>
                      <UserPage />
                    </ProtectedRoute>
                  } 
        />

        <Route path="/user" element={<UserPage />} />
        <Route path="/restore" element={<RestorePage />} />
        <Route path="/restoreauth" element={<RestoreAuthPage />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/publications/:id" element={<PublicationDetail />} />
        <Route path="/user/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;