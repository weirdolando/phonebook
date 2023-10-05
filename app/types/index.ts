export type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
  isFavorite: boolean;
};
