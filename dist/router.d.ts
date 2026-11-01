import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { TRMComplianceEngine } from './compliance.js';
import { VolumeTracker } from './fee.js';
import { MultiSendExecutionResult, MultiSendPlan, MultiSendRecipient, RouteConfig, RouteExecutionResult, RoutePlan } from './types.js';
export interface RouterOptions {
    connection?: Connection;
    complianceEngine?: TRMComplianceEngine;
    volumeTracker?: VolumeTracker;
    builderTreasury?: PublicKey;
    protocolTreasury?: PublicKey;
}
export declare class MultiHopperRouter {
    connection?: Connection;
    compliance: TRMComplianceEngine;
    volumeTracker: VolumeTracker;
    builderTreasury: PublicKey;
    protocolTreasury: PublicKey;
    static readonly MIN_RENT_EXEMPT_LAMPORTS = 890880n;
    static readonly TX_FEE_LAMPORTS = 5000n;
    constructor(options?: RouterOptions);
    /**
     * Plans a multi-hop routed transfer from source to destination.
     * Enforces TRM Labs compliance, calculates 0.5% fee split, and generates ephemeral hops.
     */
    planRoute(config: RouteConfig): Promise<RoutePlan>;
    /**
     * Plans an unbundled Multi-Send distribution across multiple recipients.
     */
    planMultiSend(source: PublicKey, recipients: MultiSendRecipient[], hopsPerRecipient?: number): Promise<MultiSendPlan>;
    /**
     * Builds the sequence of Solana Transactions representing the route.
     */
    buildTransactions(plan: RoutePlan, payer: Keypair, recentBlockhash?: string): Promise<Transaction[]>;
    /**
     * Executes a planned route either on-chain or in simulation mode.
     */
    executeRoute(plan: RoutePlan, payer: Keypair, simulateOnly?: boolean): Promise<RouteExecutionResult>;
    /**
     * Builds transactions for all recipients in an unbundled multi-send plan.
     */
    buildMultiSendTransactions(plan: MultiSendPlan, payer: Keypair, recentBlockhash?: string): Promise<Transaction[][]>;
    /**
     * Executes all routes in an unbundled multi-send plan.
     */
    executeMultiSend(plan: MultiSendPlan, payer: Keypair, simulateOnly?: boolean): Promise<MultiSendExecutionResult>;
}
