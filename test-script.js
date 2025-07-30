// Test Script for TOPSIS Rizki Batik
// This script will automatically populate the database with test data
// Run this in the browser console after logging in

console.log('🚀 Starting TOPSIS Test Data Population...');

// Test data configuration
const TEST_DATA = {
  kriteria: [
    { nama: 'Kualitas', bobot: 5, atribut: 'Benefit' },
    { nama: 'Daya Serap', bobot: 4, atribut: 'Benefit' },
    { nama: 'Tekstur', bobot: 4, atribut: 'Benefit' },
    { nama: 'Harga Perimeter', bobot: 3, atribut: 'Cost' },
    { nama: 'Ketersediaan di Pasar', bobot: 3, atribut: 'Benefit' },
    { nama: 'Ramah Lingkungan', bobot: 4, atribut: 'Benefit' },
    { nama: 'Kemudahan Proses Produksi Batik', bobot: 5, atribut: 'Benefit' }
  ],
  alternatif: [
    { nama: 'Kain Primisima', deskripsi: 'Kain katun premium berkualitas tinggi' },
    { nama: 'Kain Katun Basa', deskripsi: 'Kain katun standar untuk batik' },
    { nama: 'Kain Doby', deskripsi: 'Kain dengan tekstur bermotif halus' },
    { nama: 'Kain Viscose', deskripsi: 'Kain serat buatan dari selulosa' },
    { nama: 'Kain Safira', deskripsi: 'Kain campuran dengan daya serap baik' },
    { nama: 'Kain Polyester', deskripsi: 'Kain sintetis tahan lama' },
    { nama: 'Kain Rayon', deskripsi: 'Kain serat buatan dengan drape baik' }
  ],
  penilaian: {
    'Kain Primisima': {
      'Kualitas': 85, 'Daya Serap': 95, 'Tekstur': 95, 'Harga Perimeter': 90,
      'Ketersediaan di Pasar': 80, 'Ramah Lingkungan': 85, 'Kemudahan Proses Produksi Batik': 90
    },
    'Kain Katun Basa': {
      'Kualitas': 85, 'Daya Serap': 85, 'Tekstur': 90, 'Harga Perimeter': 90,
      'Ketersediaan di Pasar': 85, 'Ramah Lingkungan': 90, 'Kemudahan Proses Produksi Batik': 85
    },
    'Kain Doby': {
      'Kualitas': 80, 'Daya Serap': 85, 'Tekstur': 85, 'Harga Perimeter': 85,
      'Ketersediaan di Pasar': 80, 'Ramah Lingkungan': 75, 'Kemudahan Proses Produksi Batik': 75
    },
    'Kain Viscose': {
      'Kualitas': 95, 'Daya Serap': 90, 'Tekstur': 90, 'Harga Perimeter': 75,
      'Ketersediaan di Pasar': 80, 'Ramah Lingkungan': 75, 'Kemudahan Proses Produksi Batik': 85
    },
    'Kain Safira': {
      'Kualitas': 90, 'Daya Serap': 80, 'Tekstur': 90, 'Harga Perimeter': 75,
      'Ketersediaan di Pasar': 80, 'Ramah Lingkungan': 90, 'Kemudahan Proses Produksi Batik': 90
    },
    'Kain Polyester': {
      'Kualitas': 75, 'Daya Serap': 70, 'Tekstur': 75, 'Harga Perimeter': 85,
      'Ketersediaan di Pasar': 85, 'Ramah Lingkungan': 90, 'Kemudahan Proses Produksi Batik': 70
    },
    'Kain Rayon': {
      'Kualitas': 70, 'Daya Serap': 75, 'Tekstur': 70, 'Harga Perimeter': 55,
      'Ketersediaan di Pasar': 80, 'Ramah Lingkungan': 85, 'Kemudahan Proses Produksi Batik': 75
    }
  }
};

// Helper function to wait for elements
const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  });
};

