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
import PropertyValuation from './pages/PropertyValuation'
import RentAgreement from './pages/RentAgreement'
import AuctionedProperty from './pages/AuctionedProperty'
import EscrowServices from './pages/EscrowServices'
import AdvertiseWithUs from './pages/AdvertiseWithUs'
import AreaDemographics from './pages/AreaDemographics'
import BudgetFriendly from './pages/BudgetFriendly'
import ChannelPartners from './pages/ChannelPartners'
import Comparator from './pages/Comparator'
import ContactDevelopers from './pages/ContactDevelopers'
import CoworkingSpaces from './pages/CoworkingSpaces'
import DataInsights from './pages/DataInsights'
import DealerConnect from './pages/DealerConnect'
import FamilyHomes from './pages/FamilyHomes'
import HomeInterior from './pages/HomeInterior'
import InvestmentProperties from './pages/InvestmentProperties'
import InvestmentReports from './pages/InvestmentReports'
import KnowYourProperty from './pages/KnowYourProperty'
import Listings from './pages/Listings'
import LuxuryCondos from './pages/LuxuryCondos'
import MarketAnalysis from './pages/MarketAnalysis'
import PremiumLocations from './pages/PremiumLocations'
import PropertyLegalServices from './pages/PropertyLegalServices'
import PropertyManagement from './pages/PropertyManagement'
import PropertyValidation from './pages/PropertyValidation'
import RegistrationDocs from './pages/RegistrationDocs'
import SmartHomes from './pages/SmartHomes'
import SustainableLiving from './pages/SustainableLiving'
import VentureInvestment from './pages/VentureInvestment'
import MarketTrends from './pages/MarketTrends'
import PostProperty from './pages/PostProperty'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path='login' element={<Login/>}/> 
      <Route index element={<Home />} />
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path="compare" element={<PropertyComparator />} />
      <Route path="price-trends" element={<PriceTrends />} />
      <Route path="property-valuation" element={<PropertyValuation />} />
      <Route path="rent-agreement" element={<RentAgreement />} />
      <Route path="auctioned-property" element={<AuctionedProperty />} />
      <Route path="escow-services" element={<EscrowServices />} />
      <Route path="advertise-with-us" element={<AdvertiseWithUs />} />
      <Route path="area-demographics" element={<AreaDemographics />} />
      <Route path="budget-friendly" element={<BudgetFriendly />} />
      <Route path="channel-partners" element={<ChannelPartners />} />
      <Route path="comparator" element={<Comparator />} />
      <Route path="contact-developers" element={<ContactDevelopers />} />
      <Route path="coworking" element={<CoworkingSpaces />} />
      <Route path="data-insights" element={<DataInsights />} />
      <Route path="dealer-connect" element={<DealerConnect />} />
      <Route path="family-homes" element={<FamilyHomes />} />
      <Route path="home-interior" element={<HomeInterior />} />
      <Route path="investment-properties" element={<InvestmentProperties />} />
      <Route path="investment-reports" element={<InvestmentReports />} />
      <Route path="know-property" element={<KnowYourProperty />} />
      <Route path="listings" element={<Listings />} />
      <Route path="luxury-condos" element={<LuxuryCondos />} />
      <Route path="market-analysis" element={<MarketAnalysis />} />
      <Route path="market-trends" element={<MarketTrends />} />
      <Route path="premium-locations" element={<PremiumLocations />} />
      <Route path="property-legal" element={<PropertyLegalServices />} />
      <Route path="property-manage" element={<PropertyManagement />} />
      <Route path="post-property" element={<PostProperty />} />
      <Route path="property-validation" element={<PropertyValidation />} />
      <Route path="registration-docs" element={<RegistrationDocs />} />
      <Route path="smart-homes" element={<SmartHomes />} />
      <Route path="sustainable-living" element={<SustainableLiving />} />
      <Route path="venture-invest" element={<VentureInvestment />} />
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
