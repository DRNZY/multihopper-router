import { PublicKey } from '@solana/web3.js';
export class FeeCalculator {
    // 0.5% total fee = 50 basis points (bps)
    static TOTAL_FEE_BPS = 50n;
    // 0.25% integrator/builder share = 25 bps
    static BUILDER_SHARE_BPS = 25n;
    // 0.25% protocol pool share = 25 bps
    static PROTOCOL_SHARE_BPS = 25n;
    static BPS_DIVISOR = 10000n;
    // Minimum qualification threshold in USD for Superteam Earn bounty
    static BOUNTY_MIN_VOLUME_USD = 100000;
    // Default treasuries (valid 32-byte Solana Base58 public keys)
    static DEFAULT_PROTOCOL_TREASURY = new PublicKey('q3xodrtcvjH8NfPLMAQbRWqUXW9iH9qd8VxbhqWMiHb');
    static DEFAULT_BUILDER_TREASURY = new PublicKey('7vBCEUNdZD9WoNmpR6Hp6sLiETgsbq4Gc3eBc5Tjv76d');
    /**
     * Computes the exact fee breakdown in lamports using integer basis points.
     * Total fee: 0.5% (50 bps)
     * Builder split: 0.25% (25 bps)
     * Protocol split: 0.25% (25 bps)
     */
    static calculateFee(grossAmountLamports) {
        if (grossAmountLamports <= 0n) {
            throw new Error('Gross amount must be positive');
        }
        const totalFeeLamports = (grossAmountLamports * FeeCalculator.TOTAL_FEE_BPS) / FeeCalculator.BPS_DIVISOR;
        const builderFeeLamports = (grossAmountLamports * FeeCalculator.BUILDER_SHARE_BPS) / FeeCalculator.BPS_DIVISOR;
        // Protocol gets the remainder of the fee to guarantee conservation of lamports
        const protocolFeeLamports = totalFeeLamports - builderFeeLamports;
        const netTransferLamports = grossAmountLamports - totalFeeLamports;
        return {
            grossAmountLamports,
            netTransferLamports,
            totalFeeLamports,
            builderFeeLamports,
            protocolFeeLamports
        };
    }
    /**
     * Calculates qualifying transaction volume from collected builder fees.
     * MultiHopper rule: Qualifying volume = collected percentage fees / 0.0025
     */
    static volumeFromBuilderFee(builderFeeLamports) {
        return (builderFeeLamports * FeeCalculator.BPS_DIVISOR) / FeeCalculator.BUILDER_SHARE_BPS;
    }
}
/**
 * Volume Tracker for MultiHopper Route Activity
 * Records transactions, tallies production volume, and tracks builder revenue yield.
 */
export class VolumeTracker {
    records = [];
    recordTransfer(record) {
        this.records.push(record);
    }
    getRecords() {
        return [...this.records];
    }
    getSummary(solPriceUsd = 180) {
        let totalGrossVolumeLamports = 0n;
        let totalBuilderYieldLamports = 0n;
        for (const r of this.records) {
            totalGrossVolumeLamports += r.grossVolumeLamports;
            totalBuilderYieldLamports += r.builderFeeLamports;
        }
        const LAMPORTS_PER_SOL = 1000000000n;
        const totalGrossSOL = Number(totalGrossVolumeLamports) / Number(LAMPORTS_PER_SOL);
        const totalBuilderSOL = Number(totalBuilderYieldLamports) / Number(LAMPORTS_PER_SOL);
        const totalVolumeUsd = totalGrossSOL * solPriceUsd;
        return {
            totalTransfers: this.records.length,
            totalGrossVolumeLamports,
            totalGrossVolumeSOL: totalGrossSOL,
            totalBuilderYieldLamports,
            totalBuilderYieldSOL: totalBuilderSOL,
            qualifiesForBounty: totalVolumeUsd >= FeeCalculator.BOUNTY_MIN_VOLUME_USD,
            solPriceUsd,
            totalVolumeUsd
        };
    }
    reset() {
        this.records = [];
    }
}
