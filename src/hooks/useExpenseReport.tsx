import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useState, useContext } from "react";
import { ExpenseReport } from "../reports/ExpenseReport";
import { UserContext } from "../contexts/UserContext";
import type {
  IExpenseRow,
  IExpenseCategoryAggregateRow,
} from "../modules/ExpenseApp/interfaces/data";

interface IReportData {
  expenses: IExpenseRow[];
  categoryAggregate: IExpenseCategoryAggregateRow[];
  total: number;
  month: string;
}

export const useExpenseReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { defaultCurrency, user } = useContext(UserContext);

  const download = async (data: IReportData) => {
    setIsGenerating(true);
    try {
      const doc = (
        <ExpenseReport
          expenses={data.expenses}
          categoryAggregate={data.categoryAggregate}
          total={data.total}
          currency={defaultCurrency.value}
          month={data.month}
          userName={`${user.FirstName} ${user.LastName}`}
        />
      );
      const blob = await pdf(doc).toBlob();
      saveAs(blob, `S90_Expenses_${data.month}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  return { download, isGenerating };
};
