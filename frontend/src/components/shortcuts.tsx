import { Box, Typography } from "@mui/material";
import React from "react";

const Shortcuts = () => {
  return (
    <div
      className="task"
      style={{ display: "flex", justifyContent: "center", padding: "20px" }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <Typography variant="h3" mb={4}>
          Shortcuts list
        </Typography>
        <Box>
          <Typography variant="h6">
            <strong>Shift + L: </strong>Logout
          </Typography>
          <Typography variant="h6">
            <strong>Shift + T: </strong>Navigate to tasks
          </Typography>
        </Box>
      </div>
    </div>
  );
};
export default Shortcuts;
