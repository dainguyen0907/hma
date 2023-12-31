import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './views/login_page';
import { useCookies } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./components/proteced_route";
import MasterPage from './views/master_page';
import 'react-toastify/dist/ReactToastify.css';
import AreaSetting from "./views/sub_pages/motel_area_setting";

function App() {
  const [cookie, setCookie, removeCookie] = useCookies(['loginCode']);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'
          element={
            <ProtectedRoute isAllowed={cookie.loginCode}>
              <MasterPage cookie={cookie} removeCookie={removeCookie}>
              </MasterPage>
            </ProtectedRoute>}
        />
        <Route path='/login'
          element={
            <ProtectedRoute isAllowed={!cookie.loginCode} redirectTo={'/'}>
              <Login cookie={cookie} setCookie={setCookie} />
            </ProtectedRoute>
          } />
        <Route path='/motel/floor'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <AreaSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
      </Routes>
      <ToastContainer position="top-center"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        limit={3}
        pauseOnFocusLoss
        draggable
        theme="light" />
    </BrowserRouter>

  );
}

export default App;
