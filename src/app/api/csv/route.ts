import { NextResponse } from 'next/server';
import { getCharacter } from '../../../services/serverApi';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const idsString = formData.get('ids') as string;
    
    if (!idsString) {
      return new NextResponse('No IDs provided', { status: 400 });
    }
    
    const ids = idsString.split(',');
    const characters = await Promise.all(ids.map(id => getCharacter(id)));
    
    const header = 'ID,Name,Birth Year,Details URL\n';
    const rows = characters.map(item => {
      // Extract ID
      const idMatch = item.url.match(/\/people\/(\d+)\//);
      const id = idMatch ? idMatch[1] : '';
      return `${id},${item.name},${item.birth_year},${item.url}`;
    });
    
    const csvContent = header + rows.join('\n');
    
    const response = new NextResponse(csvContent);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename="${ids.length}_items.csv"`);
    
    return response;
  } catch (error: unknown) {
    return new NextResponse(`Error generating CSV: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
