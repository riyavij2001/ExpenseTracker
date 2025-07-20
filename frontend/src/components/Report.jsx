import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

function Report() {
    const [transactions, setTransactions] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [monthlyIncome, setMonthlyIncome] = useState([]);
    const [months, setMonths] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
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
                console.error('Failed to fetch transactions', err);
                setTransactions([]);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        if (transactions.length === 0) return;

        const incomeMap = {};
        const expenseMap = {};
        const monthMap = {};
        const incomeByMonth = {};
        const expenseByMonth = {};

        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const month = date.toLocaleString('default', { month: 'short' });
            monthMap[month] = true;

            if (tx.is_debit) {
                expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount;
                expenseByMonth[month] = (expenseByMonth[month] || 0) + tx.amount;
            } else {
                incomeMap[tx.category] = (incomeMap[tx.category] || 0) + tx.amount;
                incomeByMonth[month] = (incomeByMonth[month] || 0) + tx.amount;
            }
        });

        const sortedMonths = Object.keys(monthMap).sort((a, b) =>
            new Date(`01 ${a} 2024`) - new Date(`01 ${b} 2024`)
        );

        setMonths(sortedMonths);
        setExpenseData(Object.entries(expenseMap).map(([label, value], idx) => ({ id: idx, label, value })));
        setIncomeData(Object.entries(incomeMap).map(([label, value], idx) => ({ id: idx, label, value })));
        setMonthlyExpenses(sortedMonths.map(m => expenseByMonth[m] || 0));
        setMonthlyIncome(sortedMonths.map(m => incomeByMonth[m] || 0));
    }, [transactions]);

    return (
        <Box sx={{
            minHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: '#21242D',
        }}>
            <Box sx={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '32px 24px',
                width: '97%',
                maxWidth: '94%',
                mb: 4
            }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#21242D', mb: 3, letterSpacing: 1, textAlign: 'center' }}>
                    Financial Report
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 6
                }}>
                    <Box sx={{ flex: 1, minWidth: 320 }}>
                        <Typography variant="h6" sx={{ color: '#21242D', mb: 2, textAlign: 'center' }}>Monthly Expenses</Typography>
                        <BarChart
                            xAxis={[{ data: months, scaleType: 'band', label: 'Month' }]}
                            series={[{ data: monthlyExpenses, label: 'Expenses', color: '#d32f2f' }]}
                            width={400}
                            height={260}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 320 }}>
                        <Typography variant="h6" sx={{ color: '#21242D', mb: 2, textAlign: 'center' }}>Monthly Income</Typography>
                        <LineChart
                            xAxis={[{ data: months, scaleType: 'point', label: 'Month' }]}
                            series={[{ data: monthlyIncome, label: 'Income', color: '#43a047' }]}
                            width={400}
                            height={260}
                        />
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box sx={{ flex: 1, minWidth: 320 }}>
                        <Typography variant="h6" sx={{ color: '#21242D', mb: 2, textAlign: 'center' }}>Expense Breakdown</Typography>
                        <PieChart
                            series={[{ data: expenseData, innerRadius: 40, outerRadius: 110 }]}
                            width={350}
                            height={350}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 320 }}>
                        <Typography variant="h6" sx={{ color: '#21242D', mb: 2, textAlign: 'center' }}>Income Breakdown</Typography>
                        <PieChart
                            series={[{ data: incomeData, innerRadius: 40, outerRadius: 110 }]}
                            width={350}
                            height={350}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Report;
