export const connectPrinter = async () => {
  const device = await navigator.usb.requestDevice({
    filters: [{ vendorId: 0x0416 }],
  });

  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);

  return device;
};

export const sendToPrinter = async (device: USBDevice, data: Uint8Array) => {
  await device.transferOut(1, data);
};