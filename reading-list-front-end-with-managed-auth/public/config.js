window.configs = {
  apiUrl: "/choreo-apis/sample-project/reading-list-service/v1",
};

// Environment variables for OAuth2 service connections
// These will be injected by Choreo at runtime
window.ENV = {
  SERVICEURL: window.ENV?.SERVICEURL || "",
  CONSUMERKEY: window.ENV?.CONSUMERKEY || "",
  CONSUMERSECRET: window.ENV?.CONSUMERSECRET || "",
  TOKENURL: window.ENV?.TOKENURL || "https://sts.choreo.dev/oauth2/token",
  CHOREOAPIKEY: window.ENV?.CHOREOAPIKEY || ""
};
