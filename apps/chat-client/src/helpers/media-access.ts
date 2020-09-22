export async function getDisplayStream() {
  const mediaDevices = navigator.mediaDevices as any
  return mediaDevices.getDisplayMedia();
}
