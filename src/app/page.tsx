'use client';
import React, { useState, useEffect, useRef } from 'react';
import capitalsData from '../data/world-capitals.json';

// Helper: Haversine formula to calculate distance between two lat/lon points (in km)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const toRad = (d: number) => (d * Math.PI) / 180;
	const R = 6371; // Radius of Earth in km
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) *
			Math.cos(toRad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round(R * c);
}

// Normalize strings for comparison
function normalize(str: string) {
	return str.trim().toLowerCase();
}

type Capital = (typeof capitalsData)[number];

type Guess = {
	guess: string;
	distance: number | null;
	correct: boolean;
};

function pickRandomCapital(): Capital {
	// Only pick capitals with valid coordinates and country names
	const valid = capitalsData.filter(
		(c) => c.capital && c.countryName && c.latitude && c.longitude && c.capital !== 'N/A'
	);
	return valid[Math.floor(Math.random() * valid.length)];
}

import famousFor from '../data/famous-for.json';

function getCountryFamousFor(country: string): string {
	return (
		(famousFor as Record<string, string>)[country] ||
		'Famous landmarks, food, culture, and history.'
	);
}

function ShowMapButton({ target }: { target: Capital }) {
	const [show, setShow] = useState(false);
	if (!target) return null;
	const lat = target.latitude ? parseFloat(target.latitude) : 0;
	const lon = target.longitude ? parseFloat(target.longitude) : 0;
	const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 1}%2C${
		lat - 1
	}%2C${lon + 1}%2C${lat + 1}&layer=mapnik&marker=${lat}%2C${lon}`;
	return (
		<div style={{ marginTop: 18 }}>
			{!show ? (
				<button
					onClick={() => setShow(true)}
					style={{
						marginTop: 12,
						padding: '8px 16px',
						fontSize: 16,
						background: '#fff',
						border: '1.5px solid #bb2222',
						color: '#bb2222',
						borderRadius: 6,
						cursor: 'pointer',
						fontWeight: 500,
						display: 'flex',
						alignItems: 'center',
						gap: 8,
					}}
				>
					<svg
						width='18'
						height='18'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#bb2222'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path d='M12 2v20M12 22l-4-4m4 4l4-4' />
					</svg>
					Show Answer on Map
				</button>
			) : (
				<div style={{ marginTop: 12 }}>
					<div style={{ fontSize: 16, marginBottom: 8 }}>
						<b>{target.capital}</b> is in <b>{target.countryName}</b>
					</div>
					<div
						style={{
							border: '2px solid #bb2222',
							borderRadius: 8,
							overflow: 'hidden',
							maxWidth: 400,
						}}
					>
						<iframe
							title='Map'
							width='100%'
							height='260'
							src={mapUrl}
							style={{ border: 'none', display: 'block' }}
							loading='lazy'
						></iframe>
					</div>
					<div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
						<a
							href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=6/${lat}/${lon}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							View interactive map ↗
						</a>
					</div>
				</div>
			)}
		</div>
	);
}

export default function Home() {
	// --- Autocomplete state ---
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [highlighted, setHighlighted] = useState(-1);

	// List of all country names for autocomplete
	const countryNames = React.useMemo(
		() => capitalsData.map((c) => c.countryName).sort(),
		[]
	);

	const [target, setTarget] = useState<Capital | null>(null);
	const [guesses, setGuesses] = useState<Guess[]>([]);
	const [input, setInput] = useState('');
	const [gameOver, setGameOver] = useState(false);
	const [win, setWin] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Build a map for fast lookup
	const countryMap = React.useMemo(() => {
		const map = new Map<string, Capital>();
		capitalsData.forEach((c) => {
			map.set(normalize(c.countryName), c);
		});
		return map;
	}, []);

	// Start or restart the game
	const startGame = () => {
		setTarget(pickRandomCapital());
		setGuesses([]);
		setInput('');
		setGameOver(false);
		setWin(false);
		setTimeout(() => inputRef.current?.focus(), 100);
	};

	useEffect(() => {
		startGame();
		// eslint-disable-next-line
	}, []);

	// Update suggestions as user types
	useEffect(() => {
		if (input.trim()) {
			const val = normalize(input);
			setSuggestions(
				countryNames.filter((name) => normalize(name).includes(val)).slice(0, 10)
			);
		} else {
			setSuggestions([]);
		}
	}, [input, countryNames]);

	const handleGuess = (e: React.FormEvent) => {
		e.preventDefault();
		if (!target || gameOver) return;
		const userGuess = input.trim();
		if (!userGuess) return;
		const guessNorm = normalize(userGuess);
		const correctNorm = normalize(target.countryName);
		let correct = false;
		let distance = null;
		if (guessNorm === correctNorm) {
			correct = true;
			distance = 0;
		} else if (countryMap.has(guessNorm)) {
			const guessedCountry = countryMap.get(guessNorm)!;
			distance = getDistanceKm(
				parseFloat(target.latitude),
				target.longitude ? parseFloat(target.longitude) : 0,
				parseFloat(guessedCountry.latitude),
				guessedCountry.longitude ? parseFloat(guessedCountry.longitude) : 0
			);
		}
		const newGuess: Guess = { guess: userGuess, distance, correct };
		const updatedGuesses = [...guesses, newGuess];
		setGuesses(updatedGuesses);
		setInput('');
		setShowSuggestions(false);
		setHighlighted(-1);
		if (correct) {
			setWin(true);
			setGameOver(true);
		} else if (updatedGuesses.length >= 5) {
			setGameOver(true);
		}
		setTimeout(() => inputRef.current?.focus(), 100);
	};

	return (
		<main
			style={{
				maxWidth: 500,
				margin: '40px auto',
				padding: 24,
				fontFamily: 'sans-serif',
			}}
		>
			<h1>Capital Game</h1>
			{target && (
				<>
					<p style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
						What country has the capital city{' '}
						<b style={{ color: '#0070f3' }}>{target.capital}</b>?
						{/* Hint1 button with tooltip */}
						<span style={{ position: 'relative', display: 'inline-block' }}>
							{/* Hint1: Continent */}
							<button
								type='button'
								aria-label='Show continent hint'
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									padding: 0,
									display: 'inline-flex',
									alignItems: 'center',
								}}
								onMouseEnter={(e) => {
									const tooltip = e.currentTarget.nextSibling as HTMLElement;
									if (tooltip) tooltip.style.opacity = '1';
								}}
								onMouseLeave={(e) => {
									const tooltip = e.currentTarget.nextSibling as HTMLElement;
									if (tooltip) tooltip.style.opacity = '0';
								}}
							>
								<svg
									width='18'
									height='18'
									viewBox='0 0 20 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<circle
										cx='10'
										cy='10'
										r='10'
										fill='#f3f3f3'
										stroke='#0070f3'
										strokeWidth='1.5'
									/>
									<text
										x='10'
										y='14'
										textAnchor='middle'
										fontSize='12'
										fill='#0070f3'
										fontWeight='bold'
									>
										?
									</text>
								</svg>
							</button>
							<span
								style={{
									position: 'absolute',
									bottom: '-2.2em',
									left: '50%',
									transform: 'translateX(-50%)',
									background: '#222',
									color: '#fff',
									padding: '6px 12px',
									borderRadius: 6,
									fontSize: 13,
									whiteSpace: 'nowrap',
									pointerEvents: 'none',
									opacity: 0,
									transition: 'opacity 0.18s',
									zIndex: 20,
								}}
							>
								Continent: <b>{target.continentName}</b>
							</span>
						</span>
						{/* Hint2: Famous for */}
						<span
							style={{ position: 'relative', display: 'inline-block', marginLeft: 4 }}
						>
							<button
								type='button'
								aria-label='Show famous for hint'
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									padding: 0,
									display: 'inline-flex',
									alignItems: 'center',
								}}
								onMouseEnter={(e) => {
									const tooltip = e.currentTarget.nextSibling as HTMLElement;
									if (tooltip) tooltip.style.opacity = '1';
								}}
								onMouseLeave={(e) => {
									const tooltip = e.currentTarget.nextSibling as HTMLElement;
									if (tooltip) tooltip.style.opacity = '0';
								}}
							>
								<svg
									width='18'
									height='18'
									viewBox='0 0 20 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<circle
										cx='10'
										cy='10'
										r='10'
										fill='#f3f3f3'
										stroke='#0070f3'
										strokeWidth='1.5'
									/>
									<text
										x='10'
										y='14'
										textAnchor='middle'
										fontSize='12'
										fill='#0070f3'
										fontWeight='bold'
									>
										?
									</text>
								</svg>
							</button>
							<span
								style={{
									position: 'absolute',
									bottom: '-2.2em',
									left: '50%',
									transform: 'translateX(-50%)',
									background: '#222',
									color: '#fff',
									padding: '6px 12px',
									borderRadius: 6,
									fontSize: 13,
									whiteSpace: 'nowrap',
									pointerEvents: 'none',
									opacity: 0,
									transition: 'opacity 0.18s',
									zIndex: 20,
								}}
							>
								{getCountryFamousFor(target.countryName)}
							</span>
						</span>
					</p>
					<form
						onSubmit={handleGuess}
						style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}
						autoComplete='off'
					>
						<div style={{ position: 'relative', width: '70%' }}>
							<input
								ref={inputRef}
								type='text'
								value={input}
								onChange={(e) => {
									setInput(e.target.value);
									setHighlighted(-1);
									e.preventDefault();
								}}
								placeholder='Type country name...'
								disabled={gameOver}
								style={{ padding: 8, fontSize: 16, width: '100%' }}
								autoComplete='off'
								onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
								onFocus={() => setShowSuggestions(true)}
								onKeyDown={(e) => {
									if (!suggestions.length) return;
									if (e.key === 'ArrowDown') {
										setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
									} else if (e.key === 'ArrowUp') {
										setHighlighted((h) => Math.max(h - 1, 0));
									} else if (e.key === 'Enter') {
										if (highlighted >= 0 && suggestions[highlighted]) {
											setInput(suggestions[highlighted]);
											setShowSuggestions(false);
											setHighlighted(-1);
											e.preventDefault();
										}
									}
								}}
							/>
							{showSuggestions && suggestions.length > 0 && (
								<ul
									style={{
										position: 'absolute',
										top: '100%',
										left: 0,
										zIndex: 10,
										background: '#fff',
										border: '1px solid #ddd',
										minWidth: 220,
										width: '100%',
										maxWidth: 400,
										maxHeight: 180,
										overflowY: 'auto',
										margin: 0,
										padding: 0,
										listStyle: 'none',
										borderRadius: 4,
										boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
									}}
								>
									{suggestions.map((s, i) => (
										<li
											key={i}
											onClick={() => {
												setInput(s);
												setShowSuggestions(false);
												setHighlighted(-1);
												inputRef.current?.focus();
											}}
											style={{
												padding: 8,
												background: i === highlighted ? '#e6f0ff' : '#fff',
												cursor: 'pointer',
											}}
										>
											{s}
										</li>
									))}
								</ul>
							)}
						</div>
						<button
							type='submit'
							disabled={gameOver || !input.trim()}
							style={{ padding: 8, fontSize: 16, marginLeft: 24 }}
						>
							Guess
						</button>
					</form>
					<div>
						<h3>Guesses ({guesses.length}/5):</h3>
						<ul style={{ padding: 0, listStyle: 'none' }}>
							{guesses.map((g, i) => (
								<li
									key={i}
									style={{
										marginBottom: 6,
										background: g.correct ? '#d2ffd2' : '#f3f3f3',
										padding: 8,
										borderRadius: 6,
									}}
								>
									<b>{g.guess}</b>
									{g.correct ? (
										<span style={{ color: 'green', marginLeft: 8 }}>🎉 Correct!</span>
									) : g.distance !== null ? (
										<span style={{ marginLeft: 8 }}>{g.distance} km away</span>
									) : (
										<span style={{ color: '#bb2222', marginLeft: 8 }}>Not found</span>
									)}
								</li>
							))}
						</ul>
					</div>
					{gameOver && (
						<div style={{ marginTop: 18, fontSize: 18 }}>
							{win ? (
								<span style={{ color: 'green' }}>
									You got it in {guesses.length} tries!
								</span>
							) : (
								<span style={{ color: '#bb2222' }}>
									Game over! The answer was <b>{target.countryName}</b>.
								</span>
							)}
							<ShowMapButton target={target} />
						</div>
					)}
				</>
			)}
			<div
				style={{
					position: 'fixed',
					bottom: 24,
					right: 24,
					display: 'flex',
					gap: 12,
					zIndex: 1000,
				}}
			>
				<button
					onClick={startGame}
					style={{
						padding: '14px 32px',
						fontSize: 20,
						background: '#0070f3',
						color: '#fff',
						border: 'none',
						borderRadius: 8,
						boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
						cursor: 'pointer',
						fontWeight: 600,
					}}
					aria-label='Restart game'
				>
					Restart
				</button>
				<button
					disabled={gameOver}
					style={{
						padding: '14px 32px',
						fontSize: 20,
						background: '#bb2222',
						color: '#fff',
						border: 'none',
						borderRadius: 8,
						boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
						cursor: gameOver ? 'not-allowed' : 'pointer',
						fontWeight: 600,
					}}
					onClick={() => {
						setGameOver(true);
						setWin(false);
					}}
					aria-label='Show answer'
				>
					Show Answer
				</button>
			</div>
		</main>
	);
}
