import React, { useState } from 'react'

// Mock API function since we don't have the actual implementation
const estimateValuation = async (form) => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    estimatedPrice: 8500000,
    ratePerSqft: 8500,
    breakdown: { areaSqft: form.area }
  }
}

function PropertyValuation() {
  const [form, setForm] = useState({
    propertyType: 'Apartment',
    bedrooms: 3,
    area: 1000,
    areaUnit: 'Sq. Ft.',
    buildUpType: 'Built-up',
    city: 'Gurgaon',
    location: 'Sector-27',
    possessionStatus: 'Ready To Move',
    coveredParking: 1,
    openParking: 0,
    age: 1,
    furnishingStatus: 'Furnished',
    tower: '1',
    totalTowers: '12',
    floor: 1,
    totalFloors: 12,
    view: 'Garden View',
    facing: 'East'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setLoading(true)
    const res = await estimateValuation(form)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 md:px-6 py-8 md:py-12 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2" style={{color: '#1e3a8a'}}>
            Property Valuation
          </h1>
          <p className="text-gray-600">Get an accurate estimate of your property's market value</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1 Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold" style={{color: '#1e3a8a'}}>
                Basic Details
              </h2>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{backgroundColor: '#dbeafe', color: '#1e40af'}}>
                Step 1/3
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                  Property Type<span className="text-red-500"> *</span>
                </label>
                <select 
                  value={form.propertyType} 
                  onChange={e=>setField('propertyType', e.target.value)} 
                  className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  style={{borderColor: '#e5e7eb'}}
                >
                  {['Apartment','Independent Floor','Independent House','Villa','Studio','Penthouse','Plot'].map(pt=> 
                    <option key={pt}>{pt}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                  Project/Locality<span className="text-red-500"> *</span>
                </label>
                <input 
                  value={`${form.location}, ${form.city}`} 
                  onChange={()=>{}} 
                  className="w-full border-2 rounded-lg px-4 py-2.5 bg-gray-50" 
                  style={{borderColor: '#e5e7eb'}}
                  readOnly 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3" style={{color: '#1e3a8a'}}>
                  Select Unit Type<span className="text-red-500"> *</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                  {[1,'1.5',2,'2.5',3,'3.5',4,5].map(b=> (
                    <button 
                      type="button" 
                      key={b} 
                      onClick={()=>setField('bedrooms', parseFloat(b))} 
                      className="px-3 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all hover:shadow-md"
                      style={String(form.bedrooms)===String(b) ? 
                        {backgroundColor: '#1e3a8a', color: 'white', borderColor: '#1e3a8a'} : 
                        {backgroundColor: 'white', color: '#1e3a8a', borderColor: '#e5e7eb'}
                      }
                    >
                      {b} BHK
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Area<span className="text-red-500"> *</span>
                  </label>
                  <input 
                    type="number" 
                    value={form.area} 
                    onChange={e=>setField('area', Number(e.target.value))} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>Unit</label>
                  <select 
                    value={form.areaUnit} 
                    onChange={e=>setField('areaUnit', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  >
                    {['Sq. Ft.','Sq. M.','Sq. Yd.'].map(u=> <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>Type</label>
                  <select 
                    value={form.buildUpType} 
                    onChange={e=>setField('buildUpType', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  >
                    {['Built-up','Super Built-up','Carpet'].map(u=> <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    City<span className="text-red-500"> *</span>
                  </label>
                  <input 
                    value={form.city} 
                    onChange={e=>setField('city', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Location<span className="text-red-500"> *</span>
                  </label>
                  <input 
                    value={form.location} 
                    onChange={e=>setField('location', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" 
                  className="px-6 py-3 rounded-lg border-2 font-semibold transition-all hover:shadow-md"
                  style={{borderColor: '#1e3a8a', color: '#1e3a8a'}}
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-70"
                  style={{backgroundColor: '#1e3a8a'}}
                >
                  {loading ? 'Calculating...' : 'Next'}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold" style={{color: '#1e3a8a'}}>
                Additional Details
              </h2>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{backgroundColor: '#dbeafe', color: '#1e40af'}}>
                Step 2/3
              </span>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Possession Status
                  </label>
                  <select 
                    value={form.possessionStatus} 
                    onChange={e=>setField('possessionStatus', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  >
                    {['Ready To Move','Under Construction'].map(s=> <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Covered Parking
                  </label>
                  <input 
                    type="number" 
                    value={form.coveredParking} 
                    onChange={e=>setField('coveredParking', Number(e.target.value))} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Age of Property
                  </label>
                  <input 
                    type="number" 
                    value={form.age} 
                    onChange={e=>setField('age', Number(e.target.value))} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Furnishing Status
                  </label>
                  <select 
                    value={form.furnishingStatus} 
                    onChange={e=>setField('furnishingStatus', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  >
                    {['Unfurnished','Semi Furnished','Fully Furnished','Furnished'].map(s=> <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Tower / Block
                  </label>
                  <input 
                    value={form.tower} 
                    onChange={e=>setField('tower', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Total Towers
                  </label>
                  <input 
                    value={form.totalTowers} 
                    onChange={e=>setField('totalTowers', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Floor Number
                  </label>
                  <input 
                    type="number" 
                    value={form.floor} 
                    onChange={e=>setField('floor', Number(e.target.value))} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Total Floors
                  </label>
                  <input 
                    type="number" 
                    value={form.totalFloors} 
                    onChange={e=>setField('totalFloors', Number(e.target.value))} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    View of Property
                  </label>
                  <select 
                    value={form.view} 
                    onChange={e=>setField('view', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  >
                    {['Standard','Garden View','Park View','Club View','Pool View'].map(v=> <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
                    Facing
                  </label>
                  <select 
                    value={form.facing} 
                    onChange={e=>setField('facing', e.target.value)} 
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{borderColor: '#e5e7eb'}}
                  >
                    {['East','West','North','South','North-East','South-East'].map(v=> <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" 
                  className="px-6 py-3 rounded-lg border-2 font-semibold transition-all hover:shadow-md"
                  style={{borderColor: '#1e3a8a', color: '#1e3a8a'}}
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-70"
                  style={{backgroundColor: '#1e3a8a'}}
                >
                  {loading ? 'Calculating...' : 'Get Valuation'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          {result && (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2" style={{borderColor: '#1e3a8a'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold" style={{color: '#1e3a8a'}}>
                  Estimated Property Value
                </h3>
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{backgroundColor: '#dcfce7', color: '#166534'}}>
                  Step 3/3
                </span>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-3" style={{color: '#1e3a8a'}}>
                ₹ {result.estimatedPrice?.toLocaleString('en-IN')}
              </div>
              <div className="flex flex-wrap gap-6 text-gray-600">
                <div>
                  <span className="text-sm font-medium">Rate per sq.ft:</span>
                  <span className="ml-2 font-semibold" style={{color: '#1e3a8a'}}>
                    ₹ {result.ratePerSqft?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Total Area:</span>
                  <span className="ml-2 font-semibold" style={{color: '#1e3a8a'}}>
                    {result.breakdown?.areaSqft} sq.ft
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyValuation