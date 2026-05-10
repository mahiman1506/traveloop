"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemRenderProps = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
  isDragging: boolean;
};

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children:
    | React.ReactNode
    | ((props: SortableItemRenderProps) => React.ReactNode);
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {typeof children === "function"
        ? children({ attributes, listeners, isDragging })
        : children}
    </div>
  );
}
