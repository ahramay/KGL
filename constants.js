function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
  });
}

define("PI", 3.14);
define("SUCCESS_ADDED", "Record added successfully.");
define("SUCCESS_UPDATED", "Record updated successfully.");
define("SUCCESS_DELETED", "Record deleted successfully.");
define(
  "AUTH_ERROR",
  "An authenticated user is required to execute this action. Remember only json requests are allowed for this route."
);
