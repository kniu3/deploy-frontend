import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifySuccessfully = () => {
    const token = useParams().verificationToken;
    const SERVER_URL = "https://ece9065group3api-51579a5ffecb.herokuapp.com";
  
    useEffect(() => {
      const verifyURL = `${SERVER_URL}/api/verify-email/verify/${token}`;
  
      if (token !== null) {
        axios.get(verifyURL)
          .then((response) => {
            console.log(response.data); // Log the server response
          })
          .catch((error) => {
            console.error("Error verifying email:", error);
          });
      }
      else{
        console.error("Error verifying email: token is null");
      }
    }, [token]);
  
    return (
      <div className="container">
        <h1>Verify Successfully</h1>
      </div>
    );
  };

export default VerifySuccessfully;