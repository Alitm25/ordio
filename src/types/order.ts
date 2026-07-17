export interface OrderCustomer {
    _id: string;
    name: string;
    phone: string;
}

export interface Order {
    _id: string;
    customerName: string;
    customerPhone: string;
    productName: string;
    quantity: number;
    price: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string | null;
    customerId: OrderCustomer | null;
    createdAt: string;
}