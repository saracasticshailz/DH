// Function to extract file name from URL
export function getFileName(url: string) {
    // Match the file name including the extension (e.g., .pdf)
    const match = url.match(/\/([^/]+\.pdf)(?=\?)/);
    return match ? match[1] : null;
}