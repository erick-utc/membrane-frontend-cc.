import { create } from 'zustand'

const useOrdersStore = create((set, get) => ({
    orders: JSON.parse(localStorage.getItem('orders')) || [],
    selectedOrder: null,
    currencyList: JSON.parse(localStorage.getItem('currencies')) || [],
    addOrder: (order) => {
        const { orders } = get();
        const newOrders = structuredClone(orders);
        newOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(newOrders));

        set({ orders: newOrders });
    },
    removeOrder: (order) => {
        const { orders } = get();
        const oldOrders = structuredClone(orders);
        const newOrders = oldOrders.filter(o => o.id !== order.id)
        localStorage.setItem('orders', JSON.stringify(newOrders));

        set({ orders:  newOrders});
    },
    updateOrder: (order ) => {
        const { orders } = get();
        const newOrders = structuredClone(orders);
        const index = newOrders.findIndex(o => o.id === order.id);
        newOrders[index] = order;
        localStorage.setItem('orders', JSON.stringify(newOrders));

        set({ orders: newOrders, selectedOrder: null });
    },
    setSelectedOrder: (order) => {
        set({ selectedOrder: order });
    },
    setCurrencyList: (currencies) => {
        localStorage.setItem('currencies', JSON.stringify(currencies));
        set({ currencies });
    }
  }));


export default useOrdersStore;
