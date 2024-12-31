import React, { useState, useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import EmailIcon from "@mui/icons-material/Email";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import TextRollAnimation from "../components/TextRollAnimation";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const Dashboard = () => {
  const [mails, setMails] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchMails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/mails/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMails(response.data);
      } catch (error) {
        console.error("Error fetching mails:", error);
      }
    };
    fetchMails();
  }, []);

  const handleDelete = async (mailId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Please login first.");

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/deleteMail/${mailId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMails(mails.filter((mail) => mail._id !== mailId));
      alert("Mail deleted successfully!");
    } catch (error) {
      console.error("Error deleting mail:", error);
      alert("Error deleting mail, please try again.");
    }
  };

  const handleViewDetails = (mailId) => {
    const selectedMail = mails.find((mail) => mail._id === mailId);

    if (selectedMail) {
      let logoBase64 = null;

      if (
        selectedMail.logo &&
        selectedMail.logo.type === "Buffer" &&
        selectedMail.logo.data
      ) {
        // Convert the data array to a Base64 string
        const binary = String.fromCharCode(...selectedMail.logo.data);
        logoBase64 = btoa(binary); // Convert binary string to Base64
      }

      navigate("/viewdetails", {
        state: {
          subject: selectedMail.subject,
          body: selectedMail.body,
          logo: logoBase64 ? `data:image/png;base64,${logoBase64}` : null, // Add MIME type
          attachments: selectedMail.attachments,
          recipients: selectedMail.recipients,
          sentAt: selectedMail.sentAt,
        },
      });
    } else {
      console.error("Selected mail not found.");
    }
  };

  const handleNewBulkMail = () => {
    navigate("/edit-mail"); // Just redirect to the edit mail page without making any API call
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "5rem" }}>
      <NavigationBar />
      <br />

      <Grid
        container
        spacing={4}
        sx={{
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Mail List Section */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            order: { xs: 2, md: 1 },
            overflowY: { xs: "auto", md: "visible" },
            height: { xs: "calc(100vh - 300px)", md: "auto" }, // Adjust height for smaller screens
          }}
        >
          <Paper style={{ padding: "1rem", backgroundColor: "#F3F6F9" }}>
            <Typography variant="h6" sx={{ color: "teal" }}>
              Your Bulk Mails
            </Typography>
            <List
              sx={{
                overflow: "auto",
                maxHeight: isSmallScreen ? 500 : 380,
                "& ul": { padding: 0 },
              }}
            >
              {mails.map((mail) => {
                const formattedDate = new Date(mail.createdAt).toLocaleString(
                  "en-IN"
                );

                return (
                  <ListItem
                    key={mail._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "teal" }}>
                        <EmailIcon color="" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={mail.subject}
                      secondary={mail.sentAt}
                    />
                    <Box>
                      <Button
                        variant="outlined"
                        aria-label="view-details"
                        sx={{ borderColor: "teal", color: "teal" }}
                        onClick={() => handleViewDetails(mail._id)}
                      >
                        View Details
                      </Button>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(mail._id)}
                      >
                        <DeleteIcon sx={{ color: "#FF6F61" }} />
                      </IconButton>
                    </Box>
                    <Divider />;
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* New Bulk Mail Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            order: { xs: 1, md: 2 },
            position: { md: "sticky" },
            top: { md: "5rem" },
          }}
        >
          <Paper style={{ padding: "1rem", backgroundColor: "#E0F7F7" }}>
            <Typography variant="h6">New Bulk Mail</Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: "1rem",
                backgroundColor: "teal",
                "&:hover": {
                  backgroundColor: "#006666", // Darker teal on hover
                },
              }}
              onClick={handleNewBulkMail}
            >
              Create New Bulk Mail
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
