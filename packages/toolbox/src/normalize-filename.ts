export const normalizeFilename = (name: string): string => {
  let normalized = '';

  for (let i = 0; i < name.length; i += 1) {
    let char = name[i];

    if (/[_ \-&^*()@#$%!~]/.test(char)) {
      char = '-';
    } else if (char.toUpperCase() === char) {
      char = i > 0 ? `-${char.toLowerCase()}` : char.toLowerCase();
    }

    normalized = `${normalized}${char}`;
  }

  return normalized;
};