// Helper function to fill form fields
const fillFormField = async (selector, value) => {
  const element = await waitForElement(selector);
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

// Helper function to click buttons
const clickButton = async (selector) => {
  const button = await waitForElement(selector);
  button.click();
};

// Helper function to select dropdown values
const selectDropdown = async (selector, value) => {
  const select = await waitForElement(selector);
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
};

// Step 1: Add Kriteria
const addKriteria = async () => {
  console.log('📝 Adding Kriteria...');
  
  for (let i = 0; i < TEST_DATA.kriteria.length; i++) {
    const kriteria = TEST_DATA.kriteria[i];
    
    // Navigate to kriteria page if not already there
    if (window.location.pathname !== '/kriteria') {
      window.location.href = '/kriteria';
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Fill form
    await fillFormField('input[placeholder*="Contoh: Kekuatan"]', kriteria.nama);
    await selectDropdown('select', kriteria.bobot.toString());
    await selectDropdown('select:nth-of-type(2)', kriteria.atribut);
    
    // Submit form
    await clickButton('button[type="submit"]');
    
    // Wait for submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ Added kriteria: ${kriteria.nama}`);
  }
};

// Step 2: Add Alternatif
const addAlternatif = async () => {
  console.log('👕 Adding Alternatif...');
  
  for (let i = 0; i < TEST_DATA.alternatif.length; i++) {
    const alternatif = TEST_DATA.alternatif[i];
    
    // Navigate to alternatif page if not already there
    if (window.location.pathname !== '/alternatif') {
      window.location.href = '/alternatif';
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Fill form
    await fillFormField('input[placeholder*="Contoh: Kain Katun"]', alternatif.nama);
    
    // Submit form
    await clickButton('button[type="submit"]');
    
    // Wait for submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ Added alternatif: ${alternatif.nama}`);
  }
};

// Step 3: Fill Penilaian Matrix
const fillPenilaian = async () => {
  console.log('📊 Filling Penilaian Matrix...');
  
  // Navigate to penilaian page
  if (window.location.pathname !== '/penilaian') {
    window.location.href = '/penilaian';
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Wait for table to load
  await waitForElement('table');
  
  // Fill all input fields
  const inputs = document.querySelectorAll('input[type="number"]');
  let inputIndex = 0;
  
  for (const alternatifName of Object.keys(TEST_DATA.penilaian)) {
    for (const kriteriaName of Object.keys(TEST_DATA.penilaian[alternatifName])) {
      if (inputs[inputIndex]) {
        const value = TEST_DATA.penilaian[alternatifName][kriteriaName];
        inputs[inputIndex].value = value;
        inputs[inputIndex].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[inputIndex].dispatchEvent(new Event('change', { bubbles: true }));
        inputIndex++;
      }
    }
  }
  
  // Save penilaian
  await clickButton('button:contains("Simpan Penilaian")');
  console.log('✅ Penilaian matrix filled and saved');
};

// Step 4: Run TOPSIS Calculation
const runTOPSIS = async () => {
  console.log('🧮 Running TOPSIS Calculation...');
  
  // Navigate to perhitungan page
  if (window.location.pathname !== '/perhitungan') {
    window.location.href = '/perhitungan';
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Click through all steps
  for (let step = 1; step <= 4; step++) {
    await clickButton('button:contains("Lanjutkan")');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Calculate final results
  await clickButton('button:contains("Hitung & Simpan Hasil")');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('✅ TOPSIS calculation completed');
};

// Step 5: Check Results
const checkResults = async () => {
  console.log('🏆 Checking Results...');
  
  // Navigate to hasil page
  if (window.location.pathname !== '/hasil') {
    window.location.href = '/hasil';
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Check for decimal values
  const preferensiElements = document.querySelectorAll('[class*="text-indigo-600"]');
  let foundDecimal = false;
  
  preferensiElements.forEach(element => {
    const text = element.textContent;
    if (text && text.match(/^\d+\.\d{4}$/)) {
      console.log(`✅ Found decimal value: ${text}`);
      foundDecimal = true;
    }
  });
  
  if (foundDecimal) {
    console.log('🎉 SUCCESS: Decimal values are displaying correctly!');
  } else {
    console.log('❌ ERROR: No decimal values found. Check the implementation.');
  }
};

// Main execution function
const runTest = async () => {
  try {
    console.log('🚀 Starting automated test...');
    
    // Check if user is logged in
    if (window.location.pathname === '/auth/login') {
      console.log('❌ Please log in first, then run this script again');
      return;
    }
    
    // Clear existing data (optional)
    console.log('🗑️ Clearing existing data...');
    // You can add data clearing logic here if needed
    
    // Run the test steps
    await addKriteria();
    await addAlternatif();
    await fillPenilaian();
    await runTOPSIS();
    await checkResults();
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Export the function for manual execution
window.runTOPSISTest = runTest;

console.log('📋 Test script loaded. Run "runTOPSISTest()" in the console to start the test.');
console.log('💡 Make sure you are logged in before running the test.'); 