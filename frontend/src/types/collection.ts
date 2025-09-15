import type { Term } from "./term";

export type Collection = {
  id?: number;
  name: string;
  description: string | null;
  imagePath?: string;
  terms?: Term[];
};
