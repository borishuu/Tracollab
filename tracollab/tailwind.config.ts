import type {Config} from "tailwindcss";

const config: {
    plugins: any[];
    theme: {
        extend: {
            keyframes: { scroll: { "100%": { transform: string }; "0%": { transform: string } } };
            backgroundImage: { "gradient-conic": string; "gradient-radial": string };
            colors: { customPurple: string; customGreen: string };
            animation: { scroll: string }
        }
    };
    content: string[]
} = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                scroll: {
                    '0%': {transform: 'translateX(100%)'},
                    '100%': {transform: 'translateX(-100%)'},
                },
            },
            animation: {
                scroll: 'scroll 10s linear infinite',
            },
            colors: {
                customPurple: '#9732C2',
                customGreen: '#8ACE01',
            },
        },
    },
    plugins: [],
};

export default config;