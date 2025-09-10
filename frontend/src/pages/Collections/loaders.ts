import type { LoaderFunctionArgs } from "react-router-dom";
import { getCollectionById } from "../../services/collectionService";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) throw new Error("No collection ID provided");
  const collection = await getCollectionById(id);
  return collection;
}
