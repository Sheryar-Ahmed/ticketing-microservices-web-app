
const OrderShow = ({ order }) => {
    console.log("order", order)
    return <div>
        Order Show {order.id}
    </div>
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    console.log("orderid", orderId);
    const { data } = await client.get(`/api/orders/getone/${orderId}`);

    return { order: data.existingOrder };
}


export default OrderShow;