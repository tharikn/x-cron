import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const themes = [
  { id: 'swiggy-orange', label: '01 Swiggy', title: '01 · Swiggy Orange', inspired: 'Swiggy', note: 'Bold orange CTAs on clean white — food-delivery energy for jobs.', primary: '#FC8019', hover: '#e56f0d', bg: '#ffffff', surface: '#ffffff', ink: '#1c1c1c', muted: '#686b78', wash: '#fff4eb', line: '#ffe3cc', accent: '#fc8019', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '12px', dark: 0 },
  { id: 'zomato-red', label: '02 Zomato', title: '02 · Zomato Red', inspired: 'Zomato', note: 'Confident red primary with soft gray UI chrome.', primary: '#E23744', hover: '#c81e2b', bg: '#f8f8f8', surface: '#ffffff', ink: '#1c1c1c', muted: '#696969', wash: '#fff1f2', line: '#f1d5d7', accent: '#e23744', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '14px', dark: 0 },
  { id: 'blinkit-yellow', label: '03 Blinkit', title: '03 · Blinkit Yellow', inspired: 'Blinkit', note: 'High-energy yellow actions on near-black type.', primary: '#F8C301', hover: '#e0b000', bg: '#ffffff', surface: '#ffffff', ink: '#1f1f1f', muted: '#6b6b6b', wash: '#fff8d9', line: '#f3e7a8', accent: '#0d0d0d', on: '#111', display: 'Outfit', body: 'Manrope', radius: '12px', dark: 0 },
  { id: 'zepto-violet', label: '04 Zepto', title: '04 · Zepto Violet', inspired: 'Zepto', note: 'Fast-commerce violet with dark accents.', primary: '#7C3AED', hover: '#6d28d9', bg: '#faf7ff', surface: '#ffffff', ink: '#1e1235', muted: '#6b6280', wash: '#f3e8ff', line: '#e9d5ff', accent: '#a78bfa', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '16px', dark: 0 },
  { id: 'phonepe-purple', label: '05 PhonePe', title: '05 · PhonePe Purple', inspired: 'PhonePe', note: 'Dense fintech purple — trusted payment-app feel.', primary: '#5F259F', hover: '#4c1d7a', bg: '#f7f2fc', surface: '#ffffff', ink: '#1a102b', muted: '#6b5f7a', wash: '#efe5f8', line: '#ddd0ea', accent: '#5f259f', on: '#fff', display: 'Manrope', body: 'Manrope', radius: '12px', dark: 0 },
  { id: 'gpay-blue', label: '06 GPay', title: '06 · Google Pay Blue', inspired: 'Google Pay', note: 'Soft Google blue, airy and people-first.', primary: '#1A73E8', hover: '#1557b0', bg: '#f8fbff', surface: '#ffffff', ink: '#202124', muted: '#5f6368', wash: '#e8f0fe', line: '#d2e3fc', accent: '#34a853', on: '#fff', display: 'Outfit', body: 'IBM Plex Sans', radius: '999px', dark: 0 },
  { id: 'paytm-blue', label: '07 Paytm', title: '07 · Paytm Blue', inspired: 'Paytm', note: 'Mall-of-services blue with bright CTAs.', primary: '#00BAF2', hover: '#0099c7', bg: '#f2fbff', surface: '#ffffff', ink: '#002970', muted: '#5a6b85', wash: '#e0f6ff', line: '#bfe9fb', accent: '#002970', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '10px', dark: 0 },
  { id: 'cred-dark', label: '08 CRED', title: '08 · CRED Dark Gold', inspired: 'CRED', note: 'Black luxury canvas with gold CTA — premium club feel.', primary: '#D4AF37', hover: '#b8942b', bg: '#0a0a0a', surface: '#161616', ink: '#f5f5f5', muted: '#a3a3a3', wash: '#1f1f1f', line: '#2a2a2a', accent: '#d4af37', on: '#111', display: 'Libre Baskerville', body: 'Manrope', radius: '12px', dark: 1 },
  { id: 'groww-green', label: '09 Groww', title: '09 · Groww Green', inspired: 'Groww', note: 'Simple investing green — calm money trust.', primary: '#00B386', hover: '#00956f', bg: '#f7fffb', surface: '#ffffff', ink: '#14453c', muted: '#5c736c', wash: '#e6f8f2', line: '#c9eee1', accent: '#00b386', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'zerodha-blue', label: '10 Zerodha', title: '10 · Zerodha Blue', inspired: 'Zerodha', note: 'Clean trading blue, precise and serious.', primary: '#387ED1', hover: '#2f6bb3', bg: '#f7faff', surface: '#ffffff', ink: '#1a1a1a', muted: '#666666', wash: '#eaf2fc', line: '#d5e4f7', accent: '#387ed1', on: '#fff', display: 'IBM Plex Sans', body: 'IBM Plex Sans', radius: '6px', dark: 0 },
  { id: 'linkedin-blue', label: '11 LinkedIn', title: '11 · LinkedIn Blue', inspired: 'LinkedIn', note: 'Professional career blue — network trust.', primary: '#0A66C2', hover: '#004182', bg: '#f3f6f8', surface: '#ffffff', ink: '#191919', muted: '#666666', wash: '#e8f1fa', line: '#d0dce8', accent: '#0a66c2', on: '#fff', display: 'Source Serif 4', body: 'IBM Plex Sans', radius: '10px', dark: 0 },
  { id: 'naukri-blue', label: '12 Naukri', title: '12 · Naukri Blue', inspired: 'Naukri', note: 'Classic India job-board blue.', primary: '#4A90E2', hover: '#357abd', bg: '#f5f8fc', surface: '#ffffff', ink: '#2d2d2d', muted: '#6a6a6a', wash: '#e9f1fb', line: '#d5e4f5', accent: '#f39c12', on: '#fff', display: 'Manrope', body: 'Figtree', radius: '8px', dark: 0 },
  { id: 'internshala-blue', label: '13 Internshala', title: '13 · Internshala Blue', inspired: 'Internshala', note: 'Student-career blue, friendly and clear.', primary: '#008BDC', hover: '#0070b0', bg: '#f4fbff', surface: '#ffffff', ink: '#333333', muted: '#666666', wash: '#e5f5ff', line: '#cfe9fa', accent: '#00a5ec', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '10px', dark: 0 },
  { id: 'indeed-indigo', label: '14 Indeed', title: '14 · Indeed Indigo', inspired: 'Indeed', note: 'Global job-search indigo with soft surfaces.', primary: '#2557A7', hover: '#1d4285', bg: '#f5f8fc', surface: '#ffffff', ink: '#2d2d2d', muted: '#595959', wash: '#e8eef8', line: '#d3dceb', accent: '#2557a7', on: '#fff', display: 'IBM Plex Sans', body: 'IBM Plex Sans', radius: '8px', dark: 0 },
  { id: 'whatsapp-green', label: '15 WhatsApp', title: '15 · WhatsApp Green', inspired: 'WhatsApp', note: 'Familiar chat green — approachable messaging feel.', primary: '#25D366', hover: '#1ebe57', bg: '#eefbf3', surface: '#ffffff', ink: '#111b21', muted: '#667781', wash: '#dcf8c6', line: '#c6e9d2', accent: '#128c7e', on: '#fff', display: 'Manrope', body: 'Figtree', radius: '14px', dark: 0 },
  { id: 'telegram-blue', label: '16 Telegram', title: '16 · Telegram Blue', inspired: 'Telegram', note: 'Sky messenger blue, light and fast.', primary: '#2AABEE', hover: '#229ed9', bg: '#f3faff', surface: '#ffffff', ink: '#182533', muted: '#707579', wash: '#e3f4fc', line: '#cbe8f7', accent: '#2aabee', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '14px', dark: 0 },
  { id: 'instagram-pink', label: '17 Instagram', title: '17 · Instagram Pink', inspired: 'Instagram', note: 'Warm social pink accent on light UI.', primary: '#E1306C', hover: '#c13584', bg: '#fffafc', surface: '#ffffff', ink: '#262626', muted: '#8e8e8e', wash: '#ffe4ec', line: '#f8d0dc', accent: '#f77737', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'youtube-red', label: '18 YouTube', title: '18 · YouTube Red', inspired: 'YouTube', note: 'Media red on white — content-first clarity.', primary: '#FF0000', hover: '#cc0000', bg: '#f9f9f9', surface: '#ffffff', ink: '#0f0f0f', muted: '#606060', wash: '#ffe5e5', line: '#f0d0d0', accent: '#ff0000', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '10px', dark: 0 },
  { id: 'spotify-green', label: '19 Spotify', title: '19 · Spotify Green Dark', inspired: 'Spotify', note: 'Dark entertainment canvas with neon green.', primary: '#1DB954', hover: '#1aa34a', bg: '#121212', surface: '#181818', ink: '#ffffff', muted: '#b3b3b3', wash: '#282828', line: '#333333', accent: '#1db954', on: '#111', display: 'Outfit', body: 'Manrope', radius: '999px', dark: 1 },
  { id: 'netflix-dark', label: '20 Netflix', title: '20 · Netflix Dark Red', inspired: 'Netflix', note: 'Cinematic black with scarlet CTA.', primary: '#E50914', hover: '#b20710', bg: '#141414', surface: '#1f1f1f', ink: '#ffffff', muted: '#b3b3b3', wash: '#2a2a2a', line: '#333333', accent: '#e50914', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '4px', dark: 1 },
  { id: 'amazon-orange', label: '21 Amazon', title: '21 · Amazon Orange', inspired: 'Amazon', note: 'Retail orange on warm light gray.', primary: '#FF9900', hover: '#e68a00', bg: '#eaeded', surface: '#ffffff', ink: '#0f1111', muted: '#565959', wash: '#fff3df', line: '#d5dbdb', accent: '#ff9900', on: '#111', display: 'IBM Plex Sans', body: 'IBM Plex Sans', radius: '8px', dark: 0 },
  { id: 'flipkart-blue', label: '22 Flipkart', title: '22 · Flipkart Blue', inspired: 'Flipkart', note: 'India commerce blue + yellow accent chip feel.', primary: '#2874F0', hover: '#1d5bbf', bg: '#f1f3f6', surface: '#ffffff', ink: '#212121', muted: '#878787', wash: '#e8f0fe', line: '#d0dceb', accent: '#ffe500', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '4px', dark: 0 },
  { id: 'meesho-pink', label: '23 Meesho', title: '23 · Meesho Pink', inspired: 'Meesho', note: 'Commerce pink — social shopping energy.', primary: '#9F2089', hover: '#7d196c', bg: '#fff5fb', surface: '#ffffff', ink: '#2d0a27', muted: '#7a5672', wash: '#fce7f6', line: '#f5d0ea', accent: '#9f2089', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'myntra-rose', label: '24 Myntra', title: '24 · Myntra Rose', inspired: 'Myntra', note: 'Fashion rose on soft ivory.', primary: '#FF3F6C', hover: '#e63660', bg: '#fff7f9', surface: '#ffffff', ink: '#282c3f', muted: '#696b79', wash: '#ffe5ec', line: '#ffd0db', accent: '#ff3f6c', on: '#fff', display: 'Fraunces', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'nykaa-pink', label: '25 Nykaa', title: '25 · Nykaa Pink', inspired: 'Nykaa', note: 'Beauty-brand pink, polished and soft.', primary: '#FC2779', hover: '#e01f69', bg: '#fff5f9', surface: '#ffffff', ink: '#3b1224', muted: '#7a5564', wash: '#ffe0ec', line: '#fbcfe0', accent: '#fc2779', on: '#fff', display: 'Newsreader', body: 'Manrope', radius: '14px', dark: 0 },
  { id: 'ajio-gold', label: '26 Ajio', title: '26 · Ajio Black Gold', inspired: 'Ajio', note: 'Fashion black with gold accents.', primary: '#C9A227', hover: '#b08d20', bg: '#111111', surface: '#1a1a1a', ink: '#f5f5f5', muted: '#a8a8a8', wash: '#242424', line: '#333333', accent: '#c9a227', on: '#111', display: 'Libre Baskerville', body: 'Manrope', radius: '0px', dark: 1 },
  { id: 'airbnb-coral', label: '27 Airbnb', title: '27 · Airbnb Coral', inspired: 'Airbnb', note: 'Travel coral on soft white.', primary: '#FF385C', hover: '#e31c5f', bg: '#ffffff', surface: '#ffffff', ink: '#222222', muted: '#717171', wash: '#fff0f3', line: '#dddddd', accent: '#ff385c', on: '#fff', display: 'Fraunces', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'booking-blue', label: '28 Booking', title: '28 · Booking Blue', inspired: 'Booking.com', note: 'Travel booking blue — clear and global.', primary: '#003580', hover: '#00224f', bg: '#f2f6fc', surface: '#ffffff', ink: '#1a1a1a', muted: '#595959', wash: '#e6eef8', line: '#cdd9ea', accent: '#003580', on: '#fff', display: 'IBM Plex Sans', body: 'IBM Plex Sans', radius: '8px', dark: 0 },
  { id: 'makemytrip-red', label: '29 MakeMyTrip', title: '29 · MakeMyTrip', inspired: 'MakeMyTrip', note: 'India travel red energy.', primary: '#E21B22', hover: '#c1161c', bg: '#fff6f6', surface: '#ffffff', ink: '#0a0a0a', muted: '#666666', wash: '#ffe5e6', line: '#f7c9cb', accent: '#1a73e8', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '10px', dark: 0 },
  { id: 'uber-black', label: '30 Uber', title: '30 · Uber Black', inspired: 'Uber', note: 'Mobility black with green success cue.', primary: '#000000', hover: '#222222', bg: '#f6f6f6', surface: '#ffffff', ink: '#000000', muted: '#5e5e5e', wash: '#eeeeee', line: '#e2e2e2', accent: '#06C167', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '8px', dark: 0 },
  { id: 'ola-mustard', label: '31 Ola', title: '31 · Ola Mustard', inspired: 'Ola', note: 'India ride mustard yellow on dark type.', primary: '#000000', hover: '#222222', bg: '#fffbeb', surface: '#ffffff', ink: '#111111', muted: '#6b6b6b', wash: '#fef3c7', line: '#fde68a', accent: '#C4A000', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'rapido-yellow', label: '32 Rapido', title: '32 · Rapido Yellow', inspired: 'Rapido', note: 'Bike-taxi yellow — quick and street-smart.', primary: '#F9C80E', hover: '#e0b400', bg: '#fffdf0', surface: '#ffffff', ink: '#1a1a1a', muted: '#666666', wash: '#fff7cc', line: '#f5e7a0', accent: '#111111', on: '#111', display: 'Outfit', body: 'Manrope', radius: '12px', dark: 0 },
  { id: 'truecaller-teal', label: '33 Truecaller', title: '33 · Truecaller Teal', inspired: 'Truecaller', note: 'Utility teal — identity and trust.', primary: '#00857C', hover: '#006b64', bg: '#f2fbfa', surface: '#ffffff', ink: '#102a27', muted: '#5f7471', wash: '#d9f3f0', line: '#bfe6e1', accent: '#00857c', on: '#fff', display: 'Manrope', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'snapchat-yellow', label: '34 Snapchat', title: '34 · Snapchat Yellow', inspired: 'Snapchat', note: 'Bright social yellow on dark canvas.', primary: '#FFFC00', hover: '#e6e300', bg: '#111111', surface: '#1a1a1a', ink: '#ffffff', muted: '#bdbdbd', wash: '#2a2a2a', line: '#333333', accent: '#fffc00', on: '#111', display: 'Outfit', body: 'Manrope', radius: '999px', dark: 1 },
  { id: 'pinterest-red', label: '35 Pinterest', title: '35 · Pinterest Red', inspired: 'Pinterest', note: 'Discovery red on soft cream boards.', primary: '#E60023', hover: '#ad081b', bg: '#fff8f8', surface: '#ffffff', ink: '#111111', muted: '#767676', wash: '#ffe5ea', line: '#f5cdd3', accent: '#e60023', on: '#fff', display: 'Fraunces', body: 'Figtree', radius: '16px', dark: 0 },
  { id: 'duolingo-green', label: '36 Duolingo', title: '36 · Duolingo Green', inspired: 'Duolingo', note: 'Learning green — playful and motivating.', primary: '#58CC02', hover: '#49a802', bg: '#f7fff0', surface: '#ffffff', ink: '#3c3c3c', muted: '#777777', wash: '#e5f9d4', line: '#cdeeb0', accent: '#58cc02', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '16px', dark: 0 },
  { id: 'canva-purple', label: '37 Canva', title: '37 · Canva Soft Purple', inspired: 'Canva', note: 'Creative soft purple, friendly tools feel.', primary: '#8B3DFF', hover: '#7a2fe0', bg: '#faf7ff', surface: '#ffffff', ink: '#0e0e10', muted: '#6b6b76', wash: '#f1e8ff', line: '#e4d4ff', accent: '#00c4cc', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'notion-minimal', label: '38 Notion', title: '38 · Notion Minimal', inspired: 'Notion', note: 'Minimal black/white workspace calm.', primary: '#111111', hover: '#333333', bg: '#ffffff', surface: '#ffffff', ink: '#37352f', muted: '#787774', wash: '#f7f6f3', line: '#e9e9e7', accent: '#2383e2', on: '#fff', display: 'IBM Plex Sans', body: 'IBM Plex Sans', radius: '6px', dark: 0 },
  { id: 'slack-aubergine', label: '39 Slack', title: '39 · Slack Aubergine', inspired: 'Slack', note: 'Work chat aubergine with soft pastel wash.', primary: '#611F69', hover: '#4a154b', bg: '#f9f5fa', surface: '#ffffff', ink: '#1d1c1d', muted: '#616061', wash: '#f4eaf5', line: '#e6d5e8', accent: '#2bac76', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '10px', dark: 0 },
  { id: 'discord-blurple', label: '40 Discord', title: '40 · Discord Blurple', inspired: 'Discord', note: 'Community blurple on soft surfaces.', primary: '#5865F2', hover: '#4752c4', bg: '#f2f3ff', surface: '#ffffff', ink: '#2e3338', muted: '#6b7280', wash: '#e8eaff', line: '#d5d8fb', accent: '#5865f2', on: '#fff', display: 'Outfit', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'hotstar-blue', label: '41 Hotstar', title: '41 · JioHotstar Blue', inspired: 'JioHotstar', note: 'Streaming deep blue entertainment.', primary: '#1B6EF3', hover: '#1457c4', bg: '#0a1628', surface: '#12203a', ink: '#ffffff', muted: '#a8b3c7', wash: '#1a2b4a', line: '#243859', accent: '#1b6ef3', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '10px', dark: 1 },
  { id: 'jiocinema-pink', label: '42 JioCinema', title: '42 · JioCinema Pink', inspired: 'JioCinema', note: 'Dark cinema pink accent.', primary: '#D91A72', hover: '#b0155d', bg: '#0d0d0d', surface: '#171717', ink: '#ffffff', muted: '#b0b0b0', wash: '#241018', line: '#332028', accent: '#d91a72', on: '#fff', display: 'Outfit', body: 'Manrope', radius: '10px', dark: 1 },
  { id: 'bigbasket-green', label: '43 BigBasket', title: '43 · BigBasket Green', inspired: 'BigBasket', note: 'Grocery green — household trust.', primary: '#689F38', hover: '#558b2f', bg: '#f6faf1', surface: '#ffffff', ink: '#1b2a10', muted: '#66755a', wash: '#e8f3d9', line: '#d2e4b8', accent: '#689f38', on: '#fff', display: 'Manrope', body: 'Figtree', radius: '10px', dark: 0 },
  { id: 'dunzo-teal', label: '44 Dunzo', title: '44 · Dunzo Teal', inspired: 'Dunzo', note: 'Hyperlocal teal — errands and speed.', primary: '#00D2C8', hover: '#00b8af', bg: '#f2fffe', surface: '#ffffff', ink: '#0b2c2a', muted: '#5d7472', wash: '#d9fffc', line: '#b6f3ef', accent: '#00d2c8', on: '#083b38', display: 'Outfit', body: 'Manrope', radius: '14px', dark: 0 },
  { id: 'shaadi-pink', label: '45 Shaadi', title: '45 · Shaadi Pink', inspired: 'Shaadi.com', note: 'Matrimony pink — warm human connection.', primary: '#D81B60', hover: '#ad1457', bg: '#fff5f8', surface: '#ffffff', ink: '#3e0d1f', muted: '#7a5564', wash: '#fce4ec', line: '#f8bbd0', accent: '#d81b60', on: '#fff', display: 'Newsreader', body: 'Figtree', radius: '12px', dark: 0 },
  { id: 'irctc-blue', label: '46 IRCTC', title: '46 · IRCTC Blue', inspired: 'IRCTC Rail', note: 'Travel utility blue — India rail seriousness.', primary: '#213D77', hover: '#1a3160', bg: '#f3f6fb', surface: '#ffffff', ink: '#1a1a1a', muted: '#5c6778', wash: '#e4ebf6', line: '#c9d5e8', accent: '#f39c12', on: '#fff', display: 'IBM Plex Sans', body: 'IBM Plex Sans', radius: '6px', dark: 0 },
  { id: 'where-train', label: '47 WhereTrain', title: '47 · Where is my Train', inspired: 'Where is my Train', note: 'Utility map teal — transit clarity.', primary: '#00897B', hover: '#00796b', bg: '#f1fafa', surface: '#ffffff', ink: '#102a27', muted: '#5f7471', wash: '#d7f0ec', line: '#b9e0da', accent: '#00897b', on: '#fff', display: 'Manrope', body: 'Figtree', radius: '10px', dark: 0 },
  { id: 'gemini-soft', label: '48 Gemini', title: '48 · Gemini Soft AI', inspired: 'Google Gemini', note: 'Soft AI blue/lilac wash — modern assistant.', primary: '#1A73E8', hover: '#1557b0', bg: '#f7f8ff', surface: '#ffffff', ink: '#1f1f1f', muted: '#5f6368', wash: '#eef0ff', line: '#dde1fb', accent: '#8ab4f8', on: '#fff', display: 'Outfit', body: 'IBM Plex Sans', radius: '16px', dark: 0 },
  { id: 'facebook-blue', label: '49 Facebook', title: '49 · Facebook Blue', inspired: 'Facebook', note: 'Classic social blue — familiar and broad.', primary: '#1877F2', hover: '#0d65d9', bg: '#f0f2f5', surface: '#ffffff', ink: '#050505', muted: '#65676b', wash: '#e7f3ff', line: '#ccd0d5', accent: '#1877f2', on: '#fff', display: 'IBM Plex Sans', body: 'IBM Plex Sans', radius: '10px', dark: 0 },
  { id: 'warm-xcron', label: '50 XCron Warm', title: '50 · X Cron Warm Pro', inspired: 'X Cron proposal', note: 'Our warm professional proposal — cream + terracotta.', primary: '#9A3412', hover: '#7c2d12', bg: '#f7f1ea', surface: '#fffdf9', ink: '#1f1814', muted: '#6f6258', wash: '#f1e7dc', line: '#e8ddd2', accent: '#c2410c', on: '#fffdf9', display: 'Source Serif 4', body: 'IBM Plex Sans', radius: '10px', dark: 0 },
];

