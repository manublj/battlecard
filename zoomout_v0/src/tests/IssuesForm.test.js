import React from "react";
import { render, fireEvent } from "@testing-library/react";
import IssuesForm from "../components/forms/IssuesForm";

test("renders IssuesForm and submits data", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(<IssuesForm onSubmit={handleSubmit} />);

    fireEvent.change(getByPlaceholderText("Issue Title"), { target: { value: "Test Issue" } });
    fireEvent.change(getByPlaceholderText("Description"), { target: { value: "Test Description" } });
    fireEvent.click(getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
            issue_title: "Test Issue",
            issue_description: "Test Description",
        })
    );
});