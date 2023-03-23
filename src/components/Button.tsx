import styles from "./Button.module.css";

export default function Button(props: {
  name: string;
  onClick: (button: string) => void;
}) {
  const clickHandler = () => {
    props.onClick(props.name);
  };
  return (
    <button onClick={clickHandler} className={styles.button}>
      {props.name}
    </button>
  );
}
