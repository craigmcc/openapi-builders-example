// generate ------------------------------------------------------------------

// Function to generate the OpenAPI description document for a simple
// application, using @craigmcc/openapi-builders tooling.

// External Modules ----------------------------------------------------------

const pluralize = require("pluralize");
//import * as ob from "@craigmcc/openapi-builders/dist/3.0";
import * as ob from "@craigmcc/openapi-builders";

// Configuration Constants ---------------------------------------------------

const API_PREFIX = "/api";
const ERROR_SCHEMA = "GenericError";
const MEDIA_TYPE = "application/json";
const POSTING_MODEL = "Posting";
const QUERY_LIMIT = "limit";
const QUERY_OFFSET = "offset";
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
                .contact(contactBuilder().build())
                .description("Illustrate ways to use Builder Pattern builders for OpenAPI")
                .license(new ob.LicenseObjectBuilder("Apache-2.0")
                    .url("https://apache.org/licenses/LICENSE-2.0")
                    .build()
                )
                .build())
            .components(components())
            .pathItems(modelPathItems())
        ;

        RESULT = openApiBuilder.asJson();

    }

    return RESULT

}

// Private Functions ---------------------------------------------------------

const components = (): ob.ComponentsObject => {
    const builder = new ob.ComponentsObjectBuilder()
        .parameters(queryParameters())
        .requestBodies(modelRequestBodies())
        .responses(errorResponses())
        .responses(modelResponses())
        .schemas(errorSchemas())
        .schemas(modelSchemas())
    ;
    return builder.build();
}

const contactBuilder = (): ob.ContactObjectBuilder => {
    return new ob.ContactObjectBuilder()
        .email("fred@example.com")
        .name("Fred Flintstone");
}

const errorResponse = (description: string): ob.ResponseObject => {
    return new ob.ResponseObjectBuilder(description)
        .content(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .example({
                description: "User Not Found Error",
                value: {
                    context: "UserLookupService",
                    message: "Missing User 123",
                    status: 404,
                }
            })
            .schema(schemaRef(ERROR_SCHEMA)))
        .build();
}

const errorResponses = (): ob.ResponsesObject => {
    const responses: ob.ResponsesObject = {};
    responses[STATUS_BAD_REQUEST] = errorResponse("Error in request properties");
    responses[STATUS_FORBIDDEN] = errorResponse("Requested operation is forbidden");
    responses[STATUS_NOT_FOUND] = errorResponse("Requested item is not found");
    return responses;
}

const errorSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .example({
            description: "User Not Found Error",
            value: {
                context: "UserLookupService",
                message: "Missing User 123",
                status: 404,
            }
        })
        .property("context", new ob.SchemaObjectBuilder("string", "Error source location")
            .build())
        .property("message", new ob.SchemaObjectBuilder("string", "Error message summary")
            .build())
        .property("status", new ob.SchemaObjectBuilder("integer", "HTTP status code")
            .build())
        .type("object")
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
        .description(`Return all visible ${pluralModel}`)
        .parameter(parameterRef(QUERY_LIMIT))
        .parameter(parameterRef(QUERY_OFFSET))
        .response(STATUS_OK, responseRef(pluralize(model)))
        .response(STATUS_FORBIDDEN, responseRef(STATUS_FORBIDDEN))
        .summary(`The requested ${pluralModel}`)
        .build();
}

// Return an operation that returns an array of the specified model objects
const modelOperationChildren = (parent: string, child: string): ob.OperationObject => {
    const pluralChild = pluralize(child);
    return new ob.OperationObjectBuilder()
        .description(`Return all ${pluralChild} for the specified ${parent}`)
        .parameter(parameterRef(QUERY_LIMIT))
        .parameter(parameterRef(QUERY_OFFSET))
        .response(STATUS_OK, responseRef(pluralize(child)))
        .response(STATUS_FORBIDDEN, responseRef(STATUS_FORBIDDEN))
        .response(STATUS_NOT_FOUND, responseRef(STATUS_NOT_FOUND))
        .summary(`The requested ${pluralChild}`)
        .build();
}

