// components/BeasiswaReport.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Styling untuk PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #ccc',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  rowDark: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
  },
  column: {
    flex: 1,
    padding: 5,
  },
  columnSmall: {
    flex: 0.5,
    padding: 5,
  },
  columnLarge: {
    flex: 2,
    padding: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: 5,
    fontSize: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    borderTop: '1px solid #ccc',
    paddingTop: 10,
  },
  info: {
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statsBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 120,
  },
  value: {
    flex: 1,
  },
  signatureSection: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signature: {
    width: 200,
    alignItems: 'center',
  },
  signatureLine: {
    borderTop: '1px solid #000',
    width: 150,
    marginTop: 40,
    marginBottom: 5,
  },
});

// Format tanggal
const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Komponen PDF
export const BeasiswaReport = ({ data }) => {
  const { beasiswa, pendaftarans, tanggalCetak, adminName } = data;
  
  // Hitung statistik
  const totalPendaftar = pendaftarans.length;
  const menungguCount = pendaftarans.filter(p => p.status === 'menunggu').length;
  const diterimaCount = pendaftarans.filter(p => p.status === 'diterima').length;
  const ditolakCount = pendaftarans.filter(p => p.status === 'ditolak').length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Laporan Pendaftaran Beasiswa</Text>
          <Text style={styles.subtitle}>{beasiswa.nama}</Text>
        </View>

        {/* Informasi Beasiswa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Beasiswa</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Nama Beasiswa</Text>
            <Text style={styles.value}>: {beasiswa.nama}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Kuota</Text>
            <Text style={styles.value}>: {beasiswa.kuota} Orang</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Periode</Text>
            <Text style={styles.value}>: {formatDate(beasiswa.tanggalBuka)} s/d {formatDate(beasiswa.tanggalTutup)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>: {beasiswa.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>IPK Minimum</Text>
            <Text style={styles.value}>: {beasiswa.minIpk}</Text>
          </View>
        </View>

        {/* Statistik */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistik Pendaftaran</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statsBox}>
              <Text style={styles.statsValue}>{totalPendaftar}</Text>
              <Text style={styles.statsLabel}>Total Pendaftar</Text>
            </View>
            
            <View style={styles.statsBox}>
              <Text style={styles.statsValue}>{menungguCount}</Text>
              <Text style={styles.statsLabel}>Menunggu</Text>
            </View>
            
            <View style={styles.statsBox}>
              <Text style={styles.statsValue}>{diterimaCount}</Text>
              <Text style={styles.statsLabel}>Diterima</Text>
            </View>
            
            <View style={styles.statsBox}>
              <Text style={styles.statsValue}>{ditolakCount}</Text>
              <Text style={styles.statsLabel}>Ditolak</Text>
            </View>
          </View>
        </View>

        {/* Daftar Pendaftar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daftar Pendaftar</Text>
          
          {pendaftarans.length === 0 ? (
            <Text>Belum ada pendaftaran untuk beasiswa ini.</Text>
          ) : (
            <View>
              {/* Header Tabel */}
              <View style={styles.tableHeader}>
                <View style={[styles.columnSmall, styles.headerCell]}>
                  <Text>No</Text>
                </View>
                <View style={[styles.columnLarge, styles.headerCell]}>
                  <Text>Nama Mahasiswa</Text>
                </View>
                <View style={[styles.column, styles.headerCell]}>
                  <Text>NIM</Text>
                </View>
                <View style={[styles.columnSmall, styles.headerCell]}>
                  <Text>IPK</Text>
                </View>
                <View style={[styles.column, styles.headerCell]}>
                  <Text>Status</Text>
                </View>
              </View>
              
              {/* Data Tabel */}
              {pendaftarans.map((pendaftaran, index) => (
                <View key={pendaftaran.id} style={index % 2 === 0 ? styles.row : styles.rowDark}>
                  <View style={styles.columnSmall}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={styles.columnLarge}>
                    <Text>{pendaftaran.mahasiswaNama}</Text>
                  </View>
                  <View style={styles.column}>
                    <Text>{pendaftaran.mahasiswaNim}</Text>
                  </View>
                  <View style={styles.columnSmall}>
                    <Text>{pendaftaran.ipk}</Text>
                  </View>
                  <View style={styles.column}>
                    <Text>{pendaftaran.status === 'menunggu'
                      ? 'Menunggu'
                      : pendaftaran.status === 'diterima'
                      ? 'Diterima'
                      : 'Ditolak'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tanda Tangan */}
        <View style={styles.signatureSection}>
          <View style={styles.signature}>
            <Text>{formatDate(tanggalCetak)}</Text>
            <Text>Administrator</Text>
            <View style={styles.signatureLine} />
            <Text>{adminName}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Dokumen ini dibuat secara otomatis oleh Sistem Informasi Beasiswa Online (SIBO)</Text>
          <Text>Dicetak pada: {formatDate(tanggalCetak)}</Text>
        </View>
      </Page>
    </Document>
  );
};