


import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload to Cloudinary
async function uploadToCloudinary(base64Image, uid) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64Image,
      {
        folder: 'material-receipts/challans',
        public_id: `challan_${uid}_${Date.now()}`,
        resource_type: 'image',
        overwrite: true,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        tags: ['challan', 'material-receipt', uid],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

// ==================== GET API ====================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let supplierName = searchParams.get('supplierName');
    let supplierFirm = searchParams.get('supplierFirm');
    
    if (supplierName) {
      supplierName = decodeURIComponent(supplierName).trim();
    }
    if (supplierFirm) {
      supplierFirm = decodeURIComponent(supplierFirm).trim();
    }

    console.log('=== GET API Called ===');
    console.log('Query parameters:', { supplierName, supplierFirm });

    // Fetch all data from the Purchase_FMS sheet
    const purchaseResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Purchase_FMS!B8:BW',
    });

    let data = purchaseResponse.data.values || [];
    console.log(`Total rows fetched from Purchase_FMS: ${data.length}`);

    // ✅ REMOVED PLANNED 9 / ACTUAL 9 FILTER
    // Now using all data directly
    let filteredData = data;

    // Apply supplier filters if provided
    if (supplierName || supplierFirm) {
      filteredData = filteredData.filter(row => {
        const rowSupplierName = (row[2] || '').toString().trim();
        const rowSupplierFirm = (row[3] || '').toString().trim();
        
        const matchesSupplierName = supplierName 
          ? rowSupplierName.toLowerCase().includes(supplierName.toLowerCase()) 
          : true;
        const matchesSupplierFirm = supplierFirm 
          ? rowSupplierFirm.toLowerCase().includes(supplierFirm.toLowerCase()) 
          : true;
        
        return matchesSupplierName && matchesSupplierFirm;
      });
      console.log(`After supplier filter: ${filteredData.length} rows`);
    }

    // Fetch data from Material_Received sheet
    const materialReceivedResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Material_Received!A2:J',
    });

    const materialReceivedData = materialReceivedResponse.data.values || [];
    console.log(`Fetched ${materialReceivedData.length} rows from Material_Received`);

    // Create a map of UID to sum of Received_qty
    const receivedQtyMap = new Map();
    materialReceivedData.forEach((row) => {
      const uid = row[1];
      const receivedQty = parseFloat(row[9]) || 0;
      if (uid) {
        if (receivedQtyMap.has(uid)) {
          receivedQtyMap.set(uid, receivedQtyMap.get(uid) + receivedQty);
        } else {
          receivedQtyMap.set(uid, receivedQty);
        }
      }
    });

    // Transform data
    const transformedData = filteredData.map(row => {
      const uid = row[0] || '';
      return {
        uid,
        reqNo: row[1] || '',
        supplierName: row[2] || '',
        supplierFirm: row[3] || '',
        vendorName: row[38] || '',
        materialType: row[7] || '',
        skuCode: row[10] || '',
        materialName: row[8] || '',
        unitName: row[12] || '',
        totalReceivedQuantity: row[11] || '',
        receivedQty: receivedQtyMap.get(uid) || 0
      };
    });

    console.log(`Final transformed data count: ${transformedData.length}`);
    console.log('=== GET API Completed ===');

    return NextResponse.json({
      success: true,
      data: transformedData,
      totalRecords: transformedData.length,
      filters: { supplierName, supplierFirm }
    });

  } catch (error) {
    console.error('Error fetching filtered data:', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch filtered data', details: error.message },
      { status: 500 }
    );
  }
}

// ==================== POST API ====================
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    if (!body) {
      return NextResponse.json(
        { error: 'Request body is missing or invalid' },
        { status: 400 }
      );
    }

    const {
      uid,
      reqNo,
      supplierName,
      supplierFirm,
      materialType,
      materialName,
      skuCode,
      unitName,
      receivedQty,
      status,
      challanNo,
      qualityApproved,
      truckDelivery,
      googleFormCompleted,
      photo,
    } = body;

    // Validate required fields
    if (!uid || !reqNo || !supplierName || !supplierFirm || !materialType || !materialName || !skuCode || !unitName || !receivedQty || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const receivedQtyNum = parseFloat(receivedQty);
    if (isNaN(receivedQtyNum)) {
      return NextResponse.json(
        { error: 'Invalid receivedQty value' },
        { status: 400 }
      );
    }

    let challanUrl = '';
    let cloudinaryPublicId = '';

    // Handle photo upload to Cloudinary
    if (photo) {
      const validImageFormats = ['data:image/jpeg', 'data:image/png', 'data:image/jpg', 'data:image/webp'];
      const isValidFormat = validImageFormats.some(format => photo.startsWith(format));

      if (!isValidFormat) {
        return NextResponse.json(
          { error: 'Invalid image format. Supported: JPEG, PNG, WebP' },
          { status: 400 }
        );
      }

      const base64Size = photo.length * 0.75;
      const maxSize = 10 * 1024 * 1024;

      if (base64Size > maxSize) {
        return NextResponse.json(
          { error: 'Image size exceeds 10MB limit' },
          { status: 400 }
        );
      }

      try {
        const uploadResult = await uploadToCloudinary(photo, uid);
        challanUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id;

        console.log('Cloudinary upload successful:', {
          url: challanUrl,
          publicId: cloudinaryPublicId,
        });

      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image', details: uploadError.message },
          { status: 500 }
        );
      }
    }

    // Create timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/, /g, ' ');

    const values = [
      timestamp,
      uid,
      reqNo,
      supplierName,
      supplierFirm,
      materialType,
      materialName,
      skuCode,
      unitName,
      receivedQtyNum,
      status,
      challanUrl || '',
      truckDelivery || '',
      googleFormCompleted || '',
      challanNo || '',
      qualityApproved || '',
    ];

    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Material_Received!A:A',
    });

    const lastRow = (sheetData.data.values ? sheetData.data.values.length : 1) + 1;
    const writeRange = `Material_Received!A${lastRow}:P${lastRow}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: writeRange,
      valueInputOption: 'RAW',
      resource: {
        values: [values],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Receipt saved successfully',
      challanUrl,
      cloudinaryPublicId,
    });

  } catch (error) {
    console.error('Error saving material receipt:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to save receipt', details: error.message },
      { status: 500 }
    );
  }
}