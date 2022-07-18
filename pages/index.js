import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import StdoutPanel from "../components/StdoutPanel";
import styles from "../styles/Home.module.css";
import { Columns, Button, Box } from "react-bulma-components";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function Home() {
  const router = useRouter();
  const { Column } = Columns;
  const exampleTest = { name: "example.e2e" };
  const goToSampleTest = () => router.push("/builder/sample");
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState("");
  const mobile = 769;

  useEffect(() => {
    if (width < mobile) {
      setScreen("mobile");
    } else {
      setScreen("desktop");
    }
  }, [width]);

  if (typeof window !== "undefined") {
    sessionStorage.setItem("testName", exampleTest.name);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Columns style={{ maxWidth: screen === "desktop" ? "80%" : "100%" }}>
          <Column size={6}>
            <Box shadowless={screen === "desktop"} style={{ height: '100%' }}>
              <h1 className={styles.description}>UI Automation Made Easy</h1>
              <p className={styles.descriptionP}>
                Build UI automated tests with out code! We use the power of
                Webdriver.io to build and run tests &amp; Socket.io to provide
                live feed back. Simply tell us where to go and what actions
                &amp; verifications you want to perform with just a few clicks!
              </p>
              <Button
                style={{ width: screen === "mobile" ? "100%" : "30%", marginTop: '0.5em' }}
                rounded
                size={screen === "desktop" && "medium"}
                color="primary"
                onClick={goToSampleTest}
              >
                Try It Out!
              </Button><br />
              <Image style={{ marginTop: '2em' }} src="/NxtAto.gif" alt="test" width="800" height="380" />
            </Box>
          </Column>
          {screen === "desktop" && (
            <Column size={6}>
              <StdoutPanel title="Run Sample Test!" />
            </Column>
          )}
        </Columns>
        {screen === "mobile" && <StdoutPanel title="Run Sample Test!" />}
      </main>
    </div>
  );
}
