export default class LocalStorage {
  CreateAndSetUsername() {
    const username = Math.random().toString(36).substring(2, 9);
    localStorage.setItem("username", username);
  }

  GetUsername() {
    return localStorage.getItem("username");
  }

  ClearUsername() {
    localStorage.removeItem("username");
  }

  SetSessionId() {}

  GetSessionId() {}
}
