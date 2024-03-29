const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const db = mysql.createConnection({
  host: 'bnlqvl6nsimavq6mjgpm-mysql.services.clever-cloud.com',
  port: 3306,
  user: 'uiwzc9ro5m2tlko9',
  password: 'QBwhJpP459weq7kVJMLI',
  database: 'bnlqvl6nsimavq6mjgpm'
});


//----------------------------------------------------------Driver APP

// Route to handle updating location
app.post('/update-location', (req, res) => {
  const { bus_number, latitude, longitude } = req.body;

  db.query(
    'UPDATE location SET latitude = ?, longitude = ? WHERE bus_number = ?',
    [latitude, longitude, bus_number],
    (error, results) => {
      if (error) {
        console.error('Error updating location:', error);
        res.status(500).send('Error updating location');
      } else {
        res.status(200).send('Location updated successfully');
      }
    }
  );
});

//----------------------------------------------------------Admin APP

// Route to fetch student details
app.get('/students', (req, res) => {
  db.query(
    'SELECT * FROM student',
    (error, results) => {
      if (error) {
        console.error('Error fetching student details:', error);
        res.status(500).send('Error fetching student details');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.delete('/student/:register_number', (req, res) => {
  const register_number = req.params.register_number;

  db.query(
    'DELETE FROM student WHERE register_number = ?',
    [register_number],
    (error, results) => {
      if (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
      } else {
        res.status(200).send('Student deleted successfully');
      }
    }
  );
});

// Route to fetch bus locations
app.get('/bus-locations', (req, res) => {
  db.query(
    'SELECT * FROM location',
    (error, results) => {
      if (error) {
        console.error('Error fetching bus locations:', error);
        res.status(500).send('Error fetching bus locations');
      } else {
        const busLocations = {};
        results.forEach((row) => {
          busLocations[row.bus_number] = {
            latitude: row.latitude,
            longitude: row.longitude
          };
        });
        res.status(200).json(busLocations);
      }
    }
  );
});

// Route to delete all records of a given admission year
app.delete('/delete-student/:admission_year', (req, res) => {
  const admission_year = req.params.admission_year;

  db.query(
    'DELETE FROM student WHERE admission_year = ?',
    [admission_year],
    (error, results) => {
      if (error) {
        console.error('Error deleting students of admission year:', error);
        res.status(500).send('Error deleting students of admission year');
      } else {
        res.status(200).send('Students of admission year deleted successfully');
      }
    }
  );
});

// Route to fetch delivered messages
app.get('/delivered-messages', (req, res) => {
  db.query(
    'SELECT * FROM message',
    (error, results) => {
      if (error) {
        console.error('Error fetching student details:', error);
        res.status(500).send('Error fetching student details');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Route to delete a specific message
app.delete('/message/:msg_id', (req, res) => {
  const msg_id = req.params.msg_id;

  db.query(
    'DELETE FROM message WHERE msg_id = ?',
    [msg_id],
    (error, results) => {
      if (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Error deleting message');
      } else {
        res.status(200).send('Message deleted successfully');
      }
    }
  );
});

// Route to delete all messages
app.delete('/delete-all-messages', (req, res) => {
  db.query(
    'DELETE FROM message',
    (error, results) => {
      if (error) {
        console.error('Error deleting all messages:', error);
        res.status(500).send('Error deleting all messages');
      } else {
        res.status(200).send('All messages deleted successfully');
      }
    }
  );
});

// Route to handle composing and sending messages
app.post('/compose-message', (req, res) => {
  const { subject, description, 'rec-dept': recDept, 'rec-year': recYear } = req.body;

  db.query(
    'INSERT INTO message (subject, description, `rec-dept`, `rec-year`) VALUES (?, ?, ?, ?)',
    [subject, description, JSON.stringify(recDept), JSON.stringify(recYear)],
    (error, results) => {
      if (error) {
        console.error('Error composing message:', error);
        res.status(500).send('Error composing message');
      } else {
        res.status(200).send('Message composed and sent successfully');
      }
    }
  );
});

// Route to update student information
app.put('/student/:older_register_number', (req, res) => {
  console.log('Request Body:', req.body); 
  const old_register_number = req.params.older_register_number;
  const { register_number, email_id, full_name, department, admission_year, bus_from, bus_number, pass_status, amount_paid, paid_on, pass_expires_on, dob } = req.body;
  db.query(
    'UPDATE student SET register_number= ?, email_id = ?, full_name = ?, department = ?, admission_year = ?, bus_from = ?, bus_number = ?,pass_status = ?, amount_paid = ?, paid_on = ?, pass_expires_on = ?, `dob` = ? WHERE register_number = ?',
    [register_number, email_id, full_name, department, admission_year, bus_from, bus_number, pass_status, amount_paid, paid_on, pass_expires_on, dob, old_register_number],
    (error, results) => {
      if (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Error updating student');
      } else {
        res.status(200).send('Student updated successfully');
      }
    }
  );
});


//----------------------------------------------------------Student APP

// Route to handle user registration
app.post('/register', (req, res) => {
  const { register_number, email_id, full_name, department, admission_year, dob } = req.body;

  db.query(
    'INSERT INTO student (register_number, email_id, full_name, department, admission_year, dob) VALUES (?, ?, ?, ?, ?, ?)',
    [register_number, email_id, full_name, department, admission_year, dob],
    (error, results) => {
      if (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
      } else {
        res.status(200).send('User registered successfully');
      }
    }
  );
});

// Route to handle user login
app.post('/login', (req, res) => {
  const registerNumber = req.body.registerNumber;
  const dob = req.body.dob;

  db.execute(
    "SELECT * FROM student WHERE register_number = ? AND dob = ?",
    [registerNumber, dob],
    (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (result.length > 0) {
        // If login is successful, return all student data
        res.status(200).json(result[0]);
      } else {
        // If login fails, return a generic message
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  );
});

// Route to get message for specific year and dept
app.get('/delivered-messages/:admission_year/:department', (req, res) => {
  const { admission_year, department } = req.params;

  // Query the database to fetch messages that match the user's admission year and department,
  // as well as messages intended for all users
  db.query(
    'SELECT * FROM message WHERE (JSON_CONTAINS(`rec-year`, ?, "$") OR JSON_CONTAINS(`rec-year`, \'["All"]\', "$")) AND (JSON_CONTAINS(`rec-dept`, ?, "$") OR JSON_CONTAINS(`rec-dept`, \'["All"]\', "$"))',
    [JSON.stringify(admission_year), JSON.stringify(department)],
    (error, results) => {
      if (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Error fetching messages');
      } else {
        res.status(200).json(results);
      }
    }
  );
});






server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
