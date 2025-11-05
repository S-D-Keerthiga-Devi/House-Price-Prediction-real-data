import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout'
import PropertyComparator from './components/PropertyComparator'
import Home from './components/Home'
import PriceTrends from './pages/smart_insights/PriceTrends'
import Login from './pages/Login'
import store from './store/store'
import { Provider } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import Dashboard from './pages/Dashboard'
import PropertyValuation from './pages/buyers/PropertyValuation'
import RentAgreement from './pages/buyers/RentAgreement'
import AuctionedProperty from './pages/AuctionedProperty'
import EscrowServices from './pages/buyers/EscrowServices'
import AdvertiseWithUs from './pages/developers/AdvertiseWithUs'
import EmergingLocalities from './pages/smart_insights/EmergingLocalities'
import AffordableProjects from './pages/AffordableProjects'
import ChannelPartners from './pages/dealers/ChannelPartners'
import Comparator from './pages/buyers/Comparator'
import ContactDevelopers from './pages/dealers/ContactDevelopers'
import TrendingLocalities from './pages/TrendingLocalities'
import DataInsights from './pages/DataInsights'
import DealerConnect from './pages/dealers/DealerConnect'
import ExtraSpaceComfort from './pages/ExtraSpaceComfort'
import HomeInterior from './pages/owners/HomeInterior'
import SpecialAuctionDeals from './pages/SpecialAuctionDeals'
import PriceIncomeIndex from './pages/smart_insights/PriceIncomeIndex'
import KnowYourProperty from './pages/KnowYourProperty'
import Listings from './pages/dealers/Listings'
import ViewDetails from './pages/dealers/ViewDetails'
import TrendingDealers from './pages/TrendingDealers'
import Heatmaps from './pages/smart_insights/Heatmaps'
import HotSellingProjects from './pages/HotSellingProjects'
import PropertyLegalServices from './pages/owners/PropertyLegalServices'
import PropertyManagement from './pages/FacilityManagement'
import PropertyValidation from './pages/PropertyValidation'
import RegistrationDocs from './pages/dealers/RegistrationDocs'
import TrendingProjects from './pages/TrendingProjects'
import TrendingDevelopers from './pages/TrendingDevelopers'
import VentureInvestment from './pages/developers/VentureInvestment'
import MarketTrends from './pages/MarketTrends'
import PostProperty from './pages/PostProperty'
import EMICalculator from './pages/buyers/EMICalculator'
import InteriorDesign from './pages/buyers/InteriorDesign'
import EmergingLocalitiesPage from './pages/smart_insights/EmergingLocalitiesPage'
import PriceIncomeIndexPage from './pages/smart_insights/PriceIncomeIndexPage'
import HeatmapsPage from './pages/smart_insights/HeatmapsPage'
import FractionalInvestment from './pages/investments/FractionalInvestment'
import Reit from './pages/investments/Reit'
import VentureInvestments from './pages/investments/VentureInvestments'
import HomeLoan from './pages/buyers/HomeLoan'
import { CityProvider } from './context/CityContext'

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
      <Route path="rent-agreement/:id" element={<RentAgreement />} />
      <Route path="auctioned-property" element={<AuctionedProperty />} />
      <Route path="escrow-services" element={<EscrowServices />} />
      <Route path="advertise-with-us" element={<AdvertiseWithUs />} />
      <Route path="emerging-localities" element={<CityProvider><EmergingLocalities /></CityProvider>} />
      <Route path="emerging-localities-page" element={<CityProvider><EmergingLocalitiesPage /></CityProvider>} />
      <Route path="fractional-investment" element={<FractionalInvestment />} />
      <Route path="affordable-projects" element={<AffordableProjects />} />
      <Route path="channel-partners" element={<ChannelPartners />} />
      <Route path="comparator" element={<Comparator />} />
      <Route path="contact-developers" element={<ContactDevelopers />} />
      <Route path="trending-localities" element={<CityProvider><TrendingLocalities /></CityProvider>} />
      <Route path="data-insights" element={<DataInsights />} />
      <Route path="dealer-connect" element={<DealerConnect />} />
      <Route path="extra-space-comfort" element={<ExtraSpaceComfort />} />
      <Route path="emi-calculator" element={<EMICalculator />} />
      <Route path="home-interior" element={<HomeInterior />} />
      <Route path="home-loan" element={<HomeLoan />} />
      <Route path="special-auction-deals" element={<SpecialAuctionDeals />} />
      <Route path="price-income-index" element={<CityProvider><PriceIncomeIndex /></CityProvider>} />
      <Route path="price-income-index-page" element={<CityProvider><PriceIncomeIndexPage /></CityProvider>} />
      <Route path="know-property" element={<KnowYourProperty />} />
      <Route path="listings" element={<CityProvider><Listings /></CityProvider>} />
      <Route path="property-details/:id" element={<ViewDetails />} />
      <Route path="trending-dealers" element={<TrendingDealers />} />
      <Route path="heatmaps" element={<CityProvider><Heatmaps /></CityProvider>} />
      <Route path="heatmaps-page" element={<CityProvider><HeatmapsPage /></CityProvider>} />
      <Route path="interior" element={<InteriorDesign />} />
      <Route path="market-trends" element={<MarketTrends />} />
      <Route path="hot-selling-projects" element={<HotSellingProjects />} />
      <Route path="property-legal" element={<PropertyLegalServices />} />
      <Route path="property-manage" element={<PropertyManagement />} />
      <Route path="post-property" element={<PostProperty />} />
      <Route path="property-validation" element={<PropertyValidation />} />
      <Route path="registration-docs" element={<RegistrationDocs />} />
      <Route path="reit" element={<Reit />} />
      <Route path="trending-projects" element={<TrendingProjects />} />
      <Route path="trending-developers" element={<TrendingDevelopers />} />
      <Route path="venture-invest" element={<VentureInvestment />} />
      <Route path="venture-investments" element={<VentureInvestments />} />
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
