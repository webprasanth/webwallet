import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import base58check from 'bs58check';

export const NETWORK = {
    messagePrefix: '\x18Flashcoin Signed Message:\n',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x44,
    scriptHash: 0x82,
    wif: 0xc4,
    dustThreshold: 546
};

const NETWORK_NAME = 'flashcoin';

export default class Wallet {

    private accounts = null;

    openWallet(wdata) {
        let mnemonic = wdata.pure_passphrase;
        let valid = bip39.validateMnemonic(mnemonic);

        if (!valid) {
            return;
        }

        let seed = bip39.mnemonicToSeedHex(mnemonic)
        let accountZero = bitcoin.HDNode.fromSeedHex(seed, NETWORK).deriveHardened(0);

        this.accounts = {
            externalAccount: accountZero.derive(0),
            internalAccount: accountZero.derive(1)
        };

        return this;
    }

    signTx(rawTx) {
        let tx = bitcoin.Transaction.fromHex(rawTx);
        let txBuilder = bitcoin.TransactionBuilder.fromTransaction(tx, NETWORK);
        let keyPair = this.accounts.externalAccount.derive(0).keyPair;

        for (var i = 0; i < tx.ins.length; i++) {
            txBuilder.sign(i, keyPair);
        }

        return txBuilder.build();
    }

}

export class Address {
    public hash: number;
    public version: number;

    constructor(hash, version) {
        this.version = version;
        this.hash = hash;
    }

    static fromBase58Check(string): Address {
        let payload = base58check.decode(string);
        let version = payload.readUInt8(0);
        let hash = payload.slice(1);

        return new Address(hash, version);
    }
}