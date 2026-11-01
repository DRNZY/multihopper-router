import { PublicKey } from '@solana/web3.js';
import { ComplianceReport } from './types.js';
/**
 * TRM Labs Compliance Engine
 * Screens source and destination addresses against known sanctions, illicit flow clusters,
 * and high-risk entities prior to constructing or executing any routed transfer.
 */
export declare class TRMComplianceEngine {
    private sanctionedAddresses;
    private flaggedCategories;
    constructor();
    /**
     * Adds an address to the local blocklist (e.g. for dynamic TRM webhook updates)
     */
    addSanctionedAddress(address: string, flags?: string[]): void;
    /**
     * Screens a Solana public key before route construction.
     */
    screenAddress(pubkey: PublicKey | string): Promise<ComplianceReport>;
    /**
     * Screens both endpoints of a route. Throws if either fails compliance.
     */
    verifyRouteEndpoints(source: PublicKey, destination: PublicKey): Promise<{
        sourceReport: ComplianceReport;
        destinationReport: ComplianceReport;
    }>;
}
