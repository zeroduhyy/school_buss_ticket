import { ticket } from "@/core/ticket";

async function main() {
    try {
        await ticket.buy("2026-01-06", 2);
        process.exit(0);
    } catch (err) {
        console.error('购票失败', err);
        process.exit(1);
    }
}


main()