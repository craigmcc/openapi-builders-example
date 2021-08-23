// generate ------------------------------------------------------------------

// Function to generate the OpenAPI description document for a simple
// application, using @craigmcc/openapi-builders tooling.

// External Modules ----------------------------------------------------------

const pluralize = require("pluralize");
import * as ob from "@craigmcc/openapi-builders/dist/3.0";

// Configuration Constants ---------------------------------------------------

const API_PREFIX = "/api";
const ERROR_SCHEMA = "GenericError";
const MEDIA_TYPE = "application/json";
const POSTING_MODEL = "Posting";
const STATUS_CREATED = "201";
const STATUS_BAD_REQUEST = "400";
const STATUS_FORBIDDEN = "403";
const STATUS_NOT_FOUND = "404";
const STATUS_OK = "200";
const USER_MODEL = "User";

// Public Objects ------------------------------------------------------------

let RESULT: string = "";

export default function generate(): string {

    if (RESULT === "") {

        const openApiBuilder = new ob.OpenApiObjectBuilder(
            new ob.InfoObjectBuilder("Example Application", "1.0.0")
                .addContact(contactBuilder().build())
                .addDescription("Illustrate ways to use Builder Pattern builders for OpenAPI")
                .addLicense(new ob.LicenseObjectBuilder("Apache-2.0")
                    .addUrl("https://apache.org/licenses/LICENSE-2.0")
                    .build()
                )
                .build())
            .addComponents(components())
            .addPathItems(modelPathItems())
        ;

        // Lots more stuff

        RESULT = openApiBuilder.asJson();

    }

    return RESULT

}

// Private Functions ---------------------------------------------------------

const components = (): ob.ComponentsObject => {
    const builder = new ob.ComponentsObjectBuilder()
        .addResponses(errorResponses())
        .addSchemas(errorSchemas())
        .addSchemas(modelSchemas())
    ;
    return builder.build();
}

const contactBuilder = (): ob.ContactObjectBuilder => {
    return new ob.ContactObjectBuilder()
        .addEmail("fred@example.com")
        .addName("Fred Flintstone");
}

const errorGenericResponse = (description: string): ob.ResponseObject => {
    return new ob.ResponseObjectBuilder(description)
        .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .addExample({
                description: "User Not Found Error",
                value: {
                    context: "UserLookupService",
                    message: "Missing User 123",
                    status: 404,
                }
            })
            .addSchema(errorSchemaRef()))
        .build();
}

const errorResponses = (): ob.ResponsesObject => {
    const responses: ob.ResponsesObject = {};
    responses[STATUS_BAD_REQUEST] = errorGenericResponse("Error in request properties");
    responses[STATUS_FORBIDDEN] = errorGenericResponse("Requested operation is forbidden");
    responses[STATUS_NOT_FOUND] = errorGenericResponse("Requested item is not found");
    return responses;
}

const errorSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addExample({
            description: "User Not Found Error",
            value: {
                context: "UserLookupService",
                message: "Missing User 123",
                status: 404,
            }
        })
        .addProperty("context", new ob.SchemaObjectBuilder("string", "Error source location")
            .build())
        .addProperty("message", new ob.SchemaObjectBuilder("string", "Error message summary")
            .build())
        .addProperty("status", new ob.SchemaObjectBuilder("integer", "HTTP status code")
            .build())
        .addType("object")
        .build();
}

const errorResponseRef = (statusCode: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/responses/${statusCode}`)
        .build();
}

const errorSchemaRef = (): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/schemas/${ERROR_SCHEMA}`)
        .build();
}

const errorSchemas = (): ob.SchemasObject => {
    const schemas: ob.SchemasObject = {};
    schemas[ERROR_SCHEMA] = errorSchema();
    return schemas;
}

const modelId = (model: String): string => {
    return model.toLowerCase() + "Id";
}

// Return an operation that returns an array of the specified model objects
const modelOperationAll = (model: string): ob.OperationObject => {
    const pluralModel = pluralize(model);
    return new ob.OperationObjectBuilder()
        .addDescription(`Return all visible ${pluralModel}`)
        .addResponse(STATUS_OK, new ob.ResponseObjectBuilder(`All selected ${pluralModel}`)
            .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
                .addSchema(new ob.SchemaObjectBuilder()
                    .addItems(modelSchemaRef(model))
                    .addType("array")
                    .build())
                .build())
            .build())
        .addResponse(STATUS_FORBIDDEN, errorResponseRef(STATUS_FORBIDDEN))
        .addSummary(`The requested ${pluralModel}`)
        .build();
}

// Return an operation that returns the specified model object
const modelOperationFind = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .addDescription(`Return the specified ${model}`)
        .addResponse(STATUS_OK, new ob.ResponseObjectBuilder(`The specified ${model}`)
            .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
                .addSchema(modelSchemaRef(model))
                .build())
            .build())
        .addResponse(STATUS_FORBIDDEN, errorResponseRef(STATUS_FORBIDDEN))
        .addResponse(STATUS_NOT_FOUND, errorResponseRef(STATUS_NOT_FOUND))
        .addSummary(`The specified ${model}`)
        .build();
}

