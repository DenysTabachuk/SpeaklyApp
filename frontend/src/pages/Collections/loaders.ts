import type { LoaderFunctionArgs } from "react-router-dom";
import api from "../../api/api";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) throw new Error("No collection ID provided");
  const response = await api.get(`/collections/${id}`);
  return response.data;
}
