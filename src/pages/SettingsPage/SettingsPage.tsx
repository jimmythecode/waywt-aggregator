import { Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Toolbar />
      <Box sx={{ textAlign: 'center', margin: "auto"}}>
        <br />
        <Typography variant="h3">Coming Soon</Typography>
        <br />
        <Button
        variant="outlined"
        onClick={()=>navigate("/")}
        >Click here to return</Button>
      </Box>
    </div>
  );
}

export default SettingsPage;
