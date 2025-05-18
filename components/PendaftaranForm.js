// components/PendaftaranForm.js
import React from 'react';

export default function PendaftaranForm({ beasiswa, formData, handleChange, handleSubmit, submitting }) {
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beasiswa Dipilih
        </label>
        <p className="text-blue-600 font-medium">{beasiswa.nama}</p>
      </div>
      
      <div>
        <label htmlFor="ipk" className="block text-sm font-medium text-gray-700 mb-1">
          IPK Terakhir <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="ipk"
          name="ipk"
          value={formData.ipk}
          onChange={handleChange}
          placeholder="Contoh: 3.5"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          IPK minimum untuk beasiswa ini: {beasiswa.minIpk}
        </p>
      </div>
      
      <div>
        <label htmlFor="alasan" className="block text-sm font-medium text-gray-700 mb-1">
          Alasan Mendaftar <span className="text-red-500">*</span>
        </label>
        <textarea
          id="alasan"
          name="alasan"
          value={formData.alasan}
          onChange={handleChange}
          rows="4"
          required
          placeholder="Jelaskan mengapa Anda layak mendapatkan beasiswa ini"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      
      <div className="pt-3">
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Mendaftar...' : 'Daftar Beasiswa'}
        </button>
        
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-2 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Batal
        </button>
      </div>
    </form>
  );
}