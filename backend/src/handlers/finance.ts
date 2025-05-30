import { authenticateRequest } from '../utils/auth';

const financeSchema = {
  validate: (data: any) => {
    if (!data.type || !['income', 'expense'].includes(data.type)) {
      throw new Error('Invalid type');
    }
    if (!data.category || typeof data.category !== 'string') {
      throw new Error('Invalid category');
    }
    if (!data.amount || isNaN(parseFloat(data.amount))) {
      throw new Error('Invalid amount');
    }
    return {
      type: data.type,
      category: data.category.trim(),
      amount: parseFloat(data.amount),
      description: data.description?.trim() || '',
      date: data.date || new Date().toISOString().split('T')[0]
    };
  }
};

export async function handleGetFinance(request: Request, env: any): Promise<Response> {
  try {
    const payload = await authenticateRequest(request, env);
    if (!payload) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const type = url.searchParams.get('type');

    let query = 'SELECT * FROM finance WHERE user_id = ?';
    const params: any[] = [payload.userId];

    if (type && ['income', 'expense'].includes(type)) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const results = await env.DB.prepare(query).bind(...params).all();

    // Get summary stats
    const statsQuery = `
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM finance 
      WHERE user_id = ? 
      GROUP BY type
    `;
    const stats = await env.DB.prepare(statsQuery).bind(payload.userId).all();

    const summary = {
      income: stats.results.find((s: any) => s.type === 'income') || { total: 0, count: 0 },
      expense: stats.results.find((s: any) => s.type === 'expense') || { total: 0, count: 0 },
      balance: 0
    };
    summary.balance = summary.income.total - summary.expense.total;

    return Response.json({
      success: true,
      data: {
        records: results.results,
        summary,
        pagination: {
          limit,
          offset,
          total: results.results.length
        }
      }
    });

  } catch (error) {
    console.error('Finance API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid request data';
    return Response.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function handleCreateFinance(request: Request, env: any): Promise<Response> {
  try {
    const payload = await authenticateRequest(request, env);
    if (!payload) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const financeData = financeSchema.validate(body);

    const result = await env.DB.prepare(`
      INSERT INTO finance (user_id, type, category, amount, description, date)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      payload.userId,
      financeData.type,
      financeData.category,
      financeData.amount,
      financeData.description,
      financeData.date
    ).first();

    return Response.json({
      success: true,
      data: result,
      message: 'Finance record created successfully'
    });

  } catch (error) {
    console.error('Finance create error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid request data';
    return Response.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function handleUpdateFinance(request: Request, env: any, id: string): Promise<Response> {
  try {
    const payload = await authenticateRequest(request, env);
    if (!payload) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if record exists and belongs to user
    const existing = await env.DB.prepare(
      'SELECT id FROM finance WHERE id = ? AND user_id = ?'
    ).bind(id, payload.userId).first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Finance record not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const financeData = financeSchema.validate(body);

    const result = await env.DB.prepare(`
      UPDATE finance 
      SET type = ?, category = ?, amount = ?, description = ?, date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
      RETURNING *
    `).bind(
      financeData.type,
      financeData.category,
      financeData.amount,
      financeData.description,
      financeData.date,
      id,
      payload.userId
    ).first();

    return Response.json({
      success: true,
      data: result,
      message: 'Finance record updated successfully'
    });

  } catch (error) {
    console.error('Finance update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid request data';
    return Response.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function handleDeleteFinance(request: Request, env: any, id: string): Promise<Response> {
  try {
    const payload = await authenticateRequest(request, env);
    if (!payload) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if record exists and belongs to user
    const existing = await env.DB.prepare(
      'SELECT id FROM finance WHERE id = ? AND user_id = ?'
    ).bind(id, payload.userId).first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Finance record not found' },
        { status: 404 }
      );
    }

    await env.DB.prepare(
      'DELETE FROM finance WHERE id = ? AND user_id = ?'
    ).bind(id, payload.userId).run();

    return Response.json({
      success: true,
      message: 'Finance record deleted successfully'
    });

  } catch (error) {
    console.error('Finance API error:', error);
    return Response.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
} 