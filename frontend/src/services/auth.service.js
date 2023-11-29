import axios from "axios";

const API_URL = "https://ece9065group3api-51579a5ffecb.herokuapp.com/api/auth/";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "localLogin", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(name, email, password, isGoogleLogin) {
    return axios.post(API_URL + "register", {
      name,
      email,
      password,
      isActive: isGoogleLogin ? true : false,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  findUser(email) {
    return axios.get(API_URL + "users/" + email);
  }
  updateUserPassword(id, password) {
    return axios.put(API_URL + "users/" + id, {
      password: password
    });
  }
}

const AuthServiceInstance = new AuthService();

export default AuthServiceInstance;
