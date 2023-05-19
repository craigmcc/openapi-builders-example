// display -------------------------------------------------------------------

// Display the generated OpenAPI document via a small Express server.

// External Modules ----------------------------------------------------------

import express from "express";
//const pathToSwaggerUI = require("swagger-ui-dist").absolutePath();
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath();

// Internal Modules ----------------------------------------------------------

import generate30 from "./3.0/generate30";
import generate31 from "./3.1/Generate31";

// Public Logic --------------------------------------------------------------

const PORT = 3001;

const app = express();

// Serve the generated OpenAPI definition at our "/openapi30.json" or /openapi31.json paths
app.get("/openapi30.json", (req, res) => {
    res.header("Content-Type", "application/json")
        .send(generate30());
});
app.get("/openapi31.json", (req, res) => {
    res.header("Content-Type", "application/json")
        .send(generate31());
});

// This redirect stuff is because swagger-ui-dist does not provide any way to
// server-side configure the URL of the OpenAPI definition.
// See https://github.com/swagger-api/swagger-ui/issues/5710
app.get("/ui-openapi30.json", (req, res) => {
    return res.redirect(`/openapi-ui?url=http://localhost:${PORT}/openapi30.json`);
})
app.get("/ui-openapi31.json", (req, res) => {
    return res.redirect(`/openapi-ui?url=http://localhost:${PORT}/openapi31.json`);
})
//app.use("/openapi-ui", express.static(pathToSwaggerUI));
app.use("/openapi-ui", express.static(swaggerUiAssetPath));

app.listen(PORT, () => {
    console.log(`To see the OpenAPI information, navigate to http://localhost:${PORT}`);
});
