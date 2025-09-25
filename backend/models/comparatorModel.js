import mongoose from 'mongoose';

const comparatorPropertySchema = new mongoose.Schema({
  area: Number,
  bedrooms: Number,
  bathroom: Number,
  balconies: Number,
  city: String,
  location: String,
  developer_name: String,
  furnishing_status: String,
  construction_status: String,
  price_value: Number,
  rate_sqft: Number,
  property_age_years: Number,
  parking_count: Number,
  days_on_market: Number,
  amenities_count: Number,
  facing_score: Number,
  lifestyle_quality_index: Number,
  rental_yield: Number,
  future_growth_prediction: Number,
  investment_potential: Number,
  neighbourhood_avg_income: Number,
  affordability_index: Number,
  builder_grade: Number
}, { timestamps: true });

const comparatorPropertyModel = mongoose.models.comparatorProperty || mongoose.model('comparator_properties', comparatorPropertySchema);

export default comparatorPropertyModel;