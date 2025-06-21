export type ContractType = {
  name: string;
}

export type ContractParameter = {
  name: string;
  type: ContractType;
  description?: string;
}

export type ContractFunctionItem = {
  entrypoint: string;
  public: boolean;
  readonly: boolean;
  description?: string;
  parameters: ContractParameter[];
  returns: ContractParameter[];
  // TODO: Defaults
}

export type ContractStorageItem = {
  name: string;
  type: ContractType;
  description?: string;
  // TODO: Defaults
}

export type ContractEventItem = {
  name: string;
  description?: string;
  keys: { name: string; type: ContractType }[];
  data: { name: string; type: ContractType }[];
}