// Return an operation that creates and returns the specified model object
const modelOperationInsert = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .addDescription(`Create and return the specified ${model}`)
        .addRequestBody(new ob.RequestBodyObjectBuilder()
            .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
                .addSchema(modelSchemaRef(model))
                .build())
            .addRequired(true)
            .build())
        .addResponse(STATUS_CREATED, new ob.ResponseObjectBuilder(`The specified ${model}`)
            .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
                .addSchema(modelSchemaRef(model))
                .build())
            .build())
        .addResponse(STATUS_FORBIDDEN, errorResponseRef(STATUS_FORBIDDEN))
        .addResponse(STATUS_NOT_FOUND, errorResponseRef(STATUS_NOT_FOUND))
        .addSummary(`Created ${model}`)
        .build();
}

// Return an operation that deletes and returns the specified model object
const modelOperationRemove = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .addDescription(`Delete and return the specified ${model}`)
        .addResponse(STATUS_OK, new ob.ResponseObjectBuilder(`The specified ${model}`)
            .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
                .addSchema(modelSchemaRef(model))
                .build())
            .build())
        .addResponse(STATUS_FORBIDDEN, errorResponseRef(STATUS_FORBIDDEN))
        .addResponse(STATUS_NOT_FOUND, errorResponseRef(STATUS_NOT_FOUND))
        .addSummary(`Deleted ${model}`)
        .build();
}

// Return an operation that updates the specified model object
const modelOperationUpdate = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .addDescription(`Update and return the specified ${model}`)
        .addRequestBody(new ob.RequestBodyObjectBuilder()
            .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
                .addSchema(modelSchemaRef(model))
                .build())
            .addRequired(true)
            .build())
        .addResponse(STATUS_OK, new ob.ResponseObjectBuilder(`The specified ${model}`)
            .addContent(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
                .addSchema(modelSchemaRef(model))
                .build())
            .build())
        .addResponse(STATUS_FORBIDDEN, errorResponseRef(STATUS_FORBIDDEN))
        .addResponse(STATUS_NOT_FOUND, errorResponseRef(STATUS_NOT_FOUND))
        .addSummary(`Updated ${model}`)
        .build();
}

const modelParameter = (model: String): string => {
    return "{" + modelId(model) + "}";
}

const modelPrefix = (model: String): string => {
    return "/" + pluralize(model.toLowerCase());
}

const modelPathItemChild = (model: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .addDelete(modelOperationRemove(model))
        .addGet(modelOperationFind(model))
        .addParameter(new ob.ParameterObjectBuilder("path", modelId(model))
            .addDescription(`ID of the specified ${model}`)
            .build())
        .addPut(modelOperationUpdate(model));
    ;
    return builder.build();
}

const modelPathItemParent = (model: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .addGet(modelOperationAll(model))
        .addPost(modelOperationInsert(model))
    ;
    return builder.build();
}

const modelPathItems = (): ob.PathsObject => {
    const pathItems: ob.PathsObject = {}
    pathItems[API_PREFIX + modelPrefix(POSTING_MODEL)]
        = modelPathItemParent(POSTING_MODEL);
    pathItems[API_PREFIX + modelPrefix(POSTING_MODEL) + "/" + modelParameter(POSTING_MODEL)]
        = modelPathItemChild(POSTING_MODEL);
    pathItems[API_PREFIX + modelPrefix(USER_MODEL)]
        = modelPathItemParent(USER_MODEL);
    pathItems[API_PREFIX + modelPrefix(USER_MODEL) + "/" + modelParameter(USER_MODEL)]
        = modelPathItemChild(USER_MODEL);
    return pathItems;
}

const modelSchemaRef = (model: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/schemas/${model}`)
        .build();
}

const modelSchemas = (): ob.SchemasObject => {
    const schemas: ob.SchemasObject = {};
    schemas[POSTING_MODEL] = postingSchema();
    schemas[USER_MODEL] = userSchema();
    return schemas;
}

const postingSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("object", "Blog Posting by a registered user")
        .addExample({
            description: "An example of a blog posting",
            value: {
                id: 456,
                posting: "This is my very first blog post",
                userId: 123,
            }
        })
        .addProperty("id", new ob.SchemaObjectBuilder("integer", "Primary key", true)
            .build())
        .addProperty("userId", new ob.SchemaObjectBuilder("integer", "User ID")
            .addNullable(false)
            .build())
        .addProperty("posting", new ob.SchemaObjectBuilder("string", "Blog Post content", false)
            .build())
        .build();
}

const userSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("object", "Registered User")
        .addExample({
            description: "An example of a registered user",
            value: {
                id: 123,
                firstName: "Barney",
                lastName: "Rubble",
            }
        })
        .addProperty("id", new ob.SchemaObjectBuilder("integer", "Primary key", true)
            .build())
        .addProperty("email", new ob.SchemaObjectBuilder("string", "User email address")
            .addNullable(true)
            .build())
        .addProperty("firstName", new ob.SchemaObjectBuilder("string", "User first name", false)
            .build())
        .addProperty("lastName", new ob.SchemaObjectBuilder("string", "User last name", false)
            .build())
        .build();
}

