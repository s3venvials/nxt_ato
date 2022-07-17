import styles from "../styles/Home.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        All Rights Reserved {new Date().getFullYear()}{" "}
      </p><br />
      <p>
      Hosted With{" "}
        <span className={styles.logo}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </p>
    </footer>
  );
};

export default Footer;
