import { getAccount, watchAccount } from "@wagmi/core";
import { wagmiConfig } from "..";
import type { Nullable, AccountType } from "..";
import { Address } from "./Address.svelte";

// Account => account & chain & chainId & isConnected & connectorId
// Address => address & balance & symbol & decimals & ensName & ensAvatar
class Account extends Address {
  #account = $state<Nullable<AccountType>>();

  get chain() {
    return this.#account?.chain;
  }
  get chainId() {
    return this.#account?.chainId;
  }
  get isConnected() {
    return this.#account?.isConnected;
  }
  get connectorId() {
    return this.#account?.connector?.id;
  }

  watch = () =>
    watchAccount(wagmiConfig, {
      onChange: (newAccount: AccountType) => {
        this.#account = newAccount;
        super.address = newAccount.address;
      }
    });

  constructor({ ens = false } = {}) {
    const account = getAccount(wagmiConfig);
    super(account.address, { ens });

    this.#account = account;

    this.watch();
    // $inspect("Account account", this.account);
    // $inspect("Account", this.chainId, this.address, this.connectorId);
  }
}

export { Account };
