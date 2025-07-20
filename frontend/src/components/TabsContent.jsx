import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import TransactionList from './TransactionList';

// Reusable form component
function TrackerForm({
    title,
    accent,
    buttonColor,
    buttonGradient,
    buttonHoverGradient,
    categories,
    state,
    onChange,
    onSubmit,
    buttonLabel,
    titleColor
})
{
    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                maxWidth: 420,
                mx: 'auto',
                p: 0,
                borderRadius: 4,
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)',
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'stretch',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ width: 8, background: accent }} />
            <Box sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: titleColor, letterSpacing: 0.5 }}>
                    {title}
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Amount"
                        name="amount"
                        type="number"
                        value={state.amount}
                        onChange={onChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="medium"
                        sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 2 }}
                    />
                    <TextField
                        select
                        label="Category"
                        name="category"
                        value={state.category}
                        onChange={onChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="medium"
                        sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 2 }}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Date"
                        name="date"
                        type="date"
                        value={state.date}
                        onChange={onChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        fullWidth
                        variant="outlined"
                        size="medium"
                        sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 2 }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={state.description}
                        onChange={onChange}
                        multiline
                        rows={2}
                        fullWidth
                        variant="outlined"
                        size="medium"
                        sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color={buttonColor}
                        fullWidth
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 1,
                            borderRadius: 2,
                            py: 1.2,
                            background: buttonGradient,
                            boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                            transition: 'background 0.2s',
                            '&:hover': {
                                background: buttonHoverGradient
                            }
                        }}
                    >
                        {buttonLabel}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}


const expenseCategories = [
    'Groceries',
    'Leisure',
    'Electronics',
    'Utilities',
    'Clothing',
    'Health',
    'Others'
];

const incomeCategories = [
    'Salary',
    'Other Income'
];

export default function TabsContent({
    value,
    setValue,
    expense,
    setExpense,
    income,
    setIncome,
    handleExpenseSubmit,
    handleIncomeSubmit
}) {
    const handleChange = (event, newValue) => setValue(newValue);

    // Set today's date in YYYY-MM-DD format
    const today = React.useMemo(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    }, []);

    React.useEffect(() => {
        if (!expense.date) setExpense((prev) => ({ ...prev, date: today }));
        // eslint-disable-next-line
    }, [expense.date, setExpense, today]);
    React.useEffect(() => {
        if (!income.date) setIncome((prev) => ({ ...prev, date: today }));
        // eslint-disable-next-line
    }, [income.date, setIncome, today]);

    const [expenseError, setExpenseError] = React.useState('');
    const [incomeError, setIncomeError] = React.useState('');
    const [expenseSuccess, setExpenseSuccess] = React.useState('');
    const [incomeSuccess, setIncomeSuccess] = React.useState('');
    const [refresh, setRefresh] = React.useState(0);

    const handleExpenseChange = (e) => setExpense({ ...expense, [e.target.name]: e.target.value });
    const handleIncomeChange = (e) => setIncome({ ...income, [e.target.name]: e.target.value });

    // Call API for Add Expense
    const handleExpenseSubmitInternal = async (e) => {
        e.preventDefault();
        setExpenseError('');
        setExpenseSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8181/api/v1/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({
                    ...expense,
                    amount: parseInt(expense.amount, 10),
                    is_debit: true // Expense
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setExpenseError(data.error || data.message || 'Failed to add expense');
                return;
            }
            setExpenseSuccess('Expense added!');
            setExpense({ amount: '', category: '', date: today, description: '' });
            setRefresh(r => r + 1); // trigger list refresh
        } catch (err) {
            setExpenseError('Network error');
        }
    };

    // Call API for Add Income
    const handleIncomeSubmitInternal = async (e) => {
        e.preventDefault();
        setIncomeError('');
        setIncomeSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8181/api/v1/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({
                    ...income,
                    amount: parseInt(income.amount, 10),
                    is_debit: false // Income
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setIncomeError(data.error || data.message || 'Failed to add income');
                return;
            }
            setIncomeSuccess('Income added!');
            setIncome({ amount: '', category: '', date: today, description: '' });
            setRefresh(r => r + 1); // trigger list refresh
        } catch (err) {
            setIncomeError('Network error');
        }
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    TabIndicatorProps={{
                        style: {
                            height: 4,
                            borderRadius: 2,
                            background: 'linear-gradient(90deg, #21242D 0%, #43a047 100%)'
                        }
                    }}
                    sx={{
                        minWidth: 350,
                        '& .MuiTab-root': {
                            minWidth: 160,
                            fontSize: 18,
                            fontWeight: 600,
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            color: '#21242D',
                            transition: 'background 0.2s',
                        },
                        '& .Mui-selected': {
                            background: 'rgba(33,36,45,0.08)',
                            color: '#21242D',
                        }
                    }}
                >
                    <Tab value="one" label="Expense" wrapped />
                    <Tab value="two" label="Income" />
                </Tabs>
            </Box>
            <Box sx={{ marginTop: 2, width: '100%' }}>
                {value === 'one' && (
                    <>
                        <TrackerForm
                            title="Track Expense"
                            accent="linear-gradient(180deg, #21242D 0%, #21242D 100%)"
                            buttonColor="primary"
                            buttonGradient="linear-gradient(90deg, #21242D 0%, #21242D 100%)"
                            buttonHoverGradient="linear-gradient(90deg, #21242D 0%, #21242D 100%)"
                            categories={expenseCategories}
                            state={expense}
                            onChange={handleExpenseChange}
                            onSubmit={handleExpenseSubmitInternal}
                            buttonLabel="Add Expense"
                            titleColor="#21242D"
                        />
                        {expenseError && (
                            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                                {expenseError}
                            </Typography>
                        )}
                        {expenseSuccess && (
                            <Typography color="success.main" sx={{ mt: 2, textAlign: 'center' }}>
                                {expenseSuccess}
                            </Typography>
                        )}
                    </>
                )}
                {value === 'two' && (
                    <>
                        <TrackerForm
                            title="Track Income"
                            accent="linear-gradient(180deg, #43a047 0%, #66bb6a 100%)"
                            buttonColor="success"
                            buttonGradient="linear-gradient(90deg, #43a047 0%, #66bb6a 100%)"
                            buttonHoverGradient="linear-gradient(90deg, #388e3c 0%, #43a047 100%)"
                            categories={incomeCategories}
                            state={income}
                            onChange={handleIncomeChange}
                            onSubmit={handleIncomeSubmitInternal}
                            buttonLabel="Add Income"
                            titleColor="#388e3c"
                        />
                        {incomeError && (
                            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                                {incomeError}
                            </Typography>
                        )}
                        {incomeSuccess && (
                            <Typography color="success.main" sx={{ mt: 2, textAlign: 'center' }}>
                                {incomeSuccess}
                            </Typography>
                        )}
                    </>
                )}
            </Box>
            <TransactionList refresh={refresh} />
        </React.Fragment>
    );
}
