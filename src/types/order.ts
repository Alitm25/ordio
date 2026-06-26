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
    createdAt: string;
}