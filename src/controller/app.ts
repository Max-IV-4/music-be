import express from "express"
import errorsHandler from "../middleware/errorsHandling.js";
import corsMW from "../middleware/cors-middleware.js";
import logger_http from "../middleware/logger_http.js";
import { security_context } from "../middleware/auth.js";
import accountsRouter from "./routes/accountsRouter.js";
import customersRouter from "./routes/customersRouter.js";
import albumsRouter from "./routes/albumsRouter.js";
import playlistsRouter from "./routes/playlistsRouter.js";
const app = express();
app.use(security_context)
app.use(corsMW)
app.use(express.json());
app.use(logger_http) //aspect logging
app.use("/customers", customersRouter)
app.use("/albums", albumsRouter)
app.use("/playlists", playlistsRouter)
app.use("/accounts", accountsRouter)
app.use(errorsHandler)
export default app;