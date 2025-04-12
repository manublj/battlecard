import React, { useState } from "react";

const IssuesForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        issue_id: "",
        issue_title: "",
        issue_description: "",
        issue_event_id: "",
        contradiction_id: "",
        struggle_id: "",
        issue_status: "Developing", // Default value
        issue_timeline_events: [],
        stance_1_headlines: [],
        stance_1_description: "",
        stance_1_events: [],
        stance_2_headlines: [],
        stance_2_description: "",
        stance_2_events: [],
        stance_3_headlines: [],
        stance_3_description: "",
        stance_3_events: [],
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
                name="issue_title"
                value={formData.issue_title}
                onChange={handleChange}
                placeholder="Issue Title"
                required
            />
            <textarea
                name="issue_description"
                value={formData.issue_description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <input
                name="issue_event_id"
                value={formData.issue_event_id}
                onChange={handleChange}
                placeholder="Event ID"
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
            <select
                name="issue_status"
                value={formData.issue_status}
                onChange={handleChange}
            >
                <option value="Developing">Developing</option>
                <option value="Peaking">Peaking</option>
                <option value="Resolving">Resolving</option>
            </select>
            <textarea
                name="issue_timeline_events"
                value={formData.issue_timeline_events.join(", ")}
                onChange={(e) => handleArrayChange("issue_timeline_events", e.target.value)}
                placeholder="Timeline Events (comma-separated)"
            />
            <textarea
                name="stance_1_headlines"
                value={formData.stance_1_headlines.join(", ")}
                onChange={(e) => handleArrayChange("stance_1_headlines", e.target.value)}
                placeholder="Stance 1 Headlines (comma-separated)"
            />
            <textarea
                name="stance_1_description"
                value={formData.stance_1_description}
                onChange={handleChange}
                placeholder="Stance 1 Description"
            />
            <textarea
                name="stance_1_events"
                value={formData.stance_1_events.join(", ")}
                onChange={(e) => handleArrayChange("stance_1_events", e.target.value)}
                placeholder="Stance 1 Events (comma-separated)"
            />
            <textarea
                name="stance_2_headlines"
                value={formData.stance_2_headlines.join(", ")}
                onChange={(e) => handleArrayChange("stance_2_headlines", e.target.value)}
                placeholder="Stance 2 Headlines (comma-separated)"
            />
            <textarea
                name="stance_2_description"
                value={formData.stance_2_description}
                onChange={handleChange}
                placeholder="Stance 2 Description"
            />
            <textarea
                name="stance_2_events"
                value={formData.stance_2_events.join(", ")}
                onChange={(e) => handleArrayChange("stance_2_events", e.target.value)}
                placeholder="Stance 2 Events (comma-separated)"
            />
            <textarea
                name="stance_3_headlines"
                value={formData.stance_3_headlines.join(", ")}
                onChange={(e) => handleArrayChange("stance_3_headlines", e.target.value)}
                placeholder="Stance 3 Headlines (comma-separated)"
            />
            <textarea
                name="stance_3_description"
                value={formData.stance_3_description}
                onChange={handleChange}
                placeholder="Stance 3 Description"
            />
            <textarea
                name="stance_3_events"
                value={formData.stance_3_events.join(", ")}
                onChange={(e) => handleArrayChange("stance_3_events", e.target.value)}
                placeholder="Stance 3 Events (comma-separated)"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default IssuesForm;

