import pandas as pd
import pymongo
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='backend/.env')

# MongoDB Connection
mongo_uri = os.getenv('MONGODB_URI')
if not mongo_uri:
    mongo_uri = "mongodb+srv://sdkeerthigadevi:keerthiga123@cluster0.mf3qg03.mongodb.net/house-price-auth"
else:
    if 'house-price-auth' not in mongo_uri:
        mongo_uri = f"{mongo_uri}/house-price-auth"

print(f"Connecting to MongoDB...")
client = pymongo.MongoClient(mongo_uri)
db = client["house-price-auth"]
collection = db["pricetoincomes"]

# Load Data
csv_path = 'notebook/data/data_formatted.csv'
print(f"Loading data from {csv_path}...")
try:
    df = pd.read_csv(csv_path)
except FileNotFoundError:
    print(f"Error: File not found at {csv_path}")
    exit(1)

# Process Dates
print("Processing data...")
df['posted_date'] = pd.to_datetime(df['posted_on'], errors='coerce')
df['year'] = df['posted_date'].dt.year
df['month'] = df['posted_date'].dt.month
df['month_year'] = df['posted_date'].dt.strftime('%b %Y') # e.g., Jan 2024

# Filter for valid dates and prices
df_clean = df.dropna(subset=['posted_date', 'rate_sqft'])

# Calculate Average Property Cost per Month (assuming 1000 sqft apartment)
df_clean['property_cost_lacs'] = (df_clean['rate_sqft'] * 1000) / 100000

# Group by Year and Month
monthly_stats = df_clean.groupby(['year', 'month', 'month_year'])['property_cost_lacs'].mean().reset_index()

# Sort by date
monthly_stats = monthly_stats.sort_values(['year', 'month'])

# Synthesize Income Data (Monthly basis)
def estimate_income(row):
    year = row['year']
    month = row['month']
    
    # Baseline: 2012 was ~9.6 Lacs
    base_year = 2012
    base_income = 9.6
    growth_rate = 0.08 # 8% annual growth
    
    if year < base_year:
        annual_income = base_income / (1 + growth_rate)**(base_year - year)
    else:
        annual_income = base_income * (1 + growth_rate)**(year - base_year)
    
    # Adjust slightly for month to show smooth curve (optional, but keeps it simple for now)
    # We return Annual Income rate at that point in time
    return annual_income

monthly_stats['annualIncome'] = monthly_stats.apply(estimate_income, axis=1)
monthly_stats['annualIncome'] = monthly_stats['annualIncome'].round(2)

# Calculate Affordability
monthly_stats['affordability'] = monthly_stats['property_cost_lacs'] / monthly_stats['annualIncome']
monthly_stats['affordability'] = monthly_stats['affordability'].round(1)
monthly_stats['propertyCost'] = monthly_stats['property_cost_lacs'].round(0)

print("Monthly Stats:")
print(monthly_stats[['month_year', 'propertyCost', 'affordability', 'annualIncome']].head())

# Prepare Data for MongoDB
db_data = []
for _, row in monthly_stats.iterrows():
    # Create a sortable date object (1st of the month)
    sort_date = datetime(int(row['year']), int(row['month']), 1)
    
    db_data.append({
        "year": row['month_year'], # Storing "Jan 2024" in the 'year' field as requested by schema
        "propertyCost": float(row['propertyCost']),
        "affordability": float(row['affordability']),
        "annualIncome": float(row['annualIncome']),
        "sortDate": sort_date,
        "city": "Gurgaon",
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })

# Clear existing data
collection.delete_many({})
print("Cleared existing data")

# Insert new data
if db_data:
    result = collection.insert_many(db_data)
    print(f"Inserted {len(result.inserted_ids)} records successfully.")
else:
    print("No data to insert")
