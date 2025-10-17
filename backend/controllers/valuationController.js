export const estimateValuation = async (req, res) => {
  try {
    const {
      city,
      location,
      propertyType,
      bedrooms,
      area,
      areaUnit = 'Sq. Ft.',
      buildUpType = 'Built-up',
      possessionStatus = 'Ready To Move',
      coveredParking = 0,
      openParking = 0,
      age = 1,
      furnishingStatus = 'Unfurnished',
      tower = '',
      totalTowers = '',
      floor = 1,
      totalFloors = 1,
      view = 'Standard',
      facing = 'East'
    } = req.body || {};

    // Basic sanity
    if (!city || !location || !area) {
      return res.status(400).json({ success: false, message: 'city, location and area are required' });
    }

    // Convert area to Sq.Ft.
    const unitFactor = areaUnit === 'Sq. M.' ? 10.7639 : areaUnit === 'Sq. Yd.' ? 9 : 1;
    const areaSqft = Number(area) * unitFactor;

    // Base rate heuristic by property type
    let baseRate = 6500; // default per sqft
    const typeAdj = {
      Apartment: 1.0,
      Villa: 1.35,
      'Independent House': 1.25,
      'Independent Floor': 1.15,
      Plot: 0.7,
      Studio: 0.9,
      Penthouse: 1.5
    };
    baseRate = baseRate * (typeAdj[propertyType] || 1.0);

    // Bedrooms adjustment
    const bhkAdj = 1 + (Math.max(1, Number(bedrooms || 1)) - 1) * 0.04; // +4% per extra BHK

    // Floor premium (mid floors slight premium)
    const floorRatio = totalFloors ? Math.min(1, Number(floor) / Number(totalFloors)) : 0.5;
    const floorAdj = 0.98 + (floorRatio * 0.06); // 0.98 to 1.04 roughly

    // Possession & age
    const ageYears = Math.max(0, Number(age || 0));
    const ageAdj = Math.max(0.85, 1 - ageYears * 0.01); // -1% per year, capped at -15%
    const possessionAdj = possessionStatus === 'Under Construction' ? 0.93 : 1.0;

    // Furnishing
    const furnAdj = furnishingStatus === 'Fully Furnished' ? 1.06 : furnishingStatus === 'Semi Furnished' ? 1.03 : 1.0;

    // Parking value
    const parkingAdj = 1 + Math.min(3, Number(coveredParking || 0)) * 0.01 + Math.min(2, Number(openParking || 0)) * 0.005;

    // View / Facing
    const viewAdj = (view && /garden|park|club|pool/i.test(view)) ? 1.02 : 1.0;
    const facingAdj = (facing && /east|north-east|north/i.test(facing)) ? 1.01 : 1.0;

    // Build-up type
    const buildAdj = buildUpType === 'Super Built-up' ? 0.94 : buildUpType === 'Carpet' ? 1.1 : 1.0;

    // Final rate and value
    const ratePerSqft = Math.round(baseRate * bhkAdj * floorAdj * ageAdj * possessionAdj * furnAdj * parkingAdj * viewAdj * facingAdj);
    const estimatedPrice = Math.round(ratePerSqft * areaSqft * buildAdj);

    const breakdown = {
      baseRatePerSqft: Math.round(baseRate),
      adjustments: {
        bhkAdj: Number(bhkAdj.toFixed(3)),
        floorAdj: Number(floorAdj.toFixed(3)),
        ageAdj: Number(ageAdj.toFixed(3)),
        possessionAdj,
        furnAdj,
        parkingAdj: Number(parkingAdj.toFixed(3)),
        viewAdj,
        facingAdj,
        buildAdj
      },
      ratePerSqft,
      areaSqft
    };

    return res.json({ success: true, city, location, ratePerSqft, estimatedPrice, breakdown });
  } catch (e) {
    console.error('Valuation error', e);
    return res.status(500).json({ success: false, message: 'Unable to estimate valuation' });
  }
};


