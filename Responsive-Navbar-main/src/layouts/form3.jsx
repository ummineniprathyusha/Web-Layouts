import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert
} from "@mui/material";

const BasicDetailsForm3 = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userDetails", JSON.stringify(formData));
    console.log("Form Data Submitted:", formData);
   setSubmitted(true);

    
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Basic Details Form 3
      </Typography>
      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Details saved successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Full Name"
          name="name"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextField
          label="Phone Number"
          name="phone"
          fullWidth
          variant="outlined"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <TextField
          label="Address"
          name="address"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={formData.address}
          onChange={handleChange}
        />

        <Button variant="contained" type="submit" fullWidth>
          Save Details
        </Button>
      </Box>
    </Paper>
  );
};

export default BasicDetailsForm3;
