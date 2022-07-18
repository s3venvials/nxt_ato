import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { reporterState } from "../recoils/builder/atoms";
import { Panel, Button, Columns, Message } from "react-bulma-components";
import Socket from "../socket/client";

import UnderscoreSpring from "./UnderscoreSpring";

import styles from "../styles/Home.module.css";

const StdoutPanel = ({ title, customStyle, showReportBtn }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [testStopped, setTestStopped] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [reportBtnDisabled, setReportBtnDisabled] = useState(true);
  const setReporter = useSetRecoilState(reporterState);
  const resetReporter = useResetRecoilState(reporterState);
  const { Header } = Panel;
  const { Column } = Columns;
  const testName = useRef();
  const router = useRouter();

  if (typeof window !== "undefined") {
    testName.current = sessionStorage.getItem("testName");
  }

  const run = async () => {
    try {
      setError("");
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
        if (m.includes('"json" Reporter:{')) {
          let results = m.split('"json" Reporter:')[1];
          if (results.includes("Spec Files:")) {
            results = results.split("Spec Files:")[0];
          }
          try {
            resetReporter();
            const parsedResults = JSON.parse(results);
            setReporter(parsedResults);
          } catch (error) {
            setError("Failed to save results");
          }
        }
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
      setReportBtnDisabled(false);
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

  const goToReporter = () => router.push("/reporter");

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
        <Header className={styles.panelHeader}>
          {title}
          {showReportBtn && (
            <Button
              style={{ float: "right" }}
              rounded
              color="link"
              size="small"
              onClick={goToReporter}
              disabled={reportBtnDisabled}
            >
              View Report
            </Button>
          )}
        </Header>
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
                setError("");
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
