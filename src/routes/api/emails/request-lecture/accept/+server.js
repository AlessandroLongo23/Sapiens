import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';

// Secret key for verifying tokens
const SECRET_KEY = env.JWT_SECRET || 'aleripetizioni-lecture-actions-secret';

export async function GET({ url }) {
	try {
		
		const token = url.searchParams.get('token');
		const lectureId = url.searchParams.get('id');

		if (!token || !lectureId) {
			return json({ error: 'Missing required parameters' }, { status: 400 });
		}

		try {
			const decoded = jwt.verify(token, SECRET_KEY);
			if (decoded.lectureId !== lectureId || decoded.action !== 'accept') {
				return json({ error: 'Invalid token' }, { status: 403 });
			}
		} catch (error) {
			console.error('Token verification error:', error);
			return json({ error: 'Invalid or expired token' }, { status: 403 });
		}

		const { data, error } = await supabase
			.from('lectures')
			.update({ status: 'accepted' })
			.eq('id', lectureId)
			.select();

		if (error) {
			console.error('Error accepting lecture:', error);
			return json({ error: 'Failed to accept lecture' }, { status: 500 });
		}

		if (!data || data.length === 0) {
			return json({ error: 'Lecture not found' }, { status: 404 });
		}

		return new Response(
			`
			<!DOCTYPE html>
			<html>
				<head>
					<title>Lezione Accettata</title>
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
							color: #4CAF50;
						}
						.details {
							margin: 20px 0;
							text-align: left;
						}
						.button {
							background-color: #4CAF50;
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
						<h1>Lezione Accettata!</h1>
						<p>La richiesta di lezione è stata accettata con successo.</p>
						<p>Lo studente riceverà una notifica di conferma.</p>
						<div class="details">
							<p><strong>Data:</strong> ${data[0].date}</p>
							<p><strong>Orario:</strong> ${data[0].start_time} - ${data[0].end_time}</p>
						</div>
						<a href="https://sapiens.vercel.app/admin/calendario" class="button">Vai al Calendario</a>
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
