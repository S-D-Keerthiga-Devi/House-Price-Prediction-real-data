import React, { useEffect, useState, useRef } from "react";
import { TextField, MenuItem, ClickAwayListener, Box } from "@mui/material";
import { houseDetails } from "../api/house.js";

export default function SubLocalitySearch({ city, onSelect }) {
  const [localities, setLocalities] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!city) return;
    const fetchLocalities = async () => {
      setLoading(true);
      try {
        const res = await houseDetails(city);
        if (res.success && Array.isArray(res.localities)) {
          setLocalities(res.localities.sort());
        } else {
          setLocalities([]);
        }
      } catch (err) {
        console.error("Failed to fetch localities:", err);
        setLocalities([]);
      } finally {
        setLoading(false);
        // Don't auto-open here, let user click to open
      }
    };
    fetchLocalities();
  }, [city]);

  // filtered list based on query - show all if query is empty
  const filtered = query.trim()
    ? localities.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase())
      )
    : localities; // Show all localities when query is empty

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={containerRef} sx={{ position: "relative", width: 300 }}>
        <TextField
          size="small"
          fullWidth
          label={`Locality in ${city || "..."}`}
          placeholder={loading ? "Loading..." : `${localities.length} available`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true); // keep dropdown open while typing
          }}
          onClick={() => {
            setOpen(true); // Always open dropdown on click
          }}
          onFocus={() => {
            setOpen(true); // Also open on focus
          }}
          disabled={loading || !city}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#000080" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1d4ed8" },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#000080" },
          }}
        />
        
        {loading && (
          <Box sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </Box>
        )}
        
        {/* Show dropdown if open and localities exist and not loading */}
        {open && localities.length > 0 && !loading && (
          <Box
            sx={{
              position: "absolute",
              top: 48,
              width: "100%",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: 1,
              zIndex: 1000,
              maxHeight: 250,
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {filtered.map((loc) => (
              <MenuItem
                key={loc}
                onClick={() => {
                  setQuery(loc);
                  setOpen(false);
                  if (onSelect) onSelect(loc);
                }}
                sx={{
                  "&:hover": { backgroundColor: "#e6e6fa" },
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  fontSize: "14px",
                  py: 1,
                }}
              >
                {loc}
              </MenuItem>
            ))}
            {filtered.length === 0 && query.trim() && (
              <MenuItem disabled sx={{ fontSize: "14px", py: 1 }}>
                No localities found matching "{query}"
              </MenuItem>
            )}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}