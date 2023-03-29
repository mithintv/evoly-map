import styles from "./Button.module.css";

export default function Button(props: {
  name: string;
  disabled: boolean;
  onClick: (button: string) => void;
}) {
  const clickHandler = () => {
    props.onClick(props.name);
  };
  return (
    <button
      disabled={props.disabled}
      onClick={clickHandler}
      className={styles.button}
    >
      {props.name}
    </button>
  );
}
