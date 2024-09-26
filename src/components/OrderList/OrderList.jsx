import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import OrderItem from '../OrderItem/OrderItem';
import useOrdersStore from '../../store/useOrderStore';

const OrderList = () => {
    const orders = useOrdersStore((state) => state.orders);

    return (
        <Paper>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Operation</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {orders && orders.length > 0 && 
                    <TableBody>
                        <OrderItem/>
                    </TableBody>
                    }
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default OrderList;
