// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.

// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at

//    http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the
// specific language governing permissions and limitations
// under the License.

import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { oauthClient } from "./oauth-client";

export const performRequestWithRetry = async (
  url: string,
  options: AxiosRequestConfig | undefined
) => {
  // Check if OAuth2 client is configured for service connections
  if (oauthClient.isConfigured()) {
    console.warn("Using OAuth2 client for authenticated request");
    return await oauthClient.makeAuthenticatedRequest(url, options);
  }

  // Fallback to cookie-based authentication for managed auth
  const requestOptions = {
    ...options,
    withCredentials: true, // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  try {
    console.warn("Making request to:", url);
    console.warn("Request options:", requestOptions);

    const response = await axios(url, requestOptions);
    console.warn("Request successful:", response.status);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Request failed:", axiosError.response?.status, axiosError.response?.data);

    if (axiosError.response && axiosError.response.status === 401) {
      console.warn("Authentication failed (401). Check your connection configuration.");
      throw error;
    } else if (axiosError.response && axiosError.response.status === 403) {
      console.error("Access forbidden (403). Check your service permissions and connection setup.");
      throw error;
    } else {
      console.error("API Error:", axiosError.response?.status, axiosError.response?.data);
      throw error;
    }
  }
};
