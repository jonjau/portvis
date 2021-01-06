export interface Portfolio {
    id: string;
    username: string;
    name: string;
    initialValue: number;
    allocations: {
        [symbol: string]: number;
    };
}

export interface PortfolioDetails {
    username: string;
    name: string;
    initialValue: number;
    allocations: {
        [symbol: string]: number;
    };
}

export interface Allocation {
    symbol: string;
    proportion: number;
}