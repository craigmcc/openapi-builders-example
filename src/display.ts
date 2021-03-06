// display -------------------------------------------------------------------

// Display the generated OpenAPI document via a small Express server.

// External Modules ----------------------------------------------------------

import express from "express";
const pathToSwaggerUI = require("swagger-ui-dist").absolutePath();

// Internal Modules ----------------------------------------------------------

import generate from "./generate";

// Public Logic --------------------------------------------------------------

const PORT = 3000;

const app = express();

// Serve the generated OpenAPI definition at our "/openapi.json" path
app.get("/openapi.json", (req, res) => {
    res.header("Content-Type", "application/json")
        .send(generate());
});

// This redirect stuff is because swagger-ui-dist does not provide any way to
// server-side configure the URL of the OpenAPI definition.
// See https://github.com/swagger-api/swagger-ui/issues/5710
app.get("/", (req, res) => {
    return res.redirect(`/openapi-ui?url=http://localhost:${PORT}/openapi.json`);
})
app.use("/openapi-ui", express.static(pathToSwaggerUI));

app.listen(PORT, () => {
    console.log(`To see the OpenAPI information, navigate to http://localhost:${PORT}`);
});
