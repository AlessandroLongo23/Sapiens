import { json } from '@sveltejs/kit';
import { createClient } from '$lib/supabase';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';

// Secret key for verifying tokens
const SECRET_KEY = env.JWT_SECRET || 'aleripetizioni-lecture-actions-secret';

export async function GET({ url, cookies }) {
	try {
		// Create Supabase client for server-side use
		const supabase = createClient(cookies);
		
		console.log('Supabase client initialized in refuse endpoint:', !!supabase);
		
		// Get the token and lecture ID from query parameters
		const token = url.searchParams.get('token');
		const lectureId = url.searchParams.get('id');

		if (!token || !lectureId) {
			return json({ error: 'Missing required parameters' }, { status: 400 });
		}

		// Verify the token
		try {
			const decoded = jwt.verify(token, SECRET_KEY);
			if (decoded.lectureId !== lectureId || decoded.action !== 'refuse') {
				return json({ error: 'Invalid token' }, { status: 403 });
			}
		} catch (error) {
			console.error('Token verification error:', error);
			return json({ error: 'Invalid or expired token' }, { status: 403 });
		}

		// Get the lecture details before deleting (for display purposes)
		const { data: lectureData } = await supabase
			.from('lectures')
			.select('date, start_time, end_time')
			.eq('id', lectureId)
			.single();

		// Delete the lecture
		const { error } = await supabase
			.from('lectures')
			.delete()
			.eq('id', lectureId);

		if (error) {
			console.error('Error deleting lecture:', error);
			return json({ error: 'Failed to refuse lecture' }, { status: 500 });
		}

		// Return success response with a simple HTML page
		return new Response(
			`
			<!DOCTYPE html>
			<html>
				<head>
					<title>Lezione Rifiutata</title>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<style>
						body {
							font-family: Arial, sans-serif;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							height: 100vh;
							margin: 0;
							background-color: #f5f5f5;
							color: #333;
						}
						.card {
							background-color: white;
							border-radius: 8px;
							box-shadow: 0 4px 12px rgba(0,0,0,0.1);
							padding: 30px;
							text-align: center;
							max-width: 500px;
						}
						h1 {
							color: #F44336;
						}
						.details {
							margin: 20px 0;
							text-align: left;
						}
						.button {
							background-color: #2196F3;
							color: white;
							border: none;
							padding: 10px 20px;
							text-align: center;
							text-decoration: none;
							display: inline-block;
							font-size: 16px;
							margin: 4px 2px;
							cursor: pointer;
							border-radius: 4px;
						}
					</style>
				</head>
				<body>
					<div class="card">
						<h1>Lezione Rifiutata</h1>
						<p>La richiesta di lezione è stata rifiutata con successo.</p>
						${lectureData ? `
						<div class="details">
							<p><strong>Data:</strong> ${lectureData.date}</p>
							<p><strong>Orario:</strong> ${lectureData.start_time} - ${lectureData.end_time}</p>
						</div>
						` : ''}
						<a href="https://ale-ripetizioni.vercel.app/admin/calendario" class="button">Vai al Calendario</a>
					</div>
				</body>
			</html>
			`,
			{
				status: 200,
				headers: {
					'Content-Type': 'text/html'
				}
			}
		);
	} catch (error) {
		console.error('Error processing request:', error);
		return json({ error: 'Server error' }, { status: 500 });
	}
}
