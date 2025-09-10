import type { Collection } from "../../../services/collectionService";
import CollectionForm from "./CollectionForm/CollectionForm";
import { useLoaderData, redirect } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import api from "../../../api/api";

export default function EditCollection() {
  const collection: Collection = useLoaderData();

  return (
    <>
      <h2>Редагуємо колекцію</h2>
      <CollectionForm
        initialValues={{
          id: collection.id,
          name: collection.name,
          description: collection.description ?? "",
          imagePath: collection.imagePath ?? null,
        }}
        navigateTo={`/collections/${collection.id}`}
      />
    </>
  );
}

export async function action({ params, request }: LoaderFunctionArgs) {
  const id = params.id;
  const formData = await request.formData();

  const response = await api.put(`/collections/${id}`, formData);
  console.log("response", response);
  return redirect(`/collections/${id}`);
}
