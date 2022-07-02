import { useRouter } from 'next/router';
import { Navbar } from "react-bulma-components";
import styles from "../styles/Home.module.css";

const Navigation = () => {
  const router = useRouter();
  const { Brand } = Navbar;
  const goHome = () => router.push("/");

  return (
    <Navbar className={styles.navBorder}>
      <Brand>
      <span className={styles.triangleTopleft}></span>
        <h1
          onClick={goHome}
          className={`${styles.navBrandTitle} ${styles.pointer}`}
        >
          NXTATO
        </h1>
      </Brand>
    </Navbar>
  );
};

export default Navigation;
