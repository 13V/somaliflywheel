import { SomaliFlywheel } from '../lib/flywheel';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const RPC_URL = process.env.VITE_RPC_URL || 'https://api.mainnet-beta.solana.com';
const FRAUD_MINT = process.env.VITE_FRAUD_MINT || '2KF9SAvpU2h2ZhczzMLbgx7arkjG8QHCXbQ6XaDqtEtm';
const AUTHORITY_KEY_PATH = process.env.AUTHORITY_KEY_PATH || './authority.json';

async function runCranker() {
    console.log('\x1b[1m\x1b[33m--- FEDERAL CRANKER INITIALIZED ---\x1b[0m');

    // Load Keypair
    let secretKey: Uint8Array;
    if (fs.existsSync(AUTHORITY_KEY_PATH)) {
        const keyData = JSON.parse(fs.readFileSync(AUTHORITY_KEY_PATH, 'utf-8'));
        secretKey = Uint8Array.from(keyData);
    } else {
        throw new Error('Authority key not found. Please provide AUTHORITY_KEY_PATH in .env');
    }

    const flywheel = new SomaliFlywheel(RPC_URL, secretKey, FRAUD_MINT);
    const THRESHOLD_SOL = 0.5;

    // --- Start Community Trigger API ---
    app.post('/api/shred', async (req, res) => {
        try {
            console.log('\x1b[35m--- COMMUNITY SHRED SIGNAL RECEIVED ---\x1b[0m');
            const sig = await flywheel.shredEvidence();
            res.json({ success: true, signature: sig });
        } catch (error: any) {
            console.error('\x1b[31mShred failed:\x1b[0m', error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`\x1b[32m--- FEDERAL COMMUNICATION CHANNEL ONLINE [PORT ${PORT}] ---\x1b[0m`);
    });

    while (true) {
        try {
            console.log(`\x1b[36m[${new Date().toLocaleTimeString()}] SCANNING FOR SUBSIDIES...\x1b[0m`);

            const balance = await flywheel.getAccruedFees();
            console.log(`\x1b[33mACCRUED SUBSIDIES: ${balance.toFixed(4)} SOL\x1b[0m`);

            if (balance >= THRESHOLD_SOL) {
                console.log(`\x1b[32mTHRESHOLD MET (${THRESHOLD_SOL} SOL). EXECUTING LAUNDROMAT...\x1b[0m`);

                const amountToSpend = Math.min(balance - 0.05, 1.8);
                const buybackTx = await flywheel.executeBuyback(amountToSpend);

                if (buybackTx) {
                    console.log(`\x1b[32mBUYBACK COMPLETE: ${buybackTx}\x1b[0m`);
                    console.log('\x1b[90mWAITING FOR TOKENS TO CLEAR CUSTOMS...\x1b[0m');
                    await new Promise(r => setTimeout(r, 15000));
                    console.log('\x1b[31mSHREDDING EVIDENCE...\x1b[0m');
                    await flywheel.shredEvidence().catch(e => console.error('\x1b[31mAuto-Shred failed:\x1b[0m', e.message));
                }
            } else {
                console.log(`\x1b[90mWAITING FOR SUBSIDIES (NEED ${THRESHOLD_SOL} SOL)\x1b[0m`);
            }

        } catch (error: any) {
            console.error('\x1b[31mCRANKER ERROR:\x1b[0m', error.message);
        }

        console.log('\x1b[90mNEXT SCAN IN 5 MINUTES...\x1b[0m');
        await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    }
}

runCranker().catch(err => {
    console.error('\x1b[31mCRITICAL CRANKER FAILURE:\x1b[0m', err.message);
    process.exit(1);
});
