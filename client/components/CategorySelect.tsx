import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CATEGORIES = [
  { value: "road", label: "Road & Infrastructure" },
  { value: "water", label: "Water & Sanitation" },
  { value: "utilities", label: "Utilities" },
  { value: "health", label: "Health & Safety" },
  { value: "other", label: "Other" },
];

export default function CategorySelect({
  value,
  onChange,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = CATEGORIES.find((cat) => cat.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all flex items-center justify-between hover:border-white/20"
      >
        <span>{selectedCategory?.label || "Select Category"}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a0a42] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => {
                onChange(category.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left transition-colors ${
                value === category.value
                  ? "bg-primary/30 text-primary border-l-2 border-primary"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
