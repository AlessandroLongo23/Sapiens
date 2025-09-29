import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function compileTikz(tikzCode) {
    const tempDir = path.join(process.cwd(), 'temp-tikz');
    await fs.mkdir(tempDir, { recursive: true });
    const tempFilePath = path.join(tempDir, `tikz-${Date.now()}.tex`);

    const latexDocument = `
		\\documentclass{standalone}
		\\usepackage{tikz}
		\\begin{document}
		${tikzCode}
		\\end{document}
	`;

    await fs.writeFile(tempFilePath, latexDocument);

    try {
        await execAsync(`pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${tempFilePath}`);
        const pdfPath = tempFilePath.replace('.tex', '.pdf');
        await execAsync(`pdf2svg ${pdfPath} ${pdfPath.replace('.pdf', '.svg')}`);
        
        const svgPath = tempFilePath.replace('.tex', '.svg');
        const svgContent = await fs.readFile(svgPath, 'utf-8');
        
        return svgContent;
    } finally {
        
        const files = await fs.readdir(tempDir);
        for (const file of files) {
            await fs.unlink(path.join(tempDir, file));
        }
        await fs.rmdir(tempDir);
    }
}

export async function POST({ request }) {
	const { tikz } = await request.json();

	if (!tikz) {
		return new Response(JSON.stringify({ error: 'TikZ code is required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	try {
		const svg = await compileTikz(tikz);
		return new Response(JSON.stringify({ svg }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('TikZ compilation error:', error);
		return new Response(JSON.stringify({ error: 'Failed to compile TikZ' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
