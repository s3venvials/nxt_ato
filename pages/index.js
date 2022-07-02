import { useState } from "react";
import { useRouter } from "next/router";
import StdoutPanel from "../components/StdoutPanel";
import styles from "../styles/Home.module.css";
import { Columns, Button } from "react-bulma-components";

export default function Home() {
  const router = useRouter();
  const { Column } = Columns;
  const exampleTest = { name: "example.e2e" };
  const goToSampleTest = () => router.push("/builder/sample");

  if (typeof window !== "undefined") {
    sessionStorage.setItem('testName', exampleTest.name);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.description}>UI Automation Made Easy</h1>
        <Columns>
          <Column>
            <p className={styles.descriptionP}>
              Build UI automated tests with out code! We use the power of
              Webdriver.io to build and run tests &amp; Socket.io to provide
              live feed back.
            </p>
            <p className={styles.descriptionP}>
              Simply tell us where to go and what actions &amp; verifications
              you want to perform with just a few clicks!
            </p>
            <Button color="primary" onClick={goToSampleTest}>
              Try It Out
            </Button>
          </Column>

          <StdoutPanel title="Run Sample Test!" />
        </Columns>
      </main>
    </div>
  );
}
