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

import axios, { AxiosRequestConfig } from "axios";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class OAuth2Client {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private readonly serviceUrl: string;
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly tokenUrl: string;
  private readonly choreoApiKey: string;

  constructor() {
    // These environment variables will be injected by Choreo at runtime
    this.serviceUrl = (window as unknown as { ENV?: Record<string, string> }).ENV?.SERVICEURL || "";
    this.consumerKey =
      (window as unknown as { ENV?: Record<string, string> }).ENV?.CONSUMERKEY || "";
    this.consumerSecret =
      (window as unknown as { ENV?: Record<string, string> }).ENV?.CONSUMERSECRET || "";
    this.tokenUrl =
      (window as unknown as { ENV?: Record<string, string> }).ENV?.TOKENURL ||
      "https://sts.choreo.dev/oauth2/token";
    this.choreoApiKey =
      (window as unknown as { ENV?: Record<string, string> }).ENV?.CHOREOAPIKEY || "";

    console.warn("OAuth2Client initialized with:", {
      serviceUrl: this.serviceUrl,
      consumerKey: this.consumerKey ? "***" : "missing",
      consumerSecret: this.consumerSecret ? "***" : "missing",
      tokenUrl: this.tokenUrl,
      choreoApiKey: this.choreoApiKey ? "***" : "missing",
    });
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Check if we have the required credentials
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error(
        "OAuth2 credentials not configured. Make sure CONSUMERKEY and CONSUMERSECRET are set."
      );
    }

    try {
      console.warn("Requesting new access token from:", this.tokenUrl);

      const credentials = btoa(`${this.consumerKey}:${this.consumerSecret}`);

      const response = await axios.post<TokenResponse>(
        this.tokenUrl,
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
            ...(this.choreoApiKey && { "Choreo-API-Key": this.choreoApiKey }),
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 90% of the actual expiry to ensure we refresh before it expires
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000 * 0.9;

      console.warn("Access token obtained successfully");
      return this.accessToken;
    } catch (error) {
      console.error("Failed to obtain access token:", error);
      throw new Error("Failed to authenticate with OAuth2 provider");
    }
  }

  async makeAuthenticatedRequest(url: string, options: AxiosRequestConfig = {}): Promise<unknown> {
    try {
      const token = await this.getAccessToken();

      const requestOptions: AxiosRequestConfig = {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...(this.choreoApiKey && { "Choreo-API-Key": this.choreoApiKey }),
          ...options.headers,
        },
      };

      console.warn("Making authenticated request to:", url);
      console.warn("Request headers:", {
        ...requestOptions.headers,
        Authorization: "Bearer ***",
      });

      const response = await axios(url, requestOptions);
      console.warn("Request successful:", response.status);
      return response;
    } catch (error) {
      console.error("Authenticated request failed:", error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!(this.consumerKey && this.consumerSecret && this.tokenUrl);
  }
}

// Export a singleton instance
export const oauthClient = new OAuth2Client();
