// subLocalitySearch.jsx
import React, { useState, useRef } from "react";
import { 
  TextField, 
  MenuItem, 
  ClickAwayListener, 
  Box, 
  InputAdornment, 
  IconButton 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function SubLocalitySearch({ city, onSelect, validLocalities }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState("");
  const containerRef = useRef(null);

  // Filter valid localities based on query
  const filtered = query.trim() === ""
    ? validLocalities
    : validLocalities.filter(loc =>
        loc.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (locality) => {
    setQuery(locality);
    setSelectedLocality(locality);
    setOpen(false);
    if (onSelect) onSelect(locality);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedLocality("");
    setOpen(false);
    if (onSelect) onSelect("");
  };

  const handleSearch = () => {
    if (query.trim() && filtered.length > 0) {
      // Auto-select first match if exact match not found
      const exactMatch = filtered.find(loc => 
        loc.toLowerCase() === query.toLowerCase()
      );
      const toSelect = exactMatch || filtered[0];
      handleSelect(toSelect);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={containerRef} sx={{ position: "relative", width: 300 }}>
        <TextField
          size="small"
          fullWidth
          label={`Locality in ${city || "..."}`}
          placeholder={`${validLocalities.length} available`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          disabled={!city}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={handleSearch}
                  disabled={!city || !query.trim()}
                  sx={{ p: 0.5 }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        {open && filtered.length > 0 && (
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
                onClick={() => handleSelect(loc)}
                selected={selectedLocality === loc}
                sx={{
                  "&:hover": { backgroundColor: "#e6e6fa" },
                  "&.Mui-selected": { backgroundColor: "#f0f0ff" },
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  fontSize: "14px",
                  py: 1,
                }}
              >
                {loc}
              </MenuItem>
            ))}
          </Box>
        )}
        
        {open && filtered.length === 0 && query.trim() !== "" && (
          <Box
            sx={{
              position: "absolute",
              top: 48,
              width: "100%",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: 1,
              zIndex: 1000,
              p: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <MenuItem disabled>No matching localities found</MenuItem>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}