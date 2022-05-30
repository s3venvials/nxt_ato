import { Navbar } from "react-bulma-components";
import styles from "../styles/Home.module.css";
const { Brand } = Navbar;

const Navigation = () => {
  return (
    <Navbar className={styles.navBorder}>
      <Brand>
      <span className={styles.triangleTopleft}></span>
        <h1
          className={styles.navBrandTitle}
        >
          NXTATO
        </h1>
      </Brand>
    </Navbar>
  );
};

export default Navigation;
