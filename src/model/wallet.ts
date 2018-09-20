import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import base58check from 'bs58check';
import hdkey from 'hdkey';
import ethTx from 'ethereumjs-tx';

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
      private: 0x0488ade4,
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
      private: 0x04358394,
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
  DASH: {
    messagePrefix: '\x18Dash Coin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
    dustThreshold: 546,
  },
  DASH_TESTNET: {
    messagePrefix: '\x18Dash Coin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x8c,
    scriptHash: 0x13,
    wif: 0xef,
    dustThreshold: 546,
  },
  ETH: {
    chainId: 1,
  },
  ETH_TESTNET: {
    chainId: 4,
  },
  OMG: {
    contract_address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
  },
  OMG_TESTNET: {
    contract_address: '0x2Ff7535a5EDda98C9A20D289F711cD4cE29C92b6',
  },
  ADT: {
    contract_address: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
  },
  ARN: {
    contract_address: '0xBA5F11b16B155792Cf3B2E6880E8706859A8AEB6',
  },
  AE: {
    contract_address: '0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d',
  },
  AST: {
    contract_address: '0x27054b13b1b798b345b591a4d22e6562d47ea75a',
  },
  AMB: {
    contract_address: '0x4dc3643dbc642b72c158e7f3d2ff232df61cb6ce',
  },
  APPC: {
    contract_address: '0x1a7a8bd9106f2b8d977e08582dc7d24c723ab0db',
  },
  // LINK: {
  //   contract_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
  // },
  CND: {
    contract_address: '0xd4c435f5b09f855c3317c8524cb1f586e42795fa',
  },
  DAI: {
    contract_address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  },
  MANA: {
    contract_address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  },
  DENT: {
    contract_address: '0x3597bfd533a99c9aa083587b074434e61eb0a258',
  },
  DCN: {
    contract_address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
  },
  DRGN: {
    contract_address: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e',
  },
  ETHOS: {
    contract_address: '0x5af2be193a6abca9c8817001f45744777db30756',
  },
  '1ST': {
    contract_address: '0xaf30d2a7e90d7dc361c8c4585e9bb7d2f6f15bc7',
  },
  GVT: {
    contract_address: '0x103c3A209da59d3E7C4A89307e66521e081CFDF0',
  },
  ICN: {
    contract_address: '0x888666CA69E0f178DED6D75b5726Cee99A87D698',
  },
  KIN: {
    contract_address: '0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5',
  },
  KCS: {
    contract_address: '0x039b5649a59967e3e936d7471f9c3700100ee1ab',
  },
  LRC: {
    contract_address: '0xef68e7c694f40c8202821edf525de3782458639f',
  },
  LUN: {
    contract_address: '0xfa05A73FfE78ef8f1a739473e462c54bae6567D9',
  },
  MKR: {
    contract_address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  },
  MDS: {
    contract_address: '0x66186008C1050627F979d464eABb258860563dbE',
  },
  MLN: {
    contract_address: '0xBEB9eF514a379B997e0798FDcC901Ee474B6D9A1',
  },
  MTL: {
    contract_address: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
  },
  PLR: {
    contract_address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17',
  },
  POE: {
    contract_address: '0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195',
  },
  POWR: {
    contract_address: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
  },
  QASH: {
    contract_address: '0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6',
  },
  QSP: {
    contract_address: '0x99ea4db9ee77acd40b119bd1dc4e33e1c070b80d',
  },
  RDN: {
    contract_address: '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
  },
  REQ: {
    contract_address: '0x8f8221afbb33998d8584a2b05749ba73c37a938a',
  },
  R: {
    contract_address: '0x48f775efbe4f5ece6e0df2f7b5932df56823b990',
  },
  RVT: {
    contract_address: '0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244',
  },
  SAN: {
    contract_address: '0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098',
  },
  SNGLS: {
    contract_address: '0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009',
  },
  STORM: {
    contract_address: '0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433',
  },
  SUB: {
    contract_address: '0x12480e24eb5bec1a9d4369cab6a80cad3c0a377a',
  },
  TAAS: {
    contract_address: '0xe7775a6e9bcf904eb39da2b68c5efb4f9360e08c',
  },
  TNB: {
    contract_address: '0xf7920b0768ecb20a123fac32311d07d193381d6f',
  },
  VERI: {
    contract_address: '0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374',
  },
  VIB: {
    contract_address: '0x2C974B2d0BA1716E644c1FC59982a89DDD2fF724',
  },
  WTC: {
    contract_address: '0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74',
  },
  WAX: {
    contract_address: '0x39bb259f66e1c59d5abef88375979b4d20d98022',
  },
  // TRST: {
  //   contract_address: '0xcb94be6f13a1182e4a4b6140cb7bf2025d28e41b',
  // },
  BNB: {
    contract_address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  },
  GNT: {
    contract_address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
  },
  PAY: {
    contract_address: '0xB97048628DB6B661D4C2aA833e95Dbe1A905B280',
  },
  BAT: {
    contract_address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  },
  '0x': {
    contract_address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
  },
  ANT: {
    contract_address: '0x960b236A07cf122663c4303350609A66A7B288C0',
  },
  // REP: {
  //   contract_address: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  // },
  BNT: {
    contract_address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
  },
  BRD: {
    contract_address: '0x558ec3152e2eb2174905cd19aea4e34a23de9ad6',
  },
  CVC: {
    contract_address: '0x41e5560054824ea6b0732e656e3ad64e20e94e45',
  },
  DGB: {
    contract_address: '',
  },
  DNT: {
    contract_address: '0x0abdace70d3790235af448c88547603b945604ea',
  },
  FUN: {
    contract_address: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
  },
  GNO: {
    contract_address: '0x6810e776880c02933d47db1b9fc05908e5386b96',
  },
  RLC: {
    contract_address: '0x607F4C5BB672230e8672085532f7e901544a7375',
  },
  GUP: {
    contract_address: '0xf7b098298f7c69fc14610bf71d5e02c60792894c',
  },
  MCO: {
    contract_address: '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
  },
  NMR: {
    contract_address: '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
  },
  POLY: {
    contract_address: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec',
  },
  PPT: {
    contract_address: '0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a',
  },
  RCN: {
    contract_address: '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
  },
  SALT: {
    contract_address: '0x4156D3342D5c385a87D264F90653733592000581',
  },
  SNT: {
    contract_address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
  },
  STORJ: {
    contract_address: '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
  },
  WINGS: {
    contract_address: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
  },
  UTK: {
    contract_address: '0x70a72833d6bf7f508c8224ce59ea1ef3d0ea3a38',
  },
};

