import React, { useState } from "react";

const ContradictionsForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        contradiction_id: "",
        first_major_flashpoint_event_id: "",
        contradiction_type: "",
        contradiction_description: "",
        contradiction_status: "Latent", // Default value
        contradiction_intensity: "Neutralizing", // Default value
        root_structure: "",
        linked_struggles: [],
        linked_issues: [],
        contradiction_priority: "Secondary", // Default value
        historical_motion: "",
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
                name="contradiction_id"
                value={formData.contradiction_id}
                onChange={handleChange}
                placeholder="Contradiction ID"
                required
            />
            <input
                name="first_major_flashpoint_event_id"
                value={formData.first_major_flashpoint_event_id}
                onChange={handleChange}
                placeholder="First Major Flashpoint Event ID"
            />
            <input
                name="contradiction_type"
                value={formData.contradiction_type}
                onChange={handleChange}
                placeholder="Contradiction Type (e.g., Class, Caste)"
            />
            <textarea
                name="contradiction_description"
                value={formData.contradiction_description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <select
                name="contradiction_status"
                value={formData.contradiction_status}
                onChange={handleChange}
            >
                <option value="Latent">Latent</option>
                <option value="Developing">Developing</option>
                <option value="Sharp">Sharp</option>
                <option value="Explosive">Explosive</option>
            </select>
            <select
                name="contradiction_intensity"
                value={formData.contradiction_intensity}
                onChange={handleChange}
            >
                <option value="Sharpening">Sharpening</option>
                <option value="Neutralizing">Neutralizing</option>
                <option value="Transforming">Transforming</option>
            </select>
            <input
                name="root_structure"
                value={formData.root_structure}
                onChange={handleChange}
                placeholder="Root Structure"
            />
            <textarea
                name="linked_struggles"
                value={formData.linked_struggles.join(", ")}
                onChange={(e) => handleArrayChange("linked_struggles", e.target.value)}
                placeholder="Linked Struggles (comma-separated)"
            />
            <textarea
                name="linked_issues"
                value={formData.linked_issues.join(", ")}
                onChange={(e) => handleArrayChange("linked_issues", e.target.value)}
                placeholder="Linked Issues (comma-separated)"
            />
            <select
                name="contradiction_priority"
                value={formData.contradiction_priority}
                onChange={handleChange}
            >
                <option value="Principal">Principal</option>
                <option value="Secondary">Secondary</option>
                <option value="Tertiary">Tertiary</option>
            </select>
            <textarea
                name="historical_motion"
                value={formData.historical_motion}
                onChange={handleChange}
                placeholder="Historical Motion"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ContradictionsForm;

