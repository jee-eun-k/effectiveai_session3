import { supabase } from '@/utils/supabaseClient';
import { useState } from 'react';

function AuthSection({ onAuth }: { onAuth: () => void }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		const { error } = isSignUp
			? await supabase.auth.signUp({ email, password })
			: await supabase.auth.signInWithPassword({ email, password });
		if (error) setError(error.message);
		else onAuth();
	};

	return (
		<form onSubmit={handleAuth} style={{ marginBottom: 24 }}>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				style={{ marginRight: 8 }}
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				style={{ marginRight: 8 }}
			/>
			<button type='submit'>{isSignUp ? 'Sign Up' : 'Sign In'}</button>
			<button
				type='button'
				onClick={() => setIsSignUp((s) => !s)}
				style={{ marginLeft: 8 }}
			>
				{isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
			</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
		</form>
	);
}

export default AuthSection;
