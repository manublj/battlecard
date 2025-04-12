import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RelationshipForm from "../components/forms/RelationshipForm";

test("renders RelationshipForm and submits data", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(<RelationshipForm onSubmit={handleSubmit} />);

    fireEvent.change(getByPlaceholderText("Entity 1"), { target: { value: "Entity A" } });
    fireEvent.change(getByPlaceholderText("Entity 2"), { target: { value: "Entity B" } });
    fireEvent.change(getByPlaceholderText("Relationship Type (e.g., Strategic Alliance, Conflict)"), {
        target: { value: "Strategic Alliance" },
    });
    fireEvent.click(getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
            entity_1: "Entity A",
            entity_2: "Entity B",
            relationship_type: "Strategic Alliance",
        })
    );
});