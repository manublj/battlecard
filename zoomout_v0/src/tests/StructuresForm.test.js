import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StructuresForm from "../components/forms/StructuresForm";

test("renders StructuresForm and submits data with evolution entries", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(<StructuresForm onSubmit={handleSubmit} />);

    fireEvent.change(getByPlaceholderText("Structure Name"), { target: { value: "Test Structure" } });
    fireEvent.change(getByPlaceholderText("Structure Type (e.g., Economic, Political)"), {
        target: { value: "Economic" },
    });
    fireEvent.change(getByPlaceholderText("Description"), { target: { value: "Test Description" } });

    fireEvent.click(getByText("Add Evolution Entry"));
    fireEvent.change(getByPlaceholderText("Date"), { target: { value: "2025-04-06" } });
    fireEvent.change(getByPlaceholderText("Transformation Type"), { target: { value: "Reform" } });
    fireEvent.change(getByPlaceholderText("Description"), { target: { value: "Major reform in structure." } });

    fireEvent.click(getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
            structure_name: "Test Structure",
            structure_type: "Economic",
            description: "Test Description",
            structure_evolution: [
                { date: "2025-04-06", type: "Reform", description: "Major reform in structure." },
            ],
        })
    );
});