"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // states
  const [cities, setCities] = useState<{ Id: number; Name: string }[]>();
  const [districts, setDistricts] = useState<{ Id: number; Name: string }[]>();

  // useEffects
  useEffect(() => {
    (async () => {
      const request = await fetch("http://localhost:3000/api/city");
      const response = await request.json();

      setCities(response);
    })();
  }, []);

  return (
    <main>
      <select
        onChange={(event) => {
          console.log(event.target.value);
        }}
      >
        {cities?.map((city) => (
          <option value={city.Id}>{city.Name}</option>
        ))}
      </select>

      <select></select>
    </main>
  );
}
