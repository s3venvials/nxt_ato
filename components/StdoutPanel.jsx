import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Panel, Button, Columns, Message } from "react-bulma-components";
import Socket from "../socket/client";

import UnderscoreSpring from "./UnderscoreSpring";

import styles from "../styles/Home.module.css";

const StdoutPanel = ({ title, customStyle }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [testStopped, setTestStopped] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const { Header } = Panel;
  const { Column } = Columns;
  const testName = useRef();

  if (typeof window !== "undefined") {
    testName.current = sessionStorage.getItem("testName");
  }

  const run = async () => {
    try {
      setError('');
      setLoading(true);
      if (!connected) {
        Socket.Connect();
        setConnected(Socket.IsConnected());
      }
      Socket.socket.emit("run", testName.current);
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
        const m = msg.replaceAll("\n", "").replaceAll("[0-0]", "");
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
    <div
      className={customStyle ? styles.customStdoutPanel : styles.stdoutPanel}
    >
      {error && (
        <Message color="danger">
          <Message.Body>{error}</Message.Body>
        </Message>
      )}
      <Panel>
        <Header className={styles.panelHeader}>{title}</Header>
        <div id="outputBox" className={styles.outputBox}>
          {messages.split("INFO").map((o, i) => (
            <p key={i} className={styles.outputMsg}>
              {o.length > 0 ? (
                o
              ) : (
                <span>
                  NxtAto@machine:~$: <UnderscoreSpring />
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
              rounded
            >
              Run
            </Button>
          </Column>
          <Column size={6}>
            <Button
              rounded
              fullwidth
              color="link"
              onClick={() => {
                setMessages("");
                setDisableBtn(false);
                setError('');
              }}
            >
              Clear
            </Button>
          </Column>
        </Columns>
      </Panel>
    </div>
  );
};

export default StdoutPanel;
