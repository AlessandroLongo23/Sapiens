/** Pregenerated in Python with RDKit and verified there: scripts/chimica/esercizi/amminoacidi_legame_peptidico.py. See pool.ts. */
import pool from './pools/amminoacidi-legame-peptidico.json';
import { poolGenerator, type Pool } from './pool';

export default poolGenerator(pool as unknown as Pool);
