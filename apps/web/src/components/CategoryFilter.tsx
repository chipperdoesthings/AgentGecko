"use client";

import { Badge } from "@/components/ui/badge";
import { CATEGORIES, CATEGORY_META, type Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="radiogroup"
      aria-label="Filter by category"
    >
      <Badge
        variant={selected === "all" ? "default" : "outline"}
        className={cn(
          "cursor-pointer transition-colors px-3 py-1.5 text-sm",
          selected === "all"
            ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
        )}
        onClick={() => onChange("all")}
        role="radio"
        aria-checked={selected === "all"}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange("all");
          }
        }}
      >
        All
      </Badge>
      {CATEGORIES.map((cat: Category) => {
        const meta = CATEGORY_META[cat];
        const isSelected = selected === cat;
        return (
          <Badge
            key={cat}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors px-3 py-1.5 text-sm",
              isSelected
                ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
            )}
            onClick={() => onChange(cat)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(cat);
              }
            }}
          >
            <span aria-hidden="true">{meta.icon}</span> {meta.label}
          </Badge>
        );
      })}
    </div>
  );
}
