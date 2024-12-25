import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button } from "@mui/material";

const PreviewMail = () => {
  const { state } = useLocation();
  const { subject, body, logo, attachments } = state || {};
  const navigate = useNavigate();

  // Navigate back to EditMail page to edit details
  // PreviewMail.jsx
  // PreviewMail.jsx
  const handleEdit = () => {
    navigate("/edit-mail", {
      state: {
        subject,
        body,
        logo, // Pass the logo file itself
        attachments, // Pass the attachments files themselves
      },
    });
  };

  // Handle "Next" (for example, to send the email or proceed to the next step)
  const handleNext = () => {
    navigate("/bulk-mail", {
      state: {
        subject,
        body,
        logo,
        attachments,
      },
    });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h5">Mail Preview</Typography>
      <Box style={{ marginTop: "1rem" }}>
        <Typography variant="h6">Subject:</Typography>
        <Typography variant="body1">{subject}</Typography>

        <Typography variant="h6" style={{ marginTop: "1rem" }}>
          Body:
        </Typography>
        <Typography variant="body1">{body}</Typography>

        {/* Show Logo if present */}
        {logo && (
          <Box style={{ marginTop: "1rem" }}>
            <Typography variant="h6">Logo:</Typography>
            <img
              src={URL.createObjectURL(logo)}
              alt="Logo"
              style={{ maxWidth: "200px", maxHeight: "100px" }}
            />
          </Box>
        )}

        {/* Show Attachments if present */}
        {attachments && attachments.length > 0 && (
          <Box style={{ marginTop: "1rem" }}>
            <Typography variant="h6">Attachments:</Typography>
            <ul>
              {attachments.map((attachment, index) => (
                <li key={index}>
                  <Typography variant="body1">{attachment.name}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}

        {/* Buttons for Edit and Next */}
        <Box
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleEdit}
            sx={{
              borderColor: "#FF6F61",
              color: "#FF6F61",
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              backgroundColor: "teal",
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PreviewMail;
