import React, { useState } from "react";

const CheckboxDropdown = ({ options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (value) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value) // Remove if already selected
      : [...selectedValues, value]; // Add if not selected
    onChange(updatedValues);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-60 p-2 bg-light2 border-2 border-text3 dark:bg-dark4 dark:border-none rounded-lg text-left"
      >
        {selectedValues.length > 0
          ? selectedValues.join(", ")
          : "Select roles"}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-light2 dark:bg-dark4 border-2 border-text3 dark:border-none rounded-lg shadow-lg">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark3"
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckboxDropdown;