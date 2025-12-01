import mongoose from 'mongoose';
import PriceToIncome from '../models/priceToIncomeModel.js';
import 'dotenv/config';

const importData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Data to Import
        const data = [
            { year: '1995', propertyCost: 26, affordability: 5.3, annualIncome: 1.2, city: "Gurgaon" },
            { year: '1996', propertyCost: 21, affordability: 3.7, annualIncome: 1.4, city: "Gurgaon" },
            { year: '1997', propertyCost: 17, affordability: 2.7, annualIncome: 1.5, city: "Gurgaon" },
            { year: '1998', propertyCost: 14, affordability: 2.0, annualIncome: 1.7, city: "Gurgaon" },
            { year: '1999', propertyCost: 10, affordability: 1.6, annualIncome: 1.9, city: "Gurgaon" },
            { year: '2000', propertyCost: 12, affordability: 1.4, annualIncome: 2.1, city: "Gurgaon" },
            { year: '2001', propertyCost: 12, affordability: 1.3, annualIncome: 2.3, city: "Gurgaon" },
            { year: '2002', propertyCost: 12, affordability: 1.2, annualIncome: 2.5, city: "Gurgaon" },
            { year: '2003', propertyCost: 13, affordability: 1.1, annualIncome: 2.8, city: "Gurgaon" },
            { year: '2004', propertyCost: 14, affordability: 1.0, annualIncome: 3.2, city: "Gurgaon" },
            { year: '2005', propertyCost: 18, affordability: 1.1, annualIncome: 3.8, city: "Gurgaon" },
            { year: '2006', propertyCost: 25, affordability: 1.2, annualIncome: 5.0, city: "Gurgaon" },
            { year: '2007', propertyCost: 27, affordability: 1.2, annualIncome: 5.3, city: "Gurgaon" },
            { year: '2008', propertyCost: 32, affordability: 1.2, annualIncome: 6.3, city: "Gurgaon" },
            { year: '2009', propertyCost: 29, affordability: 1.1, annualIncome: 6.5, city: "Gurgaon" },
            { year: '2010', propertyCost: 36, affordability: 1.1, annualIncome: 7.6, city: "Gurgaon" },
            { year: '2011', propertyCost: 40, affordability: 1.1, annualIncome: 8.3, city: "Gurgaon" },
            { year: '2012', propertyCost: 44, affordability: 1.1, annualIncome: 9.6, city: "Gurgaon" }
        ];

        // Clear existing data
        await PriceToIncome.deleteMany({});
        console.log('Cleared existing data');

        // Insert new data
        await PriceToIncome.insertMany(data);
        console.log('Data Imported Successfully');

        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

importData();
