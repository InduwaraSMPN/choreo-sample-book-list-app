# Database Setup for Reading List Service

This service has been updated to use a Choreo managed MySQL database instead of in-memory cache.

## Configuration

### Choreo Component Configuration

The service is configured to use a Choreo managed database through the `component.yaml` file:

```yaml
dependencies:
  connectionReferences:
    - name: Database Connection
      resourceRef: database:MySQLDatabase/BOOKS_DB
```

### Environment Variables

The following environment variables are automatically injected by Choreo when the database connection is configured:

- `CHOREO_DATABASE_CONNECTION_HOSTNAME` - Database hostname
- `CHOREO_DATABASE_CONNECTION_PORT` - Database port (defaults to 3306)
- `CHOREO_DATABASE_CONNECTION_USERNAME` - Database username
- `CHOREO_DATABASE_CONNECTION_PASSWORD` - Database password
- `CHOREO_DATABASE_CONNECTION_DATABASENAME` - Database name

## Database Schema

The service automatically creates the required table on startup:

```sql
CREATE TABLE IF NOT EXISTS books (
  uuid VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  status ENUM('read', 'to_read', 'reading') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Setup Steps

1. **Create a Choreo Managed Database**
   - In your Choreo project, create a new MySQL database
   - Note the resource identifier for the database

2. **Update Component Configuration**
   - The component.yaml file is already configured to use the database connection `database:MySQLDatabase/BOOKS_DB`

3. **Deploy the Service**
   - Deploy the service to Choreo
   - The database connection will be automatically configured through environment variables

## Local Development

For local development, you can set the environment variables manually:

```bash
export CHOREO_DATABASE_CONNECTION_HOSTNAME=localhost
export CHOREO_DATABASE_CONNECTION_PORT=3306
export CHOREO_DATABASE_CONNECTION_USERNAME=your_username
export CHOREO_DATABASE_CONNECTION_PASSWORD=your_password
export CHOREO_DATABASE_CONNECTION_DATABASENAME=your_database
```

## Features

- **Automatic Connection Management**: Connection pooling with automatic reconnection
- **Table Initialization**: Automatically creates the books table if it doesn't exist
- **Error Handling**: Comprehensive error handling for database operations
- **Graceful Shutdown**: Properly closes database connections on application shutdown

## API Endpoints

The API endpoints remain the same:

- `POST /reading-list/books` - Add a new book
- `GET /reading-list/books` - Get all books
- `GET /reading-list/books/:uuid` - Get a specific book
- `PUT /reading-list/books/:uuid` - Update book status
- `DELETE /reading-list/books/:uuid` - Delete a book
- `GET /healthz` - Health check

## Migration from In-Memory Cache

The service has been updated to use MySQL database instead of the previous in-memory NodeCache. The API interface remains exactly the same, ensuring backward compatibility with existing clients.

Key changes:
- Replaced `cache.mjs` with `database.mjs`
- All endpoints now use async/await for database operations
- Added proper error handling for database failures
- Data is now persistent across service restarts
