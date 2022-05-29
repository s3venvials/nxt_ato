import axios from "axios";

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
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/run`);
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
}