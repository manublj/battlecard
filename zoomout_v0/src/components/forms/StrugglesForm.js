import React, { useState } from "react";

const StrugglesForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        struggle_id: "",
        struggle_name: "",
        struggle_description: "",
        contradiction_id: "",
        linked_issues: [],
        scale: "Local", // Default value
        form: "",
        sector: "",
        historical_development: "",
        current_status: "Active", // Default value
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (name, value) => {
        setFormData({ ...formData, [name]: value.split(",").map((item) => item.trim()) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="struggle_name"
                value={formData.struggle_name}
                onChange={handleChange}
                placeholder="Struggle Name"
                required
            />
            <textarea
                name="struggle_description"
                value={formData.struggle_description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <input
                name="contradiction_id"
                value={formData.contradiction_id}
                onChange={handleChange}
                placeholder="Contradiction ID"
            />
            <textarea
                name="linked_issues"
                value={formData.linked_issues.join(", ")}
                onChange={(e) => handleArrayChange("linked_issues", e.target.value)}
                placeholder="Linked Issues (comma-separated)"
            />
            <select
                name="scale"
                value={formData.scale}
                onChange={handleChange}
            >
                <option value="Local">Local</option>
                <option value="National">National</option>
                <option value="Global">Global</option>
            </select>
            <input
                name="form"
                value={formData.form}
                onChange={handleChange}
                placeholder="Form (e.g., Electoral, Direct Action)"
            />
            <input
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                placeholder="Sector (e.g., Economic, Political)"
            />
            <textarea
                name="historical_development"
                value={formData.historical_development}
                onChange={handleChange}
                placeholder="Historical Development"
            />
            <select
                name="current_status"
                value={formData.current_status}
                onChange={handleChange}
            >
                <option value="Active">Active</option>
                <option value="Dormant">Dormant</option>
                <option value="Concluded">Concluded</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    );
};

export default StrugglesForm;

