"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // states
  const [cities, setCities] = useState<
    Array<{
      Id: number;
      Name: string;
      Districts: Array<{ Id: number; Name: string }>;
    }>
  >();
  const [selectedCity, setSelectedCity] = useState<number>(-1);
  const [districts, setDistricts] = useState<{ Id: number; Name: string }[]>();

  // useEffects
  useEffect(() => {
    const _districts = cities?.find(
      (city) => city.Id === selectedCity
    )?.Districts;

    setDistricts(_districts);
  }, [selectedCity]);

  useEffect(() => {
    (async () => {
      const request = await fetch("http://localhost:3000/api/city");
      const response = await request.json();

      setCities(response);
    })();
  }, []);

  return (
    <main>
      <select onChange={(event) => setSelectedCity(Number(event.target.value))}>
        {cities?.map((city, index) => (
          <option key={index} value={city.Id}>
            {city.Name}
          </option>
        ))}
      </select>

      <select>
        {districts?.map((district, index) => (
          <option key={index} value={district.Id}>
            {district.Name}
          </option>
        ))}
      </select>
    </main>
  );
}
