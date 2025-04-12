import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TimelinesForm from "../components/forms/TimelinesForm";

test("renders TimelinesForm and submits data", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(<TimelinesForm onSubmit={handleSubmit} />);

    fireEvent.change(getByPlaceholderText("Timeline Name"), { target: { value: "Test Timeline" } });
    fireEvent.change(getByPlaceholderText("Description"), { target: { value: "Test Description" } });
    fireEvent.click(getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
            timeline_name: "Test Timeline",
            description: "Test Description",
        })
    );
});