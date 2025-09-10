import api from "../../../api/api";
import { Link, useLoaderData } from "react-router-dom";
import Button from "../../../components/Button/Button";
import CollectionCardList from "./components/CollectionCardList/CollectionCardList";
import styles from "./MyCollectionsPage.module.css";
import type { Collection } from "../../../services/collectionService";

export default function MyCollectionsPage() {
  const collections: Collection[] = useLoaderData();

  return (
    <div className={styles.myCollectionsPage}>
      <div>
        <h2>Мої колекції</h2>
        <p className={styles.description}>
          Тут ви можете зручно розподілити терміни, які бажаєте запам'тати між
          колекціями(об'єднаннями термінів). Може групувати терміни за книжкою,
          яку читаєте, за улюбленою відеогрою чи як вам заманеться!
        </p>

        <CollectionCardList>
          {collections.map((collections) => (
            <CollectionCardList.Item
              key={collections.id}
              collection={collections}
            />
          ))}
        </CollectionCardList>

        <Link to="new">
          <Button glowing>+ Нова колекція</Button>
        </Link>
      </div>
    </div>
  );
}

export async function loader() {
  const response = await api.get("/collections");
  return response.data;
}
