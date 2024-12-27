import React from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  colors,
} from "@mui/material";

const ViewDetails = () => {
  const { state } = useLocation();
  const { subject, body, logo, attachments, recipients } = state || {};

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Paper
        elevation={3}
        style={{
          padding: "2rem",
          borderRadius: "15px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" sx={{ color: "teal" }}>
          Mail Details
        </Typography>
        <Box style={{ marginTop: "1rem" }}>
          <Typography variant="h6" sx={{ color: "#CC564D" }}>
            Subject:
          </Typography>
          <Typography variant="body1">{subject}</Typography>

          <Typography
            variant="h6"
            style={{ marginTop: "1rem", color: "#CC564D" }}
          >
            Body:
          </Typography>
          <Typography variant="body1">{body}</Typography>

          {logo && (
            <Box style={{ marginTop: "1rem", color: "#CC564D" }}>
              <Typography variant="h6">Logo</Typography>
              <img
                src={logo} // Use the URL passed from the dashboard
                alt="Logo"
                style={{ maxWidth: "200px", maxHeight: "100px" }}
              />
            </Box>
          )}

          {/* Show Attachments if present */}
          {attachments && attachments.length > 0 && (
            <Box style={{ marginTop: "1rem" }}>
              <Typography variant="h6" sx={{ color: "#CC564D" }}>
                Attachments:
              </Typography>
              <ul>
                {attachments.map((attachment, index) => (
                  <li key={index}>
                    <Typography variant="body1">
                      {attachments[index]}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {/* Show Recipients */}
          {recipients && recipients.length > 0 && (
            <Box style={{ marginTop: "1rem" }}>
              <Typography variant="h6" sx={{ color: "#CC564D" }}>
                Recipients:
              </Typography>
              <ul>
                {recipients.map((recipient, index) => (
                  <li key={index}>
                    <Typography variant="body1">{recipient}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewDetails;
