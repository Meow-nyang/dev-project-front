// 마크다운 문법을 일반 텍스트로 변환하는 함수
export const stripMarkdown = (markdownText) => {
  if (!markdownText) return '';

  let plainText = markdownText;

  // 제목(#) 제거
  plainText = plainText.replace(/^#{1,6}\s+/gm, '');

  // 코드 블록(```) 제거
  plainText = plainText.replace(/```[\s\S]*?```/g, (match) => {
    // 코드 블록 내용만 추출 (``` 제거)
    return match.replace(/```(?:\w*\n)?|\n```$/g, '');
  });

  // 인라인 코드(`) 제거
  plainText = plainText.replace(/`([^`]+)`/g, '$1');

  // 볼드체(**) 제거
  plainText = plainText.replace(/\*\*([^*]+)\*\*/g, '$1');

  // 기울임체(*) 제거
  plainText = plainText.replace(/\*([^*]+)\*/g, '$1');

  // 취소선(~~) 제거
  plainText = plainText.replace(/~~([^~]+)~~/g, '$1');

  // 인용구(>) 제거
  plainText = plainText.replace(/^>\s+/gm, '');

  // 링크([text](url)) 텍스트만 남기기
  plainText = plainText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 이미지(![alt](url)) 대체 텍스트만 남기기
  plainText = plainText.replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 목록(-, *, +) 제거
  plainText = plainText.replace(/^[-*+]\s+/gm, '');

  // 순서 있는 목록(1., 2. 등) 제거
  plainText = plainText.replace(/^\d+\.\s+/gm, '');

  // 수평선(---, ***, ___) 제거
  plainText = plainText.replace(/^[-*_]{3,}\s*$/gm, '');

  return plainText.trim();
};
