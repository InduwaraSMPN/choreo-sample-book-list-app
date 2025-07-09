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

import Cookies from "js-cookie";
import { Dictionary } from "lodash";
import groupBy from "lodash/groupBy";
import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "react-toastify";

import { deleteBooks } from "@/api/books/delete-books";
import { getBooks } from "@/api/books/get-books";
import { Book } from "@/api/books/types/book";
import { BookList } from "@/components/book/book-list";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

interface User {
  email?: string;
  sub?: string;
  org_name?: string;
}

// Lazy load the AddItem modal for better performance
const AddItem = lazy(() => import("@/components/modal/fragments/add-item"));

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  const [readList, setReadList] = useState<Dictionary<Book[]> | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userInfoCookie = Cookies.get("userinfo");
    if (userInfoCookie) {
      // We are here after a login
      sessionStorage.setItem("userInfo", userInfoCookie);
      Cookies.remove("userinfo");
      const userInfo = JSON.parse(atob(userInfoCookie));
      setSignedIn(true);
      setUser(userInfo);
    } else {
      const storedUserInfo = sessionStorage.getItem("userInfo");
      if (storedUserInfo) {
        // We have already logged in
        const userInfo = JSON.parse(atob(storedUserInfo));
        setSignedIn(true);
        setUser(userInfo);
      } else {
        console.warn("User is not signed in");
        // For connection-based authentication, we'll try to make API calls anyway
        // Choreo should handle authentication transparently
        setSignedIn(true); // Assume signed in for connection-based auth
      }
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    // Handle errors from Managed Authentication
    const errorCode = new URLSearchParams(window.location.search).get("code");
    const errorMessage = new URLSearchParams(window.location.search).get("message");
    if (errorCode) {
      toast.error(
        <>
          <p className="text-[16px] font-bold text-slate-800">Something went wrong !</p>
          <p className="text-[13px] text-slate-400 mt-1">
            Error Code : {errorCode}
            <br />
            Error Description: {errorMessage}
          </p>
        </>
      );
    }
  }, []);

  useEffect(() => {
    // Load books when component mounts
    getReadingList();
  }, []);

  async function getReadingList() {
    setIsLoading(true);
    console.warn("Attempting to fetch books...");
    console.warn(
      "API URL from config:",
      (window as { configs?: { apiUrl?: string } })?.configs?.apiUrl
    );

    try {
      const res = await getBooks();
      console.warn("Books fetched successfully:", res.data);

      // Validate that we received an array of books
      if (Array.isArray(res.data)) {
        const validBooks = res.data.filter(
          book => book && typeof book === "object" && book.title && book.author
        );

        if (validBooks.length > 0) {
          const grouped = groupBy(validBooks, item => item.status || "to_read");
          setReadList(grouped);
        } else {
          console.warn("No valid books found in response");
          setReadList({});
        }
      } else {
        console.error("API response is not an array:", res.data);
        toast.error("Invalid response format from server");
        setReadList({});
      }
    } catch (e) {
      const error = e as {
        response?: { status?: number; statusText?: string; data?: unknown; headers?: unknown };
      };
      console.error("Error fetching books:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Show user-friendly error message
      if (error.response?.status === 401) {
        toast.error("Authentication required. Please log in.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Check your permissions.");
      } else if (error.response?.status && error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to load books. Please check your connection.");
      }

      setReadList({});
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isAddItemOpen) {
      getReadingList();
    }
  }, [isAddItemOpen]);

  const handleDelete = async (id: string) => {
    try {
      await deleteBooks(id);
      toast.success("Book deleted successfully!");
      getReadingList();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book. Please try again.");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to Reading List</h1>
            <p className="text-muted-foreground">Please sign in to manage your books</p>
          </div>
          <Button
            onClick={() => {
              window.location.href = "/auth/login";
            }}
            size="lg"
            className="w-full"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout user={user || undefined}>
      <BookList
        books={readList}
        onAddBook={() => setIsAddItemOpen(true)}
        onRefresh={getReadingList}
        onDeleteBook={handleDelete}
        isLoading={isLoading}
      />
      <Suspense fallback={null}>
        <AddItem isOpen={isAddItemOpen} setIsOpen={setIsAddItemOpen} />
      </Suspense>
    </MainLayout>
  );
}
