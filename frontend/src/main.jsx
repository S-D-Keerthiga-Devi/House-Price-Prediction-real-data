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
import EmergingLocalities from './pages/EmergingLocalities'
import AffordableProjects from './pages/AffordableProjects'
import ChannelPartners from './pages/ChannelPartners'
import Comparator from './pages/Comparator'
import ContactDevelopers from './pages/ContactDevelopers'
import TrendingLocalities from './pages/TrendingLocalities'
import DataInsights from './pages/DataInsights'
import DealerConnect from './pages/DealerConnect'
import ExtraSpaceComfort from './pages/ExtraSpaceComfort'
import HomeInterior from './pages/HomeInterior'
import SpecialAuctionDeals from './pages/SpecialAuctionDeals'
import PriceIncomeIndex from './pages/PriceIncomeIndex'
import KnowYourProperty from './pages/KnowYourProperty'
import Listings from './pages/Listings'
import TrendingDealers from './pages/TrendingDealers'
import Heatmaps from './pages/Heatmaps'
import HotSellingProjects from './pages/HotSellingProjects'
import PropertyLegalServices from './pages/PropertyLegalServices'
import PropertyManagement from './pages/PropertyManagement'
import PropertyValidation from './pages/PropertyValidation'
import RegistrationDocs from './pages/RegistrationDocs'
import TrendingProjects from './pages/TrendingProjects'
import TrendingDevelopers from './pages/TrendingDevelopers'
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
      <Route path="emerging-localities" element={<EmergingLocalities />} />
      <Route path="affordable-projects" element={<AffordableProjects />} />
      <Route path="channel-partners" element={<ChannelPartners />} />
      <Route path="comparator" element={<Comparator />} />
      <Route path="contact-developers" element={<ContactDevelopers />} />
      <Route path="trending-localities" element={<TrendingLocalities />} />
      <Route path="data-insights" element={<DataInsights />} />
      <Route path="dealer-connect" element={<DealerConnect />} />
      <Route path="extra-space-comfort" element={<ExtraSpaceComfort />} />
      <Route path="home-interior" element={<HomeInterior />} />
      <Route path="special-auction-deals" element={<SpecialAuctionDeals />} />
      <Route path="price-income-index" element={<PriceIncomeIndex />} />
      <Route path="know-property" element={<KnowYourProperty />} />
      <Route path="listings" element={<Listings />} />
      <Route path="trending-dealers" element={<TrendingDealers />} />
      <Route path="heatmaps" element={<Heatmaps />} />
      <Route path="market-trends" element={<MarketTrends />} />
      <Route path="hot-selling-projects" element={<HotSellingProjects />} />
      <Route path="property-legal" element={<PropertyLegalServices />} />
      <Route path="property-manage" element={<PropertyManagement />} />
      <Route path="post-property" element={<PostProperty />} />
      <Route path="property-validation" element={<PropertyValidation />} />
      <Route path="registration-docs" element={<RegistrationDocs />} />
      <Route path="trending-projects" element={<TrendingProjects />} />
      <Route path="trending-developers" element={<TrendingDevelopers />} />
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
