import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, X, Plus, TrendingUp } from "lucide-react";
import { Expense } from "@shared/schema";

interface ExpenseTrackerWidgetProps {
  monthlyBudget?: number;
  expenses: Expense[];
  categories: string[];
  onUpdateData: (data: { monthlyBudget?: number; expenses: Expense[]; categories: string[] }) => void;
  onRemove: () => void;
}

export function ExpenseTrackerWidget({ 
  monthlyBudget, 
  expenses, 
  categories, 
  onUpdateData, 
  onRemove 
}: ExpenseTrackerWidgetProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyExpenses = expenses.filter(expense => expense.date.startsWith(currentMonth));
  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const addExpense = () => {
    if (newExpenseAmount && newExpenseDescription.trim() && newExpenseCategory) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(newExpenseAmount),
        description: newExpenseDescription.trim(),
        category: newExpenseCategory,
        date: new Date().toISOString().split('T')[0],
      };
      onUpdateData({
        monthlyBudget,
        expenses: [...expenses, newExpense],
        categories,
      });
      setNewExpenseAmount("");
      setNewExpenseDescription("");
      setNewExpenseCategory("");
      setShowAddExpense(false);
    }
  };

  const removeExpense = (expenseId: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    onUpdateData({
      monthlyBudget,
      expenses: updatedExpenses,
      categories,
    });
  };

  const setBudget = (budget: number) => {
    onUpdateData({
      monthlyBudget: budget,
      expenses,
      categories,
    });
  };

  const getBudgetProgress = () => {
    if (!monthlyBudget) return 0;
    return Math.min((totalSpent / monthlyBudget) * 100, 100);
  };

  const getCategorySpending = () => {
    const categoryTotals: { [key: string]: number } = {};
    monthlyExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return categoryTotals;
  };

  const categorySpending = getCategorySpending();
  const topCategory = Object.entries(categorySpending).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dusty-pink rounded-full flex items-center justify-center doodle-icon">
            <DollarSign className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Expenses</h3>
        </div>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="sm"
          className="text-warm-brown/50 hover:text-warm-brown doodle-icon p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-warm-brown">
            ${totalSpent.toFixed(2)}
          </div>
          <div className="text-xs text-warm-brown/70">
            {monthlyBudget ? `of $${monthlyBudget} budget` : 'this month'}
          </div>
        </div>

        {monthlyBudget && (
          <div className="w-full bg-warm-brown/20 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                getBudgetProgress() > 90 ? 'bg-red-500' : 
                getBudgetProgress() > 70 ? 'bg-yellow-500' : 'bg-dusty-pink'
              }`}
              style={{ width: `${getBudgetProgress()}%` }}
            />
          </div>
        )}

        {!monthlyBudget && (
          <div className="flex items-center space-x-2 mb-2">
            <Input
              type="number"
              placeholder="Set monthly budget..."
              className="flex-1 bg-transparent border border-warm-brown/30 text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-xs px-2 py-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = parseFloat((e.target as HTMLInputElement).value);
                  if (value > 0) setBudget(value);
                }
              }}
            />
          </div>
        )}

        {topCategory && (
          <div className="flex items-center space-x-2 text-xs text-warm-brown/70">
            <TrendingUp className="h-3 w-3" />
            <span>Most spent: {topCategory[0]} (${topCategory[1].toFixed(2)})</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-2 min-h-0 overflow-y-auto">
        {monthlyExpenses.slice(-5).reverse().map((expense) => (
          <div key={expense.id} className="bg-ivory/30 p-2 rounded-lg border border-warm-brown/20 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-warm-brown">{expense.description}</h4>
                  <span className="text-sm font-bold text-warm-brown">${expense.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-warm-brown/60 bg-warm-brown/10 px-2 py-0.5 rounded">
                    {expense.category}
                  </span>
                  <span className="text-xs text-warm-brown/60">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => removeExpense(expense.id)}
                variant="ghost"
                size="sm"
                className="text-warm-brown/30 hover:text-warm-brown/60 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {showAddExpense ? (
          <div className="bg-ivory/60 p-3 rounded-lg border-2 border-dashed border-warm-brown/30 space-y-2">
            <Input
              value={newExpenseDescription}
              onChange={(e) => setNewExpenseDescription(e.target.value)}
              placeholder="Description..."
              className="w-full bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-sm px-1"
            />
            <div className="flex space-x-2">
              <Input
                type="number"
                step="0.01"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                placeholder="Amount..."
                className="flex-1 bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-sm px-1"
              />
              <Select value={newExpenseCategory} onValueChange={setNewExpenseCategory}>
                <SelectTrigger className="flex-1 bg-transparent border-none text-warm-brown text-sm px-1 h-8">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowAddExpense(false);
                  setNewExpenseAmount("");
                  setNewExpenseDescription("");
                  setNewExpenseCategory("");
                }}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={addExpense}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddExpense(true)}
            className="w-full p-3 border-2 border-dashed border-warm-brown/30 rounded-lg text-warm-brown/60 hover:text-warm-brown hover:bg-ivory/30 transition-colors text-xs"
            variant="ghost"
          >
            <Plus className="mr-2 doodle-icon h-3 w-3" />
            Add Expense
          </Button>
        )}
        
        {monthlyExpenses.length === 0 && !showAddExpense && (
          <p className="text-warm-brown/60 text-xs text-center py-4">
            No expenses this month. Start tracking your spending!
          </p>
        )}
      </div>
    </div>
  );
}