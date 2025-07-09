import { motion } from "framer-motion";
import { Trash2, User, Calendar } from "lucide-react";
import { useState } from "react";

import { Book } from "@/api/books/types/book";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { cn, formatStatus } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const statusVariants = {
  to_read: "secondary",
  reading: "info",
  read: "success",
} as const;

export function BookCard({ book, onDelete, isDeleting }: BookCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (book.uuid) {
      onDelete(book.uuid);
    }
    setShowDeleteDialog(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className="group"
      role="article"
      aria-label={`Book: ${book.title} by ${book.author}`}
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border-border/50">
        <CardContent className="p-6">
          <div className="space-y-3">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge
                variant={statusVariants[book.status as keyof typeof statusVariants] || "secondary"}
                className="text-xs"
              >
                {formatStatus(book.status || "")}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className={cn(
                  "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                  "hover:bg-destructive/10 hover:text-destructive"
                )}
                aria-label={`Delete ${book.title}`}
                title={`Delete ${book.title}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Delete {book.title}</span>
              </Button>
            </div>

            {/* Book Title */}
            <div>
              <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2">
                {book.title}
              </h3>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{book.author}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Added recently</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary/20" />
          </div>
        </CardFooter>
      </Card>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
