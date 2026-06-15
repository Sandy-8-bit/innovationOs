import { DocumentUploadManager } from './Documentuploadmanager'

export default function UploadExample() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-[20px] font-semibold text-[#1A1917]">
          Upload research documents
        </h1>
        <p className="mt-1 text-[13px] text-[#92908B]">
          Drag in PDFs and Word documents, or select a folder to batch-upload
          everything inside it. Each file uploads through a mock backend that
          simulates progress and occasionally fails so you can see every state.
        </p>
        <div className="mt-6">
          <DocumentUploadManager />
        </div>
      </div>
    </div>
  )
}