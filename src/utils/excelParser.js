import { sheetToJson, readWorkbook, removeHarakat, generatePreview, checkHasFeatures } from './studioUtils';

export const parseExcelToLesson = async (file) => {
    const workbook = await readWorkbook(file);

    // 1. Parse Info Sheet
    let lessonMetadata = {
        title: "Imported Lesson",
        titleArabic: "درس مستورد",
        level: "Ibtida’i",
        fullTranslation: "",
        reference: ""
    };

    const infoSheet = workbook.Sheets['Info'];
    if (infoSheet) {
        const infoData = sheetToJson(infoSheet);
        infoData.forEach(row => {
            const key = (row[0] || '').toLowerCase().trim();
            const value = row[1] || '';
            if (key.includes('judul latin')) lessonMetadata.title = value;
            if (key.includes('judul arab')) lessonMetadata.titleArabic = value;
            if (key.includes('level')) {
                let level = value.toLowerCase().trim();
                if (level.includes('ibtida')) lessonMetadata.level = "Ibtida’i";
                else if (level.includes('mutawas')) lessonMetadata.level = "Mutawassit";
                else if (level.includes('mutaqad')) lessonMetadata.level = "Mutaqaddim";
            }
            if (key.includes('terjemahan lengkap')) lessonMetadata.fullTranslation = value;
            if (key.includes('referensi') || key.includes('sumber') || key.includes('reference')) lessonMetadata.reference = value;
        });
    }

    // 2. Parse Materi Sheet
    const textData = [];
    let currentParagraph = [];
    const materiSheet = workbook.Sheets['Materi'] || workbook.Sheets[workbook.SheetNames[0]]; // Fallback to first sheet

    if (!materiSheet) {
        throw new Error('File Excel tidak valid. Gagal menemukan Sheet "Materi".');
    }

    if (materiSheet) {
        const rows = sheetToJson(materiSheet);
        
        if (!rows || rows.length < 2) {
            throw new Error('Sheet "Materi" kosong atau tidak memiliki baris data di bawah header.');
        }

        // Skip header (row 0)
        let emptyRowCount = 0;
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const arabic = (row && row[0]) || "";

            if (!arabic) {
                emptyRowCount++;
                continue;
            }

            // If we have content and we found 2+ empty rows before it, start a new paragraph
            if (emptyRowCount >= 2) {
                if (currentParagraph.length > 0) {
                    textData.push(currentParagraph);
                    currentParagraph = [];
                }
            }

            const isNewLine = emptyRowCount === 1 && (textData.length > 0 || currentParagraph.length > 0);
            emptyRowCount = 0;

            const translation = row[1] || "";
            const irab = row[2] || "";
            const ngaLogatRaw = row[3] || ""; // Col D
            const tasykilRaw = row[4] || ""; // Col E

            // Parse Nga Logat: "utawi:top-right;iku:top-left"
            const nga_logat = [];
            if (ngaLogatRaw) {
                const parts = ngaLogatRaw.split(';');
                parts.forEach(part => {
                    const [symbol, position] = part.split(':').map(s => s.trim());
                    if (symbol && position) {
                        nga_logat.push({ symbol, position });
                    }
                });
            }

            // Parse Tasykil Options: "opt1,opt2"
            const tasykil_options = tasykilRaw ? typeof tasykilRaw === 'string' ? tasykilRaw.split(',').map(s => s.trim()).filter(s => s) : [] : [];

            currentParagraph.push({
                berharakat: typeof arabic === 'string' ? arabic : arabic.toString(),
                gundul: removeHarakat(typeof arabic === 'string' ? arabic : arabic.toString()),
                isNewLine: isNewLine,
                terjemahan: translation,
                irab: irab,
                link: '',
                nga_logat: nga_logat,
                tasykil_options: tasykil_options
            });
        }
        if (currentParagraph.length > 0) textData.push(currentParagraph);
    }
    
    if (textData.length === 0) {
        throw new Error('File tidak memiliki struktur teks Arab yang valid. Harap perhatikan format Kolom A pada Sheet Materi.');
    }

    // 3. Parse Kuis Sheet
    const quizData = [];
    const kuisSheet = workbook.Sheets['Kuis'];
    if (kuisSheet) {
        const rows = sheetToJson(kuisSheet);
        // Header: question, context, opt1, opt2, opt3, opt4, correct, explanation
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || !row[0]) continue;

            const question = row[0];
            const context = row[1] || "";
            const options = [row[2], row[3], row[4], row[5]].filter(o => o !== undefined && o !== "");
            const correctAnswer = parseInt(row[6] || "0");
            const explanation = row[7] || "";

            quizData.push({
                question,
                context,
                options,
                correctAnswer,
                explanation
            });
        }
    }

    const { hasIrab, hasQuiz } = checkHasFeatures(textData, quizData);

    return {
        id: `import-${Date.now()}`,
        ...lessonMetadata,
        textData: textData,
        quizData: quizData,
        preview: generatePreview(textData),
        hasIrab,
        hasQuiz,
        path: '' // Will be set on save if needed
    };
};
