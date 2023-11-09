import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from './AppLayout';
import Home from './Pages/Home';
import Login from './Pages/Authentication/Login';
import Signup from './Pages/Authentication/Signup';
import Cart from './Pages/Cart';
import OrderPlaced from './Pages/OrderPlaced';
import ItemCreate from './Pages/Admin/ItemCreate';
import DisplayOrders from './Pages/Admin/DisplayOrders';
import AdminSignup from './Pages/Authentication/AdminSignup';
import ManageRack from './Pages/Admin/ManageRack';
import History from './Pages/History';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/cart" element={<Cart />}/>
            <Route path="/order-placed" element={<OrderPlaced />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/admin-create" element={<ItemCreate />}/>
            <Route path="/admin-orders" element={<DisplayOrders />}/>
            <Route path="/admin-signup" element={<AdminSignup />}/>
            <Route path="/admin-manage" element={<ManageRack />}/>
            <Route path="/history" element={<History />}/>



          </Route>

        

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
