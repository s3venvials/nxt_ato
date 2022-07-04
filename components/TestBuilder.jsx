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
  Box,
} from "react-bulma-components";
import { faCircleDot, faMessage } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { urlPatternValidation } from "../utilities";
import useWindowDimensions from "../hooks/useWindowDimensions";
import LoadingScreen from "./LoadingScreen";

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
  const [loadingScreen, setShowLoadingScreen] = useState(false);
  const mobile = 769;
  const addToaster = (step) =>
    toast.success(`Step ${step} Added!`, {
      position: "bottom-center",
      duration: 3000,
    });
  const removeToaster = (step) =>
    toast.success(`Step ${step} Removed!`, {
      position: "bottom-center",
      duration: 3000,
    });

  useEffect(() => {
    if (width < mobile) {
      setScreen("mobile");
    } else {
      setScreen("desktop");
    }
  }, [width]);

  useEffect(() => {
    if (error !== "" && screen === "mobile") {
      window.scrollTo(0, 0);
    }
  }, [error]);

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
      placeholder: "Where We Goin? example.com",
      icon: "",
      action: "navigate",
      value: "",
      name: "navigate",
    },
    {
      label: "Write",
      placeholder: "value by #id",
      icon: "",
      action: "write",
      value: "",
      locator: "",
      name: "write",
    },
    {
      label: "Click",
      placeholder: "#id OR button[type='submit']",
      icon: faCircleDot,
      action: "click",
      value: "",
      name: "click",
    },
    {
      label: "Visible",
      placeholder: "#id",
      icon: faCircleDot,
      action: "visible",
      value: "",
      name: "visible",
    },
    {
      label: "Contains",
      placeholder: "value by #id",
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
      setError("Limited steps in the sample test builder.");
      return;
    }
    temp.push(step);
    setTest((prevState) => ({
      ...prevState,
      tasks: temp,
    }));
    addToaster(step.label);
  };

  const removeTestStep = (index, label) => {
    const temp = [...test.tasks];
    temp.splice(index, 1);
    setTest((prevState) => ({
      ...prevState,
      tasks: temp,
    }));
    removeToaster(label);
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
      isValid = false;
      return;
    }

    if (test.name === "example.e2e") {
      setError(
        `Please use a different test name, ${test.name} is a reserved name.`
      );
      isValid = false;
      return;
    }

    if (!test.description || !test.does || test.tasks.length === 0) {
      setError(
        "Please provide at least a description, what it does and where to navigate."
      );
      isValid = false;
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

    if (test.tasks.find((t) => t.action === "navigate") === undefined) {
      setError("Please provide an action to navigate to.");
      isValid = false;
    }

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
      setShowLoadingScreen(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/builder`,
        test
      );

      if (response.status === 200) {
        setTimeout(() => {
          setShowLoadingScreen(false);
          testCreated(true);
          sessionStorage.setItem("testName", test.name);
        }, 5000);
      }
    } catch (error) {
      setError(
        "There was an issue processing your request, please try again later."
      );
    }
  };

  if (loadingScreen) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ width: "80%" }}>
      {error && (
        <Message color="danger">
          <Message.Body>{error}</Message.Body>
        </Message>
      )}
      <h1 className={styles.description}>Test Builder</h1>
      <Box>
        <p className={styles.descriptionP}>
          To get started, click on an action which will add the action to your
          steps. To start, I would add the "Navigate" action first and then
          complete the steps form on the right. Once you are done, click on the
          build button. For example, when you run your test it will navigate to
          the website URL you provide.
        </p>
      </Box>
      <Columns>
        <Column>
          <Panel>
            <Header className={styles.panelHeader}>Actions</Header>
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
            <Header className={styles.panelHeader}>Steps</Header>
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
                      <Button
                        remove
                        onClick={() => removeTestStep(index, e.label)}
                      />
                    </Icon>
                  </Form.Control>
                </Form.Field>
              </Block>
            ))}
          </Panel>
        </Column>
      </Columns>
      <Button
        rounded
        fullwidth={screen === "mobile"}
        color="link"
        type="submit"
        onClick={handleSubmit}
      >
        Build
      </Button>
      <Toaster />
    </div>
  );
};

export default TestBuilder;
