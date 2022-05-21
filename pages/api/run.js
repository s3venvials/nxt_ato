import child_process from "child_process";

const ALL = "ALL";
const SPEC = "SPEC";

export default async function handler(req, res) {
  const { action, testName } = req.query;

  switch (action) {
    case ALL:
      await run(res);
      break;
    case SPEC:
      await runSpec(res, testName);
      break;
    default:
      return;
  }
}

const run = async (res) => {
  try {
    child_process.execSync("npm run wdio", (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
      console.log(stderr);
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

const runSpec = async (res, testName) => {
  try {
    exec.execSync(
      `npm run wdio --spec ${testName}`,
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
        console.log(stderr);
      }
    );

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};
