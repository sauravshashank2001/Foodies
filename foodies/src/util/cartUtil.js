export const calculateCartTotals = (cartItems, quantities) => {
    
    //calculating
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * quantities[item.id], 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
}