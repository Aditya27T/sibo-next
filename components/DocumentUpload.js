// components/DocumentUpload.js
import React from 'react';

export default function DocumentUpload({ 
  formData, 
  handleChange, 
  handleFileChange, 
  handleSubmit, 
  submitting, 
  selectedPendaftaran,
  jenisDokumen,
  dokumens
}) {
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beasiswa
        </label>
        <p className="text-blue-600 font-medium">{selectedPendaftaran.beasiswaNama}</p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="jenisDokumen" className="block text-sm font-medium text-gray-700 mb-1">
          Jenis Dokumen <span className="text-red-500">*</span>
        </label>
        <select
          id="jenisDokumen"
          name="jenisDokumen"
          value={formData.jenisDokumen}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Pilih Jenis Dokumen</option>
          {jenisDokumen.map((jenis) => {
            // Check if already uploaded
            const isUploaded = dokumens.some(
              d => d.pendaftaranId === selectedPendaftaran.id && d.jenisDokumen === jenis
            );
            
            return (
              <option 
                key={jenis} 
                value={jenis}
                disabled={isUploaded}
              >
                {jenis} {isUploaded ? '(Sudah Diunggah)' : ''}
              </option>
            );
          })}
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
          File (PDF) <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Hanya file PDF yang diperbolehkan (maks. 5 MB)
        </p>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Mengunggah...' : 'Unggah Dokumen'}
        </button>
      </div>
    </form>
  );
}