import React from 'react';
import Login from './Components/Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from './Components/Main';
import Menubar from './Components/Menubar';
import CreateEmployee from './Components/Employee/CreateEmployee';
import HistoryTable from './Components/HistoryTable';
import EmployeeTable from './Components/Employee/EmployeeTable';
import EmployeeInformation from './Components/Employee/EmployeeInformation';
import ModifyEmployee from './Components/Employee/ModifyEmployee';
import ProviderTable from './Components/Provider/ProviderTable';
import CreateProvider from './Components/Provider/CreateProvider';

function App(){
  return(
    <div>
      <Menubar
      />
      <BrowserRouter>
        <Routes>
        <Route> 
          <Route path='/' element={<Login/>}/>
          <Route path='/main' element={<Main />}/> 
          <Route path='/history' element={<HistoryTable/>}/>
          <Route path='/employee-table' element={<EmployeeTable/>}/>
          <Route path='/create-employee' element={<CreateEmployee/>}/>
          <Route path='/employee/information/:code' element={<EmployeeInformation/>}/>
          <Route path='/employee/modify/:code' element={<ModifyEmployee/>}/>
          <Route path='/provider-table' element={<ProviderTable/>}/>
          <Route path='/create-provider' element={<CreateProvider/>}/>
          {/*<Route path='/provider-list' element={<ProviderList />}/>
          
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
          
          
          <Route path='employee/information' element={<Information/>}/>
          <Route path='/change-password' element={<PasswordChange/>}/>
          */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )

}
export default App;