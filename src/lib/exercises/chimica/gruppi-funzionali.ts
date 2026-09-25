/** Pregenerated in Python with RDKit and verified there: scripts/chimica/esercizi/gruppi_funzionali.py. See pool.ts. */
import pool from './pools/gruppi-funzionali.json';
import { poolGenerator, type Pool } from './pool';

export default poolGenerator(pool as unknown as Pool);
