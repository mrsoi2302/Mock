import React, { useState } from 'react';
import Login from './Components/Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from './Components/Main';
import Menubar from './Components/Menubar';
import ProviderList from './Components/Provider/ProviderList';
import CreateProvider from './Components/Provider/CreateProvider';
import CustomerList from './Components/Customer/CustomerList';
import ProviderInformation from './Components/Provider/ProviderInformation';
import CreateCustomer from './Components/Customer/CreateCustomer';
import CustomerTypeList from './Components/Customer/CustomerType/CustomerTypeList';
import CreateCustomerType from './Components/Customer/CustomerType/CreateCustomerType';
import CustomerInformation from './Components/Customer/CustomerInformation';
import PaymentList from './Components/Payment/PaymentList';
import CreatePayment from './Components/Payment/CreatePayment';
import PaymentInformation from './Components/Payment/PaymentInformation';
import ReceiptList from './Components/Receipt/ReceiptList';
import CreateReceipt from './Components/Receipt/CreateReceipt';
import ReceiptInformation from './Components/Receipt/ReceiptInformation';
import EmployeeList from './Components/Employee/EmployeeList';
import CreateEmployee from './Components/Employee/CreateEmployee';
import Information from './Components/Information';
import PasswordChange from './Components/PasswordChange';
import HistoryTable from './Components/HistoryTable';

function App(){
  return(
    <div>
      <Menubar
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/main' element={<Main />}/>
          <Route path='/provider-list' element={<ProviderList />}/>
          <Route path='/create-provider' element={<CreateProvider/>}/>
          <Route path='/provider-information/*' element={<ProviderInformation />}/>
          <Route path='/customer-list' element={<CustomerList />}/>
          <Route path='/create-customer' element={<CreateCustomer />}/>
          <Route path='/customer-information/*' element={<CustomerInformation />}/>
          <Route path='/customer-type' element={<CustomerTypeList />}/>
          <Route path='/create-customer-type' element={<CreateCustomerType />}/>
          <Route path='/payment-list' element={<PaymentList/>}/>
          <Route path='/create-payment' element={<CreatePayment/>}/>
          <Route path='/payment-information/*' element={<PaymentInformation/>}/>
          <Route path='/receipt-list' element={<ReceiptList/>}/>
          <Route path='/create-receipt' element={<CreateReceipt/>}/>
          <Route path='/receipt-information/*' element={<ReceiptInformation/>}/>
          <Route path='/employee-list' element={<EmployeeList/>}/>
          <Route path='/create-employee' element={<CreateEmployee/>}/>
          <Route path='/information' element={<Information/>}/>
          <Route path='/change-password' element={<PasswordChange/>}/>
          <Route path='/history' element={<HistoryTable/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )

}
export default App;