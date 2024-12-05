export type MessageType = 
  | { type: 'INIT_URL'; payload: { url: string } }
  | { type: 'ADD_CODE'; payload: { url: string; name: string; content: string; path?: string } }
  | { type: 'GET_NODES'; payload: { url: string } }
  | { type: 'UPDATE_NODE'; payload: { id: string; updates: any } }
  | { type: 'DELETE_NODE'; payload: { id: string } };

export type ResponseType = {
  success: boolean;
  data?: any;
  error?: string;
};

export const sendMessage = async (message: MessageType): Promise<ResponseType> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: ResponseType) => resolve(response));
  });
};