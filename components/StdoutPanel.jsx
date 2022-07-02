import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Panel, Button, Columns } from "react-bulma-components";
import Socket from "../socket/client";

import UnderscoreSpring from "./UnderscoreSpring";

import styles from "../styles/Home.module.css";

const StdoutPanel = ({ title, testToRun }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [testStopped, setTestStopped] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const { Header } = Panel;
  const { Column } = Columns;
  const testName = useRef();

  useEffect(() => {
    testName.current = sessionStorage.getItem("testName");
  }, []);

  const run = async () => {
    try {
      setLoading(true);
      if (!connected) {
        Socket.Connect();
        setConnected(Socket.IsConnected());
      }
      Socket.socket.emit("run", testToRun);
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
        setError("There was an issue processing your request.");
      }
      setLoading(false);
      setTestStopped(true);
      setDisableBtn(true);
    });
  }, []);

  useEffect(() => {
    if (
      testStopped &&
      testName.current !== "example.e2e" &&
      testName.current !== undefined &&
      testName.current !== null
    ) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/builder/remove?name=${testName.current}`
        )
        .then((res) => sessionStorage.removeItem("testName"))
        .catch((err) => setError(err.toString()));
    }
  }, [testStopped]);

  return (
    <div className={styles.stdoutPanel}>
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
        <Header className={styles.panelHeader}>{title}</Header>
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
              disabled={loading || disableBtn}
            >
              Run
            </Button>
          </Column>
          <Column size={6}>
            <Button fullwidth color="link" onClick={() => setMessages("")}>
              Clear
            </Button>
          </Column>
        </Columns>
      </Panel>
    </div>
  );
};

export default StdoutPanel;
