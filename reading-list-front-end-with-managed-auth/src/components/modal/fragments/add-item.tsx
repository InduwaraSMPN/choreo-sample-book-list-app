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

import React, { useState } from "react";
import { toast } from "react-toastify";

import { postBooks } from "@/api/books/post-books";
import { Book } from "@/api/books/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";

export interface AddItemProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const statusOptions = [
  { value: "to_read", label: "To Read" },
  { value: "reading", label: "Currently Reading" },
  { value: "read", label: "Completed" },
];

export default function AddItem(props: AddItemProps) {
  const { isOpen, setIsOpen } = props;
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("to_read");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; author?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; author?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!author.trim()) {
      newErrors.author = "Author is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: Book = {
        title: title.trim(),
        author: author.trim(),
        status,
      };

      await postBooks(payload);
      toast.success("Book added successfully!");

      // Reset form
      setTitle("");
      setAuthor("");
      setStatus("to_read");
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setAuthor("");
    setStatus("to_read");
    setErrors({});
    setIsOpen(false);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Book"
      description="Add a new book to your reading list"
      footer={
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleOnSubmit}
            disabled={!title.trim() || !author.trim() || isSubmitting}
            loading={isSubmitting}
          >
            Add Book
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Book Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter the book title"
          error={errors.title}
        />

        <Input
          label="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Enter the author's name"
          error={errors.author}
        />

        <Select
          label="Reading Status"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
      </div>
    </Modal>
  );
}
