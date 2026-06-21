const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");
const calculateLevelXP = require("./calculateLevelXP");

async function generateRankCard({
	user,
	levelData,
	rank,
}) {
	const width = 900;
	const height = 280;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// sets the background
	const bgGradient = ctx.createLinearGradient(0, 0, width, height);
	bgGradient.addColorStop(0, "#1e1e2f");
	bgGradient.addColorStop(1, "#12121c");
	ctx.fillStyle = bgGradient;
	ctx.fillRect(0, 0, width, height);

	// card container
	ctx.fillStyle = "rgba(255,255,255,0.06)";
	roundRect(ctx, 20, 20, width - 40, height - 40, 20);
	ctx.fill();

	// creating the image avatar from the URL discord
	const avatar = await loadImage(user.displayAvatarURL({ extension: "png", size: 256 }));

	const avatarSize = 140;
	const avatarX = 50;
	const avatarY = 70;

	// circle clip
	ctx.save();
	ctx.beginPath();
	ctx.arc(
		avatarX + avatarSize / 2,
		avatarY + avatarSize / 2,
		avatarSize / 2,
		0,
		Math.PI * 2
	);
	ctx.closePath();
	ctx.clip();

	ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
	ctx.restore();

	// sets the username
	ctx.fillStyle = "#ffffff";
	ctx.font = "28px RobotoBold";
	ctx.fillText(user.username, 220, 90);

	// level and rank
	ctx.font = "22px Roboto";
	ctx.fillStyle = "#cfcfcf";

	ctx.fillText(`Level: ${levelData.level}`, 220, 130);
	ctx.fillText(`Rank: #${rank}`, 340, 130);

	// XP values
	const currentXP = levelData.xp;
	const requiredXP = calculateLevelXP(levelData.level);

	ctx.fillText(`${currentXP} XP / ${requiredXP} XP`, 220, 170);

	// progress bar background
	const barX = 220;
	const barY = 200;
	const barWidth = 600;
	const barHeight = 25;

	roundRect(ctx, barX, barY, barWidth, barHeight, 10);
	ctx.fillStyle = "#2c2f3a";
	ctx.fill();

	// progress fill
	const progress = Math.min(currentXP / requiredXP, 1);

	roundRect(ctx, barX, barY, barWidth * progress, barHeight, 10);
	ctx.fillStyle = "#FFC300";
	ctx.fill();

	return canvas.encode("png");
}

// helper
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}

module.exports = generateRankCard;
