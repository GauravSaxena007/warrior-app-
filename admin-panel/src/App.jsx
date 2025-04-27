import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Settings from './Components/Settings/Settings';
import Addcourses from './Components/Add-courses/Addcourses';
import Slider from './Components/Slider/Slider';
import Enquiries from './Components/Enquiries/Enquiries';
import Contactus from './Components/Contact-Us/contactus';
import FranchiseeManagement from './Components/Fra-Managment/FranchiseeManagement';
import Issuecerti from './Components/Issued-Certificate/Issuecerti';
import Transac from './Components/Transaction/transac';
import CertificatesV3 from './Components/Certificates/CertificatesV3';
import CourierDet from './Components/CourierDet/CourierDet';
import FraCer from './Components/FraCer/FraCer';
import Dashboard from './Components/Dashboard/Dashboard';
import Reeladmin from './Components/Reeladmin/Reeladmin';
import CardsAdmin from './Components/CardsAdmin/CardsAdmin';
import PrivateRouteadminpanel from './Components/PrivateRouteadminpanel';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="content" style={{ marginLeft: '350px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PrivateRouteadminpanel>
                  <Dashboard />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRouteadminpanel>
                  <Settings />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/addcourses"
              element={
                <PrivateRouteadminpanel>
                  <Addcourses />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/slider"
              element={
                <PrivateRouteadminpanel>
                  <Slider />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/enquiry"
              element={
                <PrivateRouteadminpanel>
                  <Enquiries />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/contactuss"
              element={
                <PrivateRouteadminpanel>
                  <Contactus />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/management"
              element={
                <PrivateRouteadminpanel>
                  <FranchiseeManagement />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/issuecerti"
              element={
                <PrivateRouteadminpanel>
                  <Issuecerti />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/transac"
              element={
                <PrivateRouteadminpanel>
                  <Transac />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/certificatesv3"
              element={
                <PrivateRouteadminpanel>
                  <CertificatesV3 />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/courdetail"
              element={
                <PrivateRouteadminpanel>
                  <CourierDet />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/fracer"
              element={
                <PrivateRouteadminpanel>
                  <FraCer />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/reel"
              element={
                <PrivateRouteadminpanel>
                  <Reeladmin />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/cardsadmin"
              element={
                <PrivateRouteadminpanel>
                  <CardsAdmin />
                </PrivateRouteadminpanel>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;