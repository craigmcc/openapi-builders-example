// Constants.ts --------------------------------------------------------------

/**
 * Manifest constants for OpenAPI Builder 3.1 generators, specific to this project.
 *
 * @packageDocumentation
 */

// Miscellaneous Constants ---------------------------------------------------

export const API_PREFIX = "/api";
export const APPLICATION_JSON = "application/json";

// Model Names ---------------------------------------------------------------

export const AUTHOR = "Author";
export const LIBRARY = "Library";
export const SERIES = "Series";
export const STRING = "String";
export const STORY = "Story";
export const USER = "User";
export const VOLUME = "Volume";

export const MODELS = [
    AUTHOR,
    LIBRARY,
    SERIES,
    STORY,
    USER,
    VOLUME,
];

// Model Properties ----------------------------------------------------------

export const ACTIVE = "active";
export const COPYRIGHT = "copyright";
export const FIRST_NAME = "firstName";
export const ID = "id";
export const LAST_NAME = "lastName";
export const LIBRARY_ID = "libraryId";
export const NAME = "name";
export const NOTES = "notes";
export const ORDINAL = "ordinal";
export const PASSWORD = "password";
export const PRINCIPAL = "principal";
export const SCOPE = "scope";
export const USERNAME = "username";

// Parameter Names (Includes) ------------------------------------------------

// Parameter Names (Matches) -------------------------------------------------

// Parameter Names (Other) ---------------------------------------------------

// Parameter Names (Pagination) ----------------------------------------------

export const LIMIT = "limit";
export const OFFSET = "offset";

// Response Status Codes ----------------------------------------------------

export const OK = "200";
export const CREATED = "201";
export const BAD_REQUEST = "400";
export const UNAUTHORIZED = "401";
export const FORBIDDEN = "403";
export const NOT_FOUND = "404";
export const NOT_UNIQUE = "409";
export const SERVER_ERROR = "500";

// Tag Names -----------------------------------------------------------------

export const REQUIRE_ADMIN = "requireAdmin";
export const REQUIRE_ANY = "requireAny";
export const REQUIRE_REGULAR = "requireRegular";
export const REQUIRE_SUPERUSER = "requireSuperuser";

