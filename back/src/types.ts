export type msg = {
  owner: msgOwner;
  content: string;
};

export enum msgOwner {
  Mom,
  Dad,
  Kid,
  System,
}

export type postBody = {
  openAiMessages: openAiRequestMessage[];
};

export type postData = {
  newOpenAiMsg: any;
  responseFrom: msgOwner;
};

export type openAiRequestMessage = {
  role: string;
  content: string;
};
