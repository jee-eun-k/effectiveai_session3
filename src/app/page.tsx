'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

// Function to calculate distance between two points in kilometers using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Coordinates for world capitals (add more as needed)
const capitalCoordinates: { [key: string]: { lat: number; lon: number } } = {
  'Afghanistan': { lat: 34.5553, lon: 69.2075 },
  'Albania': { lat: 41.3275, lon: 19.8187 },
  'Algeria': { lat: 36.7538, lon: 3.0588 },
  'Angola': { lat: -8.8390, lon: 13.2894 },
  'Antigua and Barbuda': { lat: 17.1175, lon: -61.8456 },
  'Argentina': { lat: -34.6118, lon: -58.4173 },
  'Armenia': { lat: 40.1792, lon: 44.4991 },
  'Australia': { lat: -35.2820, lon: 149.1286 },
  'Austria': { lat: 48.2082, lon: 16.3738 },
  'Azerbaijan': { lat: 40.4093, lon: 49.8671 },
  'Bahamas': { lat: 25.0478, lon: -77.3554 },
  'Bahrain': { lat: 26.2235, lon: 50.5876 },
  'Bangladesh': { lat: 23.8103, lon: 90.4125 },
  'Barbados': { lat: 13.1132, lon: -59.5988 },
  'Belarus': { lat: 53.9045, lon: 27.5615 },
  'Belgium': { lat: 50.8503, lon: 4.3517 },
  'Belize': { lat: 17.1899, lon: -88.4976 },
  'Benin': { lat: 6.4969, lon: 2.6289 },
  'Bhutan': { lat: 27.4728, lon: 89.6390 },
  'Bolivia': { lat: -16.4897, lon: -68.1193 },
  'Bosnia and Herzegovina': { lat: 43.8563, lon: 18.4131 },
  'Botswana': { lat: -24.6282, lon: 25.9231 },
  'Brazil': { lat: -15.8267, lon: -47.9218 },
  'Brunei': { lat: 4.9031, lon: 114.9398 },
  'Bulgaria': { lat: 42.6977, lon: 23.3219 },
  'Burkina Faso': { lat: 12.3714, lon: -1.5197 },
  'Burundi': { lat: -3.3614, lon: 29.3599 },
  'Cabo Verde': { lat: 14.9330, lon: -23.5133 },
  'Cambodia': { lat: 11.5564, lon: 104.9282 },
  'Cameroon': { lat: 3.8480, lon: 11.5021 },
  'Canada': { lat: 45.4215, lon: -75.6972 },
  // Add more countries as needed
};

