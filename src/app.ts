import 'dotenv/config';
import { httpServer } from "./http_server/server.js";
import { run as runWebsocket } from './websocket/websocket.js';

console.log(`Start static http server on the ${process.env.HTTP_PORT} port!`);
httpServer.listen(process.env.HTTP_PORT);

runWebsocket();
