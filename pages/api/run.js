import { spawn } from "child_process";

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
  const exec = spawn("npm run wdio", { shell: true });

  exec.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  exec.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  exec.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return res.status(200).json({ message: "success" });
};

const runSpec = async (res, testName) => {
  try {
    spawn(
      `npm run wdio --spec ${testName}`,
      { shell: true },
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
