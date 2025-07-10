import mysql from 'mysql2/promise';

class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Read database configuration from Choreo environment variables
      const config = {
        host: process.env.CHOREO_DATABASE_CONNECTION_HOSTNAME,
        port: process.env.CHOREO_DATABASE_CONNECTION_PORT || 3306,
        user: process.env.CHOREO_DATABASE_CONNECTION_USERNAME,
        password: process.env.CHOREO_DATABASE_CONNECTION_PASSWORD,
        database: process.env.CHOREO_DATABASE_CONNECTION_DATABASENAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
      };

      // Validate required environment variables
      if (!config.host || !config.user || !config.password || !config.database) {
        throw new Error('Missing required database configuration. Please ensure CHOREO_DATABASE_CONNECTION_* environment variables are set.');
      }

      console.log('Connecting to MySQL database...');
      this.connection = mysql.createPool(config);
      
      // Test the connection
      await this.connection.execute('SELECT 1');
      this.isConnected = true;
      
      // Initialize the books table if it doesn't exist
      await this.initializeTable();
      
      console.log('Successfully connected to MySQL database');
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
      throw error;
    }
  }

  async initializeTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        uuid VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        status ENUM('read', 'to_read', 'reading') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    try {
      await this.connection.execute(createTableQuery);
      console.log('Books table initialized successfully');
    } catch (error) {
      console.error('Failed to initialize books table:', error.message);
      throw error;
    }
  }

  async addBook(uuid, title, author, status) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const query = 'INSERT INTO books (uuid, title, author, status) VALUES (?, ?, ?, ?)';
    
    try {
      await this.connection.execute(query, [uuid, title, author, status]);
      return { uuid, title, author, status };
    } catch (error) {
      console.error('Failed to add book:', error.message);
      throw error;
    }
  }

  async getBook(uuid) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const query = 'SELECT uuid, title, author, status FROM books WHERE uuid = ?';
    
    try {
      const [rows] = await this.connection.execute(query, [uuid]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Failed to get book:', error.message);
      throw error;
    }
  }

  async getAllBooks() {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const query = 'SELECT uuid, title, author, status FROM books ORDER BY created_at DESC';
    
    try {
      const [rows] = await this.connection.execute(query);
      // Convert array to object format to match existing API
      const result = {};
      rows.forEach(book => {
        result[book.uuid] = book;
      });
      return result;
    } catch (error) {
      console.error('Failed to get all books:', error.message);
      throw error;
    }
  }

  async updateBookStatus(uuid, status) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const query = 'UPDATE books SET status = ? WHERE uuid = ?';
    
    try {
      const [result] = await this.connection.execute(query, [status, uuid]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Failed to update book status:', error.message);
      throw error;
    }
  }

  async deleteBook(uuid) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const query = 'DELETE FROM books WHERE uuid = ?';
    
    try {
      const [result] = await this.connection.execute(query, [uuid]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Failed to delete book:', error.message);
      throw error;
    }
  }

  async bookExists(uuid) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const query = 'SELECT COUNT(*) as count FROM books WHERE uuid = ?';
    
    try {
      const [rows] = await this.connection.execute(query, [uuid]);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Failed to check if book exists:', error.message);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.isConnected = false;
      console.log('Database connection closed');
    }
  }
}

// Create and export a singleton instance
const database = new Database();
export default database;
