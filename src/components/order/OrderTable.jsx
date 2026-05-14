
const OrderTable = ({orders}) => {
  return (
    <div>
      <h2>Orders Table</h2>

      {orders.map((order) => (
        <div key={order.id}>
          <p>{order.customerName}</p>
          <p>{order.flavor}</p>
          <p>₱{order.subtotal}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderTable
