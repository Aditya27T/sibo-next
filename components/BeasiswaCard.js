// components/BeasiswaCard.js
import React from 'react';

export default function BeasiswaCard({ beasiswa, isRegistered, onClick, formatDate }) {
  return (
    <div 
      className={`p-4 transition ${
        isRegistered ? 'bg-gray-50' : 'hover:bg-blue-50 cursor-pointer'
      }`}
      onClick={() => !isRegistered && onClick(beasiswa)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{beasiswa.nama}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {beasiswa.deskripsi}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Min IPK:</span>
              <span className="ml-1 font-medium">{beasiswa.minIpk}</span>
            </div>
            <div>
              <span className="text-gray-500">Kuota:</span>
              <span className="ml-1 font-medium">{beasiswa.kuota}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Deadline:</span>
              <span className="ml-1">{formatDate(beasiswa.tanggalTutup)}</span>
            </div>
          </div>
        </div>
        <div>
          {isRegistered ? (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Sudah Terdaftar
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Dapat Didaftarkan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}