type CodeKeyType = string | number;

const codeMap = new Map<CodeKeyType, string>();

// 生成
export function generateCode(codeKey: CodeKeyType) {
  const codeText = Math.random().toString().slice(2, 6);
  codeMap.set(codeKey, codeText);

  setTimeout(() => {
    codeMap.delete(codeKey);
  }, 1000 * 60);
  return codeText;
}

// 检验验证码
export function checkCode(codeKey: CodeKeyType, checkCode: string) {
  const codeInMap = codeMap.get(codeKey);
  if (codeInMap && codeInMap === checkCode) {
    return true;
  }
  return false;
}

export function genVerifyCodeImg(codeText: CodeKeyType) {
  // TODO 生成图片
  return codeText;
}