const NETWORK_NAME = 'flashcoin';

export default class Wallet {
  private accounts = null;
  private addrNode = null;
  currency_type = null;
  pure_passphrase = null;

  getCryptoNetwork(currency_type) {
    let network;
    var currency_type = parseInt(currency_type);
    switch (currency_type) {
      case CURRENCY_TYPE.BTC:
        if (APP_MODE == 'PROD') network = NETWORKS.BTC;
        else network = NETWORKS.BTC_TESTNET;
        break;
      case CURRENCY_TYPE.LTC:
        if (APP_MODE == 'PROD') network = NETWORKS.LTC;
        else network = NETWORKS.LTC_TESTNET;
        break;
      case CURRENCY_TYPE.DASH:
        if (APP_MODE == 'PROD') network = NETWORKS.DASH;
        else network = NETWORKS.DASH_TESTNET;
        break;
      case CURRENCY_TYPE.ETH:
        if (APP_MODE == 'PROD') network = NETWORKS.ETH;
        else network = NETWORKS.ETH_TESTNET;
        break;
      case CURRENCY_TYPE.FLASH:
      default:
        network = NETWORKS.FLASH;
        break;
    }
    return network;
  }

  openWallet(wdata, return_passphrase) {
    let mnemonic = wdata.pure_passphrase;
    let valid = bip39.validateMnemonic(mnemonic);

    if (!valid) {
      return;
    }

    let seed = bip39.mnemonicToSeedHex(mnemonic);
    if (wdata.currency_type != CURRENCY_TYPE.ETH) {
      let accountZero = bitcoin.HDNode.fromSeedHex(
        seed,
        this.getCryptoNetwork(wdata.currency_type)
      ).deriveHardened(0);

      this.accounts = {
        externalAccount: accountZero.derive(0),
        internalAccount: accountZero.derive(1),
      };
    } else {
      let seed = bip39.mnemonicToSeed(mnemonic);
      let root = hdkey.fromMasterSeed(seed);
      this.addrNode = root.derive("m/44'/60'/0'/0/0");
    }
    this.currency_type = wdata.currency_type;
    if (return_passphrase) this.pure_passphrase = wdata.pure_passphrase;

    return this;
  }

  signTx(rawTx) {
    let tx = bitcoin.Transaction.fromHex(rawTx);
    let txBuilder = bitcoin.TransactionBuilder.fromTransaction(
      tx,
      this.getCryptoNetwork(this.currency_type)
    );
    let keyPair = this.accounts.externalAccount.derive(0).keyPair;

    for (var i = 0; i < tx.ins.length; i++) {
      txBuilder.sign(i, keyPair);
    }

    return txBuilder.build();
  }

  signEtherBasedTx(rawTx) {
    let network = this.getCryptoNetwork(
      parseInt(localStorage.getItem('currency_type'))
    );
    rawTx.chainId = network.chainId;

    let tx = new ethTx(rawTx);
    //Signing the transaction with the correct private key
    tx.sign(this.addrNode._privateKey);
    //var serializedTx = tx.serialize()
    //console.log(serializedTx.toString('hex'));

    return tx;
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
