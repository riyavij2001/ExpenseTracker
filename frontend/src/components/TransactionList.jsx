import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Classy balance card component
function BalanceCard({ refresh }) {
    const [balance, setBalance] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8181/api/v1/getBalance', {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined
                    }
                });
                const data = await res.json();
                setBalance(data.balance);
            } catch (err) {
                setBalance(null);
            }
            setLoading(false);
        };
        fetchBalance();
    }, [refresh]);

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 180,
                mx: 'auto',
                mb: 3,
                mt: 2,
                background: '#21242D',
                borderRadius: 4,
                boxShadow: '0 2px 12px rgba(33,36,45,0.10)',
                p: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.85, mb: 1, letterSpacing: 1 }}>
                Current Balance
            </Typography>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 500, letterSpacing: 1 }}>
                {loading ? '...' : (balance !== null ? `₹ ${balance}` : '--')}
            </Typography>
        </Box>
    );
}

export default function TransactionList({ refresh }) {
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [balanceRefresh, setBalanceRefresh] = React.useState(0);

    React.useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8181/api/v1/transactions', {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined
                    }
                });
                const data = await res.json();
                setTransactions(data.transactions || []);
            } catch (err) {
                setTransactions([]);
            }
            setLoading(false);
        };
        fetchTransactions();
    }, [refresh, balanceRefresh]);

    // Delete transaction handler
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8181/api/v1/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                }
            });
            if (res.ok) {
                setTransactions((prev) => prev.filter((tx) => tx.id !== id));
                setBalanceRefresh(r => r + 1); // refresh balance
            }
        } catch (err) {
            // Optionally show error
        }
    };

    // Edit transaction handler (stub)
    const [editOpen, setEditOpen] = React.useState(false);
    const [editTx, setEditTx] = React.useState(null);
    const [editForm, setEditForm] = React.useState({ amount: '', category: '', date: '', description: '' });
    const [editError, setEditError] = React.useState('');

    const handleEdit = (tx) => {
        setEditTx(tx);
        setEditForm({
            amount: tx.amount,
            category: tx.category,
            date: tx.date,
            description: tx.description || ''
        });
        setEditError('');
        setEditOpen(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async () => {
        setEditError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8181/api/v1/transactions/${editTx.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({
                    ...editTx,
                    ...editForm,
                    amount: parseFloat(editForm.amount),
                })
            });
            if (!res.ok) {
                const data = await res.json();
                setEditError(data.error || data.message || 'Failed to update transaction');
                return;
            }
            setTransactions((prev) =>
                prev.map((tx) =>
                    tx.id === editTx.id
                        ? { ...tx, ...editForm, amount: parseFloat(editForm.amount) }
                        : tx
                )
            );
            setEditOpen(false);
            setBalanceRefresh(r => r + 1); // refresh balance
        } catch (err) {
            setEditError('Network error');
        }
    };

    // When a transaction is added, refresh balance as well
    React.useEffect(() => {
        setBalanceRefresh(r => r + 1);
        // eslint-disable-next-line
    }, [refresh]);

    return (
        <Box sx={{ mt: 5, width: '100%', maxWidth: 900, mx: 'auto' }}>
            <BalanceCard refresh={balanceRefresh} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#21242D', mb: 2, letterSpacing: 1, textAlign: 'left' }}>
                Transactions
            </Typography>
            <TableContainer component={Paper} sx={{
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(33,36,45,0.08)',
                background: 'rgba(255,255,255,0.95)'
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#21242D', fontSize: 16 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#21242D', fontSize: 16, textAlign: 'right' }}>Amount</TableCell>
                            <TableCell sx={{ width: 80 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ color: '#888' }}>
                                    Loading transactions...
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ color: '#888' }}>
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow key={tx.id} hover>
                                    <TableCell sx={{ fontWeight: 600, color: '#333', py: 1.5 }}>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', lineHeight: 1.2 }}>
                                                {tx.category}
                                            </Typography>
                                            {tx.description && (
                                                <Typography variant="body2" sx={{ color: '#888', fontSize: 13, mt: 0.5 }}>
                                                    {tx.description}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            color: tx.is_debit ? '#d32f2f' : '#388e3c',
                                            textAlign: 'right',
                                            fontSize: 17,
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        {tx.is_debit ? '-' : '+'}{Math.abs(tx.amount)}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right', verticalAlign: 'middle' }}>
                                        <IconButton onClick={() => handleEdit(tx)} size="small" sx={{ color: '#000' }}>
                                            <EditOutlinedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(tx.id)} size="small" sx={{ color: '#000' }}>
                                            <DeleteOutlineOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                    background: 'rgba(255,255,255,0.98)',
                    minWidth: 370
                }
            }}>
                <DialogTitle
                    sx={{
                        background: '#21242D',
                        color: '#fff',
                        fontWeight: 700,
                        letterSpacing: 1,
                        mb: 0,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        px: 3,
                        py: 2
                    }}
                >
                    Edit Transaction
                </DialogTitle>
                <DialogContent sx={{
                    background: 'rgba(255,255,255,0.98)',
                    p: 3,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16
                }}>
                    <Box sx={{
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <TextField
                            label="Category"
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                            select
                            fullWidth
                            size="medium"
                            sx={{ borderRadius: 2, background: '#f7f9fa' }}
                        >
                            {['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Salary', 'Other Income', 'Others'].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Amount"
                            name="amount"
                            type="number"
                            inputProps={{ step: "0.01" }}
                            value={editForm.amount}
                            onChange={handleEditChange}
                            fullWidth
                            size="medium"
                            sx={{ borderRadius: 2, background: '#f7f9fa' }}
                        />
                        <TextField
                            label="Date"
                            name="date"
                            type="date"
                            value={editForm.date}
                            onChange={handleEditChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            size="medium"
                            sx={{ borderRadius: 2, background: '#f7f9fa' }}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            multiline
                            rows={2}
                            fullWidth
                            size="medium"
                            sx={{ borderRadius: 2, background: '#f7f9fa' }}
                        />
                        {editError && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                {editError}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ background: 'rgba(255,255,255,0.98)', p: 2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleEditSubmit}
                        sx={{
                            borderRadius: 2,
                            background: '#21242D',
                            color: '#fff',
                            fontWeight: 600,
                            letterSpacing: 1,
                            px: 3,
                            '&:hover': {
                                background: 'linear-gradient(90deg, #21242D 0%, #388e3c 100%)'
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

