import { AnimatePresence } from "framer-motion";
import { Dictionary } from "lodash";
import { Search, Plus, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";

import { Book } from "@/api/books/types/book";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger-container";
import { cn, debounce } from "@/lib/utils";

import { BookCard } from "./book-card";

interface BookListProps {
  books: Dictionary<Book[]> | null;
  onAddBook: () => void;
  onRefresh: () => void;
  onDeleteBook: (id: string) => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: "all", label: "All Books" },
  { value: "to_read", label: "To Read" },
  { value: "reading", label: "Currently Reading" },
  { value: "read", label: "Completed" },
];

export function BookList({ books, onAddBook, onRefresh, onDeleteBook, isLoading }: BookListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  // Flatten and filter books
  const filteredBooks = useMemo(() => {
    if (!books) return [];

    let allBooks: Book[] = [];

    try {
      Object.entries(books).forEach(([status, bookList]) => {
        if (Array.isArray(bookList)) {
          const validBooks = bookList
            .filter(book => book && typeof book === "object" && book.title && book.author)
            .map(book => ({ ...book, status }));
          allBooks.push(...validBooks);
        }
      });

      // Filter by status
      if (selectedStatus !== "all") {
        allBooks = allBooks.filter(book => book.status === selectedStatus);
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        allBooks = allBooks.filter(book => {
          const title = book.title?.toLowerCase() || "";
          const author = book.author?.toLowerCase() || "";
          return title.includes(query) || author.includes(query);
        });
      }

      // Sort books
      allBooks.sort((a, b) => {
        switch (sortBy) {
          case "title":
            return (a.title || "").localeCompare(b.title || "");
          case "author":
            return (a.author || "").localeCompare(b.author || "");
          case "status":
            return (a.status || "").localeCompare(b.status || "");
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error("Error processing books:", error);
      return [];
    }

    return allBooks;
  }, [books, selectedStatus, searchQuery, sortBy]);

  const totalBooks = books ? Object.values(books).flat().length : 0;

  return (
    <FadeIn>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              My Reading List
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalBooks} {totalBooks === 1 ? "book" : "books"} in your collection
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-10 w-10"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="sr-only">Refresh</span>
            </Button>

            <Button onClick={onAddBook} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title or author..."
              onChange={e => debouncedSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              className="w-48"
            />

            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "title", label: "Sort by Title" },
                { value: "author", label: "Sort by Author" },
                { value: "status", label: "Sort by Status" },
              ]}
              className="w-48"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.1}
            >
              <AnimatePresence>
                {filteredBooks.map(book => (
                  <StaggerItem key={book.uuid}>
                    <BookCard book={book} onDelete={onDeleteBook} onStatusUpdate={onRefresh} />
                  </StaggerItem>
                ))}
              </AnimatePresence>
            </StaggerContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {searchQuery || selectedStatus !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start building your reading list by adding your first book."}
              </p>
              {!searchQuery && selectedStatus === "all" && (
                <Button onClick={onAddBook} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Book</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
