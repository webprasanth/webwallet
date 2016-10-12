import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';

const network = {
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

const networkName = 'flashcoin';

export default class Wallet {

    private accounts = null;

    openWallet(wdata) {
        let mnemonic = wdata.pure_passphrase;
        let valid = bip39.validateMnemonic(mnemonic);

        if (!valid) {
            return;
        }

        let seed = bip39.mnemonicToSeedHex(mnemonic)
        let accountZero = bitcoin.HDNode.fromSeedHex(seed, network).deriveHardened(0);

        this.accounts = {
            externalAccount: accountZero.derive(0),
            internalAccount: accountZero.derive(1)
        };

        return this;
    }

    signTx(rawTx) {
        let tx = bitcoin.Transaction.fromHex(rawTx);
        let txBuilder = bitcoin.TransactionBuilder.fromTransaction(tx, network);
        let keyPair = this.accounts.externalAccount.derive(0).keyPair;

        for (var i = 0; i < tx.ins.length; i++) {
            txBuilder.sign(i, keyPair);
        }

        return txBuilder.build();
    }

}