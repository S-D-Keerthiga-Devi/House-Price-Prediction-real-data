import React, { useEffect, useState, useRef } from "react";
import { TextField, MenuItem, ClickAwayListener, Box } from "@mui/material";

export default function SubLocalitySearch({ city }) {
    const [localities, setLocalities] = useState([]);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!city) return;

        const fetchLocalities = async () => {
            try {
                setLoading(true);
                setLocalities([]);
                const names = new Set();

                // --- ✅ FIX: Remove hardcoded state for a generic search ---
                // The query now only uses the city name, making it work for any city in India.
                const nomRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                        city
                    )}&format=json&limit=1&countrycodes=in`
                );
                const nomData = await nomRes.json();
                if (!nomData.length) {
                    setLoading(false);
                    return;
                }

                const [minLat, maxLat, minLon, maxLon] = nomData[0].boundingbox.map(Number);
                const bbox = `${minLat},${minLon},${maxLat},${maxLon}`;

                const overpassQuery = `
          [out:json];
          (
            node["place"~"suburb|neighbourhood|quarter"](${bbox});
            way["place"~"suburb|neighbourhood|quarter"](${bbox});
            relation["place"~"suburb|neighbourhood|quarter"](${bbox});
          );
          (._;>;);
          out;
        `;

                const overpassUrl = `https://overpass-api.de/api/interpreter`;
                const res = await fetch(overpassUrl, {
                    method: 'POST',
                    body: `data=${encodeURIComponent(overpassQuery)}`
                });
                const data = await res.json();

                if (data.elements) {
                    const validNameRegex = /^[a-zA-Z0-9\s.-]+$/;
                    const bannedTerms = /(village|gaon)/i;

                    data.elements.forEach((element) => {
                        const name = element.tags?.name;
                        if (!name) return;

                        const trimmedName = name.trim();

                        if (!validNameRegex.test(trimmedName)) return;
                        if (bannedTerms.test(trimmedName)) return;

                        names.add(trimmedName);
                    });
                }

                setLocalities([...names].sort((a, b) => a.localeCompare(b)));
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch localities:", err);
                setLoading(false);
            }
        };

        fetchLocalities();
    }, [city]);

    const filtered = query
        ? localities.filter((loc) => loc.toLowerCase().includes(query.toLowerCase()))
        : localities;

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box ref={containerRef} sx={{ position: "relative", width: 300 }}>
                <TextField
                    size="small"
                    fullWidth
                    label={`Locality in ${city || "..."}`}
                    placeholder={loading ? 'Loading...' : `${localities.length} available`}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onClick={() => setOpen(true)}
                    disabled={loading || !city}
                    sx={{
                        // Target the root of the outlined input
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white', // Set the background color to white

                            // Style the border on hover
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#000080', // Navy blue border on hover
                            },

                            // Style the border when the input is focused
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1d4ed8', // Navy blue border when focused
                            },
                        },
                        // Style the label when the input is focused
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#000080', // Navy blue label text when focused
                        },
                    }}
                />
                {loading && (
                    <Box sx={{ position: "absolute", right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                border: "2px solid #f3f3f3",
                                borderTop: "2px solid #3498db",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                            }}
                            key="spinner"
                        />
                    </Box>
                )}
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
                        {filtered.slice(0, 100).map((loc) => (
                            <MenuItem
                                key={loc}
                                onClick={() => {
                                    setQuery(loc);
                                    setOpen(false);
                                }}
                                sx={{
                                    "&:hover": { backgroundColor: "#e6e6fa" }, // A light lavender for menu item hover
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
            </Box>
        </ClickAwayListener>
    );
}