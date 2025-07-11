import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import * as React from "react";

import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  const focusTrapRef = useFocusTrap(isOpen) as React.RefObject<HTMLDivElement>;
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                ref={focusTrapRef}
                className={cn(
                  "w-full transform overflow-visible rounded-lg bg-background p-6 text-left align-middle shadow-xl transition-all",
                  sizeClasses[size]
                )}
              >
                <div className="flex items-center justify-between">
                  {title && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-foreground"
                    >
                      {title}
                    </Dialog.Title>
                  )}
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="h-6 w-6 rounded-md"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  )}
                </div>

                {description && (
                  <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </Dialog.Description>
                )}

                <div className="mt-4">{children}</div>

                {footer && <div className="mt-6 flex justify-end space-x-2">{footer}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
