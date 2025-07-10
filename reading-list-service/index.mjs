import app from "./app.mjs";
import database from "./database.mjs";

const PORT = parseInt(process.env.PORT) || 8080;

async function startServer() {
  try {
    // Initialize database connection
    await database.connect();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log('Database connection established');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await database.close();
  process.exit(0);
});

startServer();
