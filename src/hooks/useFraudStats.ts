import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://api.mainnet-beta.solana.com';
const FRAUD_MINT = import.meta.env.VITE_FRAUD_MINT || '2KF9SAvpU2h2ZhczzMLbgx7arkjG8QHCXbQ6XaDqtEtm';
const TREASURY_WALLET = import.meta.env.VITE_TREASURY_WALLET;

export const useFraudStats = () => {
    const [stats, setStats] = useState({
        subsidiesClaimed: 0,
        totalLaundered: 0,
        marketCap: 0,
        loading: true,
        error: null as string | null
    });

    const fetchStats = async () => {
        try {
            const connection = new Connection(RPC_URL, 'confirmed');

            let solBalance = 0;
            if (TREASURY_WALLET) {
                solBalance = await connection.getBalance(new PublicKey(TREASURY_WALLET));
            }

            let marketCap = 0;
            let totalLaundered = 0;
            try {
                // Fetch Market Cap
                const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${FRAUD_MINT}`);
                const dexData = await dexResponse.json();
                if (dexData.pairs && dexData.pairs.length > 0) {
                    marketCap = dexData.pairs[0].fdv || dexData.pairs[0].marketCap || 0;
                }

                // Fetch Total Burned (Total Laundered)
                // Pump.fun tokens start at 1,000,000,000
                const supplyInfo = await connection.getTokenSupply(new PublicKey(FRAUD_MINT));
                const currentSupply = Number(supplyInfo.value.uiAmount);
                totalLaundered = Math.max(0, 1000000000 - currentSupply);
            } catch (dexErr) {
                console.warn('Live stats fetch failed', dexErr);
            }

            setStats({
                subsidiesClaimed: solBalance / 1e9,
                totalLaundered: totalLaundered,
                marketCap: marketCap,
                loading: false,
                error: null
            });
        } catch (err) {
            console.error('Error fetching fraud stats:', err);
            setStats(s => ({ ...s, loading: false, error: 'NODE_CONNECTION_FAILED' }));
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    return stats;
};
