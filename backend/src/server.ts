import app from './app';
import { env } from './config/env';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`👑 Royal Korutla Backend Server listening on http://localhost:${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
