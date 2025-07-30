# 🧪 Quick Test Guide: Decimal Display Verification

## **Option 1: SQL Script (Fastest)**

### **Step 1: Get Your User ID**
1. Go to Supabase Dashboard → Table Editor → `auth.users`
2. Find your user record and copy the `id` field
3. Replace `'your-user-id-here'` in `test-data-setup.sql` with your actual user ID

### **Step 2: Run SQL Script**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire content of `test-data-setup.sql`
3. Click "Run"
4. Verify the output shows:
   ```
   Kriteria count: 7
   Alternatif count: 7  
   Penilaian count: 49
   ```

### **Step 3: Test the Application**
1. Start your app: `npm run dev`
2. Go to `http://localhost:3001` (or whatever port it's running on)
3. Login to your account
4. Go directly to `/perhitungan`
5. Click through the steps and run the calculation
6. Go to `/hasil` to see the results

## **Option 2: Browser Console Script**

### **Step 1: Load Test Script**
1. Open your app in browser
2. Login to your account
3. Open browser console (F12)
4. Copy and paste the entire content of `test-script.js`
5. Run: `runTOPSISTest()`

## **Option 3: Manual Quick Test**

### **Step 1: Minimal Data Setup**
Add just 3 kriteria and 3 alternatif for quick testing:

**Kriteria:**
- Kualitas (Bobot: 5, Atribut: Benefit)
- Harga (Bobot: 3, Atribut: Cost)  
- Tekstur (Bobot: 4, Atribut: Benefit)

**Alternatif:**
- Kain A
- Kain B
- Kain C

**Penilaian Matrix:**
```
        Kualitas  Harga  Tekstur
Kain A    85      90      80
Kain B    90      85      85
Kain C    80      95      90
```

### **Step 2: Run Calculation**
1. Go to `/perhitungan`
2. Click through all steps
3. Run the calculation
4. Check `/hasil` page

## **Expected Results**

### **✅ Success Indicators:**
- **Nilai Preferensi** displays as `0.7150` (not `71.5%`)
- **Margin Kemenangan** displays as `0.0450` (not `4.5%`)
- **All decimal values** show 4 digits after decimal point
- **No percentage symbols** anywhere in hasil page
- **Export functionality** shows decimal values

### **❌ Failure Indicators:**
- Still showing percentages like `71.5%`
- Decimal values with wrong precision like `0.715`
- Percentage symbols appearing anywhere

## **Quick Verification Commands**

### **Check Database Results:**
```sql
-- Run in Supabase SQL Editor
SELECT 
  a.nama as alternatif,
  h.nilai_preferensi,
  h.ranking
FROM hasil_perhitungan h
JOIN alternatif a ON h.alternatif_id = a.id
WHERE h.user_id = 'your-user-id-here'
ORDER BY h.ranking;
```

### **Expected Output:**
```
alternatif        | nilai_preferensi | ranking
Kain Katun Basa  | 0.7150          | 1
Kain Doby        | 0.6130          | 2
Kain Viscose     | 0.5540          | 3
```

## **Troubleshooting**

### **If Decimal Values Not Showing:**
1. Check browser cache - hard refresh (Ctrl+F5)
2. Verify all files were saved properly
3. Check browser console for errors
4. Verify Supabase connection

### **If Calculation Fails:**
1. Check if all penilaian data is complete (7×7 = 49 records)
2. Verify kriteria and alternatif data exists
3. Check browser console for errors

### **If Database Connection Issues:**
1. Verify `.env.local` has correct Supabase credentials
2. Check Supabase project is active
3. Verify RLS policies are working

## **Performance Test**

### **Test with Large Dataset:**
- Add 10 kriteria and 10 alternatif
- Fill 100 penilaian values
- Verify calculation performance
- Check decimal display still works

---

**🎯 Goal:** Verify that nilai preferensi displays as 4-digit decimals (e.g., `0.7150`) instead of percentages (`71.5%`) throughout the application. 