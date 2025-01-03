import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Input,
} from "@mui/material";

const EditMail = () => {
  const [mailData, setMailData] = useState({
    subject: "",
    body: "",
    logo: null,
    attachments: [],
    footer: {
      name: "",
      designation: "",
      contact: "",
    },
  });
  const navigate = useNavigate();
  const location = useLocation();

  // If state is passed from PreviewMail, use it to populate form
  useEffect(() => {
    if (location.state) {
      const { subject, body, logo, attachments, footer } = location.state;
      setMailData({
        subject,
        body,
        logo,
        attachments,
        footer: footer || { name: "", designation: "", contact: "" },
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in mailData.footer) {
      setMailData({
        ...mailData,
        footer: { ...mailData.footer, [name]: value },
      });
    } else {
      setMailData({ ...mailData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "logo") {
      setMailData({ ...mailData, logo: files[0] });
    } else if (name === "attachments") {
      setMailData({ ...mailData, attachments: [...files] });
    }
  };

  const handleSave = () => {
    navigate("/preview", {
      state: {
        subject: mailData.subject,
        body: mailData.body,
        logo: mailData.logo,
        attachments: mailData.attachments,
        footer: mailData.footer,
      },
    });
  };

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
        <Typography variant="h5">Create Template</Typography>
        <Box component="form" style={{ marginTop: "1rem" }}>
          <TextField
            fullWidth
            margin="normal"
            label="Subject"
            name="subject"
            value={mailData.subject}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Body"
            name="body"
            multiline
            rows={6}
            value={mailData.body}
            onChange={handleChange}
            required
            style={{ marginBottom: "1rem" }}
          />
          {/* Logo Upload */}
          Logo:
          <Input
            type="file"
            name="logo"
            onChange={handleFileChange}
            inputProps={{ accept: "image/*" }}
            fullWidth
            margin="normal"
          />
          {mailData.logo && (
            <Box style={{ marginTop: "1rem" }}>
              <Typography variant="h6">Current Logo:</Typography>
              <img
                src={URL.createObjectURL(mailData.logo)}
                alt="Logo"
                style={{
                  maxWidth: "200px",
                  maxHeight: "100px",
                  marginBottom: "1rem",
                }}
              />
            </Box>
          )}
          {/* Attachments Upload */}
          Attachments:
          <Input
            type="file"
            name="attachments"
            onChange={handleFileChange}
            inputProps={{ multiple: true }}
            fullWidth
            margin="normal"
          />
          {mailData.attachments.length > 0 && (
            <Box style={{ marginTop: "1rem" }}>
              <Typography variant="h6">Current Attachments:</Typography>
              <ul>
                {mailData.attachments.map((attachment, index) => (
                  <li key={index}>
                    <Typography variant="body1">{attachment.name}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
          {/* Footer Section */}
          <Typography variant="h6" style={{ marginTop: "1rem" }}>
            Footer Details:
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={mailData.footer.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Designation"
            name="designation"
            value={mailData.footer.designation}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Contact Number"
            name="contact"
            value={mailData.footer.contact}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: "1rem",
              backgroundColor: "#FF6F61",
              "&:hover": { backgroundColor: "#CC564D" },
            }}
            onClick={handleSave}
          >
            Preview
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditMail;
