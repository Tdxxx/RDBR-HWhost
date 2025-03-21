import React, { useState, useEffect } from "react";
import "../styles/Filters.css"; // Import CSS

const Filters = ({ onFilterChange }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Dummy Employee Data
  const employees = [
    { id: 1, name: "ნიკა კობახიძე" },
    { id: 2, name: "თამარ ბერიძე" },
    { id: 3, name: "გიორგი ცინცაძე" },
  ];

  // Fetch Departments from API
  useEffect(() => {
    fetch("YOUR_API_URL_HERE") // Replace with actual API URL
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  // Handle changes & send selected filters to parent component
  useEffect(() => {
    onFilterChange({ selectedDepartment, selectedPriority, selectedEmployee });
  }, [selectedDepartment, selectedPriority, selectedEmployee]);

  return (
    <div className="filters-container">
      {/* Department Filter */}
      <div className="filter-item">
        <label className="filter-label">დეპარტამენტი</label>
        <select
          className="filter-select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">აირჩიეთ დეპარტამენტი</option>
          {departments.map((dep) => (
            <option key={dep.id} value={dep.name}>
              {dep.name}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Filter */}
      <div className="filter-item">
        <label className="filter-label">პრიორიტეტი</label>
        <select
          className="filter-select"
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          
          <option value="დაბალი">დაბალი</option>
          <option value="საშუალო">საშუალო</option>
          <option value="მაღალი">მაღალი</option>
        </select>
      </div>

      {/* Employee Filter */}
      <div className="filter-item">
        <label className="filter-label">თანამშრომელი</label>
        <select
          className="filter-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          
          {employees.map((emp) => (
            <option key={emp.id} value={emp.name}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
