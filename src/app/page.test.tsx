import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; // React bileşenleri için kütüphane
import "@testing-library/jest-dom/extend-expect"; //

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
  } as Response),
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
    render(<Home />);

    const cityOptions = await screen.findAllByRole("option");
    expect(cityOptions).toHaveLength(3); // Including the default empty option
    expect(cityOptions[1]).toHaveTextContent("City 1");
    expect(cityOptions[2]).toHaveTextContent("City 2");
  });

  it("should display districts when a city is selected", async () => {
    render(<Home />);

    const cityOptions = await screen.findAllByRole("option");
    fireEvent.change(cityOptions[1], { target: { value: "1" } });

    await waitFor(() => {
      const districtOptions = screen.getAllByRole("option");
      expect(districtOptions).toHaveLength(2);
      expect(districtOptions[0]).toHaveTextContent("District 1");
      expect(districtOptions[1]).toHaveTextContent("District 2");
    });
  });
});
