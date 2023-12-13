import React, { useState } from "react";
import Login from "./Components/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./Components/Main";
import Menubar from "./Components/Menubar";
import CreateEmployee from "./Components/Employee/CreateEmployee";
import HistoryTable from "./Components/HistoryTable";
import EmployeeTable from "./Components/Employee/EmployeeTable";
import EmployeeInformation from "./Components/Employee/EmployeeInformation";
import ModifyEmployee from "./Components/Employee/ModifyEmployee";
import ProviderTable from "./Components/Provider/ProviderTable";
import CreateProvider from "./Components/Provider/CreateProvider";
import ProviderInformation from "./Components/Provider/ProviderInformation";
import ModifyProvider from "./Components/Provider/ModifyProvider";
import ProviderType from "./Components/Provider/ProviderType";
import CustomerTable from "./Components/Customer/CustomerTable";
import CreateCustomer from "./Components/Customer/CreateCustomer";
import CustomerInformation from "./Components/Customer/CustomerInformation";
import ModifyCustomer from "./Components/Customer/ModifyCustomer";
import CustomerType from "./Components/Customer/CustomerType";
import PaymentTable from "./Components/Payment/PaymentTable";
import PaymentInformation from "./Components/Payment/PaymentInformation";
import CreatePayment from "./Components/Payment/CreatePayment";
import ModifyPayment from "./Components/Payment/ModifyPayment";
import ReceiptTable from "./Components/Receipt/ReceiptTable";
import ReceiptInformation from "./Components/Receipt/ReceiptInformation";
import ModifyReceipt from "./Components/Receipt/ModifyReceipt";
import CreateReceipt from "./Components/Receipt/CreateReceipt";
import PasswordChange from "./Components/PasswordChange";

function App() {
  const [openKeys, setOpenKeys] = useState("");
  const [selectedKeys, setSelectedKeys] = useState("");
  const [token, setToken] = useState("Bearer " + localStorage.getItem("jwt"));
  return (
    <div>
      <BrowserRouter>
        <Menubar
          openKeys={openKeys}
          setOpenKeys={setOpenKeys}
          selectedKeys={selectedKeys}
          token={token}
          setSelectedKeys={setSelectedKeys}
        />
        {localStorage.getItem("jwt")===null ? <Routes>
          <Route path="*" element={<Navigate to={"/"} />}/>
          <Route path="/" element={<Login setToken={setToken} />} />
        </Routes>
        :
        <Routes>
          <Route>
            <Route path="/" element={<Login setToken={setToken} />} />
            <Route
              path="/main"
              element={
                <Main
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/history"
              element={
                <HistoryTable
                  openKeys={openKeys}
                  setOpen={setOpenKeys}
                  setSelected={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/employee-table"
              element={
                <EmployeeTable
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/create-employee"
              element={
                <CreateEmployee
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/employee/information/:code"
              element={
                <EmployeeInformation
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/employee/modify/:code"
              element={
                <ModifyEmployee
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/provider-table"
              element={
                <ProviderTable
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/create-provider"
              element={
                <CreateProvider
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/provider/information/:code"
              element={
                <ProviderInformation
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/provider/modify/:code"
              element={
                <ModifyProvider
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/provider-type"
              element={
                <ProviderType
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/customer-table"
              element={
                <CustomerTable
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/create-customer"
              element={
                <CreateCustomer
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/customer/information/:code"
              element={
                <CustomerInformation
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/customer/modify/:code"
              element={
                <ModifyCustomer
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/customer-type"
              element={
                <CustomerType
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/payment-table"
              element={
                <PaymentTable
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/payment/information/:code"
              element={
                <PaymentInformation
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/create-payment"
              element={
                <CreatePayment
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/payment/modify/:code"
              element={
                <ModifyPayment
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/receipt-table"
              element={
                <ReceiptTable
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/receipt/information/:code"
              element={
                <ReceiptInformation
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/create-receipt"
              element={
                <CreateReceipt
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/receipt/modify/:code"
              element={
                <ModifyReceipt
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            <Route
              path="/change-password"
              element={
                <PasswordChange
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  setSelectedKeys={setSelectedKeys}
                  selectedKeys={selectedKeys}
                  token={token}
                />
              }
            />
            {/*<Route path='/provider-list' element={<ProviderList />}/>
          
         
          
          <Route path='/customer-type' element={<CustomerTypeList />}/>
          <Route path='/create-customer-type' element={<CreateCustomerType />}/>
          
          
          
          <Route path='/receipt-list' element={<ReceiptList/>}/>
          <Route path='/create-receipt' element={<CreateReceipt/>}/>
          <Route path='/receipt-information/*' element={<ReceiptInformation/>}/>
          <Route path='employee/information' element={<Information/>}/>
          
          */}
          </Route>
        </Routes>}
      </BrowserRouter>
    </div>
  );
}
export default App;
