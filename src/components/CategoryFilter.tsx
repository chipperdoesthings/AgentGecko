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
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selected === "all" ? "default" : "outline"}
        className={cn(
          "cursor-pointer transition-colors px-3 py-1.5 text-sm",
          selected === "all"
            ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
        )}
        onClick={() => onChange("all")}
      >
        All
      </Badge>
      {CATEGORIES.map((cat: Category) => {
        const meta = CATEGORY_META[cat];
        return (
          <Badge
            key={cat}
            variant={selected === cat ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors px-3 py-1.5 text-sm",
              selected === cat
                ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
            )}
            onClick={() => onChange(cat)}
          >
            {meta.icon} {meta.label}
          </Badge>
        );
      })}
    </div>
  );
}
