import { useEffect, useRef, useState } from "react";

// const documents = [
//   { id: 1, title: 'Product Roadmap.pdf', status: 'Indexed' },
//   { id: 2, title: 'Support Playbook.docx', status: 'Processing' },
//   { id: 3, title: 'Launch Notes.pdf', status: 'Uploaded' },
// ];



// const badgeStyles = {
//     indexed: 'bg-[#dfe9dc] text-[#3f5a3b]',
//     Processing: 'bg-[#f3e1c8] text-[#825f2e]',
//     Uploaded: 'bg-[#e7dff6] text-[#5b3f7d]',
// };

const badgeStyles = {
    uploaded: 'bg-[#e7dff6] text-[#5b3f7d]',
    indexed: 'bg-[#dfe9dc] text-[#3f5a3b]',
};


function DocumentPanel() {
    const [documents, setDocuments] = useState([]);
    const [files, setFiles] = useState([]);
    const [refreshDocuments, setRefreshDocuments] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/documents")
            .then(res => res.json())
            .then(data => setDocuments(data.data));

        setRefreshDocuments(false);
        console.log("refreshed the data")

    }, [refreshDocuments]);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        console.log("handle Upload - 1")
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await fetch("http://127.0.0.1:8000/documents/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        setRefreshDocuments(true);
        setFiles([])
        // Clear the file input
        fileInputRef.current.value = "";

        console.log(data);
    };


    return (
        <div className="flex h-full flex-col rounded-[28px] border border-[#e8ddd0] bg-[#f8f3eb] p-5 shadow-[0_20px_60px_-24px_rgba(77,57,38,0.28)]">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-[#2f241c]">Documents</h2>
                <p className="text-sm text-[#7a685d]">Add files and keep your knowledge base ready for questions.</p>
            </div>

            <button
                type="button"
                onClick={() => { }}
                className="mb-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#cdb8a0] bg-[#fcfaf8] px-4 py-7 text-center transition hover:border-[#9c7c58] hover:bg-[#f7efe7]"
            >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#efe2d0] text-[#7a5732]">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                </div>

                {/* <span className="text-sm font-semibold text-[#2f241c]">Drop files here</span> */}
                <span className="mt-1 text-sm text-[#8b755c]">
                    {/* or click to browse */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                </span>
            </button>
            <button
                type="submit"
                onClick={() => handleUpload()}
                className="rounded-xl bg-[#5f4b3b] px-4 py-2 text-sm font-semibold text-[#fef8f2] transition hover:bg-[#49392d]"
            >
                Upload
            </button>

            <div className="space-y-2">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="flex items-center justify-between rounded-2xl border border-[#efe4d8] bg-[#fffdfb] px-3 py-3 shadow-sm"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#2f241c]">{document.title}</p>
                            <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${badgeStyles[document.status]}`}>
                                {document.status}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => { }}
                            className="ml-3 rounded-full p-2 text-[#8b6d4b] transition hover:bg-[#f4e7d8] hover:text-[#5f452f]"
                            aria-label={`Delete ${document.title}`}
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M4.5 6.5h15" />
                                <path d="M9 6.5V4.5h6v2" />
                                <path d="M7.5 9v8.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V9" />
                                <path d="M10 11v5" />
                                <path d="M14 11v5" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DocumentPanel;