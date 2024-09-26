import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import useOrdersStore from '../../store/useOrderStore';

const OrderItem = () => {
    const removeOrder = useOrdersStore((state) => state.removeOrder);
    const orders = useOrdersStore((state) => state.orders);
    const setSelectedOrder = useOrdersStore((state) => state.setSelectedOrder);

    return (
        <>
        {orders && orders.length && orders.map((order, i) => (
            <TableRow key={`order_${i}`}>
                <TableCell>{order.operation}</TableCell>
                <TableCell>{order.currency}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.value}</TableCell>
                <TableCell>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setSelectedOrder(order)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => removeOrder(order)}
                    >
                        Remove
                    </Button>
                </TableCell>
            </TableRow>
        ))}
        </>
    );
}

export default OrderItem;