// Return an operation that returns the specified model object
const modelOperationFind = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .description(`Return the specified ${model}`)
        .response(STATUS_OK, responseRef(model))
        .response(STATUS_FORBIDDEN, responseRef(STATUS_FORBIDDEN))
        .response(STATUS_NOT_FOUND, responseRef(STATUS_NOT_FOUND))
        .summary(`The specified ${model}`)
        .build();
}

// Return an operation that creates and returns the specified model object
const modelOperationInsert = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .description(`Create and return the specified ${model}`)
        .requestBody(requestBodyRef(model))
        .response(STATUS_CREATED, responseRef(model))
        .response(STATUS_FORBIDDEN, responseRef(STATUS_FORBIDDEN))
        .response(STATUS_NOT_FOUND, responseRef(STATUS_NOT_FOUND))
        .summary(`Created ${model}`)
        .build();
}

// Return an operation that deletes and returns the specified model object
const modelOperationRemove = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .description(`Delete and return the specified ${model}`)
        .response(STATUS_OK, responseRef(model))
        .response(STATUS_FORBIDDEN, responseRef(STATUS_FORBIDDEN))
        .response(STATUS_NOT_FOUND, responseRef(STATUS_NOT_FOUND))
        .summary(`Deleted ${model}`)
        .build();
}

// Return an operation that updates the specified model object
const modelOperationUpdate = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .description(`Update and return the specified ${model}`)
        .requestBody(requestBodyRef(model))
        .response(STATUS_OK, responseRef(model))
        .response(STATUS_FORBIDDEN, responseRef(STATUS_FORBIDDEN))
        .response(STATUS_NOT_FOUND, responseRef(STATUS_NOT_FOUND))
        .summary(`Updated ${model}`)
        .build();
}

const modelParameter = (model: String): string => {
    return "{" + modelId(model) + "}";
}

const modelPathItemChild = (model: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .delete(modelOperationRemove(model))
        .get(modelOperationFind(model))
        .parameter(new ob.ParameterObjectBuilder("path", modelId(model))
            .description(`ID of the specified ${model}`)
            .build())
        .put(modelOperationUpdate(model))
    ;
    return builder.build();
}

const modelPathItemChildren = (parent: string, child: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .get(modelOperationChildren(parent, child))
        .parameter(new ob.ParameterObjectBuilder("path", modelId(parent))
            .description(`ID of the specified ${parent}`)
            .build())
    ;
    return builder.build();
}

const modelPathItemParent = (model: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .get(modelOperationAll(model))
        .post(modelOperationInsert(model))
    ;
    return builder.build();
}

const modelPathItems = (): ob.PathsObject => {
    const pathItems: ob.PathsObject = {}

    // Posting path items
    pathItems[API_PREFIX + modelPrefix(POSTING_MODEL)]
        = modelPathItemParent(POSTING_MODEL);
    pathItems[API_PREFIX + modelPrefix(POSTING_MODEL) + "/" + modelParameter(POSTING_MODEL)]
        = modelPathItemChild(POSTING_MODEL);

    // User path items
    pathItems[API_PREFIX + modelPrefix(USER_MODEL)]
        = modelPathItemParent(USER_MODEL);
    pathItems[API_PREFIX + modelPrefix(USER_MODEL) + "/" + modelParameter(USER_MODEL)]
        = modelPathItemChild(USER_MODEL);
    pathItems[API_PREFIX + modelPrefix(USER_MODEL) + "/" + modelParameter(USER_MODEL) + modelPrefix(POSTING_MODEL)]
        = modelPathItemChildren(USER_MODEL, POSTING_MODEL);

    return pathItems;
}

const modelPrefix = (model: String): string => {
    return "/" + pluralize(model.toLowerCase());
}

