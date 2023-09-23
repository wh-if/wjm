type CodeKeyType = string | number;

const codeMap = new Map<CodeKeyType, { text: string; timer: any }>();

// 生成
export function generateCode(codeKey: CodeKeyType) {
  const codeText = Math.random().toString().slice(2, 6);
  const timer = setTimeout(() => {
    codeMap.delete(codeKey);
  }, 1000 * 60);
  codeMap.set(codeKey, {
    text: codeText,
    timer,
  });

  return codeText;
}

// 检验验证码
export function checkCode(codeKey: CodeKeyType, checkCode: string) {
  const codeInMap = codeMap.get(codeKey);
  if (codeInMap && codeInMap.text === checkCode) {
    // 验证码使用成功后删除，只能验证一次
    clearTimeout(codeInMap.timer);
    codeMap.delete(codeKey);
    return true;
  }
  return false;
}

export function genVerifyCodeImg(codeText: CodeKeyType) {
  // TODO 生成图片
  return codeText;
}
