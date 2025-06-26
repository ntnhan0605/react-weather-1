import type { FC } from 'react';

export const weatherImageSrc = {
  Clouds: 'images/sun.png',
  Rain: 'images/cloud.png',
  Sun: 'images/sun.png',
};

export type WeatherImageTypeKeys = keyof typeof weatherImageSrc;

export type WeatherImageTypeProps = {
  type?: WeatherImageTypeKeys | string;
};

export const WeatherImageType: FC<WeatherImageTypeProps> = (props) => {
  const { type } = props;

  if (!type || !(type in weatherImageSrc)) {
    return null;
  }

  return (
    <img
      src={weatherImageSrc[type as keyof typeof weatherImageSrc]}
      alt={type}
      className="w-full h-full object-contain object-center"
    />
  );
};
