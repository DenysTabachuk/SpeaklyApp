import type { Definition } from "./definition";

export type Term = {
  id?: number;
  collectionId?: number;
  word: string;
  definitions: Definition[];
};
