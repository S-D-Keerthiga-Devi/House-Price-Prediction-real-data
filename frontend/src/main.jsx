import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout'
import PropertyComparator from './components/PropertyComparator'
import Home from './components/Home'
import PriceTrends from './components/PriceTrends'
import Login from './pages/Login'
import store from './store/store'
import { Provider } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import Dashboard from './pages/Dashboard'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path='login' element={<Login/>}/> 
      <Route index element={<Home />} />
      <Route path='email-verify' element={<EmailVerify/>}/>
      <Route path='reset-password' element={<ResetPassword/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path="compare" element={<PropertyComparator />} />
      <Route path="price-trends" element={<PriceTrends />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer/>
    <RouterProvider router={router}/>
    </Provider>  
  </StrictMode>,
)
