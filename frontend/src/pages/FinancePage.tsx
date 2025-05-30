import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react';
import { financeAPI } from '../lib/api';
import { Finance, FinanceSummary } from '../types';
import Button from '../components/ui/Button';

export default function FinancePage() {
  const [records, setRecords] = useState<Finance[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Finance | null>(null);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await financeAPI.getRecords();
      if (response.success && response.data) {
        setRecords(response.data.records);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingRecord) {
        await financeAPI.updateRecord(editingRecord.id, data);
      } else {
        await financeAPI.createRecord(data);
      }

      setShowForm(false);
      setEditingRecord(null);
      setFormData({
        type: 'income',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadRecords();
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

  const handleEdit = (record: Finance) => {
    setEditingRecord(record);
    setFormData({
      type: record.type,
      category: record.category,
      amount: record.amount.toString(),
      description: record.description || '',
      date: record.date
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await financeAPI.deleteRecord(id);
        loadRecords();
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Finance</h1>
        <Button onClick={() => setShowForm(true)} className="self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Income</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                    {formatCurrency(summary.income.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Expenses</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                    {formatCurrency(summary.expense.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card sm:col-span-2 lg:col-span-1">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Balance</p>
                  <p className={`text-lg sm:text-2xl font-semibold truncate ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(summary.balance)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Records */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Records</h3>
        </div>
        
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          <div className="divide-y divide-gray-200">
            {records.map((record) => (
              <div key={record.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type}
                    </span>
                    <span className="text-sm text-gray-500">{record.date}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-primary-600 hover:text-primary-900 p-1 touch-manipulation"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900 p-1 touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{record.category}</p>
                  {record.description && (
                    <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                  )}
                </div>
                <div className={`text-lg font-semibold ${
                  record.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block card-content p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Category</th>
                  <th className="table-header-cell">Description</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="table-cell">{record.date}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="table-cell">{record.category}</td>
                    <td className="table-cell">{record.description || '-'}</td>
                    <td className={`table-cell font-semibold ${
                      record.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                  {editingRecord ? 'Edit Record' : 'Add New Record'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRecord(null);
                    setFormData({
                      type: 'income',
                      category: '',
                      amount: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0]
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Type</label>
                  <select
                    className="form-input text-base sm:text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input text-base sm:text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    placeholder="e.g., Salary, Groceries, Rent"
                  />
                </div>

                <div>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input text-base sm:text-sm"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    className="form-input text-base sm:text-sm resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Additional details..."
                  />
                </div>

                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input text-base sm:text-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2 pt-4 sm:pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setShowForm(false);
                      setEditingRecord(null);
                      setFormData({
                        type: 'income',
                        category: '',
                        amount: '',
                        description: '',
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    loading={loading}
                  >
                    {editingRecord ? 'Update' : 'Add'} Record
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 