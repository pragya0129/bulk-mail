import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Input,
  Alert,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";

const BulkMail = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const { state } = useLocation(); // Access mail details from state
  const { subject, body, logo, attachments } = state || {};
  const navigate = useNavigate();

  // Handle Excel file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
      setUploadMessage(`Uploaded file: ${file.name}`);
    }
  };

  // Handle sending bulk mail
  const handleSendBulkMail = async () => {
    if (!excelFile) {
      alert("Please upload an Excel file with email addresses.");
      return;
    }

    const token = localStorage.getItem("authToken");
    let userID = "";
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        userID = decodedToken.userId; // Get `name` directly from the token
        console.log("Decoded Token:", decodedToken); // Debugging
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("body", body);
    if (logo) formData.append("logo", logo);
    attachments.forEach((file) => formData.append("attachments", file));
    formData.append("excelFile", excelFile);
    formData.append("userId", userID);

    try {
      const response = await fetch(
        `${import.meta.env.BACKEND_BASE_URL}/send-bulk-mail`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Failed to send bulk mail: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending bulk mail:", error);
      alert("An error occurred while sending bulk mail.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h5">Send Bulk Mail</Typography>
      <Box style={{ marginTop: "1rem" }}>
        <Typography variant="body1">
          Upload an Excel file containing the list of email addresses to send
          the mail to.
        </Typography>

        {/* File Upload */}
        <Input
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: ".xlsx, .xls" }}
          fullWidth
          style={{ marginTop: "1rem" }}
        />
        {uploadMessage && (
          <Alert severity="info" style={{ marginTop: "1rem" }}>
            {uploadMessage}
          </Alert>
        )}

        {/* Send Bulk Mail Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: "2rem",
            backgroundColor: "teal",
            "&:hover": { backgroundColor: "#006666" },
          }}
          onClick={handleSendBulkMail}
        >
          Send Bulk Mail
        </Button>
      </Box>
    </Container>
  );
};

export default BulkMail;
