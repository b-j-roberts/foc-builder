// THIS FILE IS GENERATED, DO NOT EDIT

#[starknet::contract]
mod __CONTRACT_NAME__ {
  __CONTRACT_IMPORTS__

  __CONTRACT_COMPONENTS__

  #[storage]
  struct Storage {
    __CONTRACT_STORAGE__
  }

  __CONTRACT_EVENT_TYPES__

  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    __CONTRACT_EVENTS__
  }

  #[constructor]
  fn constructor(ref self: ContractState) {
    __CONTRACT_CONSTRUCTOR__
  }

  #[abi(embed_v0)]
  impl __CONTRACT_NAME__Impl of super::I__CONTRACT_NAME__<ContractState> {
    __CONTRACT_PUBLIC_FUNCTIONS__
  }

  __CONTRACT_PRIVATE_FUNCTIONS__
}
