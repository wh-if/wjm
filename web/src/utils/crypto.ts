export async function cryptoDigest(text: string) {
  const textEncoder = new TextEncoder();
  const message = textEncoder.encode(text);
  const messageDigest = await crypto.subtle.digest("SHA-256", message);
  const hexDigest = Array.from(new Uint8Array(messageDigest))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
  console.log(hexDigest);
  return hexDigest;
}
