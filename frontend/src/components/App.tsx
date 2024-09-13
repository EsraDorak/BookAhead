import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import { LoginProvider } from "./LoginContext";
import { OwnerProvider } from "./OwnerContext";
import RegisterSelection from "./RegisterSelection";
import Homepage from "./Homepage";
import RegisterUser from "./RegisterUser";
import OwnerRegister from "./RegisterOwner";
import OwnerHomePage from "./OwnerHomePage";
import RestaurantList from "./RestaurantList";
import TableSelect from "./TableSelect";
import Login from "./login";
import OwnerLogin from "./OwnerLogin";
import ProfilePage from "./ProfilePage";
import BlockedTables from "./BlockedTables";
import AddRestaurant from "./AddRestaurant";
import VerifyEmail from "./VerifyEmailPage";
import TableList from "./TableList";


export function App() {
  return (
    <LoginProvider>
      <OwnerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/register-selection" element={<RegisterSelection />} />
            <Route path="/user-register" element={<RegisterUser />} />
            <Route path="/owner-register" element={<OwnerRegister />} />
            <Route path="/owner-homepage" element={<OwnerHomePage />} />
            <Route path="/restaurants-page" element={<RestaurantList />} />
            <Route path="/table-User" element={<TableSelect />} />
            <Route path="/loginU" element={<Login />} />
            <Route path="/login-owner" element={<OwnerLogin />} />
            <Route path="/profile" element={<ProfilePage />} /> 
            <Route path="/blocked-tables" element={<BlockedTables />} />
            <Route path="/add-restaurant" element={<AddRestaurant />} />
            <Route path="/tables" element={<TableList />} /> 
            <Route path="/verify-email/:emailToken" element={<VerifyEmail />} /> 

          </Routes>
        </Router>
      </OwnerProvider> 
    </LoginProvider>
  );
}
