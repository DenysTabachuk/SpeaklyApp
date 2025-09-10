import type { Term } from "./termService";

export type Collection = {
  id?: number;
  name: string;
  description: string | null;
  imagePath?: string;
  terms?: Term[];
};

export async function addNewCollection(formData: FormData, token: string) {
  console.log("addNewCollection");
  const response = await fetch("http://localhost:3000/collections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data;
}

export async function deleteCollection(collectionId: number, token: string) {
  return fetch(`http://localhost:3000/collections/${collectionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
