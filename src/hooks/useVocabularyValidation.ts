import { useMemo } from "react";

export function useVocabularyValidation(words: string[]) {
  return useMemo(() => {
    const trimmed = words.map((w) => w.trim()).filter(Boolean);
    const duplicates = trimmed.filter((w, i) => trimmed.indexOf(w) !== i);
    const invalid = trimmed.filter((w) => !/^[a-zA-Z\-\s']+$/.test(w));

    const errors: string[] = [];
    const warnings: string[] = [];

    if (trimmed.length < 3) errors.push("Please enter at least 3 words.");
    if (trimmed.length > 50) errors.push("Please keep the list to 50 words or fewer.");
    if (duplicates.length) warnings.push(`Duplicate words detected: ${[...new Set(duplicates)].join(", ")}`);
    if (invalid.length) warnings.push("Some words contain unusual characters. Please verify them.");

    return { validWords: trimmed, errors, warnings, isValid: errors.length === 0 };
  }, [words]);
}
