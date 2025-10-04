const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const pageRoutes = require("./routes/pageRoutes");
const activityRoutes = require("./routes/activityRoutes");

const DEFAULT_PORT = parseInt(process.env.PORT) || 3004;
const MAX_INSTANCES = 3;

function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/pages", pageRoutes);
    app.use("/activities", activityRoutes);

    return app;
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("");
        console.log("");
        console.log("");
        console.log("Page Service started.");
        console.log("MongoDB Connected");


        for (let i = 0; i < MAX_INSTANCES; i++) {
            const port = DEFAULT_PORT + i;
            const app = createApp();

            const server = app.listen(port, () => {
                console.log(`Server instance listening on port ${port}`);
            });

            server.on("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    console.error(`Port ${port} is already in use`);
                } else {
                    console.error(err);
                }
            });
        }
    })
    .catch(err => console.error(err));
