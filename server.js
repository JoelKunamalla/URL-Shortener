import 'dotenv/config'; // Ensure this is at the very top

import http from 'http';
import app from './app.mjs';
import config from './config/config.mjs';

const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Server is listening at ${config.baseUrl}`);
});
