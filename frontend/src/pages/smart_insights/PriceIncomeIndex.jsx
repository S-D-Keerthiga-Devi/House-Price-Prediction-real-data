import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import axiosInstance from '../../utlis/axiosInstance';

const PriceIncomeIndex = ({ city }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching price-to-income data...');
        const response = await axiosInstance.get('/api/smart-insights/price-to-income');
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Response data.success:', response.data.success);
        console.log('Response data.data:', response.data.data);

        if (response.data.success) {
          setData(response.data.data);
          console.log('Data set successfully:', response.data.data);
        } else {
          console.error('Response success is false');
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching smart insights data:', err);
        console.error('Error details:', err.response);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  // Check if city is Gurgaon (case-insensitive)
  if (!city || city.toLowerCase() !== 'gurgaon') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-50">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Data Available</h2>
          <p className="text-gray-500">
            Price to Income Index data is currently only available for <strong>Gurgaon</strong>.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Please select Gurgaon to view this chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-blue-900 text-center mb-8 uppercase tracking-wide">
          Improved Affordability {city ? `in ${city}` : ''}
        </h1>

        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: '#333', fontSize: 12 }}
              />

              {/* Left Y-Axis for Property Cost & Affordability */}
              <YAxis
                yAxisId="left"
                label={{
                  value: 'Property Value (Rs. Lac) & Affordability',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#333', fontSize: 14, fontWeight: 'bold' }
                }}
                domain={[0, 50]}
                tickCount={11}
              />

              {/* Right Y-Axis for Annual Income */}
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: 'Annual Income (Rs. Lac)',
                  angle: 90,
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fill: '#333', fontSize: 14, fontWeight: 'bold' }
                }}
                domain={[0, 12]}
                tickCount={7}
                tickFormatter={(value) => value.toFixed(2)}
              />

              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #ccc' }}
              />
              <Legend verticalAlign="bottom" height={36} />

              {/* Bar for Property Cost - Navy Blue */}
              <Bar
                yAxisId="left"
                dataKey="propertyCost"
                name="Property Cost (Rs. Lac)"
                fill="#1e3a8a" // Navy Blue
                stroke="#000"
                strokeWidth={0}
                barSize={30}
              >
                <LabelList dataKey="affordability" position="top" fill="#1e3a8a" fontSize={10} formatter={(val) => val.toFixed(1)} content={renderCustomLabel} />
              </Bar>

              {/* Line for Affordability - Light Blue/Cyan for contrast on Navy */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="affordability"
                name="Affordability"
                stroke="#0ea5e9" // Sky Blue
                strokeWidth={3}
                dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
              />

              {/* Line for Annual Income - Dark Gray or Black for contrast */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="annualIncome"
                name="Annual Income (Rs. Lac)"
                stroke="#475569" // Slate 600
                strokeWidth={3}
                dot={{ r: 4, fill: '#475569', strokeWidth: 2, stroke: '#fff' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Custom label renderer to mimic the teal boxes in the original image
const renderCustomLabel = (props) => {
  const { x, y, width, value } = props;
  return (
    <g>
      <rect x={x + width / 2 - 15} y={y - 25} width={30} height={20} fill="#1e3a8a" stroke="none" />
      <text x={x + width / 2} y={y - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="bold">
        {value}
      </text>
    </g>
  );
};

export default PriceIncomeIndex;