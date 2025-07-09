window.configs = {
  apiUrl: "/choreo-apis/sample-project/reading-list-service/v1",
};

// Environment variables for OAuth2 service connections
// These will be injected by Choreo at runtime
// For local testing, you can temporarily set these values
window.ENV = window.ENV || {
  SERVICEURL: "",
  CONSUMERKEY: "",
  CONSUMERSECRET: "",
  TOKENURL: "https://sts.choreo.dev/oauth2/token",
  CHOREOAPIKEY: ""
};

// Debug: Log the current configuration
console.log("OAuth2 Configuration:", {
  serviceUrl: window.ENV.SERVICEURL || "not set",
  consumerKey: window.ENV.CONSUMERKEY ? "***" : "not set",
  consumerSecret: window.ENV.CONSUMERSECRET ? "***" : "not set",
  tokenUrl: window.ENV.TOKENURL,
  choreoApiKey: window.ENV.CHOREOAPIKEY ? "***" : "not set"
});
