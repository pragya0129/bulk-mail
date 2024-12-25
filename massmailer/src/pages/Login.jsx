import React, { useState } from "react";
import {
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import TextRollAnimation from "../components/TextRollAnimation";

const Login = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRedirect = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/login`,
        formData
      );

      const { token } = response.data;
      console.log("Received Token:", token); // Log the received token

      if (token) {
        localStorage.setItem("authToken", token); // Store the token in localStorage
        console.log("Token stored in localStorage"); // Log successful storage
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to the dashboard after login
      } else {
        setErrorMessage("Login failed! No token received.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Login failed! Please check your credentials."
      );
      console.error("Login error:", error);
    }
  };

  return (
    <Container
      maxWidth="md"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Section: Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src="/image.png" // Replace with your desired image URL
              alt="Login Illustration"
              style={{
                maxWidth: "100%",
                height: isSmallScreen ? "250px" : "400px",
              }}
            />
          </Box>
        </Grid>

        {/* Right Section: Login Form */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            style={{
              padding: "2rem",
              borderRadius: "15px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              marginBottom="1rem"
            >
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{ marginRight: "0.5rem", marginTop: "10px" }}
              >
                Login
              </Typography>
              <img
                src="/login (2).gif" // Replace with your image path
                alt="Login Icon"
                style={{ width: "55px" }} // Adjust size as needed
              />
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "teal", // Change border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "teal", // Change border color on focus
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "teal", // Change border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "teal", // Change border color on focus
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{ marginTop: "1rem", background: "#008080" }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                fullWidth
                style={{
                  marginTop: "1rem",
                  borderColor: "#FF6F61",
                  color: "#FF6F61",
                }}
                onClick={handleRedirect}
              >
                New User? Create Account
              </Button>
            </form>
            {errorMessage && (
              <Typography
                color="error"
                variant="body2"
                style={{ marginTop: "1rem" }}
              >
                {errorMessage}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Text Roll Animation */}
      {/* Text Roll Animation */}
      {!isSmallScreen && (
        <Box
          sx={{
            width: "100%", // Ensures it spans the full width
            position: "absolute",
            bottom: "20px", // Positioned at the bottom
            textAlign: "center", // Center-aligns the content
          }}
        >
          <TextRollAnimation />
        </Box>
      )}
    </Container>
  );
};

export default Login;
