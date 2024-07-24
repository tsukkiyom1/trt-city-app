import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import '@testing-library/jest-dom';
import Home from "./page";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve([
        {
          Id: 1,
          Name: "City 1",
          Districts: [
            { Id: 1, Name: "District 1" },
            { Id: 2, Name: "District 2" },
          ],
        },
        {
          Id: 2,
          Name: "City 2",
          Districts: [
            { Id: 3, Name: "District 3" },
            { Id: 4, Name: "District 4" },
          ],
        },
      ]),
  } as unknown as Response) // Cast to Response to match the type
);

describe("Home component", () => {
  it("should render without crashing", async () => {
    render(<Home />);

    const cityDropdown = await screen.findByRole("combobox", { name: "" });
    expect(cityDropdown).toBeInTheDocument();

    const districtDropdown = screen.getByRole("combobox", { name: "" });
    expect(districtDropdown).toBeInTheDocument();
  });

  it("should fetch and display cities", async () => {
   

    const cityOptions = await screen.findAllByRole("option");
    expect(cityOptions).toHaveLength(3); // Including the default empty option
    expect(cityOptions[1]).toHaveTextContent("City 1");
    expect(cityOptions[2]).toHaveTextContent("City 2");
  });

  it("should display districts when a city is selected", async () => {
   

    const cityDropdown = await screen.findByRole("combobox", { name: "" });
    fireEvent.change(cityDropdown, { target: { value: "1" } });

    await waitFor(() => {
      const districtOptions = screen.getAllByRole("option");
      expect(districtOptions).toHaveLength(2);
      expect(districtOptions[0]).toHaveTextContent("District 1");
      expect(districtOptions[1]).toHaveTextContent("District 2");
    });
  });
});
