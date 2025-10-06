import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, Search, MapPin } from 'lucide-react';
import { createRentAgreement, updateRentAgreement, getRentAgreementById } from '../../services/rentAgreementService';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FormControl, Select, MenuItem } from "@mui/material";

const RentAgreement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const { status: isAuthenticated } = useSelector(state => state.auth);
  const [authChecked, setAuthChecked] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    if (!authChecked && !isAuthenticated) {
      toast.error("Please login to access rent agreement");
      navigate('/login', { state: { from: location.pathname } });
      setAuthChecked(true);
    }

    // If ID is provided, fetch the agreement data
    if (id) {
      fetchAgreementData(id);
      setViewMode(true);
    }
  }, [isAuthenticated, navigate, location.pathname, authChecked, id]);
  
  // Fetch agreement data by ID
  const fetchAgreementData = async (agreementId) => {
    try {
      setLoading(true);
      console.log('Fetching agreement data for ID:', agreementId);
      const response = await getRentAgreementById(agreementId);

      console.log('API Response:', response);

      if (response && response.status === 200 && response.data) {
        // The backend returns data in response.data.rentAgreement format
        const agreementData = response.data.rentAgreement;

        if (!agreementData) {
          throw new Error('No agreement data found in response');
        }

        console.log('Agreement data:', agreementData);

        // Create a properly structured formData object with default values for any missing fields
        const updatedFormData = {
          agreementCity: agreementData.agreementCity || 'Gurgaon',
          agreementType: agreementData.agreementType || 'Rental Agreement',
          executionDate: agreementData.executionDate || '3 Oct 2025',
          landlords: agreementData.landlords && agreementData.landlords.length > 0 ? agreementData.landlords : [{
            title: 'Mr.',
            name: '',
            parentName: '',
            contactNumber: '',
            email: '',
            pan: '',
            aadhaar: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            city: '',
            pincode: ''
          }],
          tenants: agreementData.tenants && agreementData.tenants.length > 0 ? agreementData.tenants : [{
            title: 'Mr.',
            name: '',
            parentName: '',
            contactNumber: '',
            email: '',
            pan: '',
            aadhaar: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            city: '',
            pincode: ''
          }],
          propertyAddress: agreementData.propertyAddress || '',
          leasePeriod: agreementData.leasePeriod || '11',
          rentAmount: agreementData.rentAmount || '',
          rentType: agreementData.rentType || 'Monthly',
          rentPaymentDay: agreementData.rentPaymentDay || '',
          rentIncrement: agreementData.rentIncrement || '',
          refundableDeposit: agreementData.refundableDeposit || '',
          noticePeriod: agreementData.noticePeriod || '',
          lockInPeriod: agreementData.lockInPeriod || '',
          utilities: agreementData.utilities || {
            ac: 0,
            aircooler: 0,
            bed: 0,
            chair: 0,
            cupboard: 0,
            curtain: 0,
            electricGeyser: 0,
            fan: 0,
            gasGeyser: 0,
            refrigerator: 0,
            sofa: 0,
            table: 0,
            tubeLight: 0,
            tv: 0,
            washingMachine: 0,
            watercooler: 0
          }
        };

        console.log('Updated form data:', updatedFormData);
        setFormData(updatedFormData);
        setShowPreview(true);
      } else {
        console.error('Invalid response structure:', response);
        toast.error('Failed to fetch rent agreement details');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching agreement:', error);
      toast.error(`Error fetching rent agreement details: ${error.message || 'Unknown error'}`);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Get current date in format "DD MMM YYYY"
  const getCurrentDate = () => {
    const date = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Cities from OpenStreetMap API
  const [cities, setCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const cityDropdownRef = useRef(null);

  // Get default location from localStorage (same as in Location.jsx)
  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity") || localStorage.getItem("detectedCity") || "";
    if (storedCity && !formData.agreementCity) {
      setFormData(prev => ({ ...prev, agreementCity: storedCity }));
    }
  }, []);

  // Fetch cities from OpenStreetMap API
  const fetchCities = async (query) => {
    setIsLoadingCities(true);
    try {
      // Complete list of Indian cities A-Z
      const allIndianCities = [
        'Agartala', 'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 'Alwar', 'Ambala', 'Amravati', 'Amritsar', 'Asansol', 'Aurangabad',
        'Bangalore', 'Bareilly', 'Bathinda', 'Belgaum', 'Bellary', 'Bhagalpur', 'Bharatpur', 'Bhavnagar', 'Bhilai', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur', 'Bokaro', 'Brahmapur',
        'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack',
        'Darbhanga', 'Dehradun', 'Delhi', 'Dhanbad', 'Dibrugarh', 'Dimapur', 'Durgapur',
        'Erode', 'Faridabad', 'Firozabad', 'Gandhinagar', 'Gangtok', 'Gaya', 'Ghaziabad', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Gurugram', 'Guwahati', 'Gwalior',
        'Haldwani', 'Haridwar', 'Hisar', 'Howrah', 'Hubballi-Dharwad', 'Hyderabad',
        'Imphal', 'Indore', 'Itanagar', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur', 'Jorhat',
        'Kadapa', 'Kakinada', 'Kalyan-Dombivli', 'Kanpur', 'Karnal', 'Kavaratti', 'Kochi', 'Kohima', 'Kolhapur', 'Kolkata', 'Kollam', 'Kota', 'Kozhikode',
        'Kurnool', 'Kurukshetra',
        'Latur', 'Lucknow', 'Ludhiana',
        'Madurai', 'Mangalore', 'Mathura', 'Meerut', 'Mirzapur', 'Moradabad', 'Mumbai', 'Muzaffarnagar', 'Muzaffarpur', 'Mysore',
        'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nellore', 'New Delhi', 'Noida',
        'Pali', 'Panaji', 'Panipat', 'Parbhani', 'Pathankot', 'Patiala', 'Patna', 'Pondicherry', 'Port Blair', 'Pune',
        'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Ratlam', 'Rewa', 'Rohtak', 'Rourkela',
        'Sagar', 'Saharanpur', 'Salem', 'Sangli', 'Satara', 'Satna', 'Secunderabad', 'Shahjahanpur', 'Shillong', 'Shimla', 'Siliguri', 'Silvassa', 'Solapur', 'Srinagar', 'Surat', 'Surathkal',
        'Thane', 'Thanjavur', 'Thiruvananthapuram', 'Thrissur', 'Tinsukia', 'Tiruchirapalli', 'Tirunelveli', 'Tirupati', 'Tiruppur', 'Tiruvottiyur', 'Tumkur',
        'Udaipur', 'Ujjain', 'Ulhasnagar', 'Vadodara', 'Varanasi', 'Vellore', 'Vijayawada', 'Visakhapatnam', 'Warangal'
      ];

      // If query is empty or short, show all cities
      if (!query || query.length < 2) {
        setCities(allIndianCities);
        setIsLoadingCities(false);
        return;
      }

      // For specific queries, filter the list and also search using OpenStreetMap API
      const filteredCities = allIndianCities.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      );

      // Also search using OpenStreetMap API for more results
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}+India&addressdetails=1&limit=50&countrycodes=in`
      );
      const data = await response.json();

      // Extract city names from the response
      const cityNames = data
        .map(item => {
          // Try to get the city name from address details
          if (item.address) {
            return item.address.city ||
              item.address.town ||
              item.address.village ||
              item.address.hamlet ||
              item.address.county ||
              item.address.state_district;
          }
          // Fallback to display name (first part)
          return item.display_name?.split(',')[0];
        })
        .filter(city => city !== null && city !== undefined);

      // Combine filtered cities with API results, remove duplicates and sort alphabetically
      const combinedCities = [...filteredCities, ...cityNames];
      const uniqueCities = [...new Set(combinedCities)].sort((a, b) => a.localeCompare(b));
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback to complete list if API fails
      const fallbackCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
        'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Gurgaon', 'Gurugram',
        'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal'
      ].sort((a, b) => a.localeCompare(b));
      setCities(fallbackCities);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Debounce function for API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCities(cityQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [cityQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities based on search query
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(cityQuery.toLowerCase())
  );

  const [formData, setFormData] = useState({
    agreementCity: '',
    agreementType: 'Rental Agreement',
    executionDate: getCurrentDate(),
    landlords: [{
      title: 'Mr.',
      name: '',
      parentName: '',
      contactNumber: '',
      email: '',
      pan: '',
      aadhaar: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      pincode: ''
    }],

    tenants: [{
      title: 'Mr.',
      name: '',
      parentName: '',
      contactNumber: '',
      email: '',
      pan: '',
      aadhaar: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      pincode: ''
    }],

    propertyAddress: '',
    leasePeriod: '11',
    rentAmount: '',
    rentType: 'Monthly',
    rentPaymentDay: '',
    rentIncrement: '',
    refundableDeposit: '',
    noticePeriod: '',
    lockInPeriod: '',

    utilities: {
      ac: 0,
      aircooler: 0,
      bed: 0,
      chair: 0,
      cupboard: 0,
      curtain: 0,
      electricGeyser: 0,
      fan: 0,
      gasGeyser: 0,
      refrigerator: 0,
      sofa: 0,
      table: 0,
      tubeLight: 0,
      tv: 0,
      washingMachine: 0,
      watercooler: 0
    }
  });

  const handleSubmit = async () => {
    // Skip validation in view mode
    if (viewMode) {
      return;
    }

    // Validate required fields
    const requiredFields = [
      'propertyAddress', 'leasePeriod', 'rentAmount',
      'rentPaymentDay', 'rentIncrement', 'refundableDeposit',
      'noticePeriod', 'lockInPeriod'
    ];

    const isFormValid = requiredFields.every(field => formData[field] !== '');

    if (!isFormValid) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate landlord and tenant details
    const landlordValid = formData.landlords.every(landlord =>
      landlord.name && landlord.parentName && landlord.contactNumber &&
      landlord.email && landlord.pan && landlord.aadhaar &&
      landlord.addressLine1 && landlord.state && landlord.city && landlord.pincode
    );

    const tenantValid = formData.tenants.every(tenant =>
      tenant.name && tenant.parentName && tenant.contactNumber &&
      tenant.email && tenant.pan && tenant.aadhaar &&
      tenant.addressLine1 && tenant.state && tenant.city && tenant.pincode
    );

    if (!landlordValid || !tenantValid) {
      toast.error('Please fill all landlord and tenant details');
      return;
    }

    setShowPreview(true);
  };

  const saveAgreement = async (status = 'draft') => {
    try {
      setLoading(true);
      const agreementData = {
        ...formData,
        status
      };

      const response = await createRentAgreement(agreementData);

      if (response && response.status === 200 && response.data && response.data.success) {
        toast.success(`Rent agreement ${status === 'completed' ? 'created' : 'saved as draft'} successfully`);
        // Always redirect to dashboard after saving (both draft and completed)
        navigate('/dashboard');
      } else {
        throw new Error(response?.data?.message || 'Failed to save agreement');
      }

      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to save agreement');
      console.error('Error saving agreement:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    saveAgreement('draft');
  };

  const updateLandlord = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      landlords: prev.landlords.map((l, i) =>
        i === index ? { ...l, [field]: value } : l
      )
    }));
  };

  const updateTenant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      tenants: prev.tenants.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    }));
  };

  const addLandlord = () => {
    setFormData(prev => ({
      ...prev,
      landlords: [...prev.landlords, {
        title: 'Mr.', name: '', parentName: '', contactNumber: '',
        email: '', pan: '', aadhaar: '', addressLine1: '',
        addressLine2: '', state: '', city: '', pincode: ''
      }]
    }));
  };

  const removeLandlord = (index) => {
    if (formData.landlords.length > 1) {
      setFormData(prev => ({
        ...prev,
        landlords: prev.landlords.filter((_, i) => i !== index)
      }));
    }
  };

  const addTenant = () => {
    setFormData(prev => ({
      ...prev,
      tenants: [...prev.tenants, {
        title: 'Mr.', name: '', parentName: '', contactNumber: '',
        email: '', pan: '', aadhaar: '', addressLine1: '',
        addressLine2: '', state: '', city: '', pincode: ''
      }]
    }));
  };

  const removeTenant = (index) => {
    if (formData.tenants.length > 1) {
      setFormData(prev => ({
        ...prev,
        tenants: prev.tenants.filter((_, i) => i !== index)
      }));
    }
  };

  const updateUtility = (item, delta) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [item]: Math.max(0, prev.utilities[item] + delta)
      }
    }));
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 mt-20">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl">
          <div className="border-8 border-double border-blue-900 p-8">
            <div className="text-center mb-8 border-b-4 border-blue-900 pb-4">
              <div className="text-sm text-gray-600 mb-2">GOVERNMENT OF INDIA</div>
              <h1 className="text-3xl font-bold text-blue-900">LEASE DEED</h1>
              <div className="text-sm text-gray-600 mt-2">(Rent Agreement on Stamp Paper)</div>
            </div>

            <div className="mb-6 text-center">
              <p className="text-gray-700">
                This Lease Deed/Rent Agreement is executed at <strong>{formData.agreementCity}</strong> on day, <strong>{formData.executionDate}</strong>.
              </p>
            </div>

            <div className="text-center font-bold text-lg mb-6 text-blue-900">BETWEEN</div>

            {formData.landlords.map((landlord, idx) => (
              <div key={idx} className="mb-6 p-4 bg-blue-50 rounded">
                <p className="text-gray-800 leading-relaxed">
                  <strong>{landlord.title} {landlord.name}</strong>, S/O <strong>{landlord.parentName}</strong>,
                  having contact number <strong>+91-{landlord.contactNumber}</strong>,
                  Email Id: <strong>{landlord.email}</strong>,
                  PAN: <strong>{landlord.pan}</strong>,
                  UID(Aadhaar No.): <strong>{landlord.aadhaar}</strong>,
                  residing at <strong>{landlord.addressLine1}, {landlord.addressLine2}, {landlord.city}, {landlord.state}, {landlord.pincode}</strong>
                  {idx === 0 ? ' (Hereinafter called the Lessor-1 and/or the First Party)' : ` (Lessor-${idx + 1})`}
                </p>
              </div>
            ))}

            <div className="text-center font-bold text-lg my-6 text-blue-900">AND</div>

            {formData.tenants.map((tenant, idx) => (
              <div key={idx} className="mb-6 p-4 bg-blue-50 rounded">
                <p className="text-gray-800 leading-relaxed">
                  <strong>{tenant.title} {tenant.name}</strong>, S/O <strong>{tenant.parentName}</strong>,
                  having contact number <strong>+91-{tenant.contactNumber}</strong>,
                  Email Id: <strong>{tenant.email}</strong>,
                  PAN: <strong>{tenant.pan}</strong>,
                  UID(Aadhaar No.): <strong>{tenant.aadhaar}</strong>,
                  residing at <strong>{tenant.addressLine1}, {tenant.addressLine2}, {tenant.city}, {tenant.state}, {tenant.pincode}</strong>
                  {idx === 0 ? ' (Hereinafter called the Lessee-1 and/or Second Party)' : ` (Lessee-${idx + 1})`}
                </p>
              </div>
            ))}

            <p className="mb-4 text-gray-700">
              For the purpose hereof, the Lessor-1 shall be collectively referred to as Lessor and Lessee-1 shall be collectively referred to as Lessee
            </p>
            <p className="mb-6 text-gray-700">
              The Lessor and Lessee are referred to collectively as the <strong>"Parties"</strong> and individually the <strong>"Party"</strong> as the context may require.
            </p>

            <div className="mb-6 p-4 bg-gray-50 rounded">
              <p className="text-gray-800 mb-4">
                Whereas on the request of the Lessee, the Lessor has agreed to let out the Demised Premises to the LESSEE,
                and the LESSEE has agreed to take it on rent for a period of <strong>{formData.leasePeriod} Month(s)</strong> w.e.f.
                the Agreement Start Date for its bonafide Residential use. Whereas the LESSOR has represented that the Demised Premises
                is free from all encumbrances and the LESSOR has a clean and unrestricted right to the Demised Premises.
              </p>
            </div>

            <div className="font-bold text-lg mb-4 text-blue-900">Now, these present witnesses as under:</div>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  1. That the second party shall pay the monthly rent of Rs <strong>{formData.rentAmount} {formData.rentType}</strong> in respect of the Demised Premises located at <strong>{formData.propertyAddress}</strong>.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  2. The rent shall be paid per month in advance through advance rental on or before the <strong>{formData.rentPaymentDay}th</strong> day of each English calendar month. In case of TDS deduction, the Lessee shall furnish the TDS certificate to the Lessor at the end of each calendar quarter.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  3. That after the expiry of the Lease term, monthly rent shall be increased at the escalation of <strong>{formData.rentIncrement}%</strong> or at mutually agreed by both parties at the time of renewal.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  4. That the second party has deposited a sum of Rs <strong>{formData.refundableDeposit}</strong> as interest free refundable security deposit, which will be refunded within seven (7) days of the Lessee vacating the Demised Premises after deducting any outstanding rent, electricity, water, sewerage and maintenance charges.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  5. The notice period to be served by either party would be of <strong>{formData.noticePeriod} Day(s)</strong>. Either the LESSOR or the LESSEE may terminate this agreement without assigning any reasons whatsoever by giving one month's advance notice to the other party.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  6. The Lessor will ensure that all outstanding bills/charges on the above said demised premises on account of electricity, water, and any other incidentals prior to the start of lease from are settled and paid.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  7. <strong>Lock in period:</strong> Both the parties have agreed to set a lock-in period of <strong>{formData.lockInPeriod} Month(s)</strong> during which neither the Lessor shall ask the Lessee to vacate the premises, nor the Lessee shall vacate the premises on his/her own during the Lock-in period.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  8. It is further agreed between the parties that in case of any dispute the {formData.agreementCity} court shall have the exclusive jurisdiction over the disputes.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  9. That the electricity and water charges after the start of the lease will be paid timely and regularly every month by the Lessee as per actual bills provided by the service provider.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  10. That the Lessor shall hand over the Premises to the Lessee in a habitable condition. The detailed list of items provided as part of this lease is enumerated as ANNEXURE 1 to this Deed.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  11. The Lessee shall be responsible for any damage caused to the fixtures, fittings, and other items provided by the Lessor, except for normal wear and tear.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  12. The Lessee shall not make any structural changes or additions to the property without prior written consent from the Lessor.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  13. The Lessee shall not sub-let the premises or any part thereof to any third party without the prior written consent of the Lessor.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  14. The Lessee shall use the premises for residential purposes only and shall not use it for any illegal or immoral activities or cause any nuisance to the neighbors.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  15. The Lessor shall be responsible for major structural repairs, while the Lessee shall be responsible for minor repairs and maintenance of the premises.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  16. In case of breach of any terms of this agreement by the Lessee, the Lessor shall have the right to terminate this agreement and take possession of the premises after giving a notice of 15 days to the Lessee.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  17. The Lessee shall bear all expenses related to electricity, water, gas, telephone, internet, and other utilities during the tenancy period.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  18. On expiry of the lease period, the Lessee shall hand over the possession of the premises to the Lessor in the same condition as it was at the time of taking possession, subject to normal wear and tear.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  19. The Lessee shall provide the receipt of rent payment to the Lessor on demand.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  20. This agreement shall be governed by and construed in accordance with the laws of India.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  21. In case of any dispute between the parties, they shall first try to resolve it through mutual consultation. If not resolved, the matter shall be referred to arbitration.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  22. <strong>Force Majeure:</strong> Neither party shall be liable for any failure or delay in performing their obligations under this agreement if such failure or delay is due to circumstances beyond their reasonable control, including but not limited to acts of God, war, riot, fire, flood, or government action.
                </p>
              </div>

              <div className="p-3 bg-white border-l-4 border-blue-900">
                <p className="text-gray-800">
                  23. Any notice required to be given under this agreement shall be in writing and shall be deemed to have been duly given when delivered by hand or sent by registered post to the address of the other party mentioned in this agreement.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded">
              <h2 className="text-xl font-bold text-center mb-4 text-blue-900">ANNEXURE 1</h2>
              <p className="mb-4 text-gray-800">
                Items provided by the LESSOR at the time of execution of Lease Deed between the LESSOR and the LESSEE are as follows:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData.utilities).filter(([_, qty]) => qty > 0).map(([item, qty]) => (
                  <div key={item} className="flex justify-between p-2 bg-white rounded border">
                    <span className="capitalize text-gray-700">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <strong className="text-blue-900">{qty}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-t-2 border-blue-900 pt-2 mt-16">
                  <p className="font-bold text-blue-900">LESSOR</p>
                  <p className="text-sm text-gray-600">First Party</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-blue-900 pt-2 mt-16">
                  <p className="font-bold text-blue-900">LESSEE</p>
                  <p className="text-sm text-gray-600">Second Party</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2 mt-16">
                  <p className="font-bold text-gray-700">WITNESS 1</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2 mt-16">
                  <p className="font-bold text-gray-700">WITNESS 2</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              <p>This is a computer-generated document.</p>
            </div>
          </div>

          <div className="text-center py-6 space-x-4">
            <button
              onClick={() => setShowPreview(false)}
              className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-semibold"
            >
              Back to Edit
            </button>
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Print Document
            </button>
            <button
              onClick={() => saveAgreement('completed')}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Agreement'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 px-4 py-12 mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">Rent Agreement</h1>
          <p className="text-blue-100 text-lg">{viewMode ? 'View your rental agreement details' : 'Create your rental agreement online in a swift and hassle free manner'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Agreement City*</label>
              <div ref={cityDropdownRef} className="relative">
                <div
                  className={`flex items-center w-full border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${viewMode ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    if (!viewMode) {
                      setShowCityDropdown(true);
                      fetchCities(""); // Show all cities on click
                    }
                  }}
                >
                  <MapPin size={18} className="text-blue-600 mr-2" />
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => {
                      setCityQuery(e.target.value);
                      setFormData({ ...formData, agreementCity: e.target.value });
                      setShowCityDropdown(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!viewMode) {
                        setShowCityDropdown(true);
                        fetchCities(""); // Show all cities on click
                      }
                    }}
                    disabled={viewMode}
                    placeholder="Search city..."
                    className="w-full bg-transparent border-none focus:outline-none"
                  />
                  {!viewMode && (
                    <>
                      {(cityQuery || formData.agreementCity) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCityQuery('');
                            setFormData({ ...formData, agreementCity: '' });
                          }}
                          className="text-gray-400 hover:text-gray-600 mr-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      <button type="button" onClick={() => setShowCityDropdown(!showCityDropdown)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {showCityDropdown && !viewMode && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingCities ? (
                      <li className="px-4 py-2 text-sm text-gray-500">Loading cities...</li>
                    ) : cities.length > 0 ? (
                      <>
                        <li className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50">
                          {!cityQuery ? "All Cities" : "Search Results"}
                        </li>
                        {cities.map((city, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setFormData({ ...formData, agreementCity: city });
                              setCityQuery(city);
                              setShowCityDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
                          >
                            <MapPin size={16} className="mr-2 text-gray-400" />
                            {city}
                          </li>
                        ))}
                      </>
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">No cities found. Try a different search.</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Agreement Type*</label>
              <div className="relative w-full">
                <FormControl fullWidth>
                  <Select
                    value={formData.agreementType || "Rental Agreement"}
                    onChange={(e) =>
                      setFormData({ ...formData, agreementType: e.target.value })
                    }
                    disabled={viewMode}
                    displayEmpty
                    sx={{
                      borderRadius: "0.5rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d5db",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: viewMode ? "#d1d5db" : "#60a5fa",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                        boxShadow: "0 0 0 2px rgba(59,130,246,0.2)",
                      },
                      "& .MuiSelect-select": {
                        py: "12px",
                        px: "16px",
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: viewMode ? "#6b7280" : "#374151",
                        backgroundColor: viewMode ? "#f3f4f6" : "#fff",
                        borderRadius: "0.5rem",
                      },
                    }}
                  >
                    <MenuItem value="Rental Agreement">Rental Agreement</MenuItem>
                    <MenuItem value="Lease Agreement">Lease Agreement</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="bg-blue-100 rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">LEASE DEED</h2>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4">Landlord Details</h3>
          {formData.landlords.map((landlord, idx) => (
            <div key={idx} className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-blue-900">Landlord {idx + 1}</h4>
                {formData.landlords.length > 1 && (
                  <button
                    onClick={() => removeLandlord(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <FormControl fullWidth>
                    <Select
                      value={landlord.title || ""}
                      onChange={(e) => updateLandlord(idx, "title", e.target.value)}
                      disabled={viewMode}
                      displayEmpty
                      sx={{
                        borderRadius: "0.5rem",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d5db", // gray-300
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: viewMode ? "#d1d5db" : "#60a5fa", // hover border-blue-400
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6", // blue-500
                          boxShadow: "0 0 0 2px rgba(59,130,246,0.2)",
                        },
                        "& .MuiSelect-select": {
                          py: "8px",
                          px: "12px",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          color: viewMode ? "#6b7280" : "#374151", // gray-500 : gray-700
                          backgroundColor: viewMode ? "#f3f4f6" : "#fff", // gray-100 : white
                          borderRadius: "0.5rem",
                        },
                      }}
                    >
                      <MenuItem value="Mr.">Mr.</MenuItem>
                      <MenuItem value="Mrs.">Mrs.</MenuItem>
                      <MenuItem value="Ms.">Ms.</MenuItem>
                    </Select>
                  </FormControl>

                </div>
                <input
                  type="text"
                  placeholder="Landlord Name*"
                  value={landlord.name}
                  onChange={(e) => updateLandlord(idx, 'name', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Parent Name*"
                  value={landlord.parentName}
                  onChange={(e) => updateLandlord(idx, 'parentName', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Contact Number*"
                  value={landlord.contactNumber}
                  onChange={(e) => updateLandlord(idx, 'contactNumber', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="email"
                  placeholder="Email ID*"
                  value={landlord.email}
                  onChange={(e) => updateLandlord(idx, 'email', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="PAN Number*"
                  value={landlord.pan}
                  onChange={(e) => updateLandlord(idx, 'pan', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Aadhaar Number*"
                  value={landlord.aadhaar}
                  onChange={(e) => updateLandlord(idx, 'aadhaar', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 col-span-3 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Address Line 1*"
                  value={landlord.addressLine1}
                  onChange={(e) => updateLandlord(idx, 'addressLine1', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 col-span-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={landlord.addressLine2}
                  onChange={(e) => updateLandlord(idx, 'addressLine2', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="State*"
                  value={landlord.state}
                  onChange={(e) => updateLandlord(idx, 'state', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="City*"
                  value={landlord.city}
                  onChange={(e) => updateLandlord(idx, 'city', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Pincode*"
                  value={landlord.pincode}
                  onChange={(e) => updateLandlord(idx, 'pincode', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
              </div>
            </div>
          ))}
          {!viewMode && (
            <button
              onClick={addLandlord}
              className="text-blue-700 border-2 border-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 font-semibold"
            >
              <Plus size={20} /> Add Landlord
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="text-center font-bold text-lg my-4 text-blue-900">AND</div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Tenant Details</h3>
          {formData.tenants.map((tenant, idx) => (
            <div key={idx} className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-blue-900">Tenant {idx + 1}</h4>
                {formData.tenants.length > 1 && (
                  <button
                    onClick={() => removeTenant(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">

                  <FormControl fullWidth>
                    <Select
                      value={tenant.title || ""}
                      onChange={(e) => updateTenant(idx, "title", e.target.value)}
                      disabled={viewMode}
                      displayEmpty
                      sx={{
                        borderRadius: "0.5rem",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d5db", // Tailwind gray-300
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: viewMode ? "#d1d5db" : "#60a5fa", // blue hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6", // blue-500
                          boxShadow: "0 0 0 2px rgba(59,130,246,0.2)", // soft focus ring
                        },
                        "& .MuiSelect-select": {
                          py: "8px",
                          px: "12px",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          color: viewMode ? "#6b7280" : "#374151", // gray tone
                          backgroundColor: viewMode ? "#f3f4f6" : "#fff",
                          borderRadius: "0.5rem",
                        },
                      }}
                    >
                      <MenuItem value="Mr.">Mr.</MenuItem>
                      <MenuItem value="Mrs.">Mrs.</MenuItem>
                      <MenuItem value="Ms.">Ms.</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <input
                  type="text"
                  placeholder="Tenant Name*"
                  value={tenant.name}
                  onChange={(e) => updateTenant(idx, 'name', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Parent Name*"
                  value={tenant.parentName}
                  onChange={(e) => updateTenant(idx, 'parentName', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Contact Number*"
                  value={tenant.contactNumber}
                  onChange={(e) => updateTenant(idx, 'contactNumber', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="email"
                  placeholder="Email ID*"
                  value={tenant.email}
                  onChange={(e) => updateTenant(idx, 'email', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="PAN Number*"
                  value={tenant.pan}
                  onChange={(e) => updateTenant(idx, 'pan', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Aadhaar Number*"
                  value={tenant.aadhaar}
                  onChange={(e) => updateTenant(idx, 'aadhaar', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 col-span-3 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Address Line 1*"
                  value={tenant.addressLine1}
                  onChange={(e) => updateTenant(idx, 'addressLine1', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 col-span-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={tenant.addressLine2}
                  onChange={(e) => updateTenant(idx, 'addressLine2', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="State*"
                  value={tenant.state}
                  onChange={(e) => updateTenant(idx, 'state', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="City*"
                  value={tenant.city}
                  onChange={(e) => updateTenant(idx, 'city', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Pincode*"
                  value={tenant.pincode}
                  onChange={(e) => updateTenant(idx, 'pincode', e.target.value)}
                  disabled={viewMode}
                  className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
                />
              </div>
            </div>
          ))}
          {!viewMode && (
            <button
              onClick={addTenant}
              className="text-blue-700 border-2 border-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 font-semibold"
            >
              <Plus size={20} /> Add Tenant
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Property Details & Terms</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Property Address*"
              value={formData.propertyAddress}
              onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 col-span-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
            <input
              type="number"
              placeholder="Lease Period (Months)*"
              value={formData.leasePeriod}
              onChange={(e) => setFormData({ ...formData, leasePeriod: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
            <input
              type="number"
              placeholder="Rent Amount*"
              value={formData.rentAmount}
              onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
            <input
              type="number"
              placeholder="Rent Payment Day*"
              value={formData.rentPaymentDay}
              onChange={(e) => setFormData({ ...formData, rentPaymentDay: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
            <input
              type="number"
              placeholder="Rent Increment %*"
              value={formData.rentIncrement}
              onChange={(e) => setFormData({ ...formData, rentIncrement: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
            <input
              type="number"
              placeholder="Refundable Deposit*"
              value={formData.refundableDeposit}
              onChange={(e) => setFormData({ ...formData, refundableDeposit: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
            <input
              type="number"
              placeholder="Notice Period (Days)*"
              value={formData.noticePeriod}
              onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
            <input
              type="number"
              placeholder="Lock-in Period (Months)*"
              value={formData.lockInPeriod}
              onChange={(e) => setFormData({ ...formData, lockInPeriod: e.target.value })}
              disabled={viewMode}
              className={`border rounded px-3 py-2 ${viewMode ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ANNEXURE 1 - Items Provided</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(formData.utilities).map(([item, qty]) => (
              <div key={item} className="flex items-center justify-between border border-gray-300 rounded p-3 bg-gray-50">
                <span className="capitalize text-gray-700 text-sm">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateUtility(item, -1)}
                    disabled={viewMode}
                    className={`${viewMode ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white w-8 h-8 rounded flex items-center justify-center transition`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
                  <button
                    type="button"
                    onClick={() => updateUtility(item, 1)}
                    disabled={viewMode}
                    className={`${viewMode ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white w-8 h-8 rounded flex items-center justify-center transition`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 pb-8">
          {viewMode ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg text-lg"
            >
              Back to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg text-lg disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Submit'}
              </button>
              <button
                onClick={saveDraft}
                disabled={loading}
                className="bg-gray-200 text-gray-700 px-10 py-4 rounded-lg font-semibold hover:bg-gray-300 transition text-lg disabled:bg-gray-100"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentAgreement;