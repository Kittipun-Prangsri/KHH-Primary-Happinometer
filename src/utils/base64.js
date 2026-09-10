// atob() decodes Base64 into a "binary string" (one UTF-16 code unit per byte),
// so multi-byte UTF-8 characters (e.g. Thai) come out mangled unless the raw
// bytes are re-assembled and decoded as UTF-8 explicitly.
export function decodeBase64Utf8(base64) {
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}
