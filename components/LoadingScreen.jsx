import { useEffect } from "react";
import { Progress, Box } from "react-bulma-components";
import styles from "../styles/Home.module.css";

const LoadingScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Box style={{ width: "100%", textAlign: "center" }}>
          {" "}
          <h1 className={styles.description}>Loading...</h1>
          <Progress color="primary" size="large" />
          <p className={styles.descriptionP}>We are getting your test ready!</p>
        </Box>
      </main>
    </div>
  );
};

export default LoadingScreen;
