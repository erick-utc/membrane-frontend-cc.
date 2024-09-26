import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import useOrdersStore from '../../store/useOrderStore';

const OrderItem = () => {
    const removeOrder = useOrdersStore((state) => state.removeOrder);
    const orders = useOrdersStore((state) => state.orders);
    const setSelectedOrder = useOrdersStore((state) => state.setSelectedOrder);
    const currencyList = useOrdersStore((state) => state.currencyList);

    const getCurrencySymbol = (order) => {
        const operation = order.operation;
        if(operation === 'sell') {
            return '$';
        }else {
            const currency = currencyList.find(currency => currency.code === order.currency);
            return currency ? currency.symbol : ''
        }
        
    }

    const getAmountSymbol = (order) => {
        const operation = order.operation;
        if(operation === 'buy') {
            return '$';
        }else {
            const currency = currencyList.find(currency => currency.code === order.currency);
            return currency ? currency.symbol : ''
        }
        
    }

    return (
        <>
        {orders && orders.length && orders.map((order, i) => (
            <TableRow key={`order_${i}`}>
                <TableCell>{order.operation}</TableCell>
                <TableCell>{order.currency}</TableCell>
                <TableCell>{getAmountSymbol(order)}{order.amount}</TableCell>
                <TableCell>{getCurrencySymbol(order)}{order.value}</TableCell>
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
