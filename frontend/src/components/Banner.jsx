import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, TrendingUp, BarChart2, PieChart } from "lucide-react";
import { motion } from "framer-motion";

export default function Banner({ onScrollToForm }) {
  const services = [
    { title: "Property Valuation", icon: <TrendingUp className="w-5 h-5 text-amber-400" /> },
    { title: "Market Analysis", icon: <BarChart2 className="w-5 h-5 text-amber-400" /> },
    { title: "Investment Insights", icon: <PieChart className="w-5 h-5 text-amber-400" /> },
    { title: "Neighborhood Analytics", icon: <MapPin className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden top-10">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://plus.unsplash.com/premium_photo-1682309553075-c84ea8d9d49a?q=80&w=1812&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury home exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Text + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white"
          >
            <div className="inline-block px-3 py-1 mb-6 text-base font-medium text-amber-400 bg-black/50 rounded-full border border-amber-400">
              Compare, Predict, and Decide – Your Home's True Value Instantly
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Know Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Home's Value
              </span>
              Instantly
            </h1>

            <p className="text-lg text-gray-200 mb-6 max-w-md leading-relaxed">
              Our AI-powered house price comparator analyzes real market data to provide you with accurate property valuations. Make informed decisions with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onScrollToForm}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Price Estimate
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button 
                variant="outline" 
                className="border-white/30 text-gray-500 hover:bg-white/10 px-6 py-4 text-base rounded-xl backdrop-blur-sm"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Right: Service Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid gap-4"
          >
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-white font-semibold text-sm">{service.title}</h3>
                </div>
                <p className="text-white/70 text-xs">
                  Detailed insights powered by AI to help you make the best decisions for your property and investments.
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
