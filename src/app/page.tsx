"use client";

import { useEffect, useState } from "react";
import './styles.css';

interface City {
  Id: number;
  Name: string;
  Districts: District[];
}

interface District {
  Id: number;
  Name: string;
}

const CitySelector = ({
  cities,
  onCityChange,
}: {
  cities: City[] | undefined;
  onCityChange: (cityId: number) => void;
}) => (
  <select onChange={(event) => onCityChange(Number(event.target.value))}>
    <option value="-1">Şehir seçiniz</option>
    {cities?.map((city) => (
      <option key={city.Id} value={city.Id}>
        {city.Name}
      </option>
    ))}
  </select>
);

const DistrictSelector = ({
  districts,
}: {
  districts: District[] | undefined;
}) => (
  <select>
    <option value="-1">İlçe seçiniz</option>
    {districts?.map((district) => (
      <option key={district.Id} value={district.Id}>
        {district.Name}
      </option>
    ))}
  </select>
);

export default function Home() {
  const [form, setForm] = useState<Partial<{name:string, surname:string, email:string, phoneNumber:string}>>()
  


  const [cities, setCities] = useState<City[]>();
  const [selectedCity, setSelectedCity] = useState<number>(-1);
  const [districts, setDistricts] = useState<District[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (selectedCity !== -1) {
      const _districts = cities?.find((city) => city.Id === selectedCity)
        ?.Districts;
      setDistricts(_districts);
    } else {
      setDistricts([]);
    }
  }, [selectedCity, cities]);

  useEffect(() => {
    (async () => {
      try {
        const request = await fetch("/api/city/get");
        const response = await request.json();
        setCities(response);
      } catch (err) {
        setError("Failed to fetch cities.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/city/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         ...form,
          cityId: selectedCity,
          districtId: districts?.[0]?.Id ?? -1,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Submission successful! ID: ${result.id}`);
      } else {
        const errorData = await response.json();
        console.error('Submission failed:', errorData);
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(form  => ({...form, [event.target.name]:event.target.value}))
  }

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main>
      <h1>Personel Giriş Formu</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ad"
          name="name"
          onChange={handleOnChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Soyad"
          onChange={handleOnChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleOnChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Telefon numarası"
          onChange={handleOnChange}
          required
        />
        <CitySelector cities={cities} onCityChange={setSelectedCity} />
        <DistrictSelector districts={districts} />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
