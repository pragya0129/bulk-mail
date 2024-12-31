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
            variant="body1"
            sx={{
              color: "#CC564D",
              border: "1px solid rgb(152, 152, 152)", // Border color
              borderRadius: "4px", // Rounded corners
              padding: "4px 8px", // Padding inside the border
            }}
          >
            <span
              style={{
                fontSize: "10px", // Smaller font size
                backgroundColor: "#b3e0dc", // Light teal background
                padding: "2px 4px", // Padding inside the background
                borderRadius: "2px", // Rounded corners for the background
                color: "black", // Text color for contrast
              }}
            >
              Subject
            </span>{" "}
            {subject}
          </Typography>

          <Typography
            variant="body1"
            style={{
              marginTop: "1rem",
              color: "black",
              border: "1px solid rgb(152, 152, 152)", // Border color
              borderRadius: "4px", // Rounded corners
              padding: "4px 8px",
            }}
          >
            <span
              style={{
                fontSize: "10px", // Smaller font size
                backgroundColor: "#b3e0dc", // Light teal background
                padding: "2px 4px", // Padding inside the background
                borderRadius: "2px", // Rounded corners for the background
                color: "black", // Text color for contrast
              }}
            >
              Body
            </span>{" "}
            {body}
            <br></br>
            {/* Footer */}
            {footer && (
              <Box style={{ marginTop: "1rem" }}>
                <Typography
                  style={{
                    fontSize: "10px", // Smaller font size
                    backgroundColor: "#b3e0dc", // Light teal background
                    padding: "2px 4px", // Padding inside the background
                    borderRadius: "2px", // Rounded corners for the background
                    color: "black", // Text color for contrast
                  }}
                >
                  Footer
                </Typography>
                <Typography variant="body1">
                  {footer.name || "N/A"}
                </Typography>
                <Typography variant="body1">
                  {footer.designation || "N/A"}
                </Typography>
                <Typography variant="body1">
                  {footer.contact || "N/A"}
                </Typography>
              </Box>
            )}
          </Typography>

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
