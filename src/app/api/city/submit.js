const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "10062004",
  database: "postgres"
});

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, surname, email, phoneNumber, cityId, districtId } = req.body;

  console.log('Received data:', { name, surname, email, phoneNumber, cityId, districtId });

  if (!name || !surname || !email || !phoneNumber || cityId === -1 || districtId === -1) {
    console.log('Missing required fields');
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await client.connect();
    console.log('Connected to the database');

    const query = `
      INSERT INTO submissions (name, surname, email, phone_number, city_id, district_id, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id;
    `;

    const values = [name, surname, email, phoneNumber, cityId, districtId];
    console.log('Executing query:', query, 'with values:', values);

    const result = await client.query(query, values);

    console.log('Query result:', result);
    res.status(200).json({ message: "Submission successful", id: result.rows[0].id });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
};


