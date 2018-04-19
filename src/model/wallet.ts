import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import base58check from 'bs58check';
import { CURRENCY_TYPE } from './currency';
import { APP_MODE } from './app-service';

export const NETWORKS = {
  FLASH: {
    messagePrefix: '\x18Flashcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x44,
    scriptHash: 0x82,
    wif: 0xc4,
    dustThreshold: 546,
  },
  BTC: {
    messagePrefix: '\x18Bitcoin Coin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: 546,
  },
  BTC_TESTNET: {
    messagePrefix: '\x18Bitcoin Coin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    dustThreshold: 546,
  },
  LTC: {
    messagePrefix: '\x18Litecoin Coin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    dustThreshold: 546,
  },
  LTC_TESTNET: {
    messagePrefix: '\x18Litecoin Coin Signed Message:\n',
    bip32: {
      public: 0x0436f6e1,
      private: 0x0436ef7d,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xef,
    dustThreshold: 546,
  },
};

const NETWORK_NAME = 'flashcoin';

export default class Wallet {
  private accounts = null;
  currency_type = null;

  getCryptoNetwork(currency_type) {
    let network;
    var currency_type = parseInt(currency_type);
    switch (currency_type) {
      case CURRENCY_TYPE.BTC:
        if (APP_MODE == 'PROD') 
          network = NETWORKS.BTC;
        else 
          network = NETWORKS.BTC_TESTNET;
        break;
      case CURRENCY_TYPE.LTC:
        if (APP_MODE == 'PROD') 
          network = NETWORKS.LTC;
        else 
          network = NETWORKS.LTC_TESTNET;
        break;
      case CURRENCY_TYPE.FLASH:
      default:
        network = NETWORKS.FLASH;
        break;
    }
    return network;
  }

  openWallet(wdata) {
    let mnemonic = wdata.pure_passphrase;
    let valid = bip39.validateMnemonic(mnemonic);

    if (!valid) {
      return;
    }

    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let accountZero = bitcoin.HDNode.fromSeedHex(seed, this.getCryptoNetwork(wdata.currency_type)).deriveHardened(
      0
    );

    this.accounts = {
      externalAccount: accountZero.derive(0),
      internalAccount: accountZero.derive(1),
    };
    this.currency_type = wdata.currency_type;

    return this;
  }

  signTx(rawTx) {
    let tx = bitcoin.Transaction.fromHex(rawTx);
    let txBuilder = bitcoin.TransactionBuilder.fromTransaction(tx, this.getCryptoNetwork(this.currency_type));
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