const CapitalGuessingGame = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [capitals, _setCapitals] = useState<{ [capital: string]: string }>({
		'Kabul': 'Afghanistan',
		'Tirana': 'Albania',
		'Algiers': 'Algeria',
		'Luanda': 'Angola',
		"Saint John's": 'Antigua and Barbuda',
		'Buenos Aires': 'Argentina',
		'Yerevan': 'Armenia',
		'Canberra': 'Australia',
		'Vienna': 'Austria',
		'Baku': 'Azerbaijan',
		'Nassau': 'Bahamas',
		'Manama': 'Bahrain',
		'Dhaka': 'Bangladesh',
		'Bridgetown': 'Barbados',
		'Minsk': 'Belarus',
		'Brussels': 'Belgium',
		'Belmopan': 'Belize',
		'Porto-Novo': 'Benin',
		'Thimphu': 'Bhutan',
		'Sucre': 'Bolivia',
		'Sarajevo': 'Bosnia and Herzegovina',
		'Gaborone': 'Botswana',
		'Bras\u00edlia': 'Brazil',
		'Bandar Seri Begawan': 'Brunei',
		'Sofia': 'Bulgaria',
		'Ouagadougou': 'Burkina Faso',
		'Gitega': 'Burundi',
		'Praia': 'Cabo Verde',
		'Phnom Penh': 'Cambodia',
		'Yaound\u00e9': 'Cameroon',
		'Ottawa': 'Canada',
		'Bangui': 'Central African Republic',
		"N'Djamena": 'Chad',
		'Santiago': 'Chile',
		'Beijing': 'China',
		'Bogot\u00e1': 'Colombia',
		'Moroni': 'Comoros',
		'Brazzaville': 'Congo, Republic of the',
		'Kinshasa': 'Congo, Democratic Republic of the',
		'San Jos\u00e9': 'Costa Rica',
		'Yamoussoukro': "C\u00f4te d'Ivoire",
		'Zagreb': 'Croatia',
		'Havana': 'Cuba',
		'Nicosia': 'Cyprus',
		'Prague': 'Czech Republic',
		'Copenhagen': 'Denmark',
		'Djibouti City': 'Djibouti',
		'Roseau': 'Dominica',
		'Santo Domingo': 'Dominican Republic',
		'Dili': 'East Timor',
		'Quito': 'Ecuador',
		'Cairo': 'Egypt',
		'San Salvador': 'El Salvador',
		'Malabo': 'Equatorial Guinea',
		'Asmara': 'Eritrea',
		'Tallinn': 'Estonia',
		'Mbabane': 'Eswatini',
		'Addis Ababa': 'Ethiopia',
		'Suva': 'Fiji',
		'Helsinki': 'Finland',
		'Paris': 'France',
		'Libreville': 'Gabon',
		'Banjul': 'Gambia',
		'Tbilisi': 'Georgia',
		'Berlin': 'Germany',
		'Accra': 'Ghana',
		'Athens': 'Greece',
		"Saint George's": 'Grenada',
		'Guatemala City': 'Guatemala',
		'Conakry': 'Guinea',
		'Bissau': 'Guinea-Bissau',
		'Georgetown': 'Guyana',
		'Port-au-Prince': 'Haiti',
		'Tegucigalpa': 'Honduras',
		'Budapest': 'Hungary',
		'Reykjavik': 'Iceland',
		'New Delhi': 'India',
		'Jakarta': 'Indonesia',
		'Tehran': 'Iran',
		'Baghdad': 'Iraq',
		'Dublin': 'Ireland',
		'Jerusalem': 'Israel',
		'Rome': 'Italy',
		'Kingston': 'Jamaica',
		'Tokyo': 'Japan',
		'Amman': 'Jordan',
		'Astana': 'Kazakhstan',
		'Nairobi': 'Kenya',
		'South Tarawa': 'Kiribati',
		'Pyongyang': 'North Korea',
		'Seoul': 'South Korea',
		'Kuwait City': 'Kuwait',
		'Bishkek': 'Kyrgyzstan',
		'Vientiane': 'Laos',
		'Beirut': 'Lebanon',
		'Maseru': 'Lesotho',
		'Monrovia': 'Liberia',
		'Tripoli': 'Libya',
		'Vaduz': 'Liechtenstein',
		'Vilnius': 'Lithuania',
		'Luxembourg City': 'Luxembourg',
		'Antananarivo': 'Madagascar',
		'Lilongwe': 'Malawi',
		'Kuala Lumpur': 'Malaysia',
		'Male': 'Maldives',
		'Bamako': 'Mali',
		'Valletta': 'Malta',
		'Majuro': 'Marshall Islands',
		'Nouakchott': 'Mauritania',
		'Port Louis': 'Mauritius',
		'Mexico City': 'Mexico',
		'Palikir': 'Micronesia',
		'Chisinau': 'Moldova',
		'Monaco': 'Monaco',
		'Ulaanbaatar': 'Mongolia',
		'Podgorica': 'Montenegro',
		'Rabat': 'Morocco',
		'Maputo': 'Mozambique',
		'Naypyidaw': 'Myanmar',
		'Windhoek': 'Namibia',
		'Yaren District': 'Nauru',
		'Kathmandu': 'Nepal',
		'Amsterdam': 'Netherlands',
		'Wellington': 'New Zealand',
		'Managua': 'Nicaragua',
		'Niamey': 'Niger',
		'Abuja': 'Nigeria',
		'Oslo': 'Norway',
		'Muscat': 'Oman',
		'Islamabad': 'Pakistan',
		'Ngerulmud': 'Palau',
		'Panama City': 'Panama',
		'Port Moresby': 'Papua New Guinea',
		'Asunci\u00f3n': 'Paraguay',
		'Lima': 'Peru',
		'Manila': 'Philippines',
		'Warsaw': 'Poland',
		'Lisbon': 'Portugal',
		'Doha': 'Qatar',
		'Bucharest': 'Romania',
		'Moscow': 'Russia',
		'Kigali': 'Rwanda',
		'Basseterre': 'Saint Kitts and Nevis',
		'Castries': 'Saint Lucia',
		'Kingstown': 'Saint Vincent and the Grenadines',
		'Apia': 'Samoa',
		'San Marino': 'San Marino',
		'Sao Tome': 'Sao Tome and Principe',
		'Riyadh': 'Saudi Arabia',
		'Dakar': 'Senegal',
		'Belgrade': 'Serbia',
		'Victoria': 'Seychelles',
		'Freetown': 'Sierra Leone',
		'Singapore': 'Singapore',
		'Bratislava': 'Slovakia',
		'Ljubljana': 'Slovenia',
		'Honiara': 'Solomon Islands',
		'Mogadishu': 'Somalia',
		'Pretoria': 'South Africa',
		'Juba': 'South Sudan',
		'Madrid': 'Spain',
		'Sri Jayawardenepura Kotte': 'Sri Lanka',
		'Khartoum': 'Sudan',
		'Paramaribo': 'Suriname',
		'Stockholm': 'Sweden',
		'Bern': 'Switzerland',
		'Damascus': 'Syria',
		'Taipei': 'Taiwan',
		'Dushanbe': 'Tajikistan',
		'Dodoma': 'Tanzania',
		'Bangkok': 'Thailand',
		'Lom\u00e9': 'Togo',
		"Nuku'alofa": 'Tonga',
		'Port of Spain': 'Trinidad and Tobago',
		'Tunis': 'Tunisia',
		'Ankara': 'Turkey',
		'Ashgabat': 'Turkmenistan',
		'Funafuti': 'Tuvalu',
		'Kampala': 'Uganda',
		'Kyiv': 'Ukraine',
		'Abu Dhabi': 'United Arab Emirates',
		'London': 'United Kingdom',
		'Washington, D.C.': 'United States',
		'Montevideo': 'Uruguay',
		'Tashkent': 'Uzbekistan',
		'Port Vila': 'Vanuatu',
		'Vatican City': 'Vatican City',
		'Caracas': 'Venezuela',
		'Hanoi': 'Vietnam',
		"Sana'a": 'Yemen',
		'Lusaka': 'Zambia',
		'Harare': 'Zimbabwe',
	});

	const [remainingGuesses, setRemainingGuesses] = useState(5);
	const [currentCapital, setCurrentCapital] = useState('');
	const [countryName, setCountryName] = useState('');
	const [guessedCountries, setGuessedCountries] = useState<
		{ country: string; distance: number }[]
	>([]);
	const [gameActive, setGameActive] = useState(true);
	const [userGuess, setUserGuess] = useState('');
	const [message, setMessage] = useState('');
	const [autocompleteList, setAutocompleteList] = useState<string[]>([]);
	const [showAutocomplete, setShowAutocomplete] = useState(false);

	useEffect(() => {
		startGame();
	}, []);

	const startGame = () => {
		const capitalKeys = Object.keys(capitals);
		const randomCapital = capitalKeys[Math.floor(Math.random() * capitalKeys.length)];
		setCurrentCapital(randomCapital);
		setCountryName(capitals[randomCapital]);
		setRemainingGuesses(5);
		setGuessedCountries([]);
		setGameActive(true);
		setUserGuess('');
		setMessage('');
		setShowAutocomplete(false);
	};

	const getGeographicalDistance = (guess: string, correctCountry: string): number => {
		const guessCoords = capitalCoordinates[guess];
		const correctCoords = capitalCoordinates[correctCountry];

		if (!guessCoords || !correctCoords) {
			// If we don't have coordinates for either country, return a large number
			return 99999;
		}

		return calculateDistance(
			guessCoords.lat,
			guessCoords.lon,
			correctCoords.lat,
			correctCoords.lon
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const displayMessage = (msg: string, _color: 'red' | 'green' = 'red') => {
		setMessage(msg);
	};

	const updateResultsTable = () => {
		// Results table is updated in the component's JSX rendering
	};

	const endGame = (isWin = false) => {
		setGameActive(false);
		if (isWin) {
			displayMessage('Congratulations! You guessed it!', 'green');
		} else {
			displayMessage(`Game over! The correct answer was ${countryName}.`);
		}
	};

	const checkAnswer = () => {
		if (!gameActive) return;

		const trimmedGuess = userGuess.trim();

		if (!trimmedGuess) {
			displayMessage('Please enter your guess.');
			return;
		}

		const distance = getGeographicalDistance(trimmedGuess, countryName);
		setGuessedCountries((prev) => [...prev, { country: trimmedGuess, distance }]);
		updateResultsTable();

		if (trimmedGuess.toLowerCase() === countryName.toLowerCase()) {
			endGame(true);
			return;
		}

		setRemainingGuesses((prev) => prev - 1);

		if (remainingGuesses - 1 === 0) {
			endGame();
		} else {
			displayMessage('Incorrect guess. Try again.');
		}
		setUserGuess('');
		setShowAutocomplete(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value.toLowerCase();
		setUserGuess(e.target.value);
		if (!input) {
			setAutocompleteList([]);
			setShowAutocomplete(false);
			return;
		}

		const suggestions = Object.entries(capitals)
			.filter(
				([capital, country]) =>
					country.toLowerCase().startsWith(input) ||
					capital.toLowerCase().startsWith(input)
			)
			.map(([, country]) => country);
		setAutocompleteList(suggestions);
		setShowAutocomplete(suggestions.length > 0);
	};

	const handleSuggestionClick = (suggestion: string) => {
		setUserGuess(suggestion);
		setAutocompleteList([]);
		setShowAutocomplete(false);
	};

	return (
		<div className='bg-gray-100 flex justify-center items-center min-h-screen font-inter'>
			<div className='bg-white rounded-lg shadow-md p-8 w-full max-w-md'>
				<h1 className='text-2xl font-semibold text-blue-600 mb-4 text-center'>
					Guess the Country
				</h1>
				<div className='mb-4'>
					<p className='text-gray-700'>
						Capital:{' '}
						<span className='font-semibold' id='capital-name'>
							{currentCapital}
						</span>
					</p>
					<p className='text-sm text-gray-500 mt-1'>
						You have{' '}
						<span className='font-semibold' id='remaining-guesses'>
							{remainingGuesses}
						</span>{' '}
						guesses left.
					</p>
				</div>
				<div className='mb-4 relative'>
					<Input
						type='text'
						id='user-answer'
						placeholder='Enter your guess'
						className={cn(
							'w-full px-4 py-2 rounded-md border',
							gameActive
								? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								: message.startsWith('Congratulations')
								? 'border-green-500 focus:ring-green-500'
								: 'border-red-500 focus:ring-red-500'
						)}
						autoComplete='off'
						value={userGuess}
						onChange={handleInputChange}
					/>
					{showAutocomplete && (
						<ul
							id='autocomplete-list'
							className='absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-52 overflow-y-auto'
						>
							{autocompleteList.map((suggestion, index) => (
								<li
									key={index}
									className='px-4 py-2 cursor-pointer hover:bg-gray-100'
									onClick={() => handleSuggestionClick(suggestion)}
								>
									{suggestion}
								</li>
							))}
						</ul>
					)}
				</div>
				<div className='mb-4'>
					<Table
						id='results-table'
						className={cn(
							'min-w-full table-auto rounded-md',
							guessedCountries.length === 0 && 'hidden'
						)}
					>
						<TableHeader className='bg-gray-200'>
							<TableRow>
								<TableHead className='px-4 py-2 text-left'>Your Guess</TableHead>
								<TableHead className='px-4 py-2 text-left'>Distance</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className='text-gray-700'>
							{guessedCountries.map((guess, index) => (
								<TableRow key={index}>
									<TableCell className='px-4 py-2'>{guess.country}</TableCell>
									<TableCell className='px-4 py-2'>{guess.distance}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className='mb-4 text-red-500' id='message'>
					{message}
				</div>
				<div className='game-controls flex justify-center space-x-4 mt-6'>
					<Button
						id='check-answer'
						className={cn(
							'bg-green-500 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:shadow-outline',
							!gameActive && 'bg-gray-400 cursor-not-allowed'
						)}
						onClick={checkAnswer}
						disabled={!gameActive}
					>
						Check Answer
					</Button>
					<Button
						id='show-answer'
						className='bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:shadow-outline'
						onClick={() => {
							displayMessage(`The answer is ${countryName}.`);
							setUserGuess(countryName);
							endGame();
						}}
					>
						Show Answer
					</Button>
					<Button
						id='restart-game'
						className='bg-yellow-500 hover:bg-yellow-700 text-gray-900 font-semibold rounded-md py-2 px-4 focus:outline-none focus:shadow-outline'
						onClick={startGame}
					>
						Restart Game
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CapitalGuessingGame;
