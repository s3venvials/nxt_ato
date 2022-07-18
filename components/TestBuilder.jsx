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
    name: `sample-${Math.random()}.e2e`,
    description: "",
    does: "",
    tasks: [],
  });
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState("");
  const [loadingScreen, setShowLoadingScreen] = useState(false);
  const [showHelper, setShowHelper] = useState(true);
  const [helperStep, setHelperStep] = useState(0);
  const [showHelperBox, setShowHelperBox] = useState(false);
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
  }, [error, screen]);

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
      tooltip: "",
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

  const addTestStep = (step, ignoreToast, fromHelperBox = false) => {
    if (showHelperBox && !fromHelperBox) return;
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
    if (ignoreToast) return;
    addToaster(step.label);
  };

  const removeTestStep = (index, label) => {
    if (showHelperBox) return;
    const temp = [...test.tasks];
    temp.splice(index, 1);
    setTest((prevState) => ({
      ...prevState,
      tasks: temp,
    }));
    removeToaster(label);
  };

  useEffect(() => {
    if (!test.tasks.some((t) => t.action === "navigate")) {
      addTestStep(controls[0], true);
    }
  }, []);

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

  const helperSteps = [
    {
      id: 0,
    },
    {
      id: 1,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
    {
      id: 8,
    },
    {
      id: 9,
    },
    {
      id: 10,
    },
    {
      id: 11,
    },
    {
      id: 12,
    },
    {
      id: 13,
    },
    {
      id: 14,
    },
    {
      id: 15,
    },
  ];

  const handleHelperSteps = (forward, backwards) => {
    if (forward && helperStep !== helperSteps.length - 1)
      setHelperStep((helperStep += 1));
    if (backwards && helperStep !== 0) setHelperStep((helperStep -= 1));
  };

  const helperStepAlreadyAddedWriteAction = () =>
    test.tasks.some((t) => t.action === "write");
  const helperStepAlreadyAddedWriteValue = () =>
    test.tasks.some((t) => t.action === "write" && t.value !== "");
  const helperStepAlreadyAddedNavValue = () =>
    test.tasks.some((t) => t.action === "navigate" && t.value !== "");
  const helperStepAlreadyAddedBtn = () =>
    test.tasks.some((t) => t.action === "click");
  const helperStepAlreadyAddedBtnValue = () =>
    test.tasks.some((t) => t.action === "click" && t.value !== "");
  const helperStepAlreadyAddedVisible = () =>
    test.tasks.some((t) => t.action === "visible");
  const helperStepAlreadyAddedVisibleValue = () =>
    test.tasks.some((t) => t.action === "visible" && t.value !== "");

  useEffect(() => {
    if (helperStep === 5 && !helperStepAlreadyAddedWriteAction()) {
      addTestStep(controls[1], false, true);
    }
    if (helperStep === 9 && !helperStepAlreadyAddedWriteValue()) {
      setTest((prevTest) => ({
        ...prevTest,
        description: "Perform a search.",
        does: "Verify search functionality",
      }));
      handleControls({ target: { value: "shirts by #search_query_top" } }, 1);
    }
    if (helperStep === 10 && !helperStepAlreadyAddedNavValue()) {
      handleControls(
        { target: { value: "http://automationpractice.com/index.php" } },
        0
      );
    }
    if (helperStep === 11 && !helperStepAlreadyAddedBtn()) {
      addTestStep(controls[2], false, true);
    }
    if (helperStep === 12 && !helperStepAlreadyAddedBtnValue()) {
      handleControls({ target: { value: "button[type='submit']" } }, 2);
    }
    if (helperStep === 13 && !helperStepAlreadyAddedVisible()) {
      addTestStep(controls[3], false, true);
    }
    if (helperStep === 14 && !helperStepAlreadyAddedVisibleValue()) {
      handleControls({ target: { value: "#center_column" } }, 3);
    }
  }, [helperStep]);

  const HelperBox = ({ message }) => {
    return (
      <Box className={styles.helperBox}>
        <Icon size="small" className={styles.helperBoxCloseBtn}>
          <Button remove onClick={() => setShowHelperBox(false)} />
        </Icon>
        <p style={{ fontWeight: "bold" }}>{message}</p>
        {helperStep !== 0 && (
          <Button
            onClick={() => handleHelperSteps(false, true)}
            rounded
            color="primary"
            size="small"
            style={{ marginTop: "1em", marginRight: "1em" }}
          >
            Back
          </Button>
        )}

        {helperStep !== helperSteps.length - 1 ? (
          <Button
            onClick={() => handleHelperSteps(true, false)}
            rounded
            color="link"
            size="small"
            style={{ marginTop: "1em" }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => {
              setShowHelperBox(false);
              setShowHelper(false);
            }}
            rounded
            color="link"
            size="small"
            style={{ marginTop: "1em" }}
          >
            Done
          </Button>
        )}
      </Box>
    );
  };

  if (loadingScreen) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div style={{ width: screen === "desktop" ? "80%" : "100%" }}>
        {error && (
          <Message color="danger">
            <Message.Body>{error}</Message.Body>
          </Message>
        )}
        <h1 className={styles.description}>Test Builder</h1>
        <Columns>
          <Column>
            {showHelperBox && helperStep === 0 && (
              <HelperBox message="Start by selecting an action here! (I'll do this for you!)" />
            )}
            {showHelperBox && helperStep === 4 && (
              <HelperBox message="Lets add the action Write. (I'll do this for you!)" />
            )}
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
                  <div className={styles.tooltip}>
                    {c.label}
                    {c.tooltip && (
                      <span className={styles.tooltiptext}>{c.tooltip}</span>
                    )}
                  </div>
                </Block>
              ))}
            </Panel>
          </Column>
          <Column>
            {showHelperBox && helperStep === 1 && (
              <HelperBox message="Selected actions are added as a step!" />
            )}
            {showHelperBox && helperStep === 2 && (
              <HelperBox message="Steps will run in the order you add them." />
            )}
            {showHelperBox && helperStep === 3 && (
              <HelperBox message="At a minimum tests need a description, does, and navigate." />
            )}
            {showHelperBox && helperStep === 5 && (
              <HelperBox message="Notice the value by #id." />
            )}
            {showHelperBox && helperStep === 6 && (
              <HelperBox message="We need a value of what we want to write by the element id." />
            )}
            {showHelperBox && helperStep === 7 && (
              <HelperBox message="For example, shirts by #search_query_top" />
            )}
            {showHelperBox && helperStep === 8 && (
              <HelperBox message="Now lets fill out the form! (I'll do this for you!)" />
            )}
            {showHelperBox && helperStep === 9 && (
              <HelperBox message="We will use a practice site for the navigate URL." />
            )}
            {showHelperBox && helperStep === 10 && (
              <HelperBox message="Lets add a click action! (I'll do this for you!)" />
            )}
            {showHelperBox && helperStep === 11 && (
              <HelperBox message="Here we can add by ID or button type submit." />
            )}
            {showHelperBox && helperStep === 12 && (
              <HelperBox message="We will also add a visible action to verify the search results." />
            )}
            {showHelperBox && helperStep === 13 && (
              <HelperBox message="This only needs an id." />
            )}
            {showHelperBox && helperStep === 14 && (
              <HelperBox message="When your ready, build it!" />
            )}
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
                        readOnly={showHelperBox}
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
                        readOnly={showHelperBox}
                      />
                      {index !== 0 && (
                        <Icon align="right" size="small">
                          <Button
                            remove
                            onClick={() => removeTestStep(index, e.label)}
                          />
                        </Icon>
                      )}
                    </Form.Control>
                  </Form.Field>
                </Block>
              ))}
            </Panel>
          </Column>
        </Columns>
        <Button
          style={{ width: screen !== "mobile" && "10%" }}
          rounded
          fullwidth={screen === "mobile"}
          color="link"
          type="submit"
          onClick={handleSubmit}
          disabled={showHelperBox}
        >
          Build
        </Button>
        <Toaster />
      </div>
      {showHelper && (
        <Box id={styles.testBuilderHelper}>
          <p style={{ fontWeight: "bold" }}>
            Welcome and thank you for trying us out! I&apos;ll be your guide if you
            need assistance, let me know!
          </p>
          <Button
            onClick={() => {
              setShowHelperBox(true);
              setShowHelper(false);
            }}
            rounded
            color="primary"
            size="small"
            style={{ marginTop: "1em", marginRight: "1em" }}
          >
            Need Help
          </Button>
          <Button
            onClick={() => {
              setShowHelper(false);
              setShowHelperBox(false);
              setHelperStep(0);
            }}
            rounded
            color="link"
            size="small"
            style={{ marginTop: "1em" }}
          >
            I&apos;m Good
          </Button>
        </Box>
      )}
    </>
  );
};

export default TestBuilder;
