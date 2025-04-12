import React, { useState } from "react";

const RelationshipForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        relationship_id: "",
        entity_1: "",
        entity_2: "",
        relationship_type: "",
        contradiction_id: "",
        struggle_id: "",
        linked_events: [],
        relationship_timeline: [], // Array of objects
        historical_context: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (name, value) => {
        setFormData({ ...formData, [name]: value.split(",").map((item) => item.trim()) });
    };

    const handleTimelineChange = (index, field, value) => {
        const updatedTimeline = [...formData.relationship_timeline];
        updatedTimeline[index] = { ...updatedTimeline[index], [field]: value };
        setFormData({ ...formData, relationship_timeline: updatedTimeline });
    };

    const addTimelineEntry = () => {
        setFormData({
            ...formData,
            relationship_timeline: [...formData.relationship_timeline, { date: "", type: "", description: "" }],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="entity_1"
                value={formData.entity_1}
                onChange={handleChange}
                placeholder="Entity 1"
                required
            />
            <input
                name="entity_2"
                value={formData.entity_2}
                onChange={handleChange}
                placeholder="Entity 2"
                required
            />
            <input
                name="relationship_type"
                value={formData.relationship_type}
                onChange={handleChange}
                placeholder="Relationship Type (e.g., Strategic Alliance, Conflict)"
                required
            />
            <input
                name="contradiction_id"
                value={formData.contradiction_id}
                onChange={handleChange}
                placeholder="Contradiction ID"
            />
            <input
                name="struggle_id"
                value={formData.struggle_id}
                onChange={handleChange}
                placeholder="Struggle ID"
            />
            <textarea
                name="linked_events"
                value={formData.linked_events.join(", ")}
                onChange={(e) => handleArrayChange("linked_events", e.target.value)}
                placeholder="Linked Events (comma-separated)"
            />
            <div>
                <h4>Relationship Timeline</h4>
                {formData.relationship_timeline.map((entry, index) => (
                    <div key={index}>
                        <input
                            type="date"
                            value={entry.date}
                            onChange={(e) => handleTimelineChange(index, "date", e.target.value)}
                            placeholder="Date"
                        />
                        <input
                            value={entry.type}
                            onChange={(e) => handleTimelineChange(index, "type", e.target.value)}
                            placeholder="Shift Type"
                        />
                        <textarea
                            value={entry.description}
                            onChange={(e) => handleTimelineChange(index, "description", e.target.value)}
                            placeholder="Description"
                        />
                    </div>
                ))}
                <button type="button" onClick={addTimelineEntry}>
                    Add Timeline Entry
                </button>
            </div>
            <textarea
                name="historical_context"
                value={formData.historical_context}
                onChange={handleChange}
                placeholder="Historical Context"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default RelationshipForm;

