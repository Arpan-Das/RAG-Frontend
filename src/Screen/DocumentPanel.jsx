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
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const URL = import.meta.env.VITE_BACKEND_URL;

    const fetchDocument = () => {
        try {
            fetch(`${URL}/documents`)
                .then(res => res.json())
                .then(data => setDocuments(data.data));
            
            console.log("refreshed the data");
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        console.log("first")
        fetchDocument()
    }, []);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            console.log("handle Upload - 1")
            const formData = new FormData();

            files.forEach((file) => {
                formData.append("files", file);
            });

            const response = await fetch(`${URL}/documents/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            fetchDocument();
            setFiles([]);
            // Clear the file input
            fileInputRef.current.value = "";

            console.log(data);

        } catch (err) {
            console.log(err)
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handelDeleteFile = async (doc_id) => {
        try {
            const res = await fetch(`${URL}/documents/${doc_id}`, { method: "DELETE" })
            if (!res.ok) {
                const errData = await res.json();
                alert(errData.detail || "Delete failed");
                return;
            }
            const data = await res.json();
            fetchDocument();
            alert(data.status);
            console.log(data.status);
            
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className="flex h-full flex-col rounded-[28px] border border-[#e8ddd0] bg-[#f8f3eb] p-5 shadow-[0_20px_60px_-24px_rgba(77,57,38,0.28)]">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-[#2f241c]">Documents</h2>
                <p className="text-sm text-[#7a685d]">Add files and keep your knowledge base ready for questions.</p>
            </div>

            <div className="rounded-2xl border border-[#e5d8c8] bg-[#fcfaf8] p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#2f241c]">
                            Upload Documents
                        </h2>
                        <p className="text-sm text-[#8b755c]">
                            Add PDF documents for the chatbot to answer from.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg border border-[#d7c7b5] px-4 py-2 text-sm font-medium text-[#5f4b3b] transition hover:bg-[#f3ebe3]"
                    >
                        + Add Files
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {files.length > 0 ? (
                    <>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border border-[#e7ddd1] bg-white px-4 py-3"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="text-xl">📄</span>

                                        <div className="overflow-hidden">
                                            <p className="truncate text-sm font-medium text-[#2f241c]">
                                                {file.name}
                                            </p>

                                            <p className="text-xs text-[#8b755c]">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFile(index)}
                                        className="rounded p-2 text-[#8b755c] hover:bg-red-50 hover:text-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            disabled={isUploading}
                            onClick={handleUpload}
                            className="mt-5 w-full rounded-xl bg-[#5f4b3b] py-3 font-semibold text-white transition hover:bg-[#49392d]"
                        >
                            {isUploading ? "Uploading..." : `Upload ${files.length} Document${files.length > 1 ? "s" : ""}`}
                        </button>
                    </>
                ) : (
                    <div className="rounded-xl border border-dashed border-[#d7c7b5] py-10 text-center text-[#8b755c]">
                        No documents selected
                    </div>
                )}
            </div>          

            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
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
                            onClick={() => handelDeleteFile(document.id)}
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