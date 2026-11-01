import { PublicKey } from '@solana/web3.js';
import { VolumeRecord, VolumeSummary } from './types.js';
export interface FeeBreakdown {
    grossAmountLamports: bigint;
    netTransferLamports: bigint;
    totalFeeLamports: bigint;
    builderFeeLamports: bigint;
    protocolFeeLamports: bigint;
}
export declare class FeeCalculator {
    static readonly TOTAL_FEE_BPS = 50n;
    static readonly BUILDER_SHARE_BPS = 25n;
    static readonly PROTOCOL_SHARE_BPS = 25n;
    static readonly BPS_DIVISOR = 10000n;
    static readonly BOUNTY_MIN_VOLUME_USD = 100000;
    static readonly DEFAULT_PROTOCOL_TREASURY: PublicKey;
    static readonly DEFAULT_BUILDER_TREASURY: PublicKey;
    /**
     * Computes the exact fee breakdown in lamports using integer basis points.
     * Total fee: 0.5% (50 bps)
     * Builder split: 0.25% (25 bps)
     * Protocol split: 0.25% (25 bps)
     */
    static calculateFee(grossAmountLamports: bigint): FeeBreakdown;
    /**
     * Calculates qualifying transaction volume from collected builder fees.
     * MultiHopper rule: Qualifying volume = collected percentage fees / 0.0025
     */
    static volumeFromBuilderFee(builderFeeLamports: bigint): bigint;
}
/**
 * Volume Tracker for MultiHopper Route Activity
 * Records transactions, tallies production volume, and tracks builder revenue yield.
 */
export declare class VolumeTracker {
    private records;
    recordTransfer(record: VolumeRecord): void;
    getRecords(): VolumeRecord[];
    getSummary(solPriceUsd?: number): VolumeSummary;
    reset(): void;
}
