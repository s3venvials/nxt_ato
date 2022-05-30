import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Panel, Button, Columns } from "react-bulma-components";

import UnderscoreSpring from "./UnderscoreSpring";

import styles from "../styles/Home.module.css";

const { Header } = Panel;
const { Column } = Columns;

const StdoutPanel = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      withCredentials: true,
      // extraHeaders: {
      //   "my-custom-header": "abcd"
      // }
    });

    socket.on("run", (msg) => {
      if (msg === "undefined" || msg === "" || typeof msg !== "string") return;
      const m = msg.replace("\n", "");
      setMessages((messages += m));
      const elem = document.getElementById("outputBox");
      elem.scrollTop = elem.scrollHeight;
    });

    socket.on("done", (code) => {
      setLoading(false);
      if (code !== 0) {
        setError("There was an issue processing your request.");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const run = async () => {
    try {
      setLoading(true);
      await axios.get("/api/run?action=ALL");
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  return (
    <Columns>
      <Column size={4}></Column>
      <Column size={4}>
        <Panel>
          <Header className={styles.panelHeader}>Run Sample Test!</Header>
          <div id="outputBox" className={styles.outputBox}>
            {messages.split("INFO").map((o, i) => (
              <p key={i} className={styles.outputMsg}>
                {o.length > 0 ? (
                  o
                ) : (
                  <span>
                    NxtAuto@machine:~$: <UnderscoreSpring />
                  </span>
                )}
              </p>
            ))}
          </div>
          <Columns className={styles.panelBtnGrp}>
            <Column size={6}>
              <Button loading={loading} fullwidth onClick={run} color="primary">
                Run
              </Button>
            </Column>
            <Column size={6}>
              <Button fullwidth color="link" onClick={() => setMessages("")}>
                Reset
              </Button>
            </Column>
          </Columns>
        </Panel>
      </Column>
      <Column size={4}></Column>
    </Columns>
  );
};

export default StdoutPanel;
