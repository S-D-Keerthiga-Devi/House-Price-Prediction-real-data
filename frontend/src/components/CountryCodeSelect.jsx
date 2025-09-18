import React, { useState, useEffect, useRef } from "react";

export default function CountryCodeSelect({ value, onChange, className }) {
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState(value || "+91");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=idd,name"
        );
        const data = await res.json();

        const codes = data
          .map((c) => {
            if (c.idd?.root) {
              const fullCodes = c.idd.suffixes?.length
                ? c.idd.suffixes.map((suf) => ({
                    code: `${c.idd.root}${suf}`,
                    name: c.name.common,
                  }))
                : [{ code: `${c.idd.root}`, name: c.name.common }];
              return fullCodes;
            }
            return null;
          })
          .flat()
          .filter(Boolean)
          .sort((a, b) => a.code.localeCompare(b.code));

        setCountryCodes(codes);

        if (!value && codes.length) {
          setSelectedCode(codes[0].code);
          onChange && onChange(codes[0].code);
        }
      } catch (err) {
        console.error("Error fetching country codes:", err);
        setSelectedCode("+91");
        onChange && onChange("+91");
      }
    };

    fetchCountryCodes();
  }, []);

  const handleSelect = (code) => {
    setSelectedCode(code);
    onChange && onChange(code);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {/* Selected code box */}
      <div
        className="px-3 py-2 border border-gray-300 bg-gray-100 text-sm cursor-pointer flex items-center justify-between h-full"
        style={{ minWidth: "80px" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selectedCode}</span>
        <span className="ml-1">&#9662;</span>
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute top-full left-0 w-56 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-50 mt-1">
          {countryCodes.map((c) => (
            <div
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer flex justify-between text-sm"
            >
              <span>{c.name}</span>
              <span className="font-medium">{c.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
