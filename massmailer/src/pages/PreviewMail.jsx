import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button } from "@mui/material";

const PreviewMail = () => {
  const { state } = useLocation();
  const { subject, body, logo, attachments, footer } = state || {};
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/edit-mail", {
      state: {
        subject,
        body,
        logo,
        attachments,
        footer,
      },
    });
  };

  const handleNext = () => {
    navigate("/bulk-mail", {
      state: {
        subject,
        body,
        logo,
        attachments,
        footer,
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

        {/* Footer Preview */}
        {footer && (
          <Box style={{ marginTop: "1rem" }}>
            <Typography variant="h6">Footer:</Typography>
            <Typography variant="body1">Name: {footer.name}</Typography>
            <Typography variant="body1">
              Designation: {footer.designation}
            </Typography>
            <Typography variant="body1">Contact: {footer.contact}</Typography>
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
