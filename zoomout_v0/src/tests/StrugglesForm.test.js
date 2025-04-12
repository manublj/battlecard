import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StrugglesForm from "../components/forms/StrugglesForm";

test("renders StrugglesForm and submits data", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(<StrugglesForm onSubmit={handleSubmit} />);

    fireEvent.change(getByPlaceholderText("Struggle Name"), { target: { value: "Test Struggle" } });
    fireEvent.change(getByPlaceholderText("Description"), { target: { value: "Test Description" } });
    fireEvent.click(getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
            struggle_name: "Test Struggle",
            struggle_description: "Test Description",
        })
    );
});