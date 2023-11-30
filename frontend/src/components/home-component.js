import { React, useState, useEffect } from "react";
import GoogleButton from "react-google-button";
import AuthService from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { app } from "../config/firebase-config";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import axios from "axios";
import "../styles/home.css";

const HomeComponent = () => {
  const client_URL = "http://localhost:3000";
  const BASE_URL = "https://ece9065group3api-51579a5ffecb.herokuapp.com/api";
  const USER_URL = `${BASE_URL}/auth/users`;
  // let [registerModalVisible, setRegisterModalVisible] = useState(false);
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  let [imgSrc, setImgSrc] = useState(null);
  //get random images from pexels api
  const auth = "ucV98Fuq6thBiqKVYIOji8YlLUZWy49yzsFnElUr2ljzBMAY1FLDJBAp";
  const imageURL =
    "https://api.pexels.com/v1/search?page=1&per_page=50&query=reading";

  const fetchImage = async (url) => {
    const dataFetch = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });
    let parseData = await dataFetch.json();
    //get random image from data
    let random = Math.floor(Math.random() * 15);
    let image = parseData.photos[random].src.large;
    setImgSrc(image);
  };
  useEffect(() => {
    fetchImage(imageURL);
  }, []);

  //login part
  let [email_login, setEmail_login] = useState("");
  let [password_login, setPassword_login] = useState("");
  let [loginMsg, setLoginMsg] = useState("");
  const navigator = useNavigate();

  const handleChangeEmailLogin = (event) => {
    setEmail_login(event.target.value);
  };
  const handleChangePasswordLogin = (event) => {
    setPassword_login(event.target.value);
  };

  const ifActivateAccount = async (email) => {
    try {
      const response = await axios.get(USER_URL + "/" + email);
      const user = response.data.users[0];
      return user.isActive;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      setLoginMsg("Please enter email and password");
      setTimeout(() => {
        setLoginMsg("");
      }, 5000);
      return;
    }

    try {
      const isAccountActivated = await ifActivateAccount(email);

      if (!isAccountActivated) {
        setLoginMsg("Please contact site manager to activate your account");
      } else {
        const response = await AuthService.login(email, password);

        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
          setCurrentUser(AuthService.getCurrentUser());
          navigator("/me");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoginMsg(error.response.data);
    }
  };

  //register part
  let [name_register, setName_register] = useState("");
  let [email_register, setEmail_register] = useState("");
  let [password_register, setPassword_register] = useState("");
  let [confirm_register, setConfirm_register] = useState("");
  let [message, setMessage] = useState("");
  let [resSuccMsg, setResSuccMsg] = useState("");
  //modal control
  let modal = document.getElementById("registerModal");
  let modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];

  //register user input handlers
  const handleChangeNameRegister = (event) => {
    setName_register(event.target.value);
  };
  const handleChangeEmailRegister = (event) => {
    setEmail_register(event.target.value);
  };
  const handleChangePasswordRegister = (event) => {
    setPassword_register(event.target.value);
  };
  const handleChangeConfirmRegister = (event) => {
    setConfirm_register(event.target.value);
  };

  const handleRegister = () => {
    if (password_register !== confirm_register) {
      setMessage("Passwords are not matched");
    } else {
      AuthService.register(
        name_register,
        email_register,
        password_register,
        false
      )
        .then((response) => {
          const sendURL = `${BASE_URL}/verify-email/send/`;
          //use a user object as the verification token
          const verificationToken = response.data.savedUser._id;
          // Send verification email
          axios.post(sendURL, {
            to: email_register,
            subject: "Verify your email",
            html: `<p>Click <a href="${client_URL}/verify-successfully/${verificationToken}">here</a> to verify your email.</p>`,
          });

          setResSuccMsg(
            "Registered successfully, remember to verify your email"
          );
          setTimeout(() => {
            setResSuccMsg("");
          }, 5000);
          //find the modal and hide it
          modal.style.display = "none";
          modalBackdrop.style.display = "none";

          //clear input fields
          setName_register("");
          setEmail_register("");
          setPassword_register("");
          setConfirm_register("");
        })
        .catch((error) => {
          setMessage(error.response.data);
          setTimeout(() => {
            setMessage("");
          }, 5000);
        });
    }
  };

  //google login module
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        let user_name = user.displayName;
        let user_email = user.email;
        let user_password = user.uid;

        const findURL = `${BASE_URL}/auth/users/${user_email}`;

        //find if the user already exists
        axios
          .get(findURL)
          .then((response) => {
            //if user exists, login
            if (response.data.users && response.data.users.length > 0) {
              handleLogin(user_email, user_password);
              console.log("user exists and logged in successfully");
            } else {
              //if not, register
              AuthService.register(user_name, user_email, user_password, true)
                .then((response) => {
                  //then login automatically
                  handleLogin(user_email, user_password);
                })
                .catch((error) => {
                  setMessage(error.response.data);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdminPanel = () => {
    window.location.replace('https://ece9065group3api-51579a5ffecb.herokuapp.com/admin');
  };

  return (
    <div className="container d-flex flex-row flex-wrap align-items-stretch w-100">
      {loginMsg && <div className="alert alert-danger w-100">{loginMsg}</div>}
      {resSuccMsg && (
        <div className="alert alert-success w-100">{resSuccMsg}</div>
      )}

      <div className="body d-md-flex align-items-center justify-content-between">
        <div className="box-1 mt-md-0 mt-5">
          <img src={imgSrc} alt="Reading is essential" />
        </div>
        <div className=" box-2 d-flex flex-column h-90 flex-wrap overflow-auto">
          <div className="mt-5">
            <h1>Onlin3 Boostor3</h1>
            <h3>
              Our purporse is to provide Google books API to search books
              <br />
              <b>&</b>
              <br /> save them to your account.
            </h3>
            <p className="mb-1 h-1">Start From here...</p>
            {/* if user already logged in, then hide login part */}
            {!currentUser && (
              <div className="d-flex flex-column ">
                <p className="text-muted mb-2">Continue with...</p>
                <div className="d-flex align-items-center">
                  <GoogleButton onClick={handleGoogleLogin} />
                </div>
                <div className="mt-3">
                  <p className="mb-0 text-muted">Already have an account?</p>
                </div>
                <div className="d-grid gap-2">
                  <input
                    className=""
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChangeEmailLogin}
                  />
                  <input
                    className=""
                    id="password"
                    type="Password"
                    placeholder="Enter your password here"
                    onChange={handleChangePasswordLogin}
                  />

                  <div className="d-flex justify-content-around">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleLogin(email_login, password_login)}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      data-bs-toggle="modal"
                      data-bs-target="#registerModal"
                    >
                      Sign Up
                    </button>
                    <Link className="btn btn-outline-danger" to="https://ece9065group3api-51579a5ffecb.herokuapp.com/admin">
                      Admin Login
                    </Link>
                  </div>
                  <div className="mt-auto">
                    <p className="footer text-muted mb-0 mt-md-0 mt-4">
                      By register you agree with our
                      <span className="p-color me-1">terms and conditions</span>
                      and
                      <span className="p-color ms-1">privacy policy</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`modal`}
        id="registerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Sign Up
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {message && <div className="alert alert-danger">{message}</div>}
            <div className="modal-body d-flex align-items-center justify-content-center">
              <div className="container">
                <div className="row">
                  <span>
                    <input
                      className="basic-slide"
                      id="name"
                      type="text"
                      value={name_register}
                      placeholder="Enter Your Name"
                      onChange={handleChangeNameRegister}
                    />
                    <label htmlFor="name">Name</label>
                  </span>
                  <span>
                    <input
                      className="basic-slide"
                      id="email"
                      type="email"
                      value={email_register}
                      placeholder="Enter your email"
                      onChange={handleChangeEmailRegister}
                    />
                    <label htmlFor="email">Email</label>
                  </span>
                  <span>
                    <input
                      className="basic-slide"
                      id="password"
                      type="Password"
                      value={password_register}
                      placeholder="I guess it's not 123456"
                      onChange={handleChangePasswordRegister}
                    />
                    <label htmlFor="password">Password</label>
                  </span>
                  <span>
                    <input
                      className="basic-slide"
                      id="password"
                      type="Password"
                      value={confirm_register}
                      placeholder="Confirm Password"
                      onChange={handleChangeConfirmRegister}
                    />
                    <label htmlFor="password">Confirm</label>
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={handleRegister}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
