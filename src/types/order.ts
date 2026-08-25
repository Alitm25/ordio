export interface OrderItem {
    _id?: string;
    productId?: string | null;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface OrderCustomer {
    _id: string;
    name: string;
    phone: string;
}

export interface Order {
    _id: string;
    customerId: OrderCustomer | null;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string | null;
    createdAt: string;
}