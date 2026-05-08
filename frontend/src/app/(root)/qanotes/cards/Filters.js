"use client";

import { useRouter, useSearchParams } from "next/navigation";





export default function Filters({options,  selected }) {




  const router = useRouter();
  const searchParams = useSearchParams();

  const isAllSelected = options.every((opt) => selected.includes(opt));

  const updateURL = (newSelected) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSelected.length === 0) {
      params.delete("filter");
    } else {
      params.set("filter", newSelected.join(","));
    }

    router.push(`?${params.toString()}`);
  };

  const toggleOption = (option) => {
    let newSelected;

    if (selected.includes(option)) {
      newSelected = selected.filter((o) => o !== option);
    } else {
      newSelected = [...selected, option];
    }

    updateURL(newSelected);
  };

  const toggleAll = () => {
    if (isAllSelected) {
      updateURL([]); // uncheck all
    } else {
      updateURL(options); // select all
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {/* ALL */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={toggleAll}
        />
        All
      </label>

      {/* A B C */}
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggleOption(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}