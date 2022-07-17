import { useState, useEffect, Fragment } from "react";
import { useRecoilValue } from "recoil";
import { reporterState } from "../recoils/builder/atoms";
import { Box, Columns, Message, Button } from "react-bulma-components";
import useWindowDimensions from "../hooks/useWindowDimensions";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const Reporter = () => {
  const reporter = useRecoilValue(reporterState);
  const { Column } = Columns;
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState("");
  const mobile = 769;
  const router = useRouter();

  useEffect(() => {
    if (width < mobile) {
      setScreen("mobile");
    } else {
      setScreen("desktop");
    }
  }, [width]);

  const goHome = () => router.push("/");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.description}>Reporter</h1>
        <Box style={{ width: screen === "mobile" ? "100%" : "80%" }}>
          <h3 className={styles.reporterSections}>Info</h3>
          <Columns>
            <Column>
              <span className={styles.label}>Start:</span>
              <span>{reporter.start}</span>
            </Column>
            <Column>
              <span className={styles.label}>End:</span>
              <span>{reporter.end}</span>
            </Column>
            <Column>
              <span className={styles.label}>Browser:</span>
              <span>{reporter.capabilities.browserName}</span>
            </Column>
            <Column>
              <span className={styles.label}>Browser Version:</span>
              <span>{reporter.capabilities.browserVersion}</span>
            </Column>
          </Columns>
          <hr />
          <h3 className={styles.reporterSections}>Tests</h3>
          <Columns>
            {reporter.suites[0].tests.map((s) => {
              return (
                <Fragment key={s.name}>
                  <Column>
                    <span className={styles.label}>Name:</span>
                    <span>{s.name}</span>
                  </Column>
                  <Column>
                    <span className={styles.label}>Start:</span>
                    <span>{s.start}</span>
                  </Column>
                  <Column>
                    <span className={styles.label}>End:</span>
                    <span>{s.end}</span>
                  </Column>
                  <Column>
                    <span className={styles.label}>Duration:</span>
                    <span>{s.duration}</span>
                  </Column>
                </Fragment>
              );
            })}
          </Columns>
          <hr />
          <h3 className={styles.reporterSections}>Results</h3>
          <Columns>
            <Column>
              {reporter.state.passed > 0 && (
                <Message color="success">
                  <Message.Body>Passed</Message.Body>
                </Message>
              )}
              {reporter.state.passed === 0 && (
                <>
                <Message color="danger">
                  <Message.Body>Failed</Message.Body>
                </Message>
                <Message color="danger">
                <Message.Body>
                  {reporter?.suites[0]?.tests[0]?.error}
                </Message.Body>
              </Message>
              </>
              )}
            </Column>
          </Columns>
          <Button
            onClick={goHome}
            color="primary"
            fullwidth={screen === "mobile"}
          >
            Done
          </Button>
        </Box>
      </main>
    </div>
  );
};

export default Reporter;
