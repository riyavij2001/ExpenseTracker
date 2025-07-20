import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = React.useState({ email: '', password: '' });
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:8181/api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Login failed');
                return;
            }
            const data = await res.json();
            localStorage.setItem('token', data.token);
            navigate('/');
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
                    minHeight: 380,
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
                    Login
                </Typography>
                <Typography variant="body1" sx={{ color: '#555', mb: 3, textAlign: 'center' }}>
                    Welcome back! Please login to your account.
                </Typography>
                <Stack spacing={2} sx={{ width: '100%' }}>
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
                        color="primary"
                        fullWidth
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 1,
                            borderRadius: 2,
                            py: 1.2,
                            background: 'linear-gradient(90deg, #21242D 0%, #21242D 100%)',
                            boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                            transition: 'background 0.2s',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #21242D 0%, #21242D 100%)'
                            }
                        }}
                    >
                        Login
                    </Button>
                </Stack>
                {error && (
                    <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
                <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    <Button
                        component={Link}
                        to="/register"
                        sx={{
                            textTransform: 'none',
                            color: '#1976d2',
                            fontWeight: 500,
                            fontSize: 15
                        }}
                        variant="text"
                    >
                        Don't have an account? Signup here
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;
