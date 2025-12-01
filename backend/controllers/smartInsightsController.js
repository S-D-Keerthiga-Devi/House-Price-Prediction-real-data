import PriceToIncome from '../models/priceToIncomeModel.js';

export const getPriceToIncomeData = async (req, res) => {
    try {
        const { city } = req.query;

        let query = {};
        if (city) {
            query.city = city;
        }

        const data = await PriceToIncome.find(query).sort({ sortDate: 1 });

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch price to income data',
            error: error.message
        });
    }
};

