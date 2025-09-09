"use client";

import React, { useState } from "react";
import { emojiCategories, popularEmojis, searchEmojis } from "@/lib/emoji";
import { FiSearch, FiX } from "react-icons/fi";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({
  onEmojiSelect,
  onClose,
}: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { key: "popular", label: "🔥", name: "Popular" },
    { key: "smileys", label: "😀", name: "Smileys" },
    { key: "gestures", label: "👍", name: "Gestures" },
    { key: "hearts", label: "❤️", name: "Hearts" },
    { key: "objects", label: "💻", name: "Objects" },
    { key: "activities", label: "⚽", name: "Activities" },
  ];

  const getEmojisToShow = () => {
    if (searchQuery.trim()) {
      return searchEmojis(searchQuery);
    }

    if (activeCategory === "popular") {
      return popularEmojis.map((emoji) => ({ emoji, name: emoji }));
    }

    return (
      emojiCategories[activeCategory as keyof typeof emojiCategories] || []
    );
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Choose an emoji</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-lg transition-colors ${
                activeCategory === category.key
                  ? "bg-indigo-100 text-indigo-600"
                  : "hover:bg-gray-100"
              }`}
              title={category.name}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
        {getEmojisToShow().map((item, index) => (
          <button
            key={`${item.emoji}-${index}`}
            onClick={() => handleEmojiClick(item.emoji)}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
            title={item.name}
          >
            {item.emoji}
          </button>
        ))}
      </div>

      {/* No results */}
      {searchQuery && getEmojisToShow().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            No emojis found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
