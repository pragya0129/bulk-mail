import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // Log the form data for debugging
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/signup`, // Backend endpoint
        formData
      );
      console.log("API response:", response.data); // Log the API response
      alert(response.data.message); // Alert the success message
    } catch (error) {
      console.error("API error:", error.response?.data || error.message); // Log the error
      alert(error.response?.data?.message || "An error occurred");
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
              alt="Sign Up Illustration"
              style={{
                maxWidth: "100%",
                height: isSmallScreen ? "250px" : "400px",
              }}
            />
          </Box>
        </Grid>

        {/* Right Section: Signup Form */}
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
                Sign Up
              </Typography>
              <img
                src="/sign-up.gif" // Replace with your image path
                alt="Sign Up Icon"
                style={{ width: "55px" }} // Adjust size as needed
              />
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
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
                Sign Up
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
                Already a User? Login
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Signup;
