export function isDayTime() {
  const hours = new Date().getHours();
  const isDayTime = hours > 6 && hours < 18;
  return isDayTime;
}
