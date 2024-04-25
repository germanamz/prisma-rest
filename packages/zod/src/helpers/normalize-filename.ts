export const normalizeFilename = (name: string): string => {
  let normalized = '';

  for (let i = 0; i < name.length; i++) {
    let char = name[i];

    if (char.toUpperCase() === char) {
      char = i > 0 ? `-${char.toLowerCase()}` : char.toLowerCase();
    }

    normalized = `${normalized}${char}`;
  }

  return normalized;
};
