import { useEffect } from "react";
import { ToggleButton, ToggleButtonGroup, Typography, InputLabel, MenuItem, FormLabel, Select, TextField, Box, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import useOrdersStore from "../../store/useOrderStore";

const OrderCreation = () => {
    const addOrder = useOrdersStore((state) => state.addOrder);
    const updateOrder = useOrdersStore((state) => state.updateOrder);
    const selectedOrder = useOrdersStore((state) => state.selectedOrder);
    const currencyList = useOrdersStore((state) => state.currencyList);
    const setCurrencyList = useOrdersStore((state) => state.setCurrencyList);

    const defaultValues = {
        operation: 'buy',
        currency: 'BTC',
        amount: 0
    }

    const { control, handleSubmit, getValues, watch, setValue, reset } = useForm({defaultValues});

    const getCurrencyValue = (currencyCode) => {
        const currency = currencyList.find(currency => currency.code === currencyCode);
        return currency ? currency.rate : 0;
    }

    const getCurrencySymbol = (currencyCode) => {
        const operation = getValues('operation');
        if(operation === 'sell') {
            return '$';
        }else {
            const currency = currencyList.find(currency => currency.code === currencyCode);
            return currency ? currency.symbol : ''
        }
        
    }

    const getAmountSymbol = (currencyCode) => {
        const operation = getValues('operation');
        if(operation === 'buy') {
            return '$';
        }else {
            const currency = currencyList.find(currency => currency.code === currencyCode);
            return currency ? currency.symbol : ''
        }
        
    }

    const getValueToTransfer = (amount) => {
        const currencyCode = getValues('currency');
        const operation = getValues('operation');
        const currencyValue = getCurrencyValue(currencyCode);
        const symbol = getCurrencySymbol(currencyCode);
        const amt = Number(amount);
        if(operation === 'sell') {
            return {
                symbol,
                value: currencyValue * amt
            };
        }else {
            
            return {
                symbol,
                value: amt / currencyValue
            };
        }
        
    }

    const onSubmit = (data) => {
        if(selectedOrder) {
            updateOrder({
                ...selectedOrder,
                ...data
            });
        }else {
            data.id =  uuidv4();
            data.value = getValueToTransfer(data.amount).value;
            console.log(data);
            addOrder(data);
        }  
        console.log(data); 
        reset();
    }

    const watchAmount = watch('amount');
    const watchOperation = watch('operation');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(new Request("https://api.livecoinwatch.com/coins/list"), {
                method: "POST",
                headers: new Headers({
                  "content-type": "application/json",
                  "x-api-key": "8d61eead-b925-41bd-8dd6-cb4ce3472150",
                }),
                body: JSON.stringify({
                  currency: "USD",
                  sort: "rank",
                  order: "ascending",
                  offset: 0,
                  limit: 5,
                  meta: true,
                }),
            });

            const data = await response.json();

            if(Array.isArray(data) && data.length > 0) {
                setCurrencyList(data);
            }
                
        }
        if(!currencyList || currencyList.length === 0) {
            fetchData();
        }
        
    }, []);

    useEffect(() => {
        if(watchOperation){
            // setValue('currency', currencyList[0].code);
            setValue('amount', 0);
        }
        
    }, [watchOperation]);

    useEffect(() => {
        if(selectedOrder) {
            setValue('operation', selectedOrder.operation);
            setValue('currency', selectedOrder.currency);
            setValue('amount', selectedOrder.amount);
        }
    }, [selectedOrder]);
    
    return (
        <Box
            component="form"
            maxWidth={'80vw'}
            justifyContent={'center'}
            p={1}
            onSubmit={handleSubmit(onSubmit)}
        >
                <Typography variant="h3" mb={4}>Order Creation</Typography>
                <Box mb={4} >
                    <>
                        <InputLabel id="operation-label" mb={2}>Operation</InputLabel>
                        <Controller
                            name="operation"
                            control={control}
                            rules={{ required: true }}
                            render={({ 
                                field: {onChange, value},
                                fieldState: {error}
                            }) => (
                                <ToggleButtonGroup
                                    color="primary"
                                    value={value}
                                    error={error}
                                    exclusive
                                    onChange={onChange}
                                    aria-label="Select your operation"
                                    name="operation"
                                    id="operation"
                                    fullWidth
                                    mb={4}
                                    p={2}
                                >
                                    <ToggleButton value="buy" aria-label="Buy">
                                        Buy
                                    </ToggleButton>
                                    <ToggleButton value="sell" aria-label="Sell">
                                        Sell
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            )} 
                        />
                    </>
                </Box>
                <Box mb={4}>
                    <>
                        <InputLabel id="currency-label">Currency *</InputLabel>
                        <Controller
                            name="currency"
                            control={control}
                            rules={{ required: true }}
                            render={({ 
                                field: {onChange, value},
                                fieldState: {error}
                            }) => (
                                <Select
                                    labelId="currency-label"
                                    id="currency"
                                    value={value}
                                    label="Currency *"
                                    onChange={onChange}
                                    required
                                    error={error}
                                    fullWidth
                                >
                                    {currencyList && currencyList.length > 0 && currencyList.map((currency) => (
                                        <MenuItem key={currency.code} value={currency.code}>
                                            {currency.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )} 
                        />
                    </>
                </Box>
                <Box mb={4}>
                    <>
                        <FormLabel component="legend">Amount in {getAmountSymbol(getValues('currency'))} *</FormLabel>
                        <Controller
                            name="amount"
                            control={control}
                            rules={{ required: true, min: 1 }}
                            render={({ 
                                field: {onChange, value},
                                fieldState: {error}
                            }) => (
                                <TextField
                                    required
                                    id="amount"
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                    fullWidth
                                />
                            )} 
                        />
                    </>
                </Box>

                <Box mb={4}>
                    <Typography variant="body2">
                        Value to transfer: {getValueToTransfer(watchAmount).symbol}{getValueToTransfer(watchAmount).value}
                    </Typography>
                </Box>
                
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>

        </Box>
        
    );
}

export default OrderCreation;
