import { useEffect, useState } from "react";
import { getUserCollections } from "../../../services/termCollectionsService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import type { Collection } from "../../../services/termCollectionsService";
import Button from "../../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import CollectionConatiner from "./components/CollectionContainer/CollectionContainer";

export default function CollectionsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      console.log("А де токен нахуй");
      // navigate("/login");
      return;
    }

    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        console.log("fetching collections");
        const response = await getUserCollections(token);
        console.log("response", response);

        if (response.status === 401) {
          navigate("/login"); // мб просто на оновлення токена змінити
        }

        const responseData = await response.json();
        console.log("responseData", response);
        if ("error" in responseData && responseData.error) {
          setError(responseData.error);
        } else {
          setCollections(responseData.collections);
          setError("");
        }
      } catch (err) {
        setError("Помилка завантаження колекцій");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [token]);

  return (
    <div>
      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <div>
          <CollectionConatiner collections={collections}></CollectionConatiner>

          <Link to="new">
            <Button glowing>+ Нова колекція</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
