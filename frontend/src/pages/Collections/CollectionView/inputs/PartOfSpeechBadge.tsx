import styles from "../CollectionView.module.css";

export default function PartOfSpeechBadge({
  partOfSpeech,
}: {
  partOfSpeech: string;
}) {
  const colors: Record<string, string> = {
    noun: "blue",
    verb: "green",
    adjective: "orange",
    adverb: "purple",
  };
  return (
    <span
      className={styles.PartOfSpeechBadge}
      style={{ color: colors[partOfSpeech] || "black" }}
    >
      <b> {partOfSpeech}</b>
    </span>
  );
}
