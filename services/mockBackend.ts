import { Event } from '../context/AppContext';

// Mock Service to simulate Backend interactions

export const MockBackend = {
    // 1. Validate Event Input
    validateEvent: (eventRaw: any): { valid: boolean; error?: string } => {
        if (!eventRaw.name) return { valid: false, error: 'Event Name is required' };
        if (!eventRaw.location) return { valid: false, error: 'Location is required' };
        if (!eventRaw.date) return { valid: false, error: 'Date is required' };
        if (!eventRaw.time) return { valid: false, error: 'Time is required' };
        if (eventRaw.supplierCount <= 0) return { valid: false, error: 'At least 1 supplier needed' };
        if (!eventRaw.services || eventRaw.services.length === 0) return { valid: false, error: 'Select at least one service' };

        return { valid: true };
    },

    // 2. Create Razorpay Order (Simulated)
    createRazorpayOrder: async (amount: number): Promise<{ orderId: string; amount: number; currency: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    orderId: `order_${Date.now()}`,
                    amount: amount * 100, // Amount in paise
                    currency: 'INR'
                });
            }, 1000); // Simulate network delay
        });
    },

    // 3. Verify Payment & Save Event
    confirmPaymentAndSave: async (eventData: Event, paymentId: string): Promise<{ success: boolean; event: Event }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const finalEvent = {
                    ...eventData,
                    id: `evt_${Date.now()}`,
                    paymentStatus: 'advance_paid',
                    paymentMethod: 'Razorpay',
                    paymentDate: new Date().toISOString(),
                    status: 'upcoming'
                };
                resolve({ success: true, event: finalEvent as Event });
            }, 1500);
        });
    },

    // 4. Simulate Real-time Updates (For Demo)
    simulateEventUpdates: (callback: (status: any) => void) => {
        const statuses = [
            'Supplier Assigned',
            'Supplier Arrived',
            'Event Started',
            'Event Completed'
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= statuses.length) {
                clearInterval(interval);
                return;
            }
            callback(statuses[i]);
            i++;
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }
};
