import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [form, setForm] = React.useState({ firstName: '', lastName: '', email: '', password: '' });
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch('http://localhost:8181/api/v1/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || data.message || 'Registration failed');
                return;
            }
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <Box sx={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#21242D'
        }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    backgroundColor: 'white',
                    minHeight: 420,
                    width: { xs: '95%', sm: 400 },
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    padding: '32px 24px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#21242D', mb: 1, letterSpacing: 1 }}>
                    Register
                </Typography>
                <Typography variant="body1" sx={{ color: '#555', mb: 3, textAlign: 'center' }}>
                    Create your account to start tracking your expenses.
                </Typography>
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="medium"
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="medium"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="medium"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="medium"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 1,
                            borderRadius: 2,
                            py: 1.2,
                            background: 'linear-gradient(90deg, #43a047 0%, #66bb6a 100%)',
                            boxShadow: '0 2px 8px rgba(67,160,71,0.10)',
                            transition: 'background 0.2s',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #388e3c 0%, #43a047 100%)'
                            }
                        }}
                    >
                        Register
                    </Button>
                </Stack>
                {error && (
                    <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
                {success && (
                    <Typography color="success.main" sx={{ mt: 2, textAlign: 'center' }}>
                        {success}
                    </Typography>
                )}
                <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    <Button
                        component={Link}
                        to="/login"
                        sx={{
                            textTransform: 'none',
                            color: '#1976d2',
                            fontWeight: 500,
                            fontSize: 15
                        }}
                        variant="text"
                    >
                        Already have an account? Login here
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Register;
