import React from 'react'
import SavingsIcon from '@mui/icons-material/Savings';
import Icon from '../assests/piggy-bank.png'
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Navbar() {
    return (
        <Box sx={{ width: '100%'}}>
            <AppBar
                position="static"
                style={{backgroundColor:'#21242D' }}
                sx={{ boxShadow: 'none' }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                            ExpenseTracker
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button color="inherit" href="/">Home</Button>
                        <Button color="inherit" href="/report">Report</Button>
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button color="inherit" href="/login">Login</Button>
                        <Button color="inherit" href="/register">Register</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;