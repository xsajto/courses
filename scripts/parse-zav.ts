import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const RAW_DIR = path.join(process.cwd(), 'resources/raw');
const OUTPUT_FILE = path.join(RAW_DIR, 'zav-lessons.json');

async function extractLessons(filePath: string, startLesson: number, limit: number) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Check if data.text exists
    if (!data || !data.text) {
        console.warn("PDF parsed but no text found.");
        return [];
    }

    const text = data.text;
    const lines = text.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
    
    const lessons: { id: number, text: string }[] = [];
    
    // Regex: "1. lesson text" or "1 lesson text"
    // Allow for some flexibility in whitespace
    const lessonRegex = /^(\d+)[.\s]+(.*)$/;

    for (const line of lines) {
      const match = line.match(lessonRegex);
      if (match) {
        const lessonNum = parseInt(match[1], 10);
        let content = match[2].trim();
        
        // Sometimes PDF extraction puts the text on the next line if headers interfere
        // For simplicity, we take the single line content for now.
        
        if (content.length > 5 && lessonNum >= startLesson) {
           if (!lessons.find(l => l.id === lessonNum)) {
               lessons.push({ id: lessonNum, text: content });
           }
        }
      }
    }
    return lessons.sort((a, b) => a.id - b.id).slice(0, limit);
  } catch (e) {
      console.error("PDF Read Error:", e);
      return [];
  }
}

async function main() {
  console.log("Extracting ZAV lessons...");
  
  const pdfPath = path.join(RAW_DIR, 'zav1_600.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error(`File not found: ${pdfPath}`);
    return;
  }

  let lessons = await extractLessons(pdfPath, 1, 100);
  console.log(`Extracted ${lessons.length} lessons from PDF.`);

  // If extraction failed to get meaningful data, generate placeholders
  if (lessons.length < 5) {
      console.log("Extraction insufficient. Generating fallback content based on ZAV progression.");
      const generated = [];
      for (let i = 1; i <= 100; i++) {
          generated.push({
              id: i,
              text: generateZavText(i)
          });
      }
      lessons = generated;
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(lessons, null, 2));
  console.log(`Saved ${lessons.length} lessons to ${OUTPUT_FILE}`);
}

function generateZavText(lessonNum: number): string {
    const sets = [
        "f j f j fj fj", 
        "d k d k dk dk", 
        "s l s l sl sl", 
        "a ; a ; a; a;",
        "g h g h gh gh",
        "r u r u ru ru",
        "e i e i ei ei",
        "w o w o wo wo",
        "q p q p qp qp",
        "t y t y ty ty"
    ];
    
    const setIndex = Math.min(Math.floor((lessonNum - 1) / 10), sets.length - 1);
    const base = sets[setIndex];
    let text = "";
    for(let k=0; k<5; k++) text += base + " ";
    return text.trim();
}

main();
