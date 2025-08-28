import type { Term } from "./termService";

export type Collection = {
  id?: number;
  name: string;
  description: string | null;
  imagePath?: string;
  terms?: Term[];
};

export async function getUserCollections(token: string) {
  const response = await fetch("http://localhost:3000/collections", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function getCollectionById(collectionID: string, token: string) {
  return fetch(`http://localhost:3000/collections/${collectionID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

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

export async function editCollection(
  formData: FormData,
  token: string,
  collectionId: string
) {
  console.log("editCollection");
  const response = await fetch(
    `http://localhost:3000/collections/${collectionId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  return data;
}

export async function deleteCollection(collectionId: string, token: string) {
  return fetch(`http://localhost:3000/collections/${collectionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
