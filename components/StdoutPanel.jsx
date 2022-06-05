import { useState, useEffect } from "react";
import { Panel, Button, Columns } from "react-bulma-components";
import Socket from "../socket/client";

import UnderscoreSpring from "./UnderscoreSpring";

import styles from "../styles/Home.module.css";

const { Header } = Panel;
const { Column } = Columns;

const StdoutPanel = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  const run = async () => {
    try {
      setLoading(true);
      if (!connected) {
        Socket.Connect();
        setConnected(Socket.IsConnected());
      }
      Socket.socket.emit("run", {});
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    if (connected) {
      Socket.socket.on("output", (msg) => {
        if (msg === "undefined" || msg === "" || typeof msg !== "string")
          return;
        const m = msg.replace("\n", "");
        setMessages((messages += m));
        const elem = document.getElementById("outputBox");
        elem.scrollTop = elem.scrollHeight;
      });
    }
  }, [connected]);

  useEffect(() => {
    Socket.socket.on("done", (code) => {
      if (code !== 0) {
        return setError("There was an issue processing your request.");
      }
      setLoading(false);
    });
  }, []);

  return (
    <Columns>
      <Column size={4}></Column>
      <Column size={4}>
        <h3
          style={{
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
            padding: "0.5em",
          }}
        >
          {error}
        </h3>
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
              <Button
                loading={loading}
                fullwidth
                onClick={run}
                color="primary"
                disabled={loading}
              >
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
