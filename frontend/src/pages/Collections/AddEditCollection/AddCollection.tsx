import CollectionForm from "./CollectionForm/CollectionForm";
import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import api from "../../../api/api";

export default function AddNewCollectionPage() {
  return (
    <>
      <h2>Створюємо нову колекцію</h2>
      <CollectionForm navigateTo={"/collections"}></CollectionForm>
    </>
  );
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  await api.post("/collections", formData);
  return redirect("/collections");
}
