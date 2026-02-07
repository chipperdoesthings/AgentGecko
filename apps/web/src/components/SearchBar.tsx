"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search agents by name, symbol, or description...",
}: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync external value changes
  useEffect(() => {
    setLocal(value);
  }, [value]);

  // Debounce the onChange callback
  const debouncedChange = useCallback(
    (val: string) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(val);
      }, 300);
    },
    [onChange],
  );

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleChange = (val: string) => {
    setLocal(val);
    debouncedChange(val);
  };

  const handleClear = () => {
    setLocal("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-md" role="search">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
        aria-hidden="true"
      />
      <Input
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-8 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-green-500 focus:ring-green-500/20"
        aria-label="Search agents"
      />
      {local && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-500 hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
