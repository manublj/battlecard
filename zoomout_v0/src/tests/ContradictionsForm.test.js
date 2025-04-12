import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ContradictionsForm from "../components/forms/ContradictionsForm";

test("renders ContradictionsForm and submits data", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(<ContradictionsForm onSubmit={handleSubmit} />);

    fireEvent.change(getByPlaceholderText("Contradiction ID"), { target: { value: "TestContradiction" } });
    fireEvent.change(getByPlaceholderText("Description"), { target: { value: "Test Description" } });
    fireEvent.click(getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
            contradiction_id: "TestContradiction",
            contradiction_description: "Test Description",
        })
    );
});