import * as XLSX from 'xlsx';

export function removeHarakat(text) {
    if (!text) return "";
    return text.replace(/[ً-ِْ-ٰٟـ]/g, "");
}

export function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

export function downloadJSON(data, fileName) {
    downloadFile(JSON.stringify(data, null, 2), fileName, "application/json");
}

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy: ', err);
        return false;
    }
};

export const readExcel = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays
                resolve(jsonData);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsBinaryString(file);
    });
};

export const readWorkbook = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                resolve(workbook);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsBinaryString(file);
    });
};

export const sheetToJson = (sheet) => {
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
};

export const generatePreview = (textData) => {
    if (!textData || textData.length === 0) return "";
    
    // Flatten all paragraphs and words, extract gundul text
    const allWords = textData.flatMap(paragraph => paragraph.map(word => word.gundul));
    const fullText = allWords.join(' ');

    // Truncate to ~70 chars (approx 1 line on most cards)
    if (fullText.length > 70) {
        return fullText.substring(0, 70) + "...";
    }
    return fullText;
};

export const checkHasFeatures = (textData, quizData) => {
    const hasIrab = (textData || []).some(paragraph => 
        paragraph.some(word => !!(word.irab && word.irab.trim()))
    );
    const hasQuiz = (quizData || []).length > 0;
    
    return { hasIrab, hasQuiz };
};
