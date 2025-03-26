import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bulk Data Management API",
      version: "1.0.0",
      description: "API for managing bulk data with JSON and Excel support",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/controller/*.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
console.log("Loading Swagger docs from:", swaggerOptions.apis);
const setupSwaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
};

export default setupSwaggerDocs;