const fontMap = {
  Outfit: 'Outfit:wght@500;600;700;800',
  Manrope: 'Manrope:wght@500;600;700;800',
  Figtree: 'Figtree:wght@500;600;700;800',
  'IBM Plex Sans': 'IBM+Plex+Sans:wght@400;600;700',
  Fraunces: 'Fraunces:opsz,wght@9..144,600;9..144,700',
  Newsreader: 'Newsreader:opsz,wght@6..72,600;6..72,700',
  'Libre Baskerville': 'Libre+Baskerville:wght@700',
  'Source Serif 4': 'Source+Serif+4:opsz,wght@8..60,600;8..60,700',
};

const fontSet = new Set();
for (const t of themes) {
  fontSet.add(t.display);
  fontSet.add(t.body);
}
const fontsUrl =
  'https://fonts.googleapis.com/css2?' +
  [...fontSet].map((f) => `family=${fontMap[f]}`).join('&') +
  '&display=swap';

const cssThemes = themes
  .map((t) => {
    const display = t.display.includes(' ') ? `'${t.display}'` : t.display;
    const body = t.body.includes(' ') ? `'${t.body}'` : t.body;
    const r = t.radius;
    const panel = r === '999px' ? '18px' : r === '0px' ? '0' : '14px';
    const card = r === '0px' ? '0' : r === '999px' ? '16px' : '12px';
    const shadow = t.dark ? '0 10px 28px rgba(0,0,0,.35)' : '0 10px 24px rgba(0,0,0,.06)';
    const soft = t.dark ? '0 6px 16px rgba(0,0,0,.25)' : '0 6px 16px rgba(0,0,0,.04)';
    return `[data-theme='${t.id}']{--bg:${t.bg};--surface:${t.surface};--ink:${t.ink};--muted:${t.muted};--wash:${t.wash};--line:${t.line};--line-strong:${t.line};--primary:${t.primary};--primary-hover:${t.hover};--accent:${t.accent};--on-primary:${t.on};--font-display:${display}, system-ui, sans-serif;--font-body:${body}, system-ui, sans-serif;--radius:${r};--panel-radius:${panel};--card-radius:${card};--shadow:${shadow};--shadow-soft:${soft};}`;
  })
  .join('\n');

