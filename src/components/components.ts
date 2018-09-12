import { riot, template, Element } from './riot-ts';

import MobileLogin from './mobile-login/mobile-login';
import sso from './sso/sso';
import Home from './home/index';
import HomeHeader from './home/header';
import Navbar from './home/navbar';
import LoadingIndicator from './loading-indicator/loading-indicator';
import TransactionDetails from './modals/transaction-details/transaction-details';
import SharingTransactionDetails from './modals/sharing-transaction-details/sharing-transaction-details';
import WalletAddress from './modals/wallet-address/wallet-address';
import FullBalance from './modals/full-balance/full-balance';
import App from './app/app';
import SubmitEmail from './reset-pass/submit-email';
import SetupPassword from './setuppassword/setuppassword';
import MerchantStand from './home/merchant-tools/merchant-stand';
import MerchantStickers from './home/merchant-tools/merchant-stickers';
import MerchantWidgets from './home/merchant-tools/merchant-widgets';
import ProfileAvatar from './home/profile/avatar';
import UserInfo from './home/profile/user-info';
import AccountSetting from './home/profile/setting';
import FountainSetting from './home/profile/fountain';
import ProfileSecurityQuestions from './home/profile/question';
import ShareCoin from './home/profile/sharecoin';
import ERC20Tokens from './home/profile/erc20-tokens';
import ErrorAlert from './modals/error-alert/error-alert';
import LocationError from './modals/location-error/location-error';
import TwoFAVerification from './modals/twofa-verification/twofa-verification-dialog';
import TwoFAVerificationSendTxn from './modals/twofa-verification-sendtxn/twofa-verification-sendtxn';
import TwoFARecommend from './modals/twofa-recommend/twofa-recommend-dialog';
import SendMoneyConfirm from './modals/send-money-confirm/send-money-confirm';
import SendRequestConfirm from './modals/send-request-confirm/send-request-confirm';
import AcceptMoneyRequest from './modals/accept-money-request/accept-money-request';
import RejectMoneyRequest from './modals/reject-money-request/reject-money-request';
import ConfirmDialog from './modals/confirm-dialog/confirm-dialog';
import ContactRequestMoney from './modals/contact-request-money/contact-request-money';
import ContactSendMoney from './modals/contact-send-money/contact-send-money';
import SecurityQuestions from './reset-pass/security-questions';
import EnableAccount from './enable-account/enable-account';
import MigrateV1ToV2 from './migrate-v1-to-v2/migrate-v1-to-v2';
import MessageDialog from './modals/message-dialog/message-dialog';
import VerifyPhone from './modals/verify-phone/verify-phone';
import RequestDetail from './modals/request-detail/request-detail';
import RequestPassword from './modals/request-password/request-password';

export {
  LoadingIndicator,
  MerchantStand,
  MerchantStickers,
  MerchantWidgets,
  ProfileAvatar,
  UserInfo,
  AccountSetting,
  FountainSetting,
  ProfileSecurityQuestions,
  ShareCoin,
  ERC20Tokens,
  TransactionDetails,
  SharingTransactionDetails,
  WalletAddress,
  FullBalance,
  MobileLogin,
  sso,
  Home,
  HomeHeader,
  App,
  SubmitEmail,
  SetupPassword,
  ErrorAlert,
  LocationError,
  SendMoneyConfirm,
  TwoFAVerification,
  TwoFAVerificationSendTxn,
  TwoFARecommend,
  SendRequestConfirm,
  AcceptMoneyRequest,
  RejectMoneyRequest,
  ConfirmDialog,
  ContactRequestMoney,
  ContactSendMoney,
  SecurityQuestions,
  EnableAccount,
  MigrateV1ToV2,
  MessageDialog,
  VerifyPhone,
  Navbar,
  RequestDetail,
  RequestPassword,
};

export function initialize() {
  riot.mount('app');
}
