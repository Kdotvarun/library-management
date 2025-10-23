import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Table from '@/models/Table';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const tables = await Table.find({}).lean();
    
    return NextResponse.json(createApiResponse(tables, 'Tables fetched successfully'));
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const table = new Table(body);
    await table.save();
    
    return NextResponse.json(createApiResponse(table, 'Table created successfully'), { status: 201 });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
