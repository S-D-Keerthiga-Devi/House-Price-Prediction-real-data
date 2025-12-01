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

const SmartInsights = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/smart-insights/price-to-income');
                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                console.error('Error fetching smart insights data:', err);
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-red-600 text-xl font-semibold">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 mt-20">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-bold text-blue-900 text-center mb-8 uppercase tracking-wide">
                    Improved Affordability
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

                            {/* Bar for Property Cost */}
                            <Bar
                                yAxisId="left"
                                dataKey="propertyCost"
                                name="Property Cost (Rs. Lac)"
                                fill="#fde047"
                                stroke="#000"
                                strokeWidth={1}
                                barSize={30}
                            >
                                <LabelList dataKey="affordability" position="top" fill="#000" fontSize={10} formatter={(val) => val.toFixed(1)} content={renderCustomLabel} />
                            </Bar>

                            {/* Line for Affordability */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="affordability"
                                name="Affordability"
                                stroke="#1e3a8a"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff' }}
                            />

                            {/* Line for Annual Income */}
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="annualIncome"
                                name="Annual Income (Rs. Lac)"
                                stroke="#ea580c"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }}
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
            <rect x={x + width / 2 - 15} y={y - 25} width={30} height={20} fill="#2dd4bf" stroke="none" />
            <text x={x + width / 2} y={y - 10} fill="#000" textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="bold">
                {value}
            </text>
        </g>
    );
};

export default SmartInsights;
