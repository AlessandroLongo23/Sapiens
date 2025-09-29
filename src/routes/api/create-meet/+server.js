import { json } from '@sveltejs/kit'
import { google } from 'googleapis'
import { env } from '$env/dynamic/private'

function normalizePrivateKey(raw) {
    if (!raw) return ''
    let key = String(raw)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\\n/g, '\n')
        .trim()

    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1)
    }

    if (!key.includes('BEGIN') && /^[A-Za-z0-9+/=\s]+$/.test(key)) {
        try {
            const decoded = Buffer.from(key, 'base64').toString('utf8')
            if (decoded.includes('BEGIN')) key = decoded
        } catch {}
    }

    return key
}

export async function POST({ request, locals: { supabase, user } }) {
    try {
        if (!user) {
            return json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { lectureId, summary, date, start_time, end_time } = await request.json()

        if (!lectureId || !date || !start_time || !end_time) {
            return json({ error: 'Missing required fields' }, { status: 400 })
        }

        const timeZone = env.GOOGLE_CALENDAR_TIMEZONE || 'Europe/Rome'

        
        const startDateTime = `${date}T${start_time}:00`
        const endDateTime = `${date}T${end_time}:00`

        
        const privateKey = normalizePrivateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
        if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
            return json({ error: 'Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY' }, { status: 500 })
        }
        const jwt = new google.auth.JWT({
            email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/calendar'],
            subject: env.GOOGLE_IMPERSONATE_SUBJECT || undefined
        })

        const calendar = google.calendar({ version: 'v3', auth: jwt })

        const res = await calendar.events.insert({
            calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
            conferenceDataVersion: 1,
            requestBody: {
                summary: summary || 'Lezione',
                start: { dateTime: startDateTime, timeZone },
                end: { dateTime: endDateTime, timeZone },
                conferenceData: {
                    createRequest: {
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                        requestId: `lecture-${lectureId}-${Date.now()}`
                    }
                }
            }
        })

        const event = res.data
        const hangoutLink = event?.hangoutLink || event?.conferenceData?.entryPoints?.[0]?.uri

        
        try {
            await supabase
                .from('lectures')
                .update({ meet_link: hangoutLink, google_event_id: event?.id })
                .eq('id', lectureId)
        } catch (_) {
            
        }

        return json({ hangoutLink, eventId: event?.id })
    } catch (err) {
        console.error('Create Meet failed:', err)
        return json({ error: 'Failed to create Google Meet' }, { status: 500 })
    }
}


