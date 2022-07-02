import { useState } from "react";
import styles from "../../styles/Home.module.css";
import { Button } from "react-bulma-components";

import TestBuilder from "../../components/TestBuilder";
import StdoutPanel from "../../components/StdoutPanel";

const Sample = () => {
  const [testCreated, setTestCreated] = useState(false);

  if (testCreated) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <Button color="primary" onClick={() => setTestCreated(false)}>
            Go Back
          </Button>

          <StdoutPanel title="Test Output" />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <TestBuilder testCreated={(value) => setTestCreated(value)} />
      </main>
    </div>
  );
};

export default Sample;
