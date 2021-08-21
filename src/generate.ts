// generate ------------------------------------------------------------------

// Function to generate the OpenAPI description document for a simple
// application, using @craigmcc/openapi-builders tooling.

// External Modules ----------------------------------------------------------

/*
import {
    ComponentsObject,
    ComponentsObjectBuilder,
    ContactObjectBuilder,
    InfoObjectBuilder,
    LicenseObjectBuilder,
    OpenApiObjectBuilder,
    SchemaObject,
    SchemaObjectBuilder,
} from "@craigmcc/openapi-builders/dist/3.0";
*/
import * as ob from "@craigmcc/openapi-builders/dist/3.0";
import { SchemaObjectBuilder } from "@craigmcc/openapi-builders/dist/3.0";

// Public Objects ------------------------------------------------------------

let RESULT: string | null;

export default function generate(): string {

    if (!RESULT) {

        const openApiBuilder = new ob.OpenApiObjectBuilder(
            new ob.InfoObjectBuilder("Example Application", "1.0.0")
                .addContact(contactBuilder().build())
                .addDescription("Illustrate ways to use Builder Pattern builders for OpenAPI")
                .addLicense(new ob.LicenseObjectBuilder("Apache-2.0")
                    .addUrl("https://apache.org/")
                    .build()
                )
                .build()
        )
            .addComponents(components());

        // Lots more stuff

        RESULT = openApiBuilder.asJson();

    }

    return RESULT

}

// Private Objects -----------------------------------------------------------

const components = (): ob.ComponentsObject => {
    return new ob.ComponentsObjectBuilder()
        // Model Objects
        .addSchema("Post", postSchema())
        .addSchema("User", userSchema())
        .build();
}

const contactBuilder = (): ob.ContactObjectBuilder => {
    return new ob.ContactObjectBuilder()
        .addEmail("fred@example.com")
        .addName("Fred Flintstone")
}

const postSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("object", "Blog Post by a registered user")
        .addProperty("userId", new SchemaObjectBuilder("integer", "User ID")
            .addNullable(false)
            .build())
        .addProperty("post", new SchemaObjectBuilder("string", "Blog Post content", false)
            .build())
        .build();
}

const userSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("object", "Registered User")
        .addExample({
            description: "An example of a registered user",
            value: {
                firstName: "Barney",
                lastName: "Rubble",
            }
        })
        .addProperty("email", new SchemaObjectBuilder("string", "User email address")
            .addNullable(true)
            .build())
        .addProperty("firstName", new SchemaObjectBuilder("string", "User first name", false)
            .build())
        .addProperty("lastName", new SchemaObjectBuilder("string", "User last name", false)
            .build())
        .build();
}

