import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Book } from "@/api/books/types/book";

import { BookCard } from "../book-card";

const mockBook: Book = {
  uuid: "1",
  title: "Test Book",
  author: "Test Author",
  status: "to_read",
};

describe("BookCard", () => {
  it("renders book information correctly", () => {
    render(<BookCard book={mockBook} onDelete={vi.fn()} />);

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByText("To Read")).toBeInTheDocument();
  });

  it("shows delete confirmation dialog when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<BookCard book={mockBook} onDelete={vi.fn()} />);

    const deleteButton = screen.getByLabelText("Delete Test Book");
    await user.click(deleteButton);

    expect(screen.getByText("Delete Book")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onDelete when delete is confirmed", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(<BookCard book={mockBook} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText("Delete Test Book");
    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "Delete" });
    await user.click(confirmButton);

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("has proper accessibility attributes", () => {
    render(<BookCard book={mockBook} onDelete={vi.fn()} />);

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("aria-label", "Book: Test Book by Test Author");

    const deleteButton = screen.getByLabelText("Delete Test Book");
    expect(deleteButton).toHaveAttribute("title", "Delete Test Book");
  });
});
