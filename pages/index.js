import { useEffect } from "react";
import axios from "axios";
import StdoutPanel from "../components/StdoutPanel";
import styles from "../styles/Home.module.css";

export default function Home() {
  // UNCOMMENT TO TEST API
  // useEffect(() => {
  //   const response = axios
  //     .get("http://localhost:5000/ping")
  //     .then((x) => console.log(x));
  // });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <p className={styles.description}>UI Automation Made Easy</p>
        <p className={styles.description}>Powered By Webdriver.IO</p>

        <StdoutPanel />
      </main>
    </div>
  );
}
