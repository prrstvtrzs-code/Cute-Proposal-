import { ProposalConfig } from '../types';

export const downloadProposalCardImage = (
  config: ProposalConfig,
  stage: 'proposal' | 'celebration' = 'proposal',
  extra?: { sliderValue?: number; isInfinity?: boolean }
) => {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 900;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background gradient: Soft romantic blush
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#FFF5F7');
  bgGrad.addColorStop(0.5, '#FFE4E6');
  bgGrad.addColorStop(1, '#FECDD3');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer decorative border
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#F43F5E';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, width - 90, height - 90);

  // Inner white parchment card
  const cardX = 70;
  const cardY = 70;
  const cardW = width - 140;
  const cardH = height - 140;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowColor = 'rgba(244, 63, 94, 0.2)';
  ctx.shadowBlur = 30;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.shadowBlur = 0; // reset

  // Corner decorative flourishes
  ctx.fillStyle = '#FB7185';
  ctx.font = '36px serif';
  ctx.fillText('❦', cardX + 25, cardY + 50);
  ctx.fillText('❧', cardX + cardW - 60, cardY + 50);
  ctx.fillText('❧', cardX + 25, cardY + cardH - 25);
  ctx.fillText('❦', cardX + cardW - 60, cardY + cardH - 25);

  // Function to draw heart
  const drawHeart = (x: number, y: number, size: number, color = '#E11D48') => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    // bottom left curve
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size * 0.8, 0, size);
    // bottom right curve
    ctx.bezierCurveTo(0, size * 0.8, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    // top right curve
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };

  // Top header ornament
  drawHeart(width / 2, 110, 32, '#E11D48');

  // Romantic subtitle / Salutation
  ctx.fillStyle = '#E11D48';
  ctx.font = 'bold 38px "Brush Script MT", "Caveat", "Dancing Script", cursive, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`To My Dearest ${config.partnerName || 'Love of My Life'} ♡`, width / 2, 200);

  // Big headline
  const headline =
    stage === 'celebration'
      ? 'FOREVER LOVERS & PROPOSAL ACCEPTED! 💍'
      : config.proposalType === 'marry'
      ? 'Will You Be Mine Forever?'
      : config.proposalType === 'girlfriend'
      ? 'Will You Be My Girlfriend?'
      : 'Will You Be Mine Forever?';

  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 52px "Playfair Display", Georgia, serif';
  ctx.fillText(headline, width / 2, 280);

  // Divider with cute heart
  ctx.strokeStyle = '#FDA4AF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 315);
  ctx.lineTo(width / 2 - 40, 315);
  ctx.moveTo(width / 2 + 40, 315);
  ctx.lineTo(width / 2 + 250, 315);
  ctx.stroke();
  drawHeart(width / 2, 305, 20, '#F43F5E');

  // Custom Message wrap
  ctx.fillStyle = '#475569';
  ctx.font = 'italic 26px Georgia, serif';
  const customText =
    config.customMessage ||
    "Every single moment with you is my favorite memory, and I never want this journey to end. You make my world infinitely brighter. Will you be mine forever? 💖✨";

  // Simple multi-line wrap
  const words = customText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const maxWidth = cardW - 140;

  for (const w of words) {
    const testLine = currentLine ? `${currentLine} ${w}` : w;
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  let textY = 380;
  for (const line of lines.slice(0, 4)) {
    ctx.fillText(line, width / 2, textY);
    textY += 40;
  }

  // Acceptance Status or Proposed Box
  ctx.fillStyle = '#FFF1F2';
  ctx.strokeStyle = '#FECDD3';
  ctx.lineWidth = 2;
  const boxY = 560;
  ctx.beginPath();
  ctx.roundRect(width / 2 - 340, boxY, 680, 110, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#9F1239';
  ctx.font = 'bold 24px sans-serif';
  const answerText =
    stage === 'celebration'
      ? `STATUS: 100% OFFICIALLY ACCEPTED WITH ENDLESS DEVOTION! 💖`
      : `SHE SAID YES! PROPOSAL COMPLETED WITH ENDLESS LOVE ✨`;
  ctx.fillText(answerText, width / 2, boxY + 45);

  const loveLevelText = extra?.isInfinity
    ? 'Love Level: ∞ INFINITY%'
    : extra?.sliderValue
    ? `Registered Love Level: ${extra.sliderValue}%`
    : `Sealed by: ${config.proposerName || 'Your Love'}`;

  ctx.fillStyle = '#BE123C';
  ctx.font = '20px sans-serif';
  ctx.fillText(loveLevelText, width / 2, boxY + 80);

  // Official Wax Seal Stamp on the corner
  const sealX = width / 2 + 250;
  const sealY = 740;
  ctx.fillStyle = '#BE123C';
  ctx.beginPath();
  ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9F1239';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('SEALED WITH', sealX, sealY - 14);
  ctx.fillText('💋', sealX, sealY + 5);
  ctx.fillText('ETERNAL LOVE', sealX, sealY + 22);

  // Proposer Signature & Date on the left
  ctx.fillStyle = '#334155';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Presented by: ${config.proposerName || 'Your Forever Partner'}`, width / 2 - 320, 725);
  ctx.fillText(`Cherished for: ${config.partnerName || 'My Forever Love'}`, width / 2 - 320, 755);
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  ctx.font = 'italic 16px serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`Commemorated on ${dateStr}`, width / 2 - 320, 785);

  // Trigger download as PNG file
  const link = document.createElement('a');
  link.download = `${(config.partnerName || 'Forever-Love')
    .toLowerCase()
    .replace(/\s+/g, '-')}-proposal-keepsake.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
