import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const NavigationBar = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Decode token to get user details
  const token = localStorage.getItem("authToken");
  let userName = "";
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.name; // Get `name` directly from the token
      console.log("Decoded Token:", decodedToken); // Debugging
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const handleLogout = (e) => {
    e.stopPropagation(); // Prevents event bubbling, ensuring only logout button click triggers logout
    localStorage.removeItem("authToken"); // Clears the token
    navigate("/login"); // Redirects to login page after logout
  };

  const handleNavigateHome = (e) => {
    e.preventDefault(); // Prevent default navigation behavior on Typography click
    navigate("/"); // Navigate to the home page
  };

  return (
    <AppBar
      position={isSmallScreen ? "fixed" : "sticky"}
      sx={{ backgroundColor: "#008080" }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          {token ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  color: "black",
                  display: "inline",
                  marginRight: "1rem",
                  color: "white",
                }}
              >
                Welcome, {userName || "User"}
              </Typography>
              <Button
                variant="contained"
                onClick={handleLogout}
                style={{ backgroundColor: "#FF6F61" }}
                endIcon={<ExitToAppIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
