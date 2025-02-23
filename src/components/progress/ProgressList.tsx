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
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={`item${item.id}`}
            checked={item.checked}
            disabled
          />
          <label
            htmlFor={`item${item.id}`}
            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.text}
          </label>
        </div>
      ))}
    </div>
  );
}