const themesJson = JSON.stringify(
  themes.map((t) => ({
    id: t.id,
    label: t.label,
    title: t.title,
    inspired: t.inspired,
    note: t.note,
  })),
);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#111111" />
<title>X Cron — 50 Play Store inspired theme review</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${fontsUrl}" rel="stylesheet" />
<style>
:root{--safe-bottom:env(safe-area-inset-bottom,0px);--safe-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:Manrope,system-ui,sans-serif;background:#111;color:#fff;min-height:100dvh}
.chrome{position:sticky;top:0;z-index:40;padding:calc(10px + var(--safe-top)) 12px 10px;background:rgba(17,17,17,.94);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08)}
.chrome h1{margin:0 0 2px;font-size:.95rem;font-weight:800}
.chrome p{margin:0 0 10px;font-size:.72rem;color:rgba(255,255,255,.62);line-height:1.35}
.picker{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.picker::-webkit-scrollbar{display:none}
.picker button{flex:0 0 auto;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:rgba(255,255,255,.85);border-radius:999px;min-height:34px;padding:0 11px;font:inherit;font-size:.72rem;font-weight:700;white-space:nowrap}
.picker button.is-active{background:#fff;color:#111;border-color:#fff}
.stage{padding:14px 12px calc(92px + var(--safe-bottom))}
.phone{width:min(390px,100%);margin:0 auto;border-radius:28px;overflow:hidden;border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 60px rgba(0,0,0,.45);min-height:700px;background:var(--bg);color:var(--ink);font-family:var(--font-body)}
.phone-inner{padding:18px 16px 24px}
.tag{display:inline-block;margin-bottom:10px;padding:.28rem .6rem;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--primary);font-size:.64rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
.inspired{margin:0 0 12px;color:var(--muted);font-size:.78rem;font-weight:700}
.top{display:flex;justify-content:space-between;align-items:center;gap:.75rem;margin-bottom:1rem;padding-bottom:.75rem;border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:baseline;gap:.4rem}
.brand strong{font-family:var(--font-display);font-size:1.28rem;color:var(--primary)}
.brand span{font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:700}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 .9rem;border-radius:var(--radius);border:1px solid var(--primary);background:var(--primary);color:var(--on-primary);font:inherit;font-weight:700;font-size:.86rem}
.btn--ghost{background:var(--surface);color:var(--ink);border-color:var(--line)}
.kicker{margin:0 0 .3rem;color:var(--accent);font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
h2.headline{margin:0 0 .45rem;font-family:var(--font-display);font-size:1.65rem;line-height:1.12;letter-spacing:-.02em;max-width:14ch}
.lead{margin:0 0 .9rem;color:var(--muted);font-size:.92rem;line-height:1.45}
.actions{display:flex;flex-wrap:wrap;gap:.45rem;margin-bottom:.9rem}
.panel{background:var(--surface);border:1px solid var(--line);border-radius:var(--panel-radius);padding:.85rem;margin-bottom:.85rem;box-shadow:var(--shadow)}
.panel h3{margin:0 0 .6rem;font-family:var(--font-display);font-size:1rem}
label{display:grid;gap:.22rem;margin-bottom:.5rem;font-size:.64rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
input{width:100%;border:1px solid var(--line);background:var(--wash);border-radius:8px;padding:.65rem .7rem;font:inherit;color:var(--ink)}
.filters{display:flex;gap:.35rem;overflow-x:auto;margin-bottom:.8rem;scrollbar-width:none}
.filters::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:.4rem .7rem;font:inherit;font-size:.78rem;font-weight:700}
.chip.is-active{border-color:var(--primary);color:var(--primary);background:color-mix(in srgb,var(--primary) 12%,var(--surface))}
.section{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 .6rem}
.section h3{margin:0;font-family:var(--font-display);font-size:1.05rem}
.section span{color:var(--muted);font-size:.78rem;font-weight:700}
.job{display:grid;gap:.35rem;padding:.8rem .85rem;margin-bottom:.5rem;background:var(--surface);border:1px solid var(--line);border-radius:var(--card-radius);box-shadow:var(--shadow-soft)}
.job__top{display:flex;justify-content:space-between;gap:.55rem}
.job h4{margin:0 0 .1rem;font-family:var(--font-display);font-size:.98rem}
.job p{margin:0;color:var(--muted);font-size:.82rem}
.pay{font-weight:800;color:var(--primary);white-space:nowrap;font-size:.88rem}
.meta{display:flex;gap:.28rem;flex-wrap:wrap}
.badge{font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em;padding:.2rem .42rem;border-radius:999px;background:var(--wash);border:1px solid var(--line);color:var(--ink)}
.cta{color:var(--primary);font-weight:800;font-size:.86rem}
.note{margin-top:.75rem;padding:.75rem .8rem;border-radius:12px;background:color-mix(in srgb,var(--primary) 10%,var(--surface));border:1px solid color-mix(in srgb,var(--primary) 28%,var(--line))}
.note strong{display:block;margin-bottom:.18rem;font-family:var(--font-display);color:var(--primary)}
.note p{margin:0;color:var(--muted);font-size:.82rem;line-height:1.4}
.dock{position:fixed;left:0;right:0;bottom:0;z-index:50;padding:10px 12px calc(12px + var(--safe-bottom));background:rgba(17,17,17,.95);border-top:1px solid rgba(255,255,255,.08);display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center}
.dock .name{font-size:.78rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dock button{border:0;border-radius:999px;min-height:40px;padding:0 14px;font:inherit;font-weight:800;font-size:.78rem;background:rgba(255,255,255,.1);color:#fff}
.hint{text-align:center;color:rgba(255,255,255,.42);font-size:.7rem;margin:8px 0 0}
${cssThemes}
</style>
</head>
<body>
<header class="chrome">
  <h1>X Cron · 50 Play Store style themes</h1>
  <p>Inspired by top apps (not affiliated). Swipe preview or use Prev/Next. Share this one HTML file.</p>
  <div class="picker" id="picker"></div>
</header>
<main class="stage">
  <div class="phone" id="phone" data-theme="swiggy-orange">
    <div class="phone-inner">
      <span class="tag" id="themeTag">01 · Swiggy Orange</span>
      <p class="inspired" id="inspired">Inspired by: Swiggy</p>
      <div class="top"><div class="brand"><strong>X Cron</strong><span>Jobs</span></div><button class="btn btn--ghost" type="button">Sign in</button></div>
      <p class="kicker">Local · Clear · Trusted</p>
      <h2 class="headline">Find local work with confidence</h2>
      <p class="lead">Browse roles freely. Pay and location stay clear. Contact unlocks only when you’re ready.</p>
      <div class="actions"><button class="btn" type="button">Search roles</button><button class="btn btn--ghost" type="button">Clear</button></div>
      <form class="panel" onsubmit="return false"><h3>Quick search</h3><label>Role<input value="Warehouse helper" readonly /></label><label>Location<input value="Palani" readonly /></label><button class="btn" type="button" style="width:100%">Find jobs</button></form>
      <div class="filters"><span class="chip is-active">Nearby</span><span class="chip">Full-time</span><span class="chip">Part-time</span><span class="chip">Daily wage</span></div>
      <div class="section"><h3>Open roles</h3><span>128 near</span></div>
      <article class="job"><div class="job__top"><div><h4>Warehouse helper</h4><p>Sunrise Logistics · Palani</p></div><div class="pay">₹16k–18k</div></div><div class="meta"><span class="badge">Full-time</span><span class="badge">Verified</span></div><div class="cta">View role →</div></article>
      <article class="job"><div class="job__top"><div><h4>Cafe cashier</h4><p>Bean Street · Dindigul</p></div><div class="pay">₹12k</div></div><div class="meta"><span class="badge">Part-time</span></div><div class="cta">View role →</div></article>
      <div class="note"><strong>Client note</strong><p id="themeNote">Bold orange CTAs on clean white — food-delivery energy for jobs.</p></div>
    </div>
  </div>
  <p class="hint">Send this file on WhatsApp/Drive · open in Chrome/Safari on phone</p>
</main>
<footer class="dock"><div class="name" id="dockName">01 · Swiggy Orange</div><button id="prevBtn" type="button">Prev</button><button id="nextBtn" type="button">Next</button></footer>
<script>
const themes = ${themesJson};
const phone=document.getElementById('phone');
const picker=document.getElementById('picker');
const themeTag=document.getElementById('themeTag');
const inspired=document.getElementById('inspired');
const themeNote=document.getElementById('themeNote');
const dockName=document.getElementById('dockName');
let index=0;
themes.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.textContent=t.label;b.addEventListener('click',()=>apply(i));picker.appendChild(b);});
function apply(i){index=(i+themes.length)%themes.length;const t=themes[index];phone.dataset.theme=t.id;themeTag.textContent=t.title;inspired.textContent='Inspired by: '+t.inspired;themeNote.textContent=t.note;dockName.textContent=t.title;[...picker.children].forEach((btn,bi)=>btn.classList.toggle('is-active',bi===index));picker.children[index]?.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});}
document.getElementById('prevBtn').onclick=()=>apply(index-1);
document.getElementById('nextBtn').onclick=()=>apply(index+1);
let startX=0;phone.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});
phone.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)<48)return;apply(index+(dx<0?1:-1))},{passive:true});
apply(0);
</script>
</body>
</html>`;

const out1 = path.join(__dirname, 'xcron-50-playstore-themes-review.html');
const out2 = path.join(__dirname, '..', 'xcron-50-playstore-themes-review.html');
fs.writeFileSync(out1, html);
fs.writeFileSync(out2, html);
console.log(`Wrote ${themes.length} themes -> ${out1}`);
