import { atom } from "recoil";

export const reporterState = atom({
  key: "reporterState",
  default: {
    start: "",
    end: "",
    capabilities: {
      acceptInsecureCerts: true,
      browserName: "",
      browserVersion: 0,
      chrome: {
        chromedriverVersion: "",
        userDataDir: "",
      },
      networkConnectionEnabled: false,
      pageLoadStrategy: "",
      platformName: "",
      proxy: {},
      setWindowRect: true,
      strictFileInteractability: false,
      timeouts: {
        implicit: 0,
        pageLoad: 0,
        script: 0,
      },
    },
    framework: "",
    suites: [
      {
        name: "",
        duration: 0,
        start: "",
        end: "",
        tests: [
        //   {
        //     name: "",
        //     start: "",
        //     end: "",
        //     duration: 0,
        //     state: "",
        //     errorType: "",
        //     error: "",
        //   },
        ],
        hooks: [],
      },
    ],
    state: {
      passed: 0,
      failed: 0,
      skipped: 0,
    },
  },
});