const modelRequestBodies = (): ob.RequestBodiesObject => {
    const requestBodies : ob.RequestBodiesObject = {};
    requestBodies[POSTING_MODEL] = new ob.RequestBodyObjectBuilder()
        .content(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(POSTING_MODEL))
            .build())
        .required(true)
        .build();
    requestBodies[USER_MODEL] = new ob.RequestBodyObjectBuilder()
        .content(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(POSTING_MODEL))
            .build())
        .required(true)
        .build();
    return requestBodies;
}

const modelResponses = (): ob.ResponsesObject => {
    const modelResponses: ob.ResponsesObject = {};
    modelResponses[POSTING_MODEL] = new ob.ResponseObjectBuilder(`The specified ${POSTING_MODEL}`)
        .content(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(POSTING_MODEL))
            .build())
        .build();
    modelResponses[pluralize(POSTING_MODEL)] = new ob.ResponseObjectBuilder(`The requested ${pluralize(POSTING_MODEL)}`)
        .content(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .schema(new ob.SchemaObjectBuilder()
                .items(schemaRef(POSTING_MODEL))
                .type("array")
                .build())
            .build())
        .build();
    modelResponses[USER_MODEL] = new ob.ResponseObjectBuilder(`The specified ${USER_MODEL}`)
        .content(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(USER_MODEL))
            .build())
        .build();
    modelResponses[pluralize(USER_MODEL)] = new ob.ResponseObjectBuilder(`The requested ${pluralize(USER_MODEL)}`)
        .content(MEDIA_TYPE, new ob.MediaTypeObjectBuilder()
            .schema(new ob.SchemaObjectBuilder()
                .items(schemaRef(USER_MODEL))
                .type("array")
                .build())
            .build())
        .build();
    return modelResponses;
}

const modelSchemas = (): ob.SchemasObject => {
    const schemas: ob.SchemasObject = {};
    schemas[POSTING_MODEL] = postingSchema();
    schemas[USER_MODEL] = userSchema();
    return schemas;
}

const parameterRef = (query: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/parameters/${query}`)
        .build();
}

const postingSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("object", "Blog Posting by a registered user")
        .example({
            description: "An example of a blog posting",
            value: {
                id: 456,
                posting: "This is my very first blog post",
                userId: 123,
            }
        })
        .property("id", new ob.SchemaObjectBuilder("integer", "Primary key", true)
            .build())
        .property("userId", new ob.SchemaObjectBuilder("integer", "User ID")
            .nullable(false)
            .build())
        .property("posting", new ob.SchemaObjectBuilder("string", "Blog Post content", false)
            .build())
        .build();
}

const queryParameters = (): ob.ParametersObject => {
    const parameters: ob.ParametersObject = {};
    parameters[QUERY_LIMIT] = new ob.ParameterObjectBuilder("query", QUERY_LIMIT)
        .description("Maximum number of rows returned (default is 25)")
        .build();
    parameters[QUERY_OFFSET] = new ob.ParameterObjectBuilder("query", QUERY_OFFSET)
        .description("Zero-relative offset to the first returned row (default is 0)")
        .build();
    return parameters;
}

const requestBodyRef = (requestBody: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/requestBodies/${requestBody}`)
        .build();
}

const responseRef = (response: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/responses/${response}`)
        .build();
}

const schemaRef = (schema: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/schemas/${schema}`)
        .build();
}

const userSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("object", "Registered User")
        .example({
            description: "An example of a registered user",
            value: {
                id: 123,
                firstName: "Barney",
                lastName: "Rubble",
            }
        })
        .property("id", new ob.SchemaObjectBuilder("integer", "Primary key", true)
            .build())
        .property("email", new ob.SchemaObjectBuilder("string", "User email address")
            .nullable(true)
            .build())
        .property("firstName", new ob.SchemaObjectBuilder("string", "User first name", false)
            .build())
        .property("lastName", new ob.SchemaObjectBuilder("string", "User last name", false)
            .build())
        .build();
}

