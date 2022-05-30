import { useSpring, animated } from "react-spring";

const UnderscoreSpring = () => {
  const styles = useSpring({
    loop: { reverse: true },
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 300,
  });

  return <animated.span style={styles}>_</animated.span>;
};

export default UnderscoreSpring;
