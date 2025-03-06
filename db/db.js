
//const mysql = require('mysql2');
//const dotenv = require('dotenv');
import mysql from 'mysql2'
import dotenv from 'dotenv'
//load environment variables from .env
dotenv.config();

//DB connection pool using .env variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();


//user authentication functions
export async function getUserByEmail(email) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
  }
}
export async function getUserById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error getting user by id:', error);
  }
}

//return a single ID, looked into these as an option for speeding up user landing page
export async function getIn_ID(email, value) {
  try {
    const [rows] = await pool.query('SELECT * FROM incoming_IDs WHERE email = ? && value = ?', [email, value]);
    console.log(rows);
    return rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
  }
}
export async function getRe_ID(email, value) {
  try {
    const [rows] = await pool.query('SELECT * FROM received_IDs WHERE email = ? && value = ?', [email, value]);
    console.log(rows);
    return rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

//getter functions to return user table or incoming/received ids for a certain user
export async function getIncoming(email) {
  try {
    const [rows] = await pool.query('SELECT * FROM incoming_IDs WHERE email = ? LIMIT 30', [email]);
    console.log(rows);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}



export async function getReceived(email) {
  try {
    const [rows] = await pool.query('SELECT * FROM received_IDs WHERE email = ? LIMIT 30', [email]);
    console.log(rows);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

export async function getUsers() {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    console.log(rows);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

//functions to add a user or add a new value to incoming/received ID tables

export async function insertIncoming(email, value) {
  try {
    if (!(await inIncoming(value, email))) {
      if(await inReceived(value, email))deleteReceived(email, value);
      const [result] = await pool.query('INSERT INTO incoming_IDs (email, value) VALUES (?, ?)', [email, value]);
      return true;
    } else {
      console.error('Value already in incoming table:', value);
      return false;
    }
  } catch (error) {
    console.error('Error inserting incoming ID:', error);
  }
}

export async function insertReceived(email, value) {
  try {
    if (!(await inReceived(value, email))) {
      if(await inIncoming(value, email))deleteIncoming(email, value);
      const [result] = await pool.query('INSERT INTO received_IDs (email, value) VALUES (?, ?)', [email, value]);
      return true;
    } else {
      console.error('Value already in received table:', value);
      return false;
    }
  } catch (error) {
    console.error('Error inserting received ID:', error);
  }
}

export async function insertUser(email, pass) { //stealing winAPI ideas
  try {
    if (!(await inUsers(email))) { 
      const [result] = await pool.query('INSERT INTO users (email, pass) VALUES (?, ?)', [email, pass]);
      return true;
    } else {
      console.error('User already registered:', email);
      return false;
    }
  } catch (error) {
    console.error('Error inserting user:', error);
  }
}

//functions to remove a specific user or value
export async function deleteReceived(email, value) {
  try {
    if (await inReceived(value, email)){
      const [result] = await pool.query('DELETE FROM received_IDs WHERE email = ? AND value = ?', [email, value]);
      return true;
    } else {
      console.error('Value not in received table:', value);
      return false;
    }
  } catch (error) {
    console.error('Error deleting received ID:', error);
  }
}
/*
export async function deleteReceived(email, value) {
  try {
    const [result] = await pool.query('DELETE FROM received_IDs WHERE email = ? AND value = ?', [email, value]);
    return getReceived(email);
  } catch (error) {
    console.error('Error popping received ID:', error);
  }
}
*/
export async function deleteIncoming(email, value) {
  try {
    if (await inIncoming(value, email)){
      const [result] = await pool.query('DELETE FROM incoming_IDs WHERE email = ? AND value = ?', [email, value]);
      return true;
    } else {
      console.error('Value not in incoming table:', value);
      return false;
    }
  } catch (error) {
    console.error('Error deleting incoming ID:', error);
  }
}
/*
export async function deleteIncoming(email, value) {
  try {
    const [result] = await pool.query('DELETE FROM incoming_IDs WHERE email = ? AND value = ?', [email, value]);
    return getIncoming(email);
  } catch (error) {
    console.error('Error popping incoming ID:', error);
  }
}
*/
export async function deleteUser(email) {
  try {
    //delete incoming and received IDs associated with the user
    await pool.query('DELETE FROM incoming_IDs WHERE email = ?', [email]);
    await pool.query('DELETE FROM received_IDs WHERE email = ?', [email]);

    //delete the user
    const [result] = await pool.query('DELETE FROM users WHERE email = ?', [email]);
    return getUsers();
  } catch (error) {
    console.error('Error popping user:', error);
  }
}

export async function inReceived(value, email) {
  try {
    const [result] = await pool.query('SELECT * FROM received_IDs WHERE value = ? AND email = ?', [value, email]);
    return result.length > 0;
  } catch (error) {
    console.error('Error checking email-value pair in received table:', error);
    return false;
  }
}
export async function inIncoming(value, email) {
    try {
      const [result] = await pool.query('SELECT * FROM incoming_IDs WHERE value = ? AND email = ?', [value, email]);
      return result.length > 0;
    } catch (error) {
      console.error('Error checking email-value pair in incoming table:', error);
      return false;
    }
  }
  
export async function inUsers(email) {
    try {
      const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return result.length > 0;
    } catch (error) {
      console.error('Error checking user presence in DB:', error);
      return false;
    }
  }
  
  
  //example usage
  /*
  getUsers()
    .then(users => console.log('Users:', users))
    .catch(error => console.error('Error getting users:', error));
  
  insertUser('jeff@fuck', 'dick')
    .then(users => console.log('Users after insertion:', users))
    .catch(error => console.error('Error inserting user:', error));
  
  insertReceived('jeff@fuck', '4498')
    .then(received => console.log('Received IDs after insertion:', received))
    .catch(error => console.error('Error inserting received ID:', error));
  
  insertIncoming('jeff@fuck', '22223')
    .then(incoming => console.log('Incoming IDs after insertion:', incoming))
    .catch(error => console.error('Error inserting incoming ID:', error));
    
  deleteUser('jeff@fuck')
    .then(users => console.log('Users after deletion:', users))
    .catch(error => console.error('Error deleting user:', error));
  
    getIncoming('jeff@fuckk')
    .then(incoming => console.log(''))
    .catch(error => console.error('Error getting incoming IDs:', error));
  */
