import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Order {
    _id: string;
    customerName: string;
    productName: string;
    price: number;
    status: string;
    createdAt: string;
}

interface Props {
    orders: Order[];
}

export default function OrdersTable({ orders }: Props) {
    return (
        <div className="rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>
                                {order.customerName}
                            </TableCell>

                            <TableCell>
                                {order.productName}
                            </TableCell>

                            <TableCell>
                                {order.status}
                            </TableCell>

                            <TableCell>
                                {order.price.toLocaleString()}
                            </TableCell>

                            <TableCell>
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}