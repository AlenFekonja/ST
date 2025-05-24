import { Box, Typography } from "@mui/material";

const Shortcuts = () => {
  return (
    <div
      className="task"
      style={{ display: "flex", justifyContent: "center", padding: "30px" }}
    >
      <div style={{ maxWidth: "900px", width: "100%" }}>
        <Typography variant="h4" mb={3}>
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
