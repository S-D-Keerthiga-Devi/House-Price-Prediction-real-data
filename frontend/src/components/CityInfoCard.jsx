// CityInfoCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box, Grid, Chip, Divider } from "@mui/material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HomeIcon from "@mui/icons-material/Home";
import gurgaon from "../assets/gurgaon.jpg"

export default function CityInfoCard({ city, averagePrice }) {
  // Mock data for different cities - in a real app, this would come from an API
  const cityData = {
    "Mumbai": {
      description: "Mumbai, the financial capital of India, is known for its bustling lifestyle, Bollywood, and diverse real estate options from luxury apartments to affordable housing.",
      population: "20.4 million",
      growthRate: "5.2%",
      popularAreas: ["Bandra", "Andheri", "Juhu", "Powai"],
      image: "https://images.unsplash.com/photo-1528975604071-8d271e915a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    "Delhi": {
      description: "Delhi, India's capital territory, is a metropolitan area with a rich history, diverse culture, and a mix of modern infrastructure and historical monuments.",
      population: "18.6 million",
      growthRate: "4.8%",
      popularAreas: ["Connaught Place", "South Delhi", "Dwarka", "Rohini"],
      image: "https://images.unsplash.com/photo-1587474269081-e775a8b0b9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    "Bangalore": {
      description: "Bangalore, the Silicon Valley of India, is known for its pleasant climate, tech parks, and vibrant startup culture.",
      population: "12.3 million",
      growthRate: "6.5%",
      popularAreas: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout"],
      image: "https://images.unsplash.com/photo-1596495577856-8aa937599bcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    "Gurgaon": {
      description: "Gurgaon, a leading financial and industrial hub, is known for its skyscrapers, malls, and modern infrastructure.",
      population: "2.5 million",
      growthRate: "7.2%",
      popularAreas: ["DLF Cyber City", "Golf Course Road", "Sohna Road", "Sector 62"],
      image: gurgaon
    },
    "Pune": {
      description: "Pune, the cultural capital of Maharashtra, is known for its educational institutions, IT companies, and pleasant climate.",
      population: "6.8 million",
      growthRate: "5.8%",
      popularAreas: ["Koregaon Park", "Kalyani Nagar", "Hinjewadi", "Baner"],
      image: "https://images.unsplash.com/photo-1596495577856-8aa937599bcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  };

  // Default data for cities not in our mock data
  const defaultData = {
    description: `${city} is a vibrant city with diverse real estate options. Explore property trends and market insights to make informed decisions.`,
    population: "Data not available",
    growthRate: "Data not available",
    popularAreas: ["Area 1", "Area 2", "Area 3"],
    image: "https://images.unsplash.com/photo-1596495577856-8aa937599bcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  };

  const currentCityData = cityData[city] || defaultData;

  return (
    <Card 
      sx={{ 
        borderRadius: 2,
        overflow: "hidden", 
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        mb: 3,
        position: "relative",
        transition: "all 0.3s ease",
        border: "1px solid rgba(0,0,0,0.06)",
        "&:hover": {
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)"
        }
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        {/* Image Section */}
        <Box sx={{ 
          width: { xs: "100%", md: "35%" }, 
          position: "relative",
          minHeight: { xs: 240, md: 320 }
        }}>
          <Box
            component="img"
            src={currentCityData.image}
            alt={city}
            sx={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              filter: "brightness(0.95) contrast(1.05)"
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
              p: 2.5,
              color: "white"
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="600" 
              sx={{ 
                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                letterSpacing: "0.02em"
              }}
            >
              {city}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                opacity: 0.95,
                mt: 0.5
              }}
            >
              Real Estate Market Overview
            </Typography>
          </Box>
        </Box>
        
        {/* Information Section */}
        <Box sx={{ 
          width: { xs: "100%", md: "65%" }, 
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Description */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              lineHeight: 1.6,
              fontSize: "0.95rem"
            }}
          >
            {currentCityData.description}
          </Typography>
          
          <Divider sx={{ mb: 3, opacity: 0.6 }} />
          
          {/* Key Metrics */}
          <Typography 
            variant="h6" 
            fontWeight="600" 
            color="text.primary"
            sx={{ mb: 2, fontSize: "1.1rem" }}
          >
            Key Metrics
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6} md={4}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "flex-start",
                p: 2,
                backgroundColor: "rgba(25, 118, 210, 0.04)",
                borderRadius: 1.5,
                border: "1px solid rgba(25, 118, 210, 0.12)"
              }}>
                <PeopleIcon 
                  sx={{ 
                    color: "primary.main", 
                    mr: 1.5, 
                    fontSize: 24,
                    mt: 0.25
                  }} 
                />
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: "0.7rem"
                    }}
                  >
                    Population
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="600"
                    color="text.primary"
                    sx={{ mt: 0.5 }}
                  >
                    {currentCityData.population}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={4}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "flex-start",
                p: 2,
                backgroundColor: "rgba(76, 175, 80, 0.04)",
                borderRadius: 1.5,
                border: "1px solid rgba(76, 175, 80, 0.12)"
              }}>
                <TrendingUpIcon 
                  sx={{ 
                    color: "success.main", 
                    mr: 1.5, 
                    fontSize: 24,
                    mt: 0.25
                  }} 
                />
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: "0.7rem"
                    }}
                  >
                    Growth Rate
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="600"
                    color="text.primary"
                    sx={{ mt: 0.5 }}
                  >
                    {currentCityData.growthRate}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "flex-start",
                p: 2,
                backgroundColor: "rgba(255, 152, 0, 0.04)",
                borderRadius: 1.5,
                border: "1px solid rgba(255, 152, 0, 0.12)"
              }}>
                <HomeIcon 
                  sx={{ 
                    color: "warning.main", 
                    mr: 1.5, 
                    fontSize: 24,
                    mt: 0.25
                  }} 
                />
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: "0.7rem"
                    }}
                  >
                    Avg. Price per sqft
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="600"
                    color="text.primary"
                    sx={{ mt: 0.5 }}
                  >
                    {averagePrice ? `₹${(averagePrice/1000).toFixed(1)}K` : "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          {/* Popular Areas */}
          <Box sx={{ mt: "auto" }}>
            <Typography 
              variant="subtitle2" 
              color="text.primary"
              sx={{ 
                fontWeight: 600,
                mb: 1.5,
                fontSize: "0.95rem"
              }}
            >
              Popular Areas
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {currentCityData.popularAreas.map((area, index) => (
                <Chip 
                  key={index} 
                  label={area} 
                  size="small"
                  sx={{ 
                    borderRadius: 1,
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                    color: "primary.main",
                    border: "1px solid rgba(25, 118, 210, 0.2)",
                    fontSize: "0.75rem",
                    height: "28px",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.12)"
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}