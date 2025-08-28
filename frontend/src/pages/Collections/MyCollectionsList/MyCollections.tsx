import { useEffect } from "react";
import { getUserCollections } from "../../../services/collectionService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import type { Collection } from "../../../services/collectionService";
import Button from "../../../components/Button/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CollectionConatiner from "./components/CollectionContainer/CollectionContainer";
import styles from "./MyCollections.module.css";

import { useHttp } from "../../../hooks/useHttp";

export default function CollectionsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const location = useLocation(); // ⬅️ от тут

  const {
    data: collections,
    isLoading,
    error,
    execute: fetchCollections,
  } = useHttp<Collection[], [string]>(getUserCollections);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCollections(token);
  }, [token, location.key]); // ⬅️ важливо! key міняється при кожній навігації

  if (error) {
    return <p>{error}</p>;
  } else {
    return (
      <div className={styles.myCollectionsPage}>
        <div>
          <h2>Мої колекції</h2>
          <p className={styles.description}>
            Тут ви можете зручно розподілити терміни, які бажаєте запам'тати між
            колекціями(об'єднаннями термінів). Може групувати терміни за
            книжкою, яку читаєте, за улюбленою відеогрою чи як вам заманеться!
          </p>

          {isLoading ? (
            <p>Завантаження...</p>
          ) : (
            <CollectionConatiner
              collections={collections || []}
            ></CollectionConatiner>
          )}
          <Link to="new">
            <Button glowing>+ Нова колекція</Button>
          </Link>
        </div>
      </div>
    );
  }
}
