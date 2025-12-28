import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

await connectDB();

app.listen(PORT, () => {
  console.log(`✅ LankaTrips API running on http://localhost:${PORT}`);
});
