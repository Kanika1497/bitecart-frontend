export const calculateCartTotals =(cartItems,quantities) =>{
    const subTotal = cartItems.reduce(
        (acc, food) => acc + food.price * (quantities[food.id] || 0),
        0
    );
    const shipping = subTotal === 0 ? 0.0 : 10;
    const tax = subTotal * 0.05; // Assuming a tax rate of 5%
    const total = subTotal + shipping + tax;
    
    return {
        subTotal,
        shipping,
        tax,
        total
    };
}