
export type GenZodOptions = {
  type: string;
  isNullable?: boolean;
  isRequired?: boolean;
  isList?: boolean;
};

export const genZod = ({
  type,
  isNullable,
  isRequired,
  isList,
}: GenZodOptions) => {
  let zod = `z.${type}()`;

  if (isList) {
    zod = `${zod}.array()`;
  }

  if (isRequired === false) {
    zod = `${zod}.optional()`;
  }

  if (isNullable) {
    zod = `${zod}.nullable()`;
  }

  return zod;
};
