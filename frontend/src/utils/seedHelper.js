export const generate64BitSeed = () => {
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);
    const bigIntSeed = (BigInt(array[0]) << 32n) | BigInt(array[1]);
    return bigIntSeed.toString();
};