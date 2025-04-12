import React, { useState } from "react";

const StructuresForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        structure_id: "",
        structure_name: "",
        structure_type: "",
        description: "",
        linked_contradictions: [],
        linked_struggles: [],
        linked_entities: [],
        structure_evolution: [], // Array of objects with date, type, and description
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (name, value) => {
        setFormData({ ...formData, [name]: value.split(",").map((item) => item.trim()) });
    };

    const handleEvolutionChange = (index, field, value) => {
        const updatedEvolution = [...formData.structure_evolution];
        updatedEvolution[index] = { ...updatedEvolution[index], [field]: value };
        setFormData({ ...formData, structure_evolution: updatedEvolution });
    };

    const addEvolutionEntry = () => {
        setFormData({
            ...formData,
            structure_evolution: [...formData.structure_evolution, { date: "", type: "", description: "" }],
        });
    };

    const removeEvolutionEntry = (index) => {
        const updatedEvolution = formData.structure_evolution.filter((_, i) => i !== index);
        setFormData({ ...formData, structure_evolution: updatedEvolution });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="structure_name"
                value={formData.structure_name}
                onChange={handleChange}
                placeholder="Structure Name"
                required
            />
            <input
                name="structure_type"
                value={formData.structure_type}
                onChange={handleChange}
                placeholder="Structure Type (e.g., Economic, Political)"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <textarea
                name="linked_contradictions"
                value={formData.linked_contradictions.join(", ")}
                onChange={(e) => handleArrayChange("linked_contradictions", e.target.value)}
                placeholder="Linked Contradictions (comma-separated)"
            />
            <textarea
                name="linked_struggles"
                value={formData.linked_struggles.join(", ")}
                onChange={(e) => handleArrayChange("linked_struggles", e.target.value)}
                placeholder="Linked Struggles (comma-separated)"
            />
            <textarea
                name="linked_entities"
                value={formData.linked_entities.join(", ")}
                onChange={(e) => handleArrayChange("linked_entities", e.target.value)}
                placeholder="Linked Entities (comma-separated)"
            />
            <div>
                <h4>Structure Evolution</h4>
                {formData.structure_evolution.map((entry, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <input
                            type="date"
                            value={entry.date}
                            onChange={(e) => handleEvolutionChange(index, "date", e.target.value)}
                            placeholder="Date"
                            required
                        />
                        <input
                            value={entry.type}
                            onChange={(e) => handleEvolutionChange(index, "type", e.target.value)}
                            placeholder="Transformation Type"
                            required
                        />
                        <textarea
                            value={entry.description}
                            onChange={(e) => handleEvolutionChange(index, "description", e.target.value)}
                            placeholder="Description"
                            required
                        />
                        <button type="button" onClick={() => removeEvolutionEntry(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addEvolutionEntry}>
                    Add Evolution Entry
                </button>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default StructuresForm;