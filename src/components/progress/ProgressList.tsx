import React from "react";
import { Checkbox } from "../ui/checkbox"

interface ListItem {
  id: number;
  text: string;
  checked: boolean;
}

interface ProgressListProps {
  items: ListItem[];
}

export function ProgressList({ items }: ProgressListProps) {
  return (
    <div className="progress-list">
      {items.map((item) => (
        <div key={item.id} className="progress-list-item">
          <Checkbox
            id={`item${item.id}`}
            checked={item.checked}
            disabled
            className="progress-checkbox"
          />
          <label
            htmlFor={`item${item.id}`}
            className="progress-label"
          >
            {item.text}
          </label>
        </div>
      ))}
    </div>
  );
}