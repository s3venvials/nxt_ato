import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  let allMessages = [];
  const socket = io(`process.env.NEXT_PUBLIC_API_URL`, {
    withCredentials: true,
    // extraHeaders: {
    //   "my-custom-header": "abcd"
    // }
  });

  // UNCOMMENT TO TEST API
  // useEffect(() => {
  //   const response = axios
  //     .get("http://localhost:5000/ping")
  //     .then((x) => console.log(x));
  // });

  socket.on('test', (msg) => {
    console.log(msg);
  });

  const run = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/run?action=ALL");
      setLoading(false);

      console.log(response);
      setMessage(response.data.message);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Next Auto</h1>

        <p className={styles.description}>UI Automation Made Easy</p>

        {loading ? (
          <h2>Running...</h2>
        ) : (
          <h2 style={{ color: "green" }}>{message}</h2>
        )}

        <div className={styles.grid}>
          <a onClick={run} className={styles.card}>
            <h2>Run Test &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
