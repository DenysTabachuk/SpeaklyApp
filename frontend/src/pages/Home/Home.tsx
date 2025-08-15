import { useEffect, useState } from "react";
import { getUserCollections } from "../../services/collectionsService";
import { useSelector } from "react-redux";
import AddNewColletion from "./components/AddNewCollection/AddNewCollection";
import type { RootState } from "../../store/store";
import type { Collection } from "../../services/collectionsService";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import CollectionConatiner from "./components/CollectionContainer/CollectionContainer";

export default function HomePage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingNewCollection, setAddingNewCollection] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await getUserCollections(token);

        if (response.status === 401) {
          navigate("/login"); // мб просто на оновлення токена змінити
        }

        const responseData = await response.json();
        // console.log("responseData", response);
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

  const handleAddCollection = () => {
    setAddingNewCollection(() => !addingNewCollection);
  };

  const addCollection = (collection: Collection) => {
    console.log("collection: ", collection);
    setCollections([...collections, collection]);
  };

  return (
    <div className={styles.HomePage}>
      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <div>
          {error && <p>{error}</p>}

          {addingNewCollection ? (
            <AddNewColletion
              stopAdding={handleAddCollection}
              addCollection={addCollection}
            ></AddNewColletion>
          ) : (
            <>
              <CollectionConatiner
                collections={collections}
              ></CollectionConatiner>

              {!addingNewCollection && (
                <Button glowing onClick={handleAddCollection}>
                  + Нова колекція
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
