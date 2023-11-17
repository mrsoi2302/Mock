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
import ProviderInformation from './Components/Provider/ProviderInformation';
import ModifyProvider from './Components/Provider/ModifyProvider';
import ProviderType from './Components/Provider/ProviderType';
import CustomerTable from './Components/Customer/CustomerTable';
import CreateCustomer from './Components/Customer/CreateCustomer';
import CustomerInformation from './Components/Customer/CustomerInformation';
import ModifyCustomer from './Components/Customer/ModifyCustomer';
import CustomerType from './Components/Customer/CustomerType';
import PaymentTable from './Components/Payment/PaymentTable';
import PaymentInformation from './Components/Payment/PaymentInformation';
import CreatePayment from './Components/Payment/CreatePayment';
import ModifyPayment from './Components/Payment/ModifyPayment';
import ReceiptTable from './Components/Receipt/ReceiptTable';
import ReceiptInformation from './Components/Receipt/ReceiptInformation';
import ModifyReceipt from './Components/Receipt/ModifyReceipt';
import CreateReceipt from './Components/Receipt/CreateReceipt';
import PasswordChange from './Components/PasswordChange';

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
          <Route path='/provider/information/:code' element={<ProviderInformation />}/>
          <Route path='/provider/modify/:code' element={<ModifyProvider/>}/>
          <Route path='/provider-type' element={<ProviderType/>}/>
          <Route path='/customer-table' element={<CustomerTable/>}/>
          <Route path='/create-customer' element={<CreateCustomer />}/>
          <Route path='/customer/information/:code' element={<CustomerInformation/>}/>
          <Route path='/customer/modify/:code' element={<ModifyCustomer/>}/>
          <Route path='/customer-type' element={<CustomerType/>}/>
          <Route path='/payment-table' element={<PaymentTable/>}/>
          <Route path='/payment/information/:code' element={<PaymentInformation/>}/>
          <Route path='/create-payment' element={<CreatePayment/>}/>
          <Route path='/payment/modify/:code' element={<ModifyPayment/>}/>  
          <Route path='/receipt-table' element={<ReceiptTable/>}/>
          <Route path='/receipt/information/:code' element={<ReceiptInformation/>}/>
          <Route path='/create-receipt' element={<CreateReceipt/>}/>
          <Route path='/receipt/modify/:code' element={<ModifyReceipt/>}/>  
          <Route path='/change-password' element={<PasswordChange/>}/>
          {/*<Route path='/provider-list' element={<ProviderList />}/>
          
         
          
          <Route path='/customer-type' element={<CustomerTypeList />}/>
          <Route path='/create-customer-type' element={<CreateCustomerType />}/>
          
          
          
          <Route path='/receipt-list' element={<ReceiptList/>}/>
          <Route path='/create-receipt' element={<CreateReceipt/>}/>
          <Route path='/receipt-information/*' element={<ReceiptInformation/>}/>
          <Route path='employee/information' element={<Information/>}/>
          
          */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App;