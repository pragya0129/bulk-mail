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
  const { subject, body, logo, attachments, recipients, footer, sentAt } =
    state || {};
  console.log(state);

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
        <Typography variant="h6" sx={{ color: "teal" }}>
          Date: {sentAt}
        </Typography>

        <Box style={{ marginTop: "1rem" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#CC564D",
              border: "1px solid rgb(152, 152, 152)", // Border color matching the text color
              borderRadius: "4px", // Optional: Add rounded corners
              padding: "4px 8px", // Optional: Add some padding inside the border
              display: "inline-block", // Ensures the border wraps tightly around the text
            }}
          >
            Subject: {subject}
          </Typography>

          <Typography
            variant="h6"
            style={{ marginTop: "1rem", color: "#CC564D" }}
          >
            Body:
          </Typography>
          <Typography variant="body1">{body}</Typography>

          {/* Footer */}
          {footer && (
            <Box style={{ marginTop: "1rem" }}>
              <Typography variant="h6" sx={{ color: "#CC564D" }}>
                Footer:
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {footer.name || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Designation:</strong> {footer.designation || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Contact:</strong> {footer.contact || "N/A"}
              </Typography>
            </Box>
          )}

          {logo !== null ? (
            <Box style={{ marginTop: "1rem", color: "#CC564D" }}>
              <Typography variant="h6">
                Logo{" "}
                <img
                  src="/check.png" // Use the URL passed from the dashboard
                  alt="Logo"
                  style={{ maxWidth: "20px", maxHeight: "20px" }}
                />
              </Typography>
            </Box>
          ) : (
            <Box style={{ marginTop: "1rem", color: "#CC564D" }}>
              <Typography variant="h6">
                Logo{" "}
                <img
                  src="/delete.png" // Fallback image if logo is not available
                  alt="Default Logo"
                  style={{ maxWidth: "20px", maxHeight: "20px" }}
                />
              </Typography>
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
