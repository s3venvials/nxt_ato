import { useEffect, useState } from "react";
import { Box } from "react-bulma-components";
import styles from "../styles/Home.module.css";
import useWindowDimensions from "../hooks/useWindowDimensions";

const About = () => {
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

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Box style={{ width: screen === "desktop" ? "80%" : "100%" }}>
          <h1
            className={styles.description}
            style={{ color: "#00d1b2", textAlign: "center" }}
          >
            Story
          </h1>
        </Box>
        <Box style={{ width: screen === "desktop" ? "80%" : "100%" }}>
          <p className={styles.descriptionP}>
            At the time of this writing, NxtAto was created and is maintained by
            a one-man dev team. The name NxtAto comes from the popular framework
            Next.js, which this site is created from and ato, short for
            automation. Here I am combining my experience with UI automation and
            my passion for web design. The current goal is just to provide a
            proof of concept that may or may not grow into something that could
            actually be useful in the UI automation world.
          </p>
        </Box>
      </main>
    </div>
  );
};

export default About;
