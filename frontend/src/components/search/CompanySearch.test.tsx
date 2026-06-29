import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompanySearch } from "./CompanySearch.js";

describe("CompanySearch", () => {
  it("requires a company name", () => {
    const onSubmit = vi.fn();
    render(<CompanySearch onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /analyze/i }));

    expect(screen.getByText(/enter a public company name/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits trimmed company names", () => {
    const onSubmit = vi.fn();
    render(<CompanySearch onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: "  Apple  " } });
    fireEvent.click(screen.getByRole("button", { name: /analyze/i }));

    expect(onSubmit).toHaveBeenCalledWith("Apple");
  });
});
