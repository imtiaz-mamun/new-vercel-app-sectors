const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5555;
// const corsOptions = {
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// };
app.use(cors());
// app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
app.use(express.json());

// const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database('database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    agree BOOLEAN NOT NULL
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY,
    name TEXT
  )
`);
db.serialize(() => {
  const sectorsData = [
    [1, 'Manufacturing'],
    [19, 'Construction materials'],
    [18, 'Electronics and Optics'],
    [6, 'Food and Beverage'],
    [342, 'Bakery & confectionery products'],
    [43, 'Beverages'],
    [42, 'Fish & fish products'],
    [40, 'Meat & meat products'],
    [39, 'Milk & dairy products'],
    [437, 'Other'],
    [378, 'Sweets & snack food'],
    [13, 'Furniture'],
    [389, 'Bathroom/sauna'],
    [385, 'Bedroom'],
    [390, 'Children’s room'],
    [98, 'Kitchen'],
    [101, 'Living room'],
    [392, 'Office'],
    [394, 'Other [Furniture]'],
    [341, 'Outdoor'],
    [99, 'Project furniture'],
    [12, 'Machinery'],
    [94, 'Machinery components'],
    [91, 'Machinery equipment/tools'],
    [224, 'Manufacture of machinery'],
    [97, 'Maritime'],
    [271, 'Aluminium and steel workboats'],
    [269, 'Boat/Yacht building'],
    [230, 'Ship repair and conversion'],
    [93, 'Metal structures'],
    [508, 'Other'],
    [227, 'Repair and maintenance service'],
    [11, 'Metalworking'],
    [67, 'Construction of metal structures'],
    [263, 'Houses and buildings'],
    [267, 'Metal products'],
    [542, 'Metal works'],
    [75, 'CNC-machining'],
    [62, 'Forgings, Fasteners'],
    [69, 'Gas, Plasma, Laser cutting'],
    [66, 'MIG, TIG, Aluminum welding'],
    [9, 'Plastic and Rubber'],
    [54, 'Packaging'],
    [556, 'Plastic goods'],
    [559, 'Plastic processing technology'],
    [55, 'Blowing'],
    [57, 'Moulding'],
    [53, 'Plastics welding and processing'],
    [560, 'Plastic profiles'],
    [5, 'Printing'],
    [148, 'Advertising'],
    [150, 'Book/Periodicals printing'],
    [145, 'Labelling and packaging printing'],
    [7, 'Textile and Clothing'],
    [44, 'Clothing'],
    [45, 'Textile'],
    [8, 'Wood'],
    [337, 'Other [Wood]'],
    [51, 'Wooden building materials'],
    [47, 'Wooden houses'],
    [3, 'Other'],
    [37, 'Creative industries'],
    [29, 'Energy technology'],
    [33, 'Environment'],
    [2, 'Service'],
    [25, 'Business services'],
    [35, 'Engineering'],
    [28, 'Information Technology and Telecommunications'],
    [581, 'Data processing, Web portals, E-marketing'],
    [576, 'Programming, Consultancy'],
    [121, 'Software, Hardware'],
    [122, 'Telecommunications'],
    [22, 'Tourism'],
    [141, 'Translation services'],
    [21, 'Transport and Logistics'],
    [111, 'Air'],
    [114, 'Rail'],
    [112, 'Road'],
    [113, 'Water'],
  ];

  const insertQuery = db.prepare('INSERT INTO sectors (id, name) VALUES (?, ?)');

  sectorsData.forEach(entry => {
    insertQuery.run(entry, err => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  insertQuery.finalize();
});


app.post('/api/saveFormData', (req, res) => {
  const { name, sectors, agree } = req.body;
  // Validation
  if (!name || sectors.length === 0 || !agree) {
    return res.status(400).json({ error: 'All fields are mandatory' });
  }
  db.run(
    'INSERT INTO users (name, sector, agree) VALUES (?, ?, ?)',
    [name, sectors.join(','), agree],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save data to the database' });
      }

      res.json({ id: this.lastID, name, sectors, agree });
    }
  );
});
app.get('/api/getAllData', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch data from the database' });
    }

    res.json({ data: rows });
  });
});
app.get('/api/sectors', (req, res) => {
  db.all('SELECT * FROM sectors', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ sectors: rows });
  });
});
app.post('/api/updateFormData', (req, res) => {
  const { id, name, sectors, agree } = req.body;
  // Validation
  if (!name || sectors.length === 0 || !agree || !id) {
    return res.status(400).json({ error: 'All fields are mandatory' });
  }
  try{
    const query = `UPDATE users SET name = ?, sector = ?, agree = ? WHERE id = ?`;

    db.run(query, [name, sectors.join(','), agree, id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update the database:: ' + err });
      }
      return res.status(200).json({ success: 'Update successful' });
    });
  }
  catch (error){
    console.error(error);
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
