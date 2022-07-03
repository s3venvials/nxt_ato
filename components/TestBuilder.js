import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import {
  Columns,
  Button,
  Form,
  Panel,
  Icon,
  Message,
} from "react-bulma-components";
import { faCircleDot, faMessage } from "@fortawesome/free-solid-svg-icons";
import { urlPatternValidation } from "../utilities";
import useWindowDimensions from "../hooks/useWindowDimensions";

const TestBuilder = ({ testCreated }) => {
  const { Header, Block } = Panel;
  const { Column } = Columns;
  const [test, setTest] = useState({
    name: "sample.e2e",
    description: "",
    does: "",
    tasks: [],
  });
  const [error, setError] = useState("");
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const defaultTestControls = [
    {
      name: "name",
      label: "Name",
      placeholder: "Test name?",
      icon: faMessage,
      value: test.name,
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Describe your test?",
      icon: faMessage,
      value: test.description,
    },
    {
      name: "does",
      label: "Does",
      placeholder: "It Should?",
      icon: faMessage,
      value: test.does,
    },
  ];

  const controls = [
    {
      label: "Navigate",
      placeholder: "Where We Goin?",
      icon: "",
      action: "navigate",
      value: "",
      name: "navigate",
    },
    {
      label: "Write",
      placeholder: "<value> by <#id>",
      icon: "",
      action: "write",
      value: "",
      locator: "",
      name: "write",
    },
    {
      label: "Click",
      placeholder: "<#id> OR <button[type='submit']>",
      icon: faCircleDot,
      action: "click",
      value: "",
      name: "click",
    },
    {
      label: "Visible",
      placeholder: "<#id>",
      icon: faCircleDot,
      action: "visible",
      value: "",
      name: "visible",
    },
    {
      label: "Contains",
      placeholder: "<value> by <#id>",
      icon: faCircleDot,
      action: "contains",
      value: "",
      locator: "",
      name: "contains",
    },
  ];

  const addTestStep = (step) => {
    const temp = [...test.tasks];
    if (temp.length === 7) {
      alert("Limited steps in the sample test builder.");
      return;
    }
    temp.push(step);
    setTest((prevState) => ({
      ...prevState,
      tasks: temp,
    }));
  };

  const removeTestStep = (index) => {
    const temp = [...test.tasks];
    temp.splice(index, 1);
    setTest((prevState) => ({
      ...prevState,
      tasks: temp,
    }));
  };

  const handleControls = (event, index) => {
    const { value } = event.target;
    const temp = [...test.tasks];
    temp[index] = { ...temp[index], value };
    setTest((prevState) => ({
      ...prevState,
      tasks: temp,
    }));
  };

  const isValidTest = (test) => {
    let isValid = true;

    if (!test.name) {
      setError("Please provide a test name.");
      return;
    }

    if (test.name === "example.e2e") {
      setError(`Please use a different test name, ${test.name} is a reserved name`);
      return;
    }

    if (!test.description || !test.does || test.tasks.length === 0) {
      setError(
        "Please provide at least a description, what it does and where to navigate."
      );
      return;
    }

    test.tasks.map((t) => {
      if (t.value === "") {
        setError(`Test action ${t.label} is invalid, action is empty.`);
        isValid = false;
      } else if (t.action === "navigate" && !urlPatternValidation(t.value)) {
        setError("Invalid URL");
        isValid = false;
      } else if (t.value.toLowerCase().includes("by")) {
        const x = t.value.split("by");
        const v = x[0];
        const id = x[1];
        if (v === "" || id === "" || !id?.includes("#")) {
          setError(`Test action ${t.label} is invalid, invalid format.`);
          isValid = false;
        }
      } else if (t.locator === "") {
        setError(`Test action ${t.label} is invalid, missing by locator.`);
        isValid = false;
      }

      return;
    });

    return isValid;
  };

  const formatedTestActions = (test) => {
    const tasks = test.tasks.map((t) => {
      if (t.value.toLowerCase().includes("by")) {
        const x = t.value.toLowerCase().split("by");
        t.value = x[0].trim();
        t.locator = x[1].trim();
      }
      if (t.action === "click") {
        t.value = t.value.replaceAll('"', "'");
      }
      return t;
    });

    return tasks;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isValidTest(test)) return;

    test.tasks = formatedTestActions(test);
    test.name = `${test.name}.js`;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/builder`,
        test
      );

      if (response.status === 200) {
        testCreated(true);
        sessionStorage.setItem("testName", test.name);
      }
    } catch (error) {
      setError(
        "There was an issue processing your request, please try again later."
      );
    }
  };

  return (
    <div style={{ width: "80%" }}>
      {error && (
        <Message color="danger">
          <Message.Body>{error}</Message.Body>
        </Message>
      )}
      <Columns>
        <Column>
          <Panel>
            <Header className={styles.panelHeader}>Test Builder</Header>
            <Block>
              <Form.Input placeholder="Search" />
            </Block>
            {controls.map((c, index) => (
              <Block
                className={styles.pointer}
                onClick={() => addTestStep(c)}
                key={`${c.label}-${index}`}
              >
                {c.label}
              </Block>
            ))}
          </Panel>
        </Column>
        <Column>
          <Panel>
            <Header className={styles.panelHeader}>Test Steps</Header>
            {defaultTestControls.map((e, index) => (
              <Block key={`${e.label}-${index}`} style={{ display: "block" }}>
                <Form.Field>
                  <Form.Label>{e.label}</Form.Label>
                  <Form.Control fullwidth>
                    <Form.Input
                      placeholder={e.placeholder}
                      onChange={handleChange}
                      name={e.name}
                      value={e.value}
                    />
                  </Form.Control>
                </Form.Field>
              </Block>
            ))}
            {test.tasks.map((e, index) => (
              <Block key={`${e.label}-${index}`} style={{ display: "block" }}>
                <Form.Field>
                  <Form.Label>{e.label}</Form.Label>
                  <Form.Control fullwidth>
                    <Form.Input
                      placeholder={e.placeholder}
                      value={e.value}
                      name={e.name}
                      onChange={(event) => handleControls(event, index)}
                    />
                    <Icon align="right" size="small">
                      <Button remove onClick={() => removeTestStep(index)} />
                    </Icon>
                  </Form.Control>
                </Form.Field>
              </Block>
            ))}
          </Panel>
        </Column>
      </Columns>
      <Button rounded fullwidth={screen === "mobile"} color="link" type="submit" onClick={handleSubmit}>
        Build
      </Button>
    </div>
  );
};

export default TestBuilder;
