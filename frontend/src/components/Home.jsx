import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TabsContent from './TabsContent';

function Home() {
    const [value, setValue] = React.useState('one');
    const [expense, setExpense] = React.useState({
        amount: '',
        category: '',
        date: '',
        description: ''
    });
    const [income, setIncome] = React.useState({
        amount: '',
        category: '',
        date: '',
        description: ''
    });

    const handleExpenseSubmit = (e) => {
        e.preventDefault();
        // handle expense submit logic here
        setExpense({ amount: '', category: '', date: '', description: '' });
    };

    const handleIncomeSubmit = (e) => {
        e.preventDefault();
        // handle income submit logic here
        setIncome({ amount: '', category: '', date: '', description: '' });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
                backgroundColor: 'white',
                minHeight: '600px',
                width: '97%',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '12px',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '32px 0 24px 0'
            }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#21242D', mb: 1, letterSpacing: 1 }}>
                    Expense Tracker
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#555', mb: 1 }}>
                    Your personal finance dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', maxWidth: 500, textAlign: 'center', mb: 2 }}>
                    Track your expenses and income effortlessly. Stay on top of your budget, analyze your spending, and achieve your financial goals with ease.
                </Typography>
                <Box sx={{ width: '100%', mb: 3 }}>
                    <hr style={{ border: 'none', borderTop: '2px solid #e0e0e0', margin: '0 auto', width: '60%' }} />
                </Box>
                <TabsContent
                    value={value}
                    setValue={setValue}
                    expense={expense}
                    setExpense={setExpense}
                    income={income}
                    setIncome={setIncome}
                    handleExpenseSubmit={handleExpenseSubmit}
                    handleIncomeSubmit={handleIncomeSubmit}
                />
            </div>
        </div>
    );
}

export default Home;