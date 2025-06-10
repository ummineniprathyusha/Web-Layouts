import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  IconButton,
  Popover,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LockIcon from "@mui/icons-material/Lock";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// EditServiceDialog Component
const EditServiceDialog = ({ open, handleClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
    category: "",
    link: "",
    seo: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
          <TextField
            label="Short Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <TextField
            label="Image URL"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
          />
          <TextField
            label="Category"
            select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <MenuItem value="Payments">Payments</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Support">Support</MenuItem>
          </TextField>
          <TextField
            label="Unique Page / Link"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
          />
          <TextField
            label="Custom SEO"
            multiline
            rows={2}
            value={formData.seo}
            onChange={(e) => handleChange("seo", e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ServiceCard Component
const ServiceCard = ({ title, setTitle }) => {
  const initialServices = [
    {
      id: 1,
      title: "Secure Transactions",
      description: "Enjoy peace of mind with our secure and private transaction system.",
      icon: <LockIcon fontSize="large" />,
    },
    {
      id: 2,
      title: "Dedicated Support",
      description: "Our team is here to assist you at every step, offering consistent and reliable help.",
      icon: <SupportAgentIcon fontSize="large" />,
    },
    {
      id: 3,
      title: "Effortless Bookings",
      description: "Schedule your services with just a few clicks, saving you precious time.",
      icon: <EventAvailableIcon fontSize="large" />,
    },
  ];

  const [services, setServices] = useState(initialServices);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleTitleClick = () => setIsEditing(true);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTitleBlur = () => setIsEditing(false);

  const handleEditClick = (service) => {
    setServiceToEdit(service);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setServiceToEdit(null);
  };

  const handleSave = (updatedData) => {
  setServices((prevServices) => {
    const exists = prevServices.some((svc) => svc.id === updatedData.id);
    if (exists) {
      return prevServices.map((svc) =>
        svc.id === updatedData.id ? { ...svc, ...updatedData } : svc
      );
    } else {
      return [...prevServices, updatedData];
    }
  });
  handleDialogClose();
};

  const handleDeleteClick = (event, service) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleConfirmDelete = () => {
    setServices((prev) => prev.filter((s) => s.id !== selectedService.id));
    handleClosePopover();
  };
  const handleAddClick = () => {
  setServiceToEdit({
    id: Date.now(), // Unique ID
    title: "",
    description: "",
    image: "",
    category: "",
    link: "",
    seo: "",
  });
  setIsAdding(true);
  setDialogOpen(true);
};

  return (
    <Box sx={{ bgcolor: "#1a1f23", color: "#f8f5f1", minHeight: "100vh", py: 5 }}>
      <Box textAlign="center" mb={2}>
        <Box
          sx={{
            border: isEditing ? "2px solid #1976d2" : "none",
            borderRadius: 1,
            width: "90%",
            maxWidth: 900,
            mx: "auto",
            px: 2,
          }}
        >
          {isEditing ? (
            <TextField
              variant="standard"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              autoFocus
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "2rem",
                  color: "#f8f5f1",
                  textAlign: "center",
                },
              }}
              sx={{ input: { textAlign: "center" }, width: "100%" }}
            />
          ) : (
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontFamily: "serif",
                fontWeight: "bold",
                letterSpacing: 1,
                cursor: "pointer",
              }}
              onClick={handleTitleClick}
            >
              {title}
            </Typography>
          )}
        </Box>
        <Box sx={{ width: 50, height: 3, bgcolor: "#d3b673", mx: "auto", mt: 1, }} />
      </Box>

      <Box textAlign="center" mt={3}>
  <Button
    variant="contained"
    color="secondary"
    onClick={handleAddClick}
    sx={{ fontFamily: "serif", textTransform: "none", mb:2 }}
  >
    + Add New Service
  </Button>
</Box>

      <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={service.id} sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                position: "relative",
                border: "2px solid transparent",
                borderRadius: "8px",
                transition: "border-color 0.3s ease",
                "&:hover": { borderColor: "#00BFFF" },
              }}
            >
              <Card
                sx={{
                  position: "relative",
                  bgcolor: "#000",
                  textAlign: "center",
                  py: 5,
                  px: 2,
                  height: "100%",
                  border: "1px solid white",
                  width: "100%",
                  maxWidth: 250,
                  transition: "transform 0.6s",
                  zIndex: 1,
                  "&:hover": {
                    transform: "translateY(-10px)",
                    border: "1px solid #00BFFF",
                    "& .hover-actions": {
                      opacity: 1,
                      visibility: "visible",
                      transform: "translateX(-50%) translateY(0)",
                    },
                  },
                }}
                elevation={3}
              >
                <Avatar sx={{ bgcolor: "#fff", width: 100, height: 100, mx: "auto", mb: 3 }}>
                  {service.icon}
                </Avatar>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: "#ccc", fontWeight: "bold", fontFamily: "serif" }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc", fontFamily: "serif" }}>
                    {service.description}
                  </Typography>
                </CardContent>
                <Box
                  className="hover-actions"
                  sx={{
                    position: "absolute",
                    bottom: 1,
                    left: "50%",
                    transform: "translateX(-50%) translateY(10px)",
                    display: "flex",
                    gap: 0,
                    opacity: 0,
                    visibility: "hidden",
                    transition: "opacity 0.3s ease",
                    fontFamily: "serif",
                  }}
                >
                  <Box sx={{ display: "flex", bgcolor: "#2e2e2e", borderRadius: 1, overflow: "hidden", border: "1px solid #444" }}>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        color: "#fff",
                        textTransform: "none",
                        fontSize: "0.8rem",
                        fontFamily: "serif",
                        px: 2,
                        py: 0.5,
                        minWidth: 48,
                        "&:hover": { bgcolor: "#444" },
                      }}
                      onClick={() => handleEditClick(service)}
                    >
                      Edit
                    </Button>
                    <Box sx={{ width: "1px", bgcolor: "#555", my: "auto" }} />
                    <IconButton
                      size="small"
                      disableRipple
                      sx={{
                        px: 1.5,
                        color: "#fff",
                        fontFamily: "serif",
                        borderRadius: 0,
                        "&:hover": { bgcolor: "red" },
                      }}
                      onClick={(e) => handleDeleteClick(e, service)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ p: 2, bgcolor: "#fff", color: "black", minWidth: 200 }}>
          <Typography variant="body2" sx={{ mb: 2, fontFamily: "serif" }}>
            Are you sure?
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={handleConfirmDelete}
              sx={{ fontFamily: "serif" }}
            >
              YES
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ bgcolor: "#666", "&:hover": { bgcolor: "#555" }, fontFamily: "serif" }}
              onClick={handleClosePopover}
            >
              NO
            </Button>
          </Stack>
        </Box>
      </Popover>

      {dialogOpen && serviceToEdit && (
        <EditServiceDialog
          open={dialogOpen}
          handleClose={handleDialogClose}
          onSave={handleSave}
          initialData={serviceToEdit}
        />
      )}
    </Box>
  );
};

export default ServiceCard;
