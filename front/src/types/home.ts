export type IBlogData = {
  _id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export type IBanner = {
  _id: string;
  image: string;
  adaptiveImage?: string;
  type: string;
  title: string;
  description: string;
  status: boolean;
  button: boolean;
  button_name: string;
  link: string;
  text_link_name?: string;
  text_link_url?: string;
  createdAt: string;
  country: string;
};

export type IPopup = {
  popupMessage: string;
  note: string;
  deliveryTimeout: string;
  banner: string;
  link: string;
};
