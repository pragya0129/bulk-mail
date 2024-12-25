import React from "react";
import { Typography, Button, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundImage: "url(Images/bg2.jpg)", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            background: "rgba(255, 255, 255, 0.2)", 
            backdropFilter: "blur(7px)", 
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", 
            borderRadius: "16px", 
            padding: "2rem", 
            border: "1px solid rgba(255, 255, 255, 0.3)", 
            marginTop: "2rem", 
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ color: "red" }}>
            CelebrateMate 🎉
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            paragraph
            sx={{ color: "black" }}
          >
            Never miss a birthday or anniversary again! CelebrateMate helps you
            stay connected with automated reminders via SMS and email.
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/signup")}
              sx={{ margin: "0.5rem" }}
            >
              Signup
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{ margin: "0.5rem" }}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
